import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HomeData } from '../../../types/home';
import WalletSection from '../../../components/home/WalletSection';
import SetupSection from '../../../components/home/SetupSection';
import QuickActionsSection from '../../../components/home/QuickActionsSection';
import TransactionsSection from '../../../components/home/TransactionsSection';
import SpendingTrendsSection from '../../../components/home/SpendingTrendsSection';
import FloatingNavbar from '../../../components/home/FloatingNavbar';
import { useRouter } from 'expo-router';
import { getRecentTransactions } from '../../../services/api';

// Dummy data (without transactions - they will be fetched from API)
const dummyHomeData: HomeData = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    profile_picture: "https://lh3.googleusercontent.com/a/ACg8ocIIou8tFPzFfdzYy3uxC2pzRmuIxZC_rc28Ee2v2iXeqqZj=s96-c"
  },
  wallets: [
    {
      id: "1",
      name: "Cash",
      balance: 1000,
      currency: "PKR",
      type: "cash",
      color: "blue",
      icon: "wallet-outline"
    },
    {
      id: "2", 
      name: "Cash",
      balance: 1000,
      currency: "PKR",
      type: "cash",
      color: "red",
      icon: "wallet-outline"
    }
  ],
  recent_transactions: [], // Will be populated from API
  setup_items: [
    {
      id: "1",
      name: "WhatsApp",
      icon: "logo-whatsapp",
      is_completed: true
    },
    {
      id: "2",
      name: "Email",
      icon: "mail-outline",
      is_completed: true
    },
    {
      id: "3",
      name: "SMS",
      icon: "chatbubble-outline",
      is_completed: false
    }
  ],
  quick_actions: [
    {
      id: "1",
      name: "Scan Expense Receipt",
      icon: "scan-outline",
      color: "blue",
      action: "scan_receipt"
    },
    {
      id: "2",
      name: "Record Voice Note",
      icon: "mic-outline",
      color: "purple",
      action: "record_voice"
    },
    {
      id: "3",
      name: "Set Fraud Alerts",
      icon: "warning-outline",
      color: "orange",
      action: "fraud_alerts"
    },
    {
      id: "4",
      name: "Upload Bank Statement",
      icon: "business-outline",
      color: "green",
      action: "upload_statement"
    }
  ],
  spending_trends: [], // Will be populated from API
  total_balance: 2000,
  monthly_income: 5000,
  monthly_expense: 3000
};

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  
  // New state for dynamic data
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');
  const [fabOpen, setFabOpen] = useState(false);
  const router = useRouter();

  // Prevent going back from home screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (params.userData) {
      try {
        const parsedUserData = JSON.parse(params.userData as string);
        setUserData(parsedUserData);
        setIsNewUser(params.isNewUser === 'true');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [params.userData, params.isNewUser]);

  // Load home data
  useEffect(() => {
    loadHomeData();
  }, [userData]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Start with dummy data
      const baseData = { ...dummyHomeData };
      
      // If we have user data, fetch real transactions
      if (userData && userData.id) {
        try {

          const transactionsResponse = await getRecentTransactions(userData.id);
          
          if (transactionsResponse && transactionsResponse.transactions) {
            // Transform backend transactions to match frontend format
            const transformedTransactions = transactionsResponse.transactions.map((transaction: any) => ({
              id: transaction.id.toString(),
              category: transaction.category_name || 'Other',
              subcategory: transaction.subcategory_name || 'General',
              amount: parseFloat(transaction.price),
              is_income: transaction.is_income,
              date: new Date(transaction.date).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short' 
              }),
              time: new Date(`2000-01-01T${transaction.time}`).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              description: transaction.vendor_name || 'Unknown',
              wallet_id: transaction.medium_id?.toString() || '1',
              icon: getTransactionIcon(transaction.category_name),
              color: getTransactionColor(transaction.category_name),
              // Add day for graph compatibility
              day: new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'short' })
            }));
            
            baseData.recent_transactions = transformedTransactions;

            
            // Generate spending trends from real transactions
            try {
              const spendingTrends = generateSpendingTrendsFromTransactions(transactionsResponse.transactions);
              baseData.spending_trends = spendingTrends;

            } catch (error) {
              console.error('Error generating spending trends:', error);
              // Fallback to empty spending trends
              baseData.spending_trends = [];
            }
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
          // Keep empty transactions array if API fails
          baseData.recent_transactions = [];
        }
      }
      
      setHomeData(baseData);
    } catch (error) {
      console.error('Error loading home data:', error);
      // Fallback to dummy data on error
      setHomeData(dummyHomeData);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate spending trends from transactions
  const generateSpendingTrendsFromTransactions = (transactions: any[]) => {
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    // Initialize spending trends with 0 values
    const spendingTrends = last7Days.map(date => ({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      income: 0,
      expense: 0
    }));

    // Process each transaction
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const dayOfWeek = transactionDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Find the corresponding day in spending trends
      const trendIndex = spendingTrends.findIndex(trend => trend.date === dayOfWeek);
      
      if (trendIndex !== -1) {
        const amount = parseFloat(transaction.price);
        if (transaction.is_income) {
          spendingTrends[trendIndex].income += amount;
        } else {
          spendingTrends[trendIndex].expense += amount;
        }
      }
    });

    return spendingTrends;
  };

  // Helper function to get transaction icon based on category
  const getTransactionIcon = (categoryName: string): string => {
    const categoryIcons: { [key: string]: string } = {
      'Food & Dining': 'restaurant-outline',
      'Transportation': 'car-outline',
      'Shopping': 'bag-outline',
      'Entertainment': 'game-controller-outline',
      'Bills & Utilities': 'card-outline',
      'Healthcare': 'medical-outline',
      'Income': 'trending-up-outline',
      'Savings': 'save-outline',
      'Investment': 'trending-up-outline'
    };
    return categoryIcons[categoryName] || 'help-outline';
  };

  // Helper function to get transaction color based on category
  const getTransactionColor = (categoryName: string): string => {
    const categoryColors: { [key: string]: string } = {
      'Food & Dining': 'orange',
      'Transportation': 'blue',
      'Shopping': 'purple',
      'Entertainment': 'pink',
      'Bills & Utilities': 'red',
      'Healthcare': 'green',
      'Income': 'green',
      'Savings': 'blue',
      'General':'blue',
      'Investment': 'green'
    };
    return categoryColors[categoryName] || 'blue';
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  // Get user initial from name
  const getUserInitial = () => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    if (homeData?.user?.name) {
      return homeData.user.name.charAt(0).toUpperCase();
    }
    return 'J';
  };

  // Handle navbar tab press
  const handleTabPress = (tabKey: string) => {
    setSelectedTab(tabKey);

    // TODO: Implement navigation to different screens
  };

  // Handle add button press
  const handleAddPress = () => {

    // TODO: Implement add functionality
  };

  const handleFabAction = (action: string) => {
    setFabOpen(false);
    // Navigate to add record screen with mode
    let mode = 'expense';
    if (action === 'income') mode = 'income';
    if (action === 'transfer') mode = 'transfer';
    router.push({ pathname: '/screens/recored', params: { mode } });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-4 text-gray-600">Loading your dashboard...</Text>
      </View>
    );
  }

  if (!homeData) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Failed to load data</Text>
        <TouchableOpacity onPress={loadHomeData} className="mt-4 bg-green-500 px-4 py-2 rounded-lg">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 bg-white mt-[9%]">
          <Text className="text-2xl font-bold text-gray-800">Home</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity className="w-8 h-8 bg-white rounded-full items-center justify-center mr-2">
              <Ionicons name="notifications-outline" size={20} color="#666" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-lg">{getUserInitial()}</Text>
            </View>
          </View>
        </View>

        {/* Wallet Section */}
        <WalletSection wallets={homeData.wallets} />

        {/* Setup Section */}
        <SetupSection setupItems={homeData.setup_items} userData={userData} />

        {/* Quick Actions Section */}
        <QuickActionsSection quickActions={homeData.quick_actions} />

        {/* Transactions Section */}
        <TransactionsSection transactions={homeData.recent_transactions} />

        {/* Spending Trends Section */}
        <SpendingTrendsSection spendingTrends={homeData.spending_trends} />
      </ScrollView>

      {/* Floating Navigation Bar */}
      <FloatingNavbar 
        selectedTab={selectedTab}
        onTabPress={handleTabPress}
        onAddPress={() => setFabOpen((open) => !open)}
        fabOpen={fabOpen}
        onFabAction={handleFabAction}
        onFabOverlayPress={() => setFabOpen(false)}
      />
    </View>
  );
} 