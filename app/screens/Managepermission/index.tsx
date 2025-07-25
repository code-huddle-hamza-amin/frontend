import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WhatsappIcon from '../../../assets/images/connection/whatsapp.svg';
import EmailIcon from '../../../assets/images/connection/mail.svg';
import SmsIcon from '../../../assets/images/connection/sms.svg';
import WhatsAppModal from '../../../components/integration/whatsappmodal';

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  isConnected: boolean;
  action: string;
}

export default function ManagePermissionsScreen() {
  const params = useLocalSearchParams();
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: '1',
      title: 'WhatsApp Integration',
      description: 'Maintain Records of your transactions through WhatsApp.',
      icon: WhatsappIcon,
      color: '#25D366',
      isConnected: false,
      action: 'Connect WhatsApp'
    },
    {
      id: '2',
      title: 'Email Integration',
      description: 'Import bank emails and receive detailed financial reports.',
      icon: EmailIcon,
      color: '#0072C6',
      isConnected: false,
      action: 'Connect Email'
    },
    {
      id: '3',
      title: 'SMS Permissions',
      description: 'Allow the app to send SMS alerts and notifications.',
      icon: SmsIcon,
      color: '#A259FF',
      isConnected: false,
      action: 'Grant SMS Permissions'
    }
  ]);

  // Handle parameters from home screen
  React.useEffect(() => {
    if (params.userId && params.userEmail) {
      setUserData({
        id: params.userId as string,
        gmail: params.userEmail as string
      });
    }
  }, [params.userId, params.userEmail]);

  // Prevent going back from this screen
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  const handlePermissionAction = (permission: PermissionItem) => {
    console.log('Permission action triggered:', permission);
    
    switch (permission.id) {
      case '1': // WhatsApp
        setWhatsappModalVisible(true);
        break;
      
      case '2': // Email
        Alert.alert(
          'Email Integration',
          'This will allow the app to import bank emails and send detailed financial reports.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Connect', 
              onPress: () => {
                // TODO: Implement Email integration
                Alert.alert('Success', 'Email integration will be implemented soon!');
              }
            }
          ]
        );
        break;
      
      case '3': // SMS
        Alert.alert(
          'SMS Permissions',
          'This will allow the app to send SMS alerts and notifications.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Grant', 
              onPress: () => {
                // TODO: Implement SMS permissions
                Alert.alert('Success', 'SMS permissions will be implemented soon!');
              }
            }
          ]
        );
        break;
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white mt-[9%]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Manage Permissions</Text>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 60 }}>
        {permissions.map((permission) => (
          <View key={permission.id} className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            {/* Icon */}
            <View className="items-center">
            <View 
              className="items-center justify-center w-16 h-16 rounded-full"
              style={{ backgroundColor: permission.color + '20' }} // Adding 20% opacity for light background
            >
              <permission.icon width={28} height={28} color={permission.color} />
              </View>
            </View>

            {/* Title */}
            <Text 
              className="text-lg font-bold text-center"
              style={{ color: permission.color }}
            >
              {permission.title}
            </Text>

            {/* Description */}
            <Text 
              className="text-xs text-center mb-3"
              style={{ color: permission.color + 'CC' }} // Adding transparency
            >
              {permission.description}
            </Text>

            {/* Status */}
            <View className="flex-row items-center justify-center mb-4">
              <View className="w-4 h-4 rounded-full bg-red-500 items-center justify-center mr-2">
                <Ionicons name="close" size={12} color="#fff" />
              </View>
              <Text className="text-red-500 font-medium">Not Connected</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              className="py-3 rounded-xl items-center justify-center"
              style={{ backgroundColor: permission.color }}
              onPress={() => handlePermissionAction(permission)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                {permission.action}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        visible={whatsappModalVisible}
        onClose={() => setWhatsappModalVisible(false)}
        userId={userData?.id || "user123"}
        userEmail={userData?.gmail || ""}
      />
    </View>
  );
} 