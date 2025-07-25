import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'cash' | 'bank' | 'card';
  color: string;
  icon: string;
}

interface WalletSectionProps {
  wallets: Wallet[];
}

export default function WalletSection({ wallets }: WalletSectionProps) {
  return (
    <View className="p-4 bg-gray-100 mt-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">Wallet</Text>
        <TouchableOpacity>
          <Text className="text-green-500 font-medium">View All {'>'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {wallets.map((wallet) => (
          <View
            key={wallet.id}
            className="bg-white rounded-2xl mr-4 p-4 flex-row items-center"
            style={{
              width: 220,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              className="items-center justify-center rounded-xl"
              style={{
                width: 48,
                height: 48,
                backgroundColor: wallet.color === 'blue' ? '#00B4D8' : '#F87171',
                marginRight: 12,
              }}
            >
              <Ionicons name="wallet-outline" size={28} color="white" />
            </View>
            <View>
              <Text className="text-gray-500 text-base font-medium mb-1">{wallet.name}</Text>
              <Text className="text-black text-xl font-bold">
                {wallet.currency} {wallet.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 