import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Google_icon from '../../assets/images/icons-signup/google-icon.svg';
import { 
  googleAuth,
  storeGmailAccount,
  getConnectedGmailAccounts,
  updateGmailAccountTokens
} from '../../services/api';

interface EmailModalProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
}

interface ConnectedGmail {
  email: string;
  user_id: string;
  name: string;
  acc_id?: string; // Database ID for the Gmail account
  refresh_token?: string; // Refresh token for the account
}

export default function EmailModal({ visible, onClose, userId, userEmail }: EmailModalProps) {
  const [connectedGmails, setConnectedGmails] = useState<ConnectedGmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.readonly'
      ],
      webClientId: '59672760015-1ie2nvc8q41527ioj3ddedj2v9sa0gat.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true
    });
  }, []);

  useEffect(() => {
    if (visible && userId && !hasLoadedOnce) {
      fetchConnectedGmails();
      setHasLoadedOnce(true);
    }
  }, [visible, userId, hasLoadedOnce]);

  const fetchConnectedGmails = async () => {
    try {
      if (!userId) return;
      
      // Get connected Gmail accounts from the new API
      const response = await getConnectedGmailAccounts(userId);
      console.log(response,"---",response.accounts,"---",response.success);
      if (response && response.success && response.accounts) {
        const gmailAccounts = response.accounts.map((account: any) => ({
          email: account.acc_id, // acc_id contains the email
          user_id: account.user_id,
          name: account.name || account.acc_id.split('@')[0], // Extract name from email if not provided
          acc_id: account.id, // Store the database ID for future operations
          refresh_token: account.refresh_token
        }));
        setConnectedGmails(gmailAccounts);
      } else {
        setConnectedGmails([]);
      }
    } catch (error) {
      console.error('Error fetching connected Gmails:', error);
      setConnectedGmails([]);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) {
      console.log('Sign-in already in progress, ignoring duplicate call');
      return;
    }

    setLoading(true);
    
    try {
      // First, sign out any existing user
      try {
        await GoogleSignin.signOut();
        console.log('Signed out any existing user');
      } catch (signOutError) {
        console.log('No existing user to sign out');
      }
      
      // Check Play Services
      await GoogleSignin.hasPlayServices();
      
      // Attempt sign in
      const user = await GoogleSignin.signIn();


      //console.log(user);

      const idToken = (user as any).data.idToken;
      const serverAuthCode = (user as any).data.serverAuthCode;
      const userPayload = (user as any).data.user;
      const scopes = (user as any).data.scopes;

      // Extract the static Google User ID - this is permanent and unique
      const googleUserId = userPayload.id;
      const userEmail = userPayload.email;
      const userName = userPayload.name || 'Unknown User';

      if (!idToken || !serverAuthCode) {
        Alert.alert("Missing tokens", "Could not get ID token or server auth code.");
        return;
      }

      // Call googleAuth to get refresh token
      let refreshToken = '';
      let accessToken = '';


      console.log(idToken,"----", serverAuthCode, "----", userPayload, "----", scopes);
      try {
        const googleAuthResponse = await googleAuth({
          idToken,
          serverAuthCode,
          user: userPayload,
          scopes
        });

        console.log(googleAuthResponse);
        
        // Extract refresh token and access token from response
        if (googleAuthResponse && googleAuthResponse.refresh_access_token) {
          refreshToken = googleAuthResponse.refresh_access_token;
          accessToken = googleAuthResponse.access_token || idToken;
          console.log('Refresh token extracted:', refreshToken);
        } else {
          console.warn('No refresh token in googleAuth response');
        }
      } catch (googleAuthError) {
        console.error('Google Auth Error:', googleAuthError);
        // Continue with the flow even if googleAuth fails
      }

      // Store Gmail account directly without user search
      if (refreshToken && userId) {
        try {
          await storeGmailAccount({
            acc_id: userEmail,
            acc_token: accessToken,
            refresh_token: refreshToken,
            user_id: userId
          });
          console.log('Gmail account stored successfully');
          Alert.alert('Success', 'Gmail account connected successfully!');
          fetchConnectedGmails(); // Refresh the list
        } catch (storeError) {
          console.error('Error storing Gmail account:', storeError);
          Alert.alert('Error', 'Failed to store Gmail account. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Failed to get refresh token. Please try again.');
      }

    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services not available');
      } else if (error.code === 10) {
        Alert.alert('Developer Error', 'Please check your Google Sign-In configuration.');
      } else if (error.code === 7) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Something went wrong', `Error Code: ${error.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHasLoadedOnce(false);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection={['down']}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      backdropColor="rgba(41, 40, 40, 0.7)"
      backdropOpacity={1}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      propagateSwipe
    >
             <View className="bg-white rounded-t-3xl h-1/2">
        {/* Top Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-2 mb-4" />
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Manage Gmail Permissions</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4">
          {/* Gmail Connection Section */}
          <View className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
            {/* Gmail Icon */}
            <View className="items-center mb-4">
              <View 
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{ backgroundColor: '#EA433520' }}
              >
                <Ionicons name="mail" size={28} color="#EA4335" />
              </View>
            </View>

            {/* Title */}
            <Text className="text-lg font-bold text-center text-gray-800 mb-2">
              Connect Gmail Account
            </Text>

            {/* Description */}
            <Text className="text-sm text-center text-gray-600 mb-6">
              Connect your Gmail account to enable email-based features.
            </Text>

            {/* Google Sign-In Button */}
            <TouchableOpacity
              style={{ 
                backgroundColor: loading ? '#F3F4F6' : 'white', 
                borderColor: '#D1D5DB', 
                borderWidth: 1, 
                borderRadius: 16, 
                paddingVertical: 16, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 12,
                opacity: loading ? 0.7 : 1
              }}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Google_icon width={22} height={22} />
              <Text style={{ color: '#1A202C', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                {loading ? 'Connecting...' : 'Connect with Google'}
              </Text>
            </TouchableOpacity>
            
            <Text className="text-xs text-gray-500 text-center">
              This will connect your Gmail account in read-only mode
            </Text>
          </View>

          {/* Connected Gmail Accounts Section */}
          {connectedGmails.length > 0 && (
            <View className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Connected Gmail Accounts
              </Text>
              
              {connectedGmails.map((gmail, index) => (
                <View key={index} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <View className="flex-row items-center">
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: '#EA433520' }}
                    >
                      <Ionicons name="mail" size={16} color="#EA4335" />
                    </View>
                                        <View>
                      <Text className="text-gray-800 font-medium">
                        {gmail.email}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {gmail.name || gmail.email.split('@')[0]}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-green-600 text-sm font-medium">Connected</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* No Connected Accounts Message */}
          {connectedGmails.length === 0 && (
            <View className="bg-gray-50 rounded-2xl p-6 mt-4">
              <View className="items-center">
                <Ionicons name="mail-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-2">
                  No Gmail accounts connected yet
                </Text>
                <Text className="text-gray-400 text-center text-sm mt-1">
                  Connect your Gmail account to get started
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}