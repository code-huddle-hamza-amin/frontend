import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, BackHandler } from "react-native";
import { router } from "expo-router";
import Google_icon from '../../assets/images/icons-signup/google-icon.svg';
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton";
import OTPVerificationModal from "../../../components/auth/OTPVerificationModal";
import { emailAuthSignUp, getUserByEmail, getOTP, createUser, generateUUID } from "../../../services/api";

const { width } = Dimensions.get("window");

export default function SignupFormScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [hasAttemptedSignUp, setHasAttemptedSignUp] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userExistsError, setUserExistsError] = useState("");

  // Prevent going back from signup screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  const handleSignUp = async () => {
    setHasAttemptedSignUp(true);
    setUserExistsError(""); // Clear previous error
    
    // Validate name
    if (!name || name.trim().length < 2) {
      setNameError("Please enter your full name (at least 2 characters).");
      return;
    } else {
      setNameError("");
    }
    
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
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      return;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }
    
    // Validate terms
    if (!agreeToTerms) {
      setTermsError("Please agree to the Terms & Conditions.");
      return;
    } else {
      setTermsError("");
    }
    
    // If no errors, proceed with sign up
    if (name && name.trim().length >= 2 && email && email.includes('@') && password && password.length >= 6 && 
        confirmPassword && password === confirmPassword && agreeToTerms) {
      try {
        console.log("Checking if user exists...");
        
        // First, check if user already exists
        try {
          const existingUser = await getUserByEmail(email);
          if (existingUser && existingUser.user) {
            setUserExistsError("An account with this email already exists. Please sign in instead.");
            return;
          }
        } catch (error) {
          // User doesn't exist, which is what we want
          console.log("User doesn't exist, proceeding with signup...");
        }
        
        // User doesn't exist, proceed with OTP verification
        try {
          await getOTP(email);
          setShowOTPModal(true);
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        }
        
      } catch (error) {
        console.error('Sign up error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleOTPVerificationSuccess = async (userData: any) => {
    try {
      console.log("OTP verified, creating user...");
      
      // Generate UUID for the user
      const uuidResponse = await generateUUID();
      const userId = uuidResponse.uuid;
      
      // Create user in backend
      const userDataToCreate = {
        id: userId,
        name: name,
        pass: password,
        gmail: email,
        net_amount: 0
      };
      
      const createResponse = await createUser(userDataToCreate);
      console.log('User created successfully:', createResponse);
      
      // Show welcome message and navigate to home screen
      Alert.alert('Welcome!', `Welcome ${name}! Your account has been created successfully.`, [
        {
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: "/screens/home",
              params: { 
                userData: JSON.stringify(userDataToCreate),
                isNewUser: 'true'
              }
            });
          }
        }
      ]);
      
    } catch (error) {
      console.error('User creation error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignUp = (data: any) => {

    
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

  const navigateToLogin = () => {
    router.push("/screens/reg-login/login");
  };

  return (
    <View className="flex-1 bg-[#00c795]">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-white text-4xl font-bold mb-2 mt-[20%]">Budget Nest</Text>
        <Text className="text-white text-2xl font-semibold self-start mt-[5%]">Sign Up</Text>
      </View>

      {/* Content Card */}
      <View className="bg-white rounded-t-3xl p-6 h-[680px]">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</Text>
          <Text className="text-gray-500 mb-8">Join us and take control of your finances.</Text>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 text-base text-black ${
                hasAttemptedSignUp && nameError 
                  ? 'border-red-500 bg-red-50' 
                  : name.trim().length > 0 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (hasAttemptedSignUp && text.trim().length >= 2) {
                  setNameError("");
                }
              }}
              autoCapitalize="words"
            />
            {hasAttemptedSignUp && nameError && (
              <Text className="text-red-500 text-sm mt-1">{nameError}</Text>
            )}
            {name.trim().length > 0 && !nameError && (
              <Text className="text-green-600 text-sm mt-1">✓ Name looks good</Text>
            )}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 text-base text-black ${
                hasAttemptedSignUp && emailError 
                  ? 'border-red-500 bg-red-50' 
                  : email.includes('@') && email.includes('.') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (hasAttemptedSignUp && text.includes('@') && text.includes('.')) {
                  setEmailError("");
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {hasAttemptedSignUp && emailError && (
              <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
            )}
            {email.includes('@') && email.includes('.') && !emailError && (
              <Text className="text-green-600 text-sm mt-1">✓ Valid email format</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-xl px-4 py-3 pr-12 text-base text-black ${
                  hasAttemptedSignUp && passwordError 
                    ? 'border-red-500 bg-red-50' 
                    : password.length >= 6 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-white'
                }`}
                placeholder="Create a strong password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (hasAttemptedSignUp && text.length >= 6) {
                    setPasswordError("");
                  }
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-gray-500 text-lg">{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {hasAttemptedSignUp && passwordError && (
              <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
            )}
            {password.length >= 6 && !passwordError && (
              <Text className="text-green-600 text-sm mt-1">✓ Password meets requirements</Text>
            )}
            <Text className="text-gray-500 text-xs mt-1">Must be at least 6 characters long</Text>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-xl px-4 py-3 pr-12 text-base text-black ${
                  hasAttemptedSignUp && confirmPasswordError 
                    ? 'border-red-500 bg-red-50' 
                    : confirmPassword.length > 0 && password === confirmPassword 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-white'
                }`}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (hasAttemptedSignUp && text === password) {
                    setConfirmPasswordError("");
                  }
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text className="text-gray-500 text-lg">{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {hasAttemptedSignUp && confirmPasswordError && (
              <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text>
            )}
            {confirmPassword.length > 0 && password === confirmPassword && !confirmPasswordError && (
              <Text className="text-green-600 text-sm mt-1">✓ Passwords match</Text>
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
                I agree to the <Text className="text-[#00c795] font-medium">Terms & Conditions</Text> and <Text className="text-[#00c795] font-medium">Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>
            {hasAttemptedSignUp && termsError && (
              <Text className="text-red-500 text-sm mt-1">{termsError}</Text>
            )}
            {agreeToTerms && !termsError && (
              <Text className="text-green-600 text-sm mt-1">✓ Terms accepted</Text>
            )}
          </View>

          {/* User Exists Error */}
          {userExistsError && (
            <Text className="text-red-500 text-sm mb-4 text-center">{userExistsError}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 mb-4 ${
              name.trim().length >= 2 && 
              email.includes('@') && 
              password.length >= 6 && 
              password === confirmPassword && 
              agreeToTerms
                ? 'bg-[#00c795]' 
                : 'bg-gray-300'
            }`}
            onPress={handleSignUp}
            disabled={
              name.trim().length < 2 || 
              !email.includes('@') || 
              password.length < 6 || 
              password !== confirmPassword || 
              !agreeToTerms
            }
          >
            <Text className={`text-center font-bold text-lg ${
              name.trim().length >= 2 && 
              email.includes('@') && 
              password.length >= 6 && 
              password === confirmPassword && 
              agreeToTerms
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Or Separator */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Button */}
          <GoogleSignInButton
            onSuccess={handleGoogleSignUp}
          />

          {/* Sign In Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-700">Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text className="text-[#00c795] font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={email}
        onVerificationSuccess={handleOTPVerificationSuccess}
      />
    </View>
  );
} 