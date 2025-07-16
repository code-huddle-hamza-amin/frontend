import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { router } from "expo-router";
import Google_icon from '../../assets/images/icons-signup/google-icon.svg';

const { width } = Dimensions.get("window");

export default function SignupFormScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [hasAttemptedSignUp, setHasAttemptedSignUp] = useState(false);

  const handleSignUp = () => {
    setHasAttemptedSignUp(true);
    
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
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
    
    // Validate terms
    if (!agreeToTerms) {
      setTermsError("Please agree to the Terms & Conditions.");
    } else {
      setTermsError("");
    }
    
    // If no errors, proceed with sign up
    if (email && email.includes('@') && password && password.length >= 6 && 
        confirmPassword && password === confirmPassword && agreeToTerms) {
      console.log("Sign up pressed");
      // Handle actual sign up logic here
    }
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Google sign up pressed");
  };

  const navigateToLogin = () => {
    router.push("/reg-login/login");
  };

  return (
    <View className="flex-1 bg-[#00c795]">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-white text-4xl font-bold mb-2 mt-[30%]">Budget Nest</Text>
        <Text className="text-white text-2xl font-semibold self-start mt-[10%]">Sign Up</Text>
      </View>

      {/* Content Card */}
      <View className="bg-white rounded-t-3xl p-8 min-h-[650px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</Text>
          <Text className="text-gray-500 mb-8">Join us and take control of your finances.</Text>

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
            {hasAttemptedSignUp && emailError && (
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
            {hasAttemptedSignUp && passwordError && (
              <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <View className="relative">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 pr-12 text-base"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text className="text-gray-500 text-lg">👁️</Text>
              </TouchableOpacity>
            </View>
            {hasAttemptedSignUp && confirmPasswordError && (
              <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text>
            )}
          </View>

          {/* Terms and Conditions Checkbox */}
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-start"
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 ${agreeToTerms ? 'bg-[#00c795] border-[#00c795]' : 'border-gray-400'}`}>
                {agreeToTerms && <Text className="text-white text-xs text-center">✓</Text>}
              </View>
              <Text className="text-gray-700 flex-1 text-sm">
                I agree to the Terms & Conditions.
              </Text>
            </TouchableOpacity>
            {hasAttemptedSignUp && termsError && (
              <Text className="text-red-500 text-sm mt-1">{termsError}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-[#00c795] rounded-xl py-4 mb-4"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
          </TouchableOpacity>

          {/* Or Separator */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            className="bg-white border border-gray-300 rounded-xl py-4 flex-row items-center justify-center mb-6"
            onPress={handleGoogleSignUp}
          >
            <Google_icon width={22} height={22} />
            <Text className="text-gray-800 font-bold text-base ml-2">Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-700">Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text className="text-[#00c795] font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
} 