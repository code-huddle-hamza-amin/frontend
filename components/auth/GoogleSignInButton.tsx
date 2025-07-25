import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// Update the import path for Google_icon as needed in your project
import Google_icon from '../../assets/images/icons-signup/google-icon.svg'; // Placeholder, replace with actual icon import
import { authenticateUser } from '@/services/api';

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  webClientId: '59672760015-1ie2nvc8q41527ioj3ddedj2v9sa0gat.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true
});

type Props = {
  onSuccess: (backendData: any) => void;
  setUserInfo?: (user: any) => void;
};

const GoogleSignInButton: React.FC<Props> = ({ onSuccess, setUserInfo }) => {
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleGoogleSignIn = async () => {
    // Prevent multiple simultaneous sign-in attempts
    if (isSigningIn) {
      console.log('Sign-in already in progress, ignoring duplicate call');
      return;
    }

    setIsSigningIn(true);
    
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

      setUserInfo?.(user);
      // GoogleSignin.signIn() returns an object with user, idToken, serverAuthCode, scopes
      const idToken = (user as any).data.idToken;
      const serverAuthCode = (user as any).data.serverAuthCode;
      const userPayload = (user as any).data.user;
      const scopes = (user as any).data.scopes;

      // Extract the static Google User ID - this is permanent and unique
      const googleUserId = userPayload.id; // This is the permanent Google User ID
      const userEmail = userPayload.email;
      const userName = userPayload.name || 'Unknown User';



      if (!idToken || !serverAuthCode) {
        Alert.alert("Missing tokens", "Could not get ID token or server auth code.");
        return;
      }

      // Test backend connection first
      const { googleAuth, generateUUID, createUser, getUserByEmail, getUserByGoogleId } = require('../../services/api');
      
      // Step 1: Call Google Auth endpoint
      //const json = await googleAuth({ idToken, serverAuthCode, user: userPayload, scopes: scopes || [] });
      
      
      // Step 3: Check if user exists by email and Google ID
      
      try {
        // First try to find user by Google User ID (more reliable for Google users)
        const userCheck = await getUserByGoogleId(googleUserId);
        
        if (!userCheck.user) {
          const uuidResponse = await generateUUID();
          const uuid = uuidResponse.uuid; // Assuming the response has a 'uuid' field
          // User not found by Google ID, check by email
          try {
            const emailUserCheck = await getUserByEmail(userEmail);
            
            if (emailUserCheck.user) {
              // User exists by email but not by Google ID - update gmail_token 
              const { updateUserGmailToken } = require('../../services/api');
              
              await updateUserGmailToken(emailUserCheck.user.gmail, googleUserId);
              
              // Get the updated user data
              const updatedUserData = await getUserByGoogleId(googleUserId);
              
              onSuccess({
                ...userPayload,
                user: updatedUserData.user,
                isNewUser: false,
                gmailTokenUpdated: true
              });
            } else {
              // User doesn't exist by email either - create new user
              const newUserData = {
                id: uuid,
                name: userName,
                pass: googleUserId, // Using Google User ID as password (static across devices)
                gmail: userEmail,
                net_amount: 0,
                gmail_token: googleUserId // Store Google User ID as static identifier
              };
              
              const createdUser = await createUser(newUserData);
              
              // Get the complete user data including personal ID
              const userData = await getUserByGoogleId(googleUserId);
              
              // Return the created user data with personal ID
              onSuccess({
                ...userPayload,
                user: userData.user,
                isNewUser: true
              });
            }
          } catch (emailError: any) {
            
            // If email check fails with 404, create new user
            if (emailError.message && emailError.message.includes('HTTP 404')) {
              const newUserData = {
                id: uuid,
                name: userName,
                pass: googleUserId,
                gmail: userEmail,
                net_amount: 0,
                gmail_token: googleUserId
              };
              
              const createdUser = await createUser(newUserData);
              
              const userData = await getUserByGoogleId(googleUserId);
              
              onSuccess({
                ...userPayload,
                user: userData.user,
                isNewUser: true
              });
            } else {
              // Real error occurred
              throw emailError;
            }
          }
        } else {
          // User exists by Google ID, get complete user data including personal ID
          const userData = await getUserByGoogleId(googleUserId);
          
          onSuccess({
            ...userPayload,
            user: userData.user,
            isNewUser: false
          });
        }
      } catch (error: any) {
        console.error('Error in user check/creation:', error);
        
        // Check if the error is a 404 (user not found) - this is expected for new users
        if (error.message && error.message.includes('HTTP 404')) {
          console.log('User not found (404) by Google ID - checking by email...');
          
          try {



            // Check if user exists by email
            const emailUserCheck = await getUserByEmail(userEmail);
            console.log('User check result by email:', emailUserCheck);
            
            if (emailUserCheck.user) {
              // User exists by email but not by Google ID - update gmail_token
              const { updateUserGmailToken } = require('../../services/api');
              await updateUserGmailToken(emailUserCheck.user.gmail, googleUserId);
              
              // Get the updated user data
              const updatedUserData = await getUserByGoogleId(googleUserId);
              
              onSuccess({
                ...userPayload,
                user: updatedUserData.user,
                isNewUser: false,
                gmailTokenUpdated: true
              });
            } else {
              // User doesn't exist by email either - create new user
              const uuidResponse = await generateUUID();
              const uuid = uuidResponse.uuid; // Assuming the response has a 'uuid' field
              const newUserData = {
                id: uuid,
                name: userName,
                pass: googleUserId, // Using Google User ID as password (static across devices)
                gmail: userEmail,
                net_amount: 0,
                gmail_token: googleUserId // Store Google User ID as static identifier
              };
              
              const createdUser = await createUser(newUserData);
              
              // Get the complete user data including personal ID
              const userData = await getUserByGoogleId(googleUserId);
              
              // Return the created user data with personal ID
              onSuccess({
                ...userPayload,
                user: userData.user,
                isNewUser: true
              });
            }
          } catch (emailError: any) {
            
            // If email check also fails with 404, create new user
            if (emailError.message && emailError.message.includes('HTTP 404')) {
              const uuidResponse = await generateUUID();
              const uuid = uuidResponse.uuid; // Assuming the response has a 'uuid' field
              const newUserData = {
                id: uuid,
                name: userName,
                pass: googleUserId,
                gmail: userEmail,
                net_amount: 0,
                gmail_token: googleUserId
              };
              
              const createdUser = await createUser(newUserData);
              console.log('New user created after both 404s:', createdUser);
              
              const userData = await getUserByGoogleId(googleUserId);
              console.log('Complete user data after creation:----------------', userData);
              
              onSuccess({
                ...userPayload,
                user: userData.user,
                isNewUser: true
              });
            } else {
              // Real error occurred with email check
              console.error('Error checking user by email:', emailError);
              onSuccess({
                ...userPayload,
                error: 'User check failed',
                errorDetails: emailError.message || 'Unknown error'
              });
            }
          }
        } else {
          // If it's not a 404 error, it's a real error
          onSuccess({
            ...userPayload,
            error: 'User check failed',
            errorDetails: error.message || 'Unknown error'
          });
        }
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
        Alert.alert('Developer Error', 'Please check your Google Sign-In configuration. Error: ' + JSON.stringify(error));
      } else if (error.code === 7) {
        Alert.alert('Network Error', 'Please check your internet connection and try again. This could be due to:\n\n1. No internet connection\n2. Google Play Services network issues\n3. Firewall blocking Google services');
      } else {
        Alert.alert('Something went wrong', `Error Code: ${error.code}\nError: ${JSON.stringify(error)}`);
      }
    } finally {
      // Always reset the signing state
      setIsSigningIn(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const { testBackendConnection } = require('../../services/api');
      const isConnected = await testBackendConnection();
      Alert.alert('Backend Test', isConnected ? 'Backend is reachable!' : 'Backend is not reachable');
    } catch (error) {
      Alert.alert('Backend Test Error', JSON.stringify(error));
    }
  };

  const testInternetConnection = async () => {
    try {
      const { testInternetConnection } = require('../../services/api');
      const isConnected = await testInternetConnection();
      Alert.alert('Internet Test', isConnected ? 'Internet is working!' : 'No internet connection');
    } catch (error) {
      Alert.alert('Internet Test Error', JSON.stringify(error));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{ 
          backgroundColor: isSigningIn ? '#F3F4F6' : 'white', 
          borderColor: '#D1D5DB', 
          borderWidth: 1, 
          borderRadius: 16, 
          paddingVertical: 16, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 12,
          opacity: isSigningIn ? 0.7 : 1
        }}
        onPress={handleGoogleSignIn}
        disabled={isSigningIn}
      >
        <Google_icon width={22} height={22} />
        <Text style={{ color: '#1A202C', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
          {isSigningIn ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>
      
    </>
  );
};

export default GoogleSignInButton;