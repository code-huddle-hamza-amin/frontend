import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ScanIcon from '../../assets/images/home_quickactions/scan.svg';
import MicIcon from '../../assets/images/home_quickactions/mic.svg';
import AlertIcon from '../../assets/images/home_quickactions/caution.svg';
import BankIcon from '../../assets/images/home_quickactions/bank.svg';

interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: string;
}

interface QuickActionsSectionProps {
  quickActions: QuickAction[];
}

export default function QuickActionsSection({ quickActions }: QuickActionsSectionProps) {
  const quickActionIconMap = {
    "Scan Expense Receipt": ScanIcon,
    "Record Voice Note": MicIcon,
    "Set Fraud Alerts": AlertIcon,
    "Upload Bank Statement": BankIcon,
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action triggered:', action);
    // TODO: Implement quick actions
    switch (action) {
      case 'scan_receipt':
        // Navigate to scan receipt screen
        break;
      case 'record_voice':
        // Navigate to voice recording screen
        break;
      case 'fraud_alerts':
        // Navigate to fraud alerts screen
        break;
      case 'upload_statement':
        // Navigate to upload statement screen
        break;
    }
  };

  return (
    <>
      <View className='bg-gray-100'>
        <Text className='text-gray-800 text-lg font-bold pl-4 pt-3'>Quick Actions</Text>
      </View>
      <View className="flex-row px-4 mt-4 mb-2">
        {quickActions.map((action) => {
          const Icon = quickActionIconMap[action.name as keyof typeof quickActionIconMap];
          return (
            <TouchableOpacity
              key={action.id}
              className="flex-1 bg-white rounded-2xl items-center justify-center mx-2"
              style={{
                height: 100,
                width: 100,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
              activeOpacity={0.85}
              onPress={() => handleQuickAction(action.action)}
            >
              {Icon && <Icon width={26} height={26} color="#00C7A3" style={{ marginBottom: 10 }} />}
              <Text className="text-black text-base font-bold text-center text-xs">
                {action.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
} 