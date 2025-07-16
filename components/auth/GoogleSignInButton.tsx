import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// Update the import path for Google_icon as needed in your project
import Google_icon from '../../assets/images/icons-signup/google-icon.svg'; // Placeholder, replace with actual icon import

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.readonly'
  ],
  webClientId: '447897947042-bm4h2fn9a2l00t2sg043vr26qesm1v5f.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true
});

type Props = {
  onSuccess: (backendData: any) => void;
  setUserInfo?: (user: any) => void;
};

const GoogleSignInButton: React.FC<Props> = ({ onSuccess, setUserInfo }) => {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();

      setUserInfo?.(user);
      // GoogleSignin.signIn() returns an object with user, idToken, serverAuthCode, scopes
      const idToken = (user as any).idToken;
      const serverAuthCode = (user as any).serverAuthCode;
      const userPayload = (user as any).user;
      const scopes = (user as any).scopes;

      if (!idToken || !serverAuthCode) {
        Alert.alert("Missing tokens", "Could not get ID token or server auth code.");
        return;
      }

      // Use the API utility for the backend call
      const { googleAuth } = require('../../services/api');
      const json = await googleAuth({ idToken, serverAuthCode, user: userPayload, scopes: scopes || [] });
      onSuccess(json);

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services not available');
      } else {
        Alert.alert('Something went wrong', JSON.stringify(error));
      }
    }
  };

  return (
    <TouchableOpacity
      style={{ backgroundColor: 'white', borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
      onPress={handleGoogleSignIn}
    >
      <Google_icon width={22} height={22} />
      <Text style={{ color: '#1A202C', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton; 