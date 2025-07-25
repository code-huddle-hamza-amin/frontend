import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, BackHandler } from "react-native";
import { router } from "expo-router";
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton";
import { emailAuthSignIn, authenticateUser } from "../../../services/api";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [backendData, setBackendData] = useState<any>(null);

  // Prevent going back from login screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  const handleSignIn = async () => {
    setHasAttemptedSignIn(true);
    
    // Validate email
    if (!email || !email.includes('@')) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError("");
    }
    
    // If no errors, proceed with sign in
    if (email && email.includes('@') && password && password.length >= 6) {
      try {

        
        // Try to authenticate with the backend
        try {
          const authResult = await authenticateUser(email, password);

          
          // If authentication is successful, get user data
          const backendResult = await emailAuthSignIn(email, password);
          
          if (backendResult.error) {
            Alert.alert('Error', backendResult.errorDetails);
            return;
          }
          
          // Show welcome message and navigate to home screen
          Alert.alert('Welcome Back!', `Welcome back ${backendResult.user.name}!`, [
            {
              text: 'OK',
              onPress: () => {
                router.push({
                  pathname: "/screens/home",
                  params: { 
                    userData: JSON.stringify(backendResult.user),
                    isNewUser: 'false'
                  }
                });
              }
            }
          ]);
          
        } catch (authError) {
          Alert.alert('Authentication Failed', 'Invalid email or password. Please try again.');
          return;
        }
        
      } catch (error) {
        console.error('Sign in error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignInSuccess = (data: any) => {

    setBackendData(data);
    
    // Handle the response based on whether it's a new user or existing user
    if (data.error) {
      Alert.alert('Error', `User check failed: ${data.errorDetails}`);
      return;
    }
    
    // Show welcome message and navigate to home screen with user data
    if (data.isNewUser) {
      Alert.alert('Welcome!', `Welcome ${data.user.name}! Your account has been created successfully.`, [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home screen with user data including personal ID
            router.push({
              pathname: "/screens/home",
              params: { 
                userData: JSON.stringify(data.user),
                isNewUser: 'true'
              }
            });
          }
        }
      ]);
    } else {
      Alert.alert('Welcome Back!', `Welcome back ${data.user.name}!`, [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home screen with user data including personal ID
            router.push({
              pathname: "/screens/home",
              params: { 
                userData: JSON.stringify(data.user),
                isNewUser: 'false'
              }
            });
          }
        }
      ]);
    }
  };

  const navigateToSignup = () => {
    router.push("/screens/reg-login/signup");
  };

  return (
    <View className="flex-1 bg-[#00c795]">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center px-7">
        <Text className="text-white text-4xl font-bold mb-2 mt-[35%]">Budget Nest</Text>
        <Text className="text-white text-2xl font-semibold self-start mt-[10%]">Sign In</Text>
      </View>

      {/* Content Card */}
      <View className="bg-white rounded-t-3xl p-8 min-h-[600px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-black mb-1">Welcome Back</Text>
          <Text className="text-gray-500 mb-8">Please enter your login info to continue.</Text>

          {/* Email Input */}
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-black"
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {hasAttemptedSignIn && emailError && (
              <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <View className="relative">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 pr-12 text-base text-black"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-gray-500 text-lg">👁️</Text>
              </TouchableOpacity>
            </View>
            {hasAttemptedSignIn && passwordError && (
              <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
            )}
          </View>

          {/* Remember Me and Forgot Password */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View className={`w-5 h-5 border-2 rounded mr-2 ${rememberMe ? 'bg-[#00c795] border-[#00c795]' : 'border-gray-400'}`}>
                {rememberMe && <Text className="text-white text-xs text-center">✓</Text>}
              </View>
              <Text className="text-black">Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/screens/forgotpassword')}>
              <Text className="text-[#00c795] font-medium">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="bg-[#00c795] rounded-xl py-4 mb-4"
            onPress={handleSignIn}
          >
            <Text className="text-white text-center font-bold text-lg">Sign In</Text>
          </TouchableOpacity>

          {/* Or Separator */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Button */}
          <GoogleSignInButton
            onSuccess={handleGoogleSignInSuccess}
            setUserInfo={setUserInfo}
          />

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-black">Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text className="text-[#00c795] font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
} 