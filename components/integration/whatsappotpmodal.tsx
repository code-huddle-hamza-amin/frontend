import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WhatsappIcon from '../../assets/images/connection/whatsapp.svg';
import { sendWhatsAppOTP, verifyOTP, connectWhatsAppNumber } from '../../services/api';

interface WhatsAppOTPModalProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber: string;
  userId: string;
  userEmail: string;
  onSuccess: () => void;
}

export default function WhatsAppOTPModal({ 
  visible, 
  onClose, 
  phoneNumber, 
  userId, 
  userEmail,
  onSuccess 
}: WhatsAppOTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (visible) {
      // Send OTP when modal opens
      handleSendOTP();
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

  const handleSendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsSendingOTP(true);
    try {
      // Send OTP to WhatsApp but store with gmail in database
      await sendWhatsAppOTP(phoneNumber,userEmail);
      setResendTimer(60); // 60 seconds cooldown
      Alert.alert('Success', 'OTP sent to your WhatsApp!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

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
      // Use gmail for OTP verification (existing function)
      const result = await verifyOTP(userEmail, otpCode);
      
      if (result.success) {
        // Connect the WhatsApp number after successful verification
        await connectWhatsAppNumber(userId, phoneNumber);
        
        Alert.alert('Success', 'WhatsApp connected successfully!', [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
              setOtp(['', '', '', '', '', '']);
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(41, 40, 40, 0.7)' }}>
        <View className="bg-white rounded-t-3xl h-1/2">
          {/* Top Handle */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-2 mb-4" />
          
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Manage Permissions</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-4 py-6">
            {/* WhatsApp Icon */}
            <View className="items-center mb-4">
              <View 
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{ backgroundColor: '#25D36620' }}
              >
                <WhatsappIcon width={28} height={28} color="#25D366" />
              </View>
            </View>

            {/* Title */}
            <Text className="text-lg font-bold text-center text-gray-800 mb-2">
              Enter OTP
            </Text>

            {/* Description */}
            <Text className="text-sm text-center text-gray-600 mb-6">
              We'll send a 6-digit code for verification
            </Text>

            {/* OTP Input Fields */}
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  className={`w-12 h-12 rounded-xl text-center text-lg font-bold border-2 ${
                    digit ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-100 border-gray-300'
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
                onPress={handleSendOTP}
                disabled={resendTimer > 0 || isSendingOTP}
              >
                <Text className={`font-medium ${resendTimer > 0 || isSendingOTP ? 'text-gray-400' : 'text-green-500'}`}>
                  {isSendingOTP ? 'Sending...' : resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center justify-center ${
                isVerifying || otp.join('').length !== 6 ? 'bg-gray-400' : 'bg-green-500'
              }`}
              onPress={handleVerifyOTP}
              disabled={isVerifying || otp.join('').length !== 6}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                {isVerifying ? 'Verifying...' : 'Verify & Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 