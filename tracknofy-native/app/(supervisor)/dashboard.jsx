import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useToast } from "react-native-toast-notifications";// You'll need to install this
import { useAuth } from '../../contexts/AuthContext';


// Using NativeWind (Tailwind for React Native) - make sure it's set up in your project
// If you haven't set up NativeWind yet: https://www.nativewind.dev/

const dashboard = () => {

  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

    const { backendURL}  = useAuth()

    const toast = useToast();
  // Fetch user data
  const fetchUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${backendURL}/api/supervisor/detail?email=${email}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "token": token
        }
      });
      
      const data = await response.json();
      if(!data.success){
        console.log(data.message);
        toast.show({
          type: 'info',
          text1: 'Info',
          text2: data.message
        });
        return;
      }
      setUserDetail(data.data);
      
    } catch (err) {
      setError(err.message);
      toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [backendURL]);

  // Pull to refresh functionality
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, []);

  // Calculate financial data from userDetail
  const financialData = useMemo(() => {
    if (!userDetail) return {
      allocated: 0,
      spent: 0,
      remaining: 0
    };

    return {
      allocated: userDetail.total_payment || 0,
      spent: userDetail.total_expense || 0,
      remaining: (userDetail.total_payment || 0) - (userDetail.total_expense || 0)
    };
  }, [userDetail]);

  // Expense summary data (static for now, can be replaced with API data)
  const expenseSummary = useMemo(() => [
    { type: 'Materials', amount: 95000, color: 'bg-blue-500' },
    { type: 'Labor', amount: 65000, color: 'bg-green-500' },
    { type: 'Equipment', amount: 15000, color: 'bg-yellow-500' },
    { type: 'Miscellaneous', amount: 12500, color: 'bg-red-500' }
  ], []);

  // Calculate percentages for chart
  const { expenseData, totalSpent } = useMemo(() => {
    const total = expenseSummary.reduce((sum, item) => sum + item.amount, 0);
    const data = expenseSummary.map(item => ({
      ...item,
      percentage: Math.round((item.amount / total) * 100)
    }));
    return { expenseData: data, totalSpent: total };
  }, [expenseSummary]);

  // Recent activities data (static for now, can be replaced with API data)
  const recentActivities = useMemo(() => [
    { id: 1, action: 'Updated Site Progress', date: '2023-05-15 14:30', project: 'Interior Work - Floor 3' },
    { id: 2, action: 'Submitted Expense', date: '2023-05-15 11:15', amount: 12500, category: 'Materials' },
    { id: 3, action: 'Received Funds', date: '2023-05-14 09:45', amount: 50000 },
    { id: 4, action: 'Updated Site Progress', date: '2023-05-13 16:20', project: 'Civil Work - Foundation' },
    { id: 5, action: 'Submitted Expense', date: '2023-05-12 10:05', amount: 32000, category: 'Labor' }
  ], []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 bg-red-100 flex-1 justify-center items-center">
        <Text className="text-red-700 text-center">Error loading dashboard: {error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
          onPress={fetchUserData}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-100 p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-2xl font-bold text-gray-800 mb-6">Supervisor Dashboard</Text>
      
      {/* Financial Overview Cards */}
      <View className="flex flex-col md:flex-row flex-wrap justify-between mb-6">
        {/* Total Paid */}
        <View className="bg-blue-100 p-4 rounded-lg mb-4 w-full md:w-[48%] lg:w-[32%]">
          <Text className="text-sm font-medium text-blue-800">Total Paid</Text>
          <Text className="text-2xl font-bold text-blue-600 mt-2">
            ₹{(financialData.allocated).toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Total Expenses */}
        <View className={`p-4 rounded-lg mb-4 w-full md:w-[48%] lg:w-[32%] ${
          financialData.spent > financialData.allocated
            ? "bg-red-100"
            : "bg-green-100"
        }`}>
          <Text className={`text-sm font-medium ${
            financialData.spent > financialData.allocated 
              ? 'text-red-800' 
              : 'text-green-800'
          }`}>
            Total Expenses
          </Text>
          <Text className={`text-2xl font-bold mt-2 ${
            financialData.spent > financialData.allocated
              ? "text-red-600"
              : "text-green-600"
          }`}>
            ₹{(financialData.spent).toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Balance Payment */}
        <View className={`p-4 rounded-lg mb-4 w-full md:w-[48%] lg:w-[32%] ${
          financialData.remaining > 0 ? "bg-green-100" : "bg-red-100"
        }`}>
          <Text className={`text-sm font-medium ${
            financialData.remaining > 0
              ? "text-green-800"
              : "text-red-800"
          }`}>
            Balance Amount
          </Text>
          <Text className={`text-2xl font-bold mt-2 ${
            financialData.remaining > 0
              ? "text-green-600"
              : "text-red-600"
          }`}>
            ₹{(financialData.remaining).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Expense Chart Section */}
      <ExpenseChart expenseData={expenseData} totalSpent={totalSpent} />

      {/* Recent Activities */}
      <RecentActivitiesTable activities={recentActivities} />
    </ScrollView>
  );
};

// Expense Chart Component
const ExpenseChart = ({ expenseData, totalSpent }) => {
  const maxHeight = 150; // Maximum height for chart bars
  
  return (
    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Expense Type-wise Summary</Text>
      
      <View className="flex flex-col md:flex-row items-center mb-4">
        {/* Bar Chart */}
        <View className="w-full md:w-1/2 mb-4 md:mb-0">
          <View className="h-48 flex-row items-end justify-between px-2">
            {expenseData.map((item) => (
              <View key={item.type} className="flex flex-col items-center flex-1 mx-1">
                <View 
                  className={`${item.color} w-full rounded-t-sm`}
                  style={{ height: `${(item.percentage / 100) * maxHeight}px` }}
                />
                <Text className="text-xs mt-1 text-gray-600 text-center">{item.type}</Text>
                <Text className="text-xs font-medium">₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Legend */}
        <View className="w-full md:w-1/2">
          <View className="flex flex-row flex-wrap">
            {expenseData.map((item) => (
              <View key={item.type} className="flex items-center w-1/2 mb-2">
                <View className="flex-row items-center">
                  <View className={`w-4 h-4 ${item.color} rounded mr-2`} />
                  <Text className="text-sm text-gray-700">{item.type}:</Text>
                </View>
                <Text className="text-sm font-medium ml-6">
                  ₹{item.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View className="border-t border-gray-200 pt-3">
        <Text className="text-sm font-medium text-gray-700 text-center">
          Total Spent: ₹{totalSpent.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
};

// Recent Activities Component
const RecentActivitiesTable = ({ activities }) => (
  <View className="bg-white rounded-lg p-4 shadow-sm">
    <Text className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</Text>
    
    {activities.map((activity) => (
      <View key={activity.id} className="border-b border-gray-200 py-3 last:border-b-0">
        <View className="flex flex-row justify-between items-start">
          <Text className="text-sm font-medium text-gray-900 flex-1">{activity.action}</Text>
          <Text className="text-xs text-gray-500 ml-2">{activity.date.split(' ')[0]}</Text>
        </View>
        
        <View className="mt-1">
          {activity.project && (
            <Text className="text-sm text-gray-600">{activity.project}</Text>
          )}
          {activity.amount && (
            <Text className="text-sm text-gray-600">
              ₹{activity.amount.toLocaleString('en-IN')}
              {activity.category && ` (${activity.category})`}
            </Text>
          )}
        </View>
      </View>
    ))}
  </View>
);

export default dashboard;
