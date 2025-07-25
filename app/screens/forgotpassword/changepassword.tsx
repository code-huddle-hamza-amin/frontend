import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { changePassword } from '../../../services/api';

export default function ChangePasswordScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const userExists = params.userExists === 'true';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Handle back button to go to OTP screen
      useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigateBack();
        return true; // Prevent default back action
      });

      return () => backHandler.remove();
    }, []);

  const handleChangePassword = async () => {
    setHasAttempted(true);
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate password
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      return;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setIsChanging(true);
    try {
      if (userExists) {
        // Real user, call backend to change password
        const result = await changePassword(email, password);
        if (result.success) {
          Alert.alert('Success', 'Password changed successfully!', [
            {
              text: 'OK',
              onPress: () => {
                router.push('/screens/reg-login/login');
              }
            }
          ]);
        }
      } else {
        // Fake user, just show success message
        Alert.alert('Success', 'Password changed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.push('/screens/reg-login/login');
            }
          }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  const navigateBack = () => {
    router.push('/screens/forgotpassword' as any);
  };
  
  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Arrow */}
      <View className="flex-col items-start p-6 pt-12 mt-[10%]">
        <TouchableOpacity onPress={navigateBack} className="mb-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-black mb-2 mt-[10%]">Create New Password</Text>
        <Text className="text-gray-600 mb-8">
          Please set a new password for your account and ensure it meets the security criteria
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-8">
        <View className="w-full">
          {/* Password Input */}
          <View className="mb-6">
            <View className="relative">
              <TextInput
                className={`bg-gray-100 rounded-xl px-4 py-4 pr-12 text-base text-black ${
                  hasAttempted && passwordError 
                    ? 'border-red-500 border' 
                    : password.length >= 6 
                      ? 'border-green-500 border' 
                      : ''
                }`}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (hasAttempted && text.length >= 6) {
                    setPasswordError('');
                  }
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-gray-500 text-lg">{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {hasAttempted && passwordError && (
              <Text className="text-red-500 text-sm mt-2">{passwordError}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-8">
            <View className="relative">
              <TextInput
                className={`bg-gray-100 rounded-xl px-4 py-4 pr-12 text-base text-black ${
                  hasAttempted && confirmPasswordError 
                    ? 'border-red-500 border' 
                    : confirmPassword.length > 0 && password === confirmPassword 
                      ? 'border-green-500 border' 
                      : ''
                }`}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (hasAttempted && text === password) {
                    setConfirmPasswordError('');
                  }
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text className="text-gray-500 text-lg">{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {hasAttempted && confirmPasswordError && (
              <Text className="text-red-500 text-sm mt-2">{confirmPasswordError}</Text>
            )}
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 ${
              password.length >= 6 && password === confirmPassword
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}
            onPress={handleChangePassword}
            disabled={password.length < 6 || password !== confirmPassword || isChanging}
          >
            <Text className={`text-center font-bold text-lg ${
              password.length >= 6 && password === confirmPassword
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              {isChanging ? 'Changing Password...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 