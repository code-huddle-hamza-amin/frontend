import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { verifyOTP } from '../../services/api';

const { width } = Dimensions.get('window');

interface OTPVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: (userData: any) => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  visible,
  onClose,
  email,
  onVerificationSuccess
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

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
      const result = await verifyOTP(email, otpCode);
      if (result.success) {
        Alert.alert('Success', 'Email verified successfully!', [
          {
            text: 'OK',
            onPress: () => {
              onVerificationSuccess(result.user);
              handleClose();
            }
          }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      const { getOTP } = require('../../services/api');
      await getOTP(email);
      setResendTimer(60); // 60 seconds cooldown
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setIsVerifying(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(41, 40, 40, 0.7)' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              minHeight: 500
            }}
            className="bg-white rounded-t-3xl p-6"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-black">OTP Verification</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-2xl text-gray-500">×</Text>
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <Text className="text-gray-600 mb-2">
              Please enter the code we just sent to your email
            </Text>
            <Text className="text-gray-800 font-medium mb-6">{email}</Text>

            {/* OTP Input Fields */}
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  className={`w-12 h-12 border-2 rounded-lg text-center text-lg font-bold ${
                    digit ? 'border-green-500 bg-green-50' : 'border-gray-300'
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
            <View className="flex-row justify-center mb-6">
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

            {/* Verify Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 ${isVerifying ? 'bg-gray-400' : 'bg-green-500'}`}
              onPress={handleVerifyOTP}
              disabled={isVerifying || otp.join('').length !== 6}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isVerifying ? 'Verifying...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default OTPVerificationModal; 