
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhoneIcon, GlobeIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '../../contexts/AuthContext';




export default function Dashboard() {
  // const { backendURL } = useAuth(); // Get backend URL from context
  // console.log(backendURL)

 
  // const backendURL = 'http://192.168.31.94:3000';

  


  const [dashboardData, setDashboardData] = useState({
    funds: {
      totalPaid: 0,
      totalExpenses: 0,
      lastPayment: null,
    },
    projectStages: [],
    expenses: [],
  });
  const [clientData, setClientData] = useState({
    balance_amount: 0,
    lastPayment: 0,
    total_expense: 0,
    total_payment: 0,
  });
  // i make it false for testing purpose its was true
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPayment, setLastPayment] = useState({
    last_payment: 0,
    date: Date.now(),
  });
  const [supervisorDetail, setSupervisorDetail] = useState({
    supervisor_name: '',
    supervisor_mobile: 0,
  });

  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  // Format currency in Indian style
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date in Indian format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Fetch last payment
  // const getLastPayment = async () => {
  //   try {
  //     const email = await AsyncStorage.getItem('email');
  //     const token = await AsyncStorage.getItem('token');

  //     const response = await fetch(
  //       `${backendURL}/api/get/LastPayment?email=${email}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-type': 'application/json',
  //           token: token,
  //         },
  //       }
  //     );

  //     const result = await response.json();

  //     if (!result.success) {
  //       // Show info message if needed
  //       const data = {
  //         last_payment: 0,
  //         date: Date.now(),
  //       };
  //       return setLastPayment(data);
  //     }

  //     setLastPayment({
  //       last_payment: result.data.amount,
  //       date: result.data.transactionDate,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert('Error', 'Failed to fetch payment details');
  //   }
  // };

  // Fetch supervisor details
  // const showSupervisorDetail = async () => {
  //   try {
  //     const email = await AsyncStorage.getItem('email');
  //     const token = await AsyncStorage.getItem('token');

  //     const response = await fetch(
  //       `${backendURL}/api/get/supervisorDetail?email=${email}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-type': 'application/json',
  //           token: token,
  //         },
  //       }
  //     );

  //     const result = await response.json();

  //     if (result.success) {
  //       setSupervisorDetail({
  //         supervisor_name: result.supervisorDetails.name,
  //         supervisor_mobile: result.supervisorDetails.mobile,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Fetch client dashboard data
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     const email = await AsyncStorage.getItem('email');
  //     const token = await AsyncStorage.getItem('token');

  //     let response = await fetch(
  //       `${backendURL}/api/get/clientDetail?email=${email}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-type': 'application/json',
  //           token: token,
  //         },
  //       }
  //     );

  //     let result = await response.json();

  //     setClientData({
  //       balance_amount: result.data?.balance_amount || 0,
  //       lastPayment: result.data?.lastPayment || 0,
  //       total_expense: result.data?.total_expense || 0,
  //       total_payment: result.data?.total_payment || 0,
  //     });

  //     // For demo purposes - in real app, this would come from API
  //     const mockData = {
  //       funds: {
  //         totalPaid: 8500000,
  //         totalExpenses: 7000000,
  //         lastPayment: {
  //           amount: 1500000,
  //           date: '2023-06-15T10:30:00Z',
  //           method: 'UPI Transfer',
  //         },
  //       },
  //       projectStages: [
  //         { name: 'Planning', completed: 100 },
  //         { name: 'Foundation', completed: 100 },
  //         { name: 'Structure', completed: 85 },
  //         { name: 'Interior', completed: 45 },
  //         { name: 'Finishing', completed: 20 },
  //       ],
  //       expenses: [
  //         {
  //           category: 'Construction Materials',
  //           amount: 4500000,
  //           approved: true,
  //         },
  //         { category: 'Labor Charges', amount: 3200000, approved: true },
  //         { category: 'Equipment Rental', amount: 1000000, approved: true },
  //         { category: 'Miscellaneous', amount: 500000, approved: false },
  //       ],
  //     };

  //     setDashboardData(mockData);
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //     Alert.alert('Error', 'Failed to load dashboard data');
  //   }
  // };

  // useEffect(() => {
  //   fetchDashboardData();
  //   getLastPayment();
  //   showSupervisorDetail();
  // }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-600 text-lg font-semibold mb-2">Error!</Text>
        <Text className="text-gray-700 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 py-3 px-6 rounded-lg"
        //   onPress={fetchDashboardData}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const approvedExpenses = dashboardData.expenses.filter((exp) => exp.approved);
  const chartData = approvedExpenses.map((exp, index) => ({
    name: exp.category,
    amount: exp.amount,
    color: `rgba(${index * 60}, ${index * 40 + 100}, ${index * 20 + 200}, 1)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <ScrollView className="flex-1 bg-gray-50 py-6">
      {/* Header */}
      <View className="bg-white shadow-sm px-6 py-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">Client Dashboard</Text>
        {/* <View className="items-end">
          <Text className="text-blue-600 font-semibold text-sm">
            Your assigned supervisor:
          </Text>
          <Text className="text-black text-sm">{supervisorDetail.supervisor_name}</Text>
          <View className="flex-row items-center mt-1">
            <PhoneIcon size={14} color="#4b5563" />
            <Text className="text-gray-600 text-sm ml-1">
              +91 {supervisorDetail.supervisor_mobile}
            </Text>
          </View>
        </View> */}
      </View>

      {/* Funds Overview */}
      <View className="bg-white rounded-lg shadow-sm p-6 mx-4 mt-6">
        <Text className="text-xl font-semibold text-gray-700 mb-4">
          Funds Overview
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {/* Total Paid */}
          <View className="bg-blue-50 p-4 rounded-lg mb-4 w-[48%]">
            <Text className="text-sm font-medium text-blue-800">Total Paid</Text>
            <Text className="text-xl font-bold text-blue-600 mt-1">
              {formatINR(clientData.total_payment)}
            </Text>
          </View>

          {/* Total Expenses */}
          <View
            className={`p-4 rounded-lg mb-4 w-[48%] ${clientData.total_expense > clientData.total_payment
                ? 'bg-red-50'
                : 'bg-green-50'
              }`}
          >
            <Text
              className={`text-sm font-medium ${clientData.total_expense > clientData.total_payment
                  ? 'text-red-800'
                  : 'text-green-800'
                }`}
            >
              Total Expenses
            </Text>
            <Text
              className={`text-xl font-bold mt-1 ${clientData.total_expense > clientData.total_payment
                  ? 'text-red-600'
                  : 'text-green-600'
                }`}
            >
              {formatINR(clientData.total_expense)}
            </Text>
          </View>

          {/* Balance Payment */}
          <View
            className={`p-4 rounded-lg w-[48%] ${clientData.balance_amount > 0 ? 'bg-green-50' : 'bg-red-50'
              }`}
          >
            <Text
              className={`text-sm font-medium ${clientData.balance_amount > 0
                  ? 'text-green-800'
                  : 'text-red-800'
                }`}
            >
              Balance Amount
            </Text>
            <Text
              className={`text-xl font-bold mt-1 ${clientData.balance_amount > 0
                  ? 'text-green-600'
                  : 'text-red-600'
                }`}
            >
              {formatINR(clientData.balance_amount)}
            </Text>
          </View>

          {/* Last Payment */}
          <View className="bg-purple-50 p-4 rounded-lg w-[48%]">
            <Text className="text-sm font-medium text-purple-800">
              Last Payment
            </Text>
            {lastPayment.last_payment > 0 ? (
              <View className="mt-1">
                <Text className="text-lg font-semibold text-purple-600">
                  {formatINR(lastPayment.last_payment)}
                </Text>
                <Text className="text-xs text-gray-600">
                  {formatDate(lastPayment.date)}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-500 mt-1">No payment history</Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between px-4 mt-4">
        {/* Project Stage Summary */}
        <View className="bg-white rounded-lg shadow-sm p-6 mb-4 w-full">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            Project Stage Summary
          </Text>
          <View className="space-y-4">
            {dashboardData.projectStages.map((stage, index) => (
              <View key={index} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-medium text-gray-700">
                    {stage.name}
                  </Text>
                  <Text className="text-sm font-medium text-gray-700">
                    {stage.completed}%
                  </Text>
                </View>
                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View
                    className={`h-2 rounded-full ${stage.completed < 30
                        ? 'bg-red-500'
                        : stage.completed < 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    style={{ width: `${stage.completed}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap mt-4">
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-1" />
              <Text className="text-xs text-gray-600">70-100% Complete</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
              <Text className="text-xs text-gray-600">30-69% Complete</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
              <Text className="text-xs text-gray-600">0-29% Complete</Text>
            </View>
          </View>
        </View>

        {/* Expense Summary Chart */}
        <View className="bg-white rounded-lg shadow-sm p-6 w-full">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            Expense Summary (Approved Only)
          </Text>
          {approvedExpenses.length > 0 ? (
            <>
              <PieChart
                data={chartData}
                width={screenWidth - 64}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Expense Breakdown
                </Text>
                <View className="space-y-2">
                  {approvedExpenses.map((expense, index) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-center"
                    >
                      <Text className="text-sm text-gray-600">
                        {expense.category}
                      </Text>
                      <Text className="text-sm font-medium text-gray-800">
                        {formatINR(expense.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View className="h-40 justify-center items-center">
              <Text className="text-gray-500">No approved expenses to display</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-lg shadow-sm p-6 mx-4 my-6">
        <Text className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-blue-500 py-3 px-6 rounded-lg w-[48%] items-center"
            onPress={() => navigation.navigate('Payment')}
          >
            <Text className="text-white font-medium">Make Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 py-3 px-6 rounded-lg w-[48%] items-center"
            onPress={() => navigation.navigate('SiteUpdate')}
          >
            <Text className="text-white font-medium">View Site Updates</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

}

Dashboard.displayName = 'Dashboard';
