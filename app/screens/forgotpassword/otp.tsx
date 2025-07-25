import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOTP, getOTP } from '../../../services/api';

export default function ForgotPasswordOTPScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const userExists = params.userExists === 'true';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  // Handle back button to go to forgot password
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigateBack();
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      if (userExists) {
        // Real user, verify OTP with backend
        const result = await verifyOTP(email, otpCode);
        if (result.success) {
          Alert.alert('Success', 'OTP verified successfully!', [
            {
              text: 'OK',
              onPress: () => {
                router.push({
                  pathname: '/screens/forgotpassword/changepassword',
                  params: { 
                    email: email,
                    userExists: 'true'
                  }
                });
              }
            }
          ]);
        }
      } else {
        // Fake user, accept any 6-digit OTP
        Alert.alert('Failed', 'OTP Failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    if (userExists) {
      try {
        await getOTP(email);
        setResendTimer(60); // 60 seconds cooldown
        Alert.alert('Success', 'OTP resent successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to resend OTP');
      }
    } else {
      // For fake users, just show success message
      setResendTimer(60);
      Alert.alert('Success', 'OTP resent successfully!');
    }
  };

  const navigateBack = () => {
    router.push('/screens/forgotpassword/index' as any);
  };

  return (
    


    <View className="flex-1 bg-white">
      {/* Header with Back Arrow */}
      <View className="flex-col items-start p-6 pt-12 mt-[10%]">
        <TouchableOpacity onPress={navigateBack} className="mb-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-8">
        <View className="w-full">
          {/* Title */}
          <Text className="text-2xl font-bold text-black mb-2">OTP Verification</Text>
          
          {/* Instructions */}
          <Text className="text-gray-600 mb-2">
            Please enter the code we just sent to your email
          </Text>
          <Text className="text-gray-600 mb-8">{email}</Text>

          {/* OTP Input Fields */}
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                className={`w-16 h-16 rounded-xl text-center text-xl font-bold ${
                  digit ? 'bg-gray-100 text-green-500' : 'bg-gray-100'
                }`}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend OTP */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-600">Didn't receive an OTP yet? </Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendTimer > 0}
            >
              <Text className={`font-medium ${resendTimer > 0 ? 'text-gray-400' : 'text-green-500'}`}>
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 ${isVerifying ? 'bg-gray-400' : 'bg-green-500'}`}
            onPress={handleVerifyOTP}
            disabled={isVerifying || otp.join('').length !== 6}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isVerifying ? 'Verifying...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 