import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShoppingIcon from '../../assets/images/items/categories/Shopping.svg';
import TransportIcon from '../../assets/images/items/categories/Transportation.svg';
import HousingIcon from '../../assets/images/items/categories/House.svg';
import UtilitiesIcon from '../../assets/images/items/categories/Utilities.svg';
import FoodIcon from '../../assets/images/items/categories/Fooddrink.svg';

interface Transaction {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  is_income: boolean;
  date: string;
  time: string;
  description?: string;
  wallet_id: string;
  icon: string;
  color: string;
  receipt_url?: string;
}

interface TransactionsSectionProps {
  transactions: Transaction[];
}

export default function TransactionsSection({ transactions }: TransactionsSectionProps) {
  const categoryIconMap = {
    Shopping: ShoppingIcon,
    Transport: TransportIcon,
    Housing: HousingIcon,
    'Bills & Utilities': UtilitiesIcon,
    "Food & Dining": FoodIcon,
  };

  // Helper function to get color for category
  const getColorForCategory = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'orange': '#F97316',
      'blue': '#3B82F6',
      'purple': '#8B5CF6',
      'pink': '#EC4899',
      'red': '#EF4444',
      'green': '#10B981',
      'gray': '#6B7280'
    };
    return colorMap[colorName] || '#6B7280'; // Default to gray if color not found
  };

  return (
    <>
      <View className="flex-row justify-between items-center ml-4 mr-4">
        <Text className="text-lg font-bold text-gray-800">Recent Transactions</Text>
        <TouchableOpacity>
          <Text className="text-green-500 font-medium">View All {'>'}</Text>
        </TouchableOpacity>
      </View>
      <View className="p-4 bg-white mt-2 rounded-2xl ml-4 mr-4">
        {transactions.length === 0 ? (
          <View className="flex-row items-center justify-center py-8">
            <Text className="text-gray-400 text-base font-semibold">No transactions</Text>
          </View>
        ) : (
          transactions.slice(0, 6).map((transaction, idx) => {
            const Icon = categoryIconMap[transaction.category as keyof typeof categoryIconMap];
            return (
              <View
                key={transaction.id}
                className="flex-row items-center py-4"
                style={{
                  borderBottomWidth: idx !== transactions.slice(0, 6).length - 1 ? 1 : 0,
                  borderColor: '#F1F5F9',
                }}
              >
                {/* Icon */}
                <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: getColorForCategory(transaction.color) }}>
                  {Icon && <Icon width={28} height={28} />}
                </View>
                {/* Details */}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="font-bold text-base text-gray-900">{transaction.category}</Text>
                    <Text className="mx-1 text-lg text-[#00C7A3]">{'>>'}</Text>
                    <Text className="font-bold text-base" style={{ color: '#00C7A3' }}>{transaction.subcategory}</Text>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                  {transaction.description} • {transaction.date} • {transaction.time}
                  </Text>
                  {transaction.description !== null && transaction.description !== undefined && transaction.description !== '' ? (
                    <View className="mt-1 bg-gray-100 px-2 py-1 rounded-lg self-start">
                      <Text className="text-black text-xs font-semibold">{transaction.description}</Text>
                    </View>
                  ) : null}
                </View>
                {/* Receipt Icon and Amount */}
                <View className="items-end ml-2">
                  <TouchableOpacity className="mb-2">
                    <Ionicons name="image-outline" size={22} color="#94A3B8" />
                  </TouchableOpacity>
                  <Text className="font-bold text-lg" style={{ color: transaction.is_income ? '#10B981' : '#F87171' }}>
                    {transaction.is_income ? '+' : '-'}PKR {transaction.amount.toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </>
  );
} 