import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WhatsappIcon from '../../assets/images/connection/whatsapp.svg';
import { getConnectedWhatsAppPhones } from '../../services/api';
import WhatsAppOTPModal from './whatsappotpmodal';

interface WhatsAppModalProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
}

interface ConnectedPhone {
  number: string;
  user_id: string;
}

export default function WhatsAppModal({ visible, onClose, userId, userEmail }: WhatsAppModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [connectedPhones, setConnectedPhones] = useState<ConnectedPhone[]>([]);
  const [loading, setLoading] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (visible && userId && !hasLoadedOnce) {
      fetchConnectedPhones();
      setHasLoadedOnce(true);
    }
  }, [visible, userId, hasLoadedOnce]);

  const fetchConnectedPhones = async () => {
    try {
      if (!userId) return;
      
      const response = await getConnectedWhatsAppPhones(userId);
      console.log('API Response:', response);
      
      if (response && response.success && response.whatsapp_numbers) {
        // Transform the API response to match our interface
        const phones = response.whatsapp_numbers.map((phone: any) => ({
          number: phone.number,
          user_id: response.user_id
        }));
        setConnectedPhones(phones);
        console.log('Connected phones set:', phones);
      } else {
        setConnectedPhones([]);
      }
    } catch (error) {
      console.error('Error fetching connected phones:', error);
      // Fallback to empty array if API fails
      setConnectedPhones([]);
    }
  };

  const handleNext = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a WhatsApp number');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try again.');
      return;
    }

    // Add country code if not present
    const fullPhoneNumber = phoneNumber.startsWith('+92') ? phoneNumber : `+92${phoneNumber}`;
    
    // Show OTP modal
    setOtpModalVisible(true);
  };

  const handleOTPSuccess = () => {
    // Only fetch again when a new number is successfully added
    fetchConnectedPhones();
    setPhoneNumber('');
  };

  const handleClose = () => {
    // Reset the loaded state when modal closes
    setHasLoadedOnce(false);
    setPhoneNumber('');
    onClose();
  };

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format as +92 XXX XXXXXXX
    if (cleaned.length >= 10) {
      const countryCode = cleaned.substring(0, 2);
      const areaCode = cleaned.substring(2, 5);
      const phoneNumber = cleaned.substring(5, 12);
      return `+${countryCode} ${areaCode} ${phoneNumber}`;
    }
    
    return number;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(41, 40, 40, 0.7)' }}>
        <View className="bg-white rounded-t-3xl h-1/2">
        {/* Top Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-2 mb-4" />
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Manage Permissions</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 ">
          {/* WhatsApp Connection Section */}
          <View className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
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
              Connect WhatsApp
            </Text>

            {/* Description */}
            <Text className="text-sm text-center text-gray-600 mb-6">
              Enter your WhatsApp number to get started.
            </Text>

            {/* Phone Number Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-800 mb-2">
                WhatsApp Number
              </Text>
              
              <View className="flex-row items-center border border-gray-300 rounded-xl overflow-hidden">
                {/* Country Code */}
                <View className="bg-gray-100 px-3 py-4 border-r border-gray-300">
                  <Text className="text-green-600 font-medium">+92</Text>
                </View>
                
                {/* Phone Number Input */}
                <TextInput
                  className="flex-1 px-4 py-4 text-base"
                  placeholder="Enter WhatsApp Number"
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
              
              <Text className="text-xs text-gray-500 mt-2">
                This number must be registered on WhatsApp
              </Text>
            </View>
          </View>

          {/* Connected Phones Section */}
          {connectedPhones.length > 0 && (
            <View className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Connected Phones
              </Text>
              
              {connectedPhones.map((phone, index) => (
                <View key={index} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <View className="flex-row items-center">
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: '#25D36620' }}
                    >
                      <WhatsappIcon width={16} height={16} color="#25D366" />
                    </View>
                    <Text className="text-gray-800 font-medium">
                      {formatPhoneNumber(phone.number)}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-green-600 text-sm font-medium">Connected</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Next Button */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className={`py-4 rounded-xl items-center justify-center ${
              loading ? 'bg-gray-400' : 'bg-green-500'
            }`}
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {loading ? 'Connecting...' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>

      {/* WhatsApp OTP Modal */}
      <WhatsAppOTPModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        phoneNumber={phoneNumber.startsWith('+92') ? phoneNumber : `+92${phoneNumber}`}
        userId={userId || ''}
        userEmail={userEmail || ''}
        onSuccess={handleOTPSuccess}
      />
    </Modal>
  );
} 