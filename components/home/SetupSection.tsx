import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WhatsappIcon from '../../assets/images/connection/whatsapp.svg';
import EmailIcon from '../../assets/images/connection/mail.svg';
import SmsIcon from '../../assets/images/connection/sms.svg';

interface SetupItem {
  id: string;
  name: string;
  icon: string;
  is_completed: boolean;
  action_url?: string;
}

interface SetupSectionProps {
  setupItems: SetupItem[];
  userData?: any;
}

export default function SetupSection({ setupItems, userData }: SetupSectionProps) {
  const setupIconMap = {
    WhatsApp: { Icon: WhatsappIcon, color: '#25D366' },
    Email: { Icon: EmailIcon, color: '#0072C6' },
    SMS: { Icon: SmsIcon, color: '#A259FF' },
  };

  const getSetupProgress = () => {
    const completed = setupItems.filter(item => item.is_completed).length;
    return `${completed}/3 Complete`;
  };

  const handleSetupAction = (item: SetupItem) => {

    // TODO: Implement setup actions
  };

  const handleCompleteNow = () => {

    router.push({
      pathname: '/screens/Managepermission' as any,
      params: { 
        userId: userData?.id || '',
        userEmail: userData?.gmail || userData?.email || ''
      }
    });
  };

  return (
    <View className='bg-white rounded-2xl ml-4 mr-4'>
      <View className='flex-row justify-between items-center pt-4 pb-2 pl-4 pr-4 mt-2 rounded-2xl'>
        <Text className='text-lg font-bold text-gray-800'>Complete Your Setup</Text>
        <View className='bg-gray-100 rounded-full p-2'>
          <Text className='text-gray-800 font-small'>{getSetupProgress()}</Text>
        </View>
      </View>
      <View className='flex-row justify-between items-center pl-4 pr-4'>
        <Text className='text-gray-800 text-xs'>Connect WhatsApp, Email & SMS to get the best experience.</Text>
      </View>
      <View className="flex-row px-4 mt-4 mb-4">
        {setupItems.map((item) => {
          const { Icon, color } = setupIconMap[item.name as keyof typeof setupIconMap] || {};
          return (
            <View
              key={item.id}
              className="mr-4"
              style={{
                backgroundColor: item.is_completed ? '#E6FAF3' : '#fff',
                borderColor: item.is_completed ? 'transparent' : '#E5E7EB',
                borderWidth: 1.5,
                borderRadius: 20,
                width: '30%',
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Top-right check or x */}
              <View
                style={{
                  position: 'absolute',
                  top: -15,
                  right: -8,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: item.is_completed ? '#10B981' : '#CBD5E1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                }}
              >
                <Ionicons
                  name={item.is_completed ? 'checkmark' : 'close'}
                  size={15}
                  color="#fff"
                />
              </View>
              {/* SVG Icon */}
              {Icon && <Icon width={26} height={26} color={color} />}
              {/* Label */}
              <Text className='text-gray-800 text-sm font-medium'>
                {item.name}
              </Text>
            </View>
          );
        })}
      </View>
      {/* Complete Now Button */}
      <TouchableOpacity
        className="w-[91%] h-16 bg-green-500 rounded-2xl justify-center items-center ml-4 mr-4 mb-4"
        activeOpacity={0.85}
        onPress={handleCompleteNow}
      >
        <Text className='text-white text-lg font-bold'>Complete Now</Text>
      </TouchableOpacity>
    </View>
  );
}