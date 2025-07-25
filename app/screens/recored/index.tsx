import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const MODES = [
  { key: 'expense', label: 'Expense', color: '#F87171' },
  { key: 'income', label: 'Income', color: '#10B981' },
  { key: 'transfer', label: 'Transfer', color: '#00B4D8' },
];

export default function AddRecordScreen() {
  const params = useLocalSearchParams();
  const initialMode = (params.mode as 'expense' | 'income' | 'transfer') || 'expense';
  const [mode, setMode] = useState<'expense' | 'income' | 'transfer'>(initialMode);

  const modeConfig = MODES.find(m => m.key === mode)!;

  return (
    <View className="flex-1" style={{ backgroundColor: modeConfig.color }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="pt-12 pb-4 px-4 flex-row items-center justify-between">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Add Record</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* Mode Switch */}
        <View className="flex-row justify-center items-center mb-4">
          {MODES.map(m => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key as any)}
              style={{
                backgroundColor: mode === m.key ? 'white' : 'rgba(255,255,255,0.15)',
                borderRadius: 20,
                paddingHorizontal: 24,
                paddingVertical: 8,
                marginHorizontal: 4,
              }}
            >
              <Text style={{ color: mode === m.key ? m.color : 'white', fontWeight: 'bold', fontSize: 16 }}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Amount Section */}
        <View className="items-center mb-4">
          <Text style={{ color: modeConfig.color, fontWeight: 'bold', fontSize: 22, backgroundColor: 'white', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 8, marginBottom: 8 }}>
            {mode === 'expense' ? '-PKR 10,000' : mode === 'income' ? '+PKR 10,000' : 'PKR 10,000'}
          </Text>
        </View>
        {/* Form Section */}
        <View className="bg-white rounded-t-3xl pt-6 pb-8 px-4">
          <Text className="text-gray-800 text-base font-bold mb-2">General Details</Text>
          {/* Account */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-700 font-semibold">Account</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-bold mr-2">Cash Wallet</Text>
              <Ionicons name="wallet-outline" size={20} color="#94A3B8" />
            </View>
          </View>
          {/* Category */}
          {mode !== 'transfer' && (
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-700 font-semibold">Category</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-400 mr-2">Select Category</Text>
                <Ionicons name="grid-outline" size={20} color="#94A3B8" />
              </View>
            </View>
          )}
          {/* Subcategory */}
          {mode !== 'transfer' && (
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-700 font-semibold">Subcategory</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-400 mr-2">Select Subcategory</Text>
                <Ionicons name="albums-outline" size={20} color="#94A3B8" />
              </View>
            </View>
          )}
          {/* Transfer fields */}
          {mode === 'transfer' && (
            <>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-700 font-semibold">Transfer To</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-bold mr-2">Cash Wallet</Text>
                  <Ionicons name="wallet-outline" size={20} color="#94A3B8" />
                </View>
              </View>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-700 font-semibold">Transfer From</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-bold mr-2">ATM</Text>
                  <Ionicons name="card-outline" size={20} color="#94A3B8" />
                </View>
              </View>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-700 font-semibold">Amount</Text>
                <Text className="text-gray-900 font-bold">10,000</Text>
              </View>
            </>
          )}
          {/* Date */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-700 font-semibold">Date</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-bold mr-2">3 Jul 2025</Text>
              <Ionicons name="calendar-outline" size={20} color="#FBBF24" />
            </View>
          </View>
          {/* Time */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-700 font-semibold">Time</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-bold mr-2">12:48 am</Text>
              <Ionicons name="time-outline" size={20} color="#F472B6" />
            </View>
          </View>
          {/* Label */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-700 font-semibold">Label</Text>
            <TouchableOpacity className="bg-[#10B981] px-3 py-1 rounded-lg">
              <Text className="text-white font-bold">Add Label</Text>
            </TouchableOpacity>
          </View>
          {/* More Detail */}
          <Text className="text-gray-800 text-base font-bold mt-6 mb-2">More Detail</Text>
          {/* Note */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-700 font-semibold">Note</Text>
            <Text className="text-gray-400">Add Note</Text>
          </View>
          {/* Payment Type */}
          {mode !== 'transfer' && (
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-700 font-semibold">Payment Type</Text>
              <Text className="text-gray-900 font-bold">Cash</Text>
            </View>
          )}
          {/* Attachment */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-gray-700 font-semibold">Attachment</Text>
            <TouchableOpacity>
              <Text className="text-[#10B981] font-bold">Add Receipt</Text>
            </TouchableOpacity>
          </View>
          {/* Save Button */}
          <TouchableOpacity className="w-full h-14 bg-[#10B981] rounded-2xl justify-center items-center mt-6">
            <Text className="text-white text-lg font-bold">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 