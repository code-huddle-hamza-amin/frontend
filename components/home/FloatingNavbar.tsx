import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeIcon from '../../assets/images/navbar/Home.svg';
import PieIcon from '../../assets/images/navbar/Split.svg';
import ChartIcon from '../../assets/images/navbar/Graph.svg';
import UsersIcon from '../../assets/images/navbar/Friend.svg';
import SettingsIcon from '../../assets/images/navbar/Setting.svg';

interface FloatingNavbarProps {
  selectedTab: string;
  onTabPress: (tabKey: string) => void;
  onAddPress: () => void;
  fabOpen: boolean;
  onFabAction: (action: string) => void;
  onFabOverlayPress?: () => void;
}

export default function FloatingNavbar({
  selectedTab,
  onTabPress,
  onAddPress,
  fabOpen,
  onFabAction,
  onFabOverlayPress,
}: FloatingNavbarProps) {
  const navTabs = [
    { key: 'home', label: 'Home', Icon: HomeIcon },
    { key: 'pie', label: 'Pie', Icon: PieIcon },
    { key: 'chart', label: 'Chart', Icon: ChartIcon },
    { key: 'users', label: 'Users', Icon: UsersIcon },
    { key: 'settings', label: 'Settings', Icon: SettingsIcon },
  ];

  // Speed dial actions (top to bottom)
  const fabActions = [
    { key: 'transfer', icon: <Ionicons name="swap-horizontal" size={28} color="white" />, color: '#00B4D8' },
    { key: 'income', icon: <Ionicons name="arrow-down-circle-outline" size={28} color="white" />, color: '#10B981' },
    { key: 'expense', icon: <Ionicons name="arrow-up-circle-outline" size={28} color="white" />, color: '#F87171' },
  ];

  return (
    <>
      {/* Overlay when FAB is open */}
      {fabOpen && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.15)',
            zIndex: 99,
          }}
          onPress={onFabOverlayPress || onAddPress}
        />
      )}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 70,
          alignItems: 'center',
          zIndex: 100,
        }}
        pointerEvents="box-none"
      >
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(209, 213, 219, 0.8)',
            borderRadius: 32,
            paddingHorizontal: 8,
            paddingVertical: 4,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
            width: '70%',
            maxWidth: 300,
          }}
        >
          {navTabs.map((tab) => {
            const isActive = selectedTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                style={{
                  marginHorizontal: 2,
                  backgroundColor: isActive ? '#00C7A3' : '#F3F4F6',
                  borderRadius: 24,
                  paddingHorizontal: isActive ? 12 : 0,
                  paddingVertical: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 40,
                  minWidth: 40,
                  justifyContent: 'center',
                }}
                activeOpacity={0.85}
              >
                <tab.Icon width={20} height={20} color={isActive ? 'white' : '#94A3B8'} />
                {isActive && (
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 4 }}>
                    {tab.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
          {/* Speed dial actions */}
          {fabOpen && (
            <View style={{
              position: 'absolute',
              right: -8,
              bottom: 60,
              alignItems: 'center',
            }}>
              {fabActions.map((action, idx) => (
                <TouchableOpacity
                  key={action.key}
                  style={{
                    marginBottom: 18,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: action.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  onPress={() => onFabAction(action.key)}
                  activeOpacity={0.85}
                >
                  {action.icon}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Floating + Button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: -40,
              top: -50,
              backgroundColor: '#00C7A3',
              width: 40,
              height: 40,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
              zIndex: 101,
            }}
            activeOpacity={0.85}
            onPress={onAddPress}
          >
            <Ionicons name={fabOpen ? 'close' : 'add'} size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
} 