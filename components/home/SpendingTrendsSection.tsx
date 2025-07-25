import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpendingTrend {
  date: string;
  income: number;
  expense: number;
}

interface SpendingTrendsSectionProps {
  spendingTrends: SpendingTrend[];
}

export default function SpendingTrendsSection({ spendingTrends }: SpendingTrendsSectionProps) {
  const [graphType, setGraphType] = useState<'income' | 'expense' | 'both'>('both');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const dropdownButtonRef = useRef<View>(null);

  const getMaxValue = () => {
    if (!spendingTrends) return 1200;
    if (graphType === 'income') {
      return Math.max(...spendingTrends.map(t => t.income), 300);
    } else if (graphType === 'expense') {
      return Math.max(...spendingTrends.map(t => t.expense), 300);
    } else {
      return Math.max(...spendingTrends.map(t => t.income + t.expense), 300);
    }
  };

  const maxValue = Math.ceil(getMaxValue() / 500) * 500;
  const yTicks = Array.from({ length: 5 }, (_, i) => maxValue - i * (maxValue / 4));

  const graphTypeOptions = [
    { label: 'Income and Expense (Both)', value: 'both' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  return (
    <View
      className="bg-white rounded-2xl mx-4 mt-2"
      style={{
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Dropdown */}
      <TouchableOpacity
        ref={dropdownButtonRef}
        className="flex-row items-center justify-between mb-2"
        style={{ minHeight: 36 }}
        onPress={() => {
          dropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
            setDropdownTop(y + height);
            setDropdownVisible(true);
          });
        }}
      >
        <Text className="text-base font-semibold text-gray-800">
          {graphTypeOptions.find(opt => opt.value === graphType)?.label}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#94A3B8" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <View
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: dropdownTop,
                  backgroundColor: 'white',
                  borderRadius: 12,
                  borderColor: '#E5E7EB',
                  borderWidth: 1,
                  paddingVertical: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 5,
                  zIndex: 100,
                }}
              >
                {graphTypeOptions.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={{ padding: 12, borderBottomWidth: opt.value !== graphTypeOptions[graphTypeOptions.length-1].value ? 1 : 0, borderBottomColor: '#F1F5F9' }}
                    onPress={() => {
                      setGraphType(opt.value as any);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={{
                      color: graphType === opt.value ? '#00C7A3' : '#222B45',
                      fontWeight: graphType === opt.value ? 'bold' : 'normal',
                      fontSize: 16,
                    }}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Chart */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 180 }}>
        {/* Y-axis */}
        <View style={{ justifyContent: 'space-between', height: 140, marginRight: 8 }}>
          {yTicks.map((v) => (
            <Text key={v} style={{ color: '#CBD5E1', fontSize: 12, height: 28 }}>{v}</Text>
          ))}
        </View>
        {/* Bars */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', height: 140 }}>
          {spendingTrends.map((trend, idx) => {
            const incomeHeight = (trend.income / maxValue) * 120;
            const expenseHeight = (trend.expense / maxValue) * 120;
            return (
              <View key={idx} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ height: 120, justifyContent: 'flex-end' }}>
                  {graphType === 'both' ? (
                    <>
                      {/* Green income bar */}
                      <View
                        style={{
                          width: 18,
                          height: incomeHeight,
                          backgroundColor: '#10B981',
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                        }}
                      />
                      {/* Red expense bar */}
                      <View
                        style={{
                          width: 18,
                          height: expenseHeight,
                          backgroundColor: '#F87171',
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          marginTop: -2,
                        }}
                      />
                    </>
                  ) : graphType === 'income' ? (
                    <View
                      style={{
                        width: 18,
                        height: incomeHeight,
                        backgroundColor: '#10B981',
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 18,
                        height: expenseHeight,
                        backgroundColor: '#F87171',
                        borderRadius: 6,
                      }}
                    />
                  )}
                </View>
                {/* Day label */}
                <Text style={{ color: '#64748B', fontSize: 13, marginTop: 8 }}>
                  {trend.date}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
} 