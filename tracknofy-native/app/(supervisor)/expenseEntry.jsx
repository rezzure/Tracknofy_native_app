import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

const ExpenseEntry = () => {
  const { backendURL } = useAuth();
  const [userDetail, setUserDetail] = useState({
    allocated: 0,
    spent: 0,
    remaining: 0,
    site: []
  });

  const [details, setDetails] = useState({
    expenseType: "",
    site: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    status: "submitted"
  });

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null); // To track if it's image or document
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const expenseTypes = [
    'Materials',
    'Labour',
    'Equipment',
    'Transportation',
    'Miscellaneous'
  ];

  // Function to get user data
  const userData = async () => {
    setIsLoading(true);
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
      
      if (!data.success) {
        Alert.alert("Info", data.message);
        console.log(data.message);
        return;
      }
      
      setUserDetail({
        allocated: (data.data.total_payment || 0),
        spent: (data.data.total_expense || 0),
        remaining: (data.data.total_payment || 0) - (data.data.total_expense || 0),
        site: data.data.site_name || []
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data");
      console.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const handleChange = (name, value) => {
    setDetails({...details, [name]: value});
  };

  // Function to handle file selection
  const handleFileSelect = async () => {
    try {
      // Request permission for iOS
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      // Launch document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (validTypes.includes(result.mimeType)) {
          setFile(result);
          setFileType(result.mimeType.includes('image') ? 'image' : 'document');
        } else {
          Alert.alert('Invalid File', 'Please upload a JPEG, PNG, or PDF file');
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  // Validate form function
  const validateForm = () => {
    const newErrors = {};
    
    if (!details.expenseType) newErrors.expenseType = 'Expense type is required';
    if (!details.site) newErrors.site = 'Site selection is required';
    if (!details.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(details.amount)) newErrors.amount = 'Amount must be a number';
    else if (parseFloat(details.amount) > userDetail.remaining) {
      newErrors.amount = `Amount exceeds remaining balance (₹${userDetail.remaining.toLocaleString()})`;
    }
    if (!details.description) newErrors.description = 'Description is required';
    if (!details.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    
    formData.append('expenseType', details.expenseType);
    formData.append('amount', details.amount);
    formData.append('description', details.description);
    formData.append('date', details.date);
    formData.append('site', details.site);
    formData.append('status', details.status);
    
    if (file) {
      // For React Native, we need to create a file object with specific structure
      formData.append("image", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType
      });
    }
    
    try {
      const supervisor_id = await AsyncStorage.getItem("_id");
      const supervisorName = await AsyncStorage.getItem("name");
      const supervisorEmail = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");
      
      formData.append("supervisor_id", supervisor_id);
      formData.append("supervisorName", supervisorName);
      formData.append("supervisorEmail", supervisorEmail);

      const response = await fetch(`${backendURL}/api/expense/detail`, {
        method: "POST",
        headers: {
          'token': token
        },
        body: formData
      });
      
      const result = await response.json();
      console.log(result);
      
      if (!result.success) {
        Alert.alert("Info", result.message);
        console.log(result.message);
        return;
      }
      
      Alert.alert("Success", result.message);
      setSubmissionStatus('success');
      
      // Reset form
      setDetails({
        expenseType: '',
        site: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'submitted'
      });
      setFile(null);
      setFileType(null);
      
      // Refresh user data
      await userData();
    } catch (error) {
      Alert.alert("Error", "Failed to submit expense");
      console.error('Error uploading:', error);
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Expense Entry</Text>
      
      {/* Financial Overview */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {/* Total Paid */}
        <View className="w-full md:w-1/3 mb-4 md:mb-0">
          <View className="bg-blue-100 p-4 rounded-lg">
            <Text className="text-sm font-medium text-blue-800">Total Paid</Text>
            <Text className="text-xl font-bold text-blue-800 mt-2">
              {formatCurrency(userDetail.allocated)}
            </Text>
          </View>
        </View>

        {/* Total Expenses */}
        <View className="w-full md:w-1/3 mb-4 md:mb-0">
          <View className={`p-4 rounded-lg ${
            userDetail.spent > userDetail.allocated ? "bg-red-100" : "bg-green-100"
          }`}>
            <Text className={`text-sm font-medium ${
              userDetail.spent > userDetail.allocated ? 'text-red-800' : 'text-green-800'
            }`}>
              Total Expenses
            </Text>
            <Text className={`text-xl font-bold mt-2 ${
              userDetail.spent > userDetail.allocated ? "text-red-800" : "text-green-800"
            }`}>
              {formatCurrency(userDetail.spent)}
            </Text>
          </View>
        </View>

        {/* Balance Amount */}
        <View className="w-full md:w-1/3">
          <View className={`p-4 rounded-lg ${
            userDetail.remaining > 0 ? "bg-green-100" : "bg-red-100"
          }`}>
            <Text className={`text-sm font-medium ${
              userDetail.remaining > 0 ? "text-green-800" : "text-red-800"
            }`}>
              Balance Amount
            </Text>
            <Text className={`text-xl font-bold mt-2 ${
              userDetail.remaining > 0 ? "text-green-800" : "text-red-800"
            }`}>
              {formatCurrency(userDetail.remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Expense Entry Form */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">New Expense Entry</Text>
        
        {submissionStatus === 'success' && (
          <View className="mb-4 p-3 bg-green-100 rounded">
            <Text className="text-green-700">Expense submitted successfully!</Text>
          </View>
        )}
        {submissionStatus === 'error' && (
          <View className="mb-4 p-3 bg-red-100 rounded">
            <Text className="text-red-700">Error submitting expense. Please try again.</Text>
          </View>
        )}

        {/* Expense Type */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Expense Type <Text className="text-red-500">*</Text>
          </Text>
          <View className={`border rounded-md ${errors.expenseType ? 'border-red-500' : 'border-gray-300'}`}>
            <Picker
              selectedValue={details.expenseType}
              onValueChange={(value) => handleChange('expenseType', value)}
              enabled={!isLoading}
            >
              <Picker.Item label="Select Expense Type" value="" />
              {expenseTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {errors.expenseType && <Text className="mt-1 text-sm text-red-500">{errors.expenseType}</Text>}
        </View>

        {/* Site Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Site Name <Text className="text-red-500">*</Text>
          </Text>
          <View className={`border rounded-md ${errors.site ? 'border-red-500' : 'border-gray-300'}`}>
            <Picker
              selectedValue={details.site}
              onValueChange={(value) => handleChange('site', value)}
              enabled={!isLoading && userDetail.site.length > 0}
            >
              <Picker.Item label="Select site" value="" />
              {userDetail.site.map((siteName, index) => (
                <Picker.Item key={index} label={siteName} value={siteName} />
              ))}
            </Picker>
          </View>
          {errors.site && <Text className="mt-1 text-sm text-red-500">{errors.site}</Text>}
          {userDetail.site.length === 0 && (
            <Text className="mt-1 text-sm text-yellow-600">No sites available</Text>
          )}
        </View>

        {/* Amount */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Amount (₹) <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={details.amount}
            onChangeText={(value) => handleChange('amount', value)}
            className={`w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter amount"
            keyboardType="numeric"
            editable={!isLoading}
          />
          {errors.amount && <Text className="mt-1 text-sm text-red-500">{errors.amount}</Text>}
          {details.amount && !errors.amount && (
            <Text className="mt-1 text-sm text-gray-500">
              Remaining after this expense: {formatCurrency(userDetail.remaining - parseFloat(details.amount))}
            </Text>
          )}
        </View>

        {/* Date */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Date <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={details.date}
            onChangeText={(value) => handleChange('date', value)}
            className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="YYYY-MM-DD"
            editable={!isLoading}
          />
          {errors.date && <Text className="mt-1 text-sm text-red-500">{errors.date}</Text>}
        </View>

        {/* Bill Upload */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Upload Bill (Optional)
          </Text>
          <TouchableOpacity 
            onPress={handleFileSelect}
            disabled={isLoading}
            className="p-3 border border-gray-300 rounded-md items-center"
          >
            <Text className="text-blue-500">
              {file ? `Selected: ${file.name}` : 'Select File'}
            </Text>
          </TouchableOpacity>
          {file && (
            <Text className="mt-1 text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </Text>
          )}
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Description <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={details.description}
            onChangeText={(value) => handleChange('description', value)}
            className={`w-full p-3 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter expense description"
            multiline
            numberOfLines={3}
            editable={!isLoading}
          />
          {errors.description && <Text className="mt-1 text-sm text-red-500">{errors.description}</Text>}
        </View>

        {/* Status (read-only) */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">Status</Text>
          <View className="p-2 bg-gray-100 rounded-md inline-block">
            <Text className="font-medium">{details.status}</Text>
          </View>
          <Text className="mt-1 text-sm text-gray-500">Status will be updated after admin review</Text>
        </View>

        {/* Submit Button */}
        <View className="flex justify-end">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-3 bg-blue-500 rounded-md ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-medium">Submit Expense</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Validation Rules */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">Validation Rules</Text>
        <View className="pl-5">
          <Text className="text-gray-700 mb-2">• All fields marked with <Text className="text-red-500">*</Text> are required</Text>
          <Text className="text-gray-700 mb-2">• Expense amount cannot exceed the remaining balance ({formatCurrency(userDetail.remaining)})</Text>
          <Text className="text-gray-700 mb-2">• Bill upload must be JPEG, PNG, or PDF (max 5MB)</Text>
          <Text className="text-gray-700 mb-2">• All expenses require admin approval before being finalized</Text>
          <Text className="text-gray-700">• You will be notified when your expense is approved or rejected</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ExpenseEntry;