import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { getUserByEmail, getOTP } from '../../../services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Handle back button to go to login
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigateToLogin();
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  const handleContinue = async () => {
    setHasAttempted(true);
    setEmailError('');

    // Validate email
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsChecking(true);
    try {
      // Check if user exists
      const existingUser = await getUserByEmail(email);
      
      if (existingUser && existingUser.user) {
        // User exists, send OTP
        try {
          await getOTP(email);
          Alert.alert('OTP Sent', 'We have sent a verification code to your email.', [
            {
              text: 'OK',
              onPress: () => {
                router.push({
                  pathname: '/screens/forgotpassword/otp',
                  params: { 
                    email: email,
                    userExists: 'true'
                  }
                });
              }
            }
          ]);
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        }
      } else {
        // User doesn't exist, proceed with fake OTP flow
        router.push({
          pathname: '/screens/forgotpassword/otp',
          params: { 
            email: email,
            userExists: 'false'
          }
        });
      }
    } catch (error) {
      // User doesn't exist (404 error), proceed with fake OTP flow
      router.push({
        pathname: '/screens/forgotpassword/otp',
        params: { 
          email: email,
          userExists: 'false'
        }
      });
    } finally {
      setIsChecking(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/screens/reg-login/login');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Arrow */}
      <View className="flex-col items-start p-6 pt-12 mt-[10%]">
        <TouchableOpacity onPress={navigateToLogin} className="mb-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
      </View>

            {/* Main Content */}
     <View className="flex-1 px-8 mt-[6%]">
         <View className="w-full">
           {/* Instructions */}

           <Text className="text-2xl font-bold text-black mb-2">Forgot Password</Text>
           <Text className="text-gray-600 mb-8">
             Enter your email to reset your password
           </Text>

          {/* Email Input */}
          <View className="mb-8">
            <TextInput
              className={`border rounded-xl px-4 py-4 text-base text-black text-center ${
                hasAttempted && emailError 
                  ? 'border-red-500 bg-red-50' 
                  : email.includes('@') && email.includes('.') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-100'
              }`}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (hasAttempted && text.includes('@') && text.includes('.')) {
                  setEmailError('');
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {hasAttempted && emailError && (
              <Text className="text-red-500 text-sm mt-2 text-center">{emailError}</Text>
            )}
          </View>

          {/* Request OTP Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 ${
              email.includes('@') && email.includes('.')
                ? 'bg-[#00c795]' 
                : 'bg-gray-300'
            }`}
            onPress={handleContinue}
            disabled={!email.includes('@') || !email.includes('.') || isChecking}
          >
            <Text className={`text-center font-bold text-lg ${
              email.includes('@') && email.includes('.')
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              {isChecking ? 'Checking...' : 'Request OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 