import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { router } from "expo-router";
import Google_icon from '../../assets/images/icons-signup/google-icon.svg';
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

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

  const handleSignIn = () => {
    setHasAttemptedSignIn(true);
    
    // Validate email
    if (!email || !email.includes('@')) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
    
    // If no errors, proceed with sign in
    if (email && email.includes('@') && password && password.length >= 6) {
      console.log("Sign in pressed");
      // Handle actual sign in logic here
    }
  };

  const handleGoogleSignInSuccess = (data: any) => {
    console.log('✅ Google Sign-in Success:', data);
    setBackendData(data);
    // Navigate to home or handle success
  };

  const navigateToSignup = () => {
    router.push("/reg-login/signup");
  };

  return (
    <View className="flex-1 bg-[#00c795]">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-white text-4xl font-bold mb-2 mt-[35%]">Budget Nest</Text>
        <Text className="text-white text-2xl font-semibold self-start mt-[10%]">Sign In</Text>
      </View>

      {/* Content Card */}
      <View className="bg-white rounded-t-3xl p-8 min-h-[620px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</Text>
          <Text className="text-gray-500 mb-8">Please enter your login info to continue.</Text>

          {/* Email Input */}
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="Email"
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
                className="border border-gray-300 rounded-xl px-4 py-3 pr-12 text-base"
                placeholder="Password"
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
              <Text className="text-gray-700">Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
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
            <Text className="text-gray-700">Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text className="text-[#00c795] font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
} 