import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios'
import { useToast } from 'react-native-toast-notifications';

// This is a simplified implementation of file-saver for React Native
const saveAs = async (uri, fileName) => {
  if (Platform.OS === 'web') {
    // For web, use the traditional method
    const link = document.createElement('a');
    link.href = uri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // For mobile, we'll use sharing or opening the file
    // Note: This is a simplified implementation
    // You might want to use expo-sharing or other libraries for proper file handling
    Alert.alert('Download', `File would be saved as ${fileName}`);
  }
};

const Payments = () => {
    const { backendURL } = useAuth()
  console.log(backendURL)

  const toast = useToast();

  // State for form data with initial values
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    proofDocument: null
  });

  // State for transactions and UI
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Format currency in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(false);
        // Get email from AsyncStorage instead of localStorage
        const email = await AsyncStorage.getItem("email");
        const token = await AsyncStorage.getItem("token");
        
        const response = await axios.get(
          `${backendURL}/api/getClient/payments?email=${email}`,
          {
            headers: {
              "Content-type": "application/json",
              "token": token
            }
          }
        );
        
        if (!response.data.success) {
          toast.show(response.data.message, { type: 'info' });
        }
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        toast.show('Error fetching transactions', { type: 'danger' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [backendURL]);

  // Handle input changes with validation
  const handleInputChange = (name, value) => {
    // Special handling for amount field
    if (name === 'amount') {
      // Ensure amount is a positive number
      if (value && (isNaN(value) || parseFloat(value) <= 0)) {
        setError('Please enter a valid positive amount');
        toast.show("Please Enter a Valid Positive Amount", { type: 'info' });
        return;
      }
    }
    
    // Special handling for transaction ID
    if (name === 'transactionId' && value.trim() === '') {
      setError('Transaction ID cannot be empty');
      return;
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when input changes
  };

  // Handle file upload with comprehensive validation
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        // Validate file type - handle both full MIME types and simplified types
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image'];
        if (!validTypes.includes(file.type) && !file.type?.startsWith('image/')) {
          setError('Please upload a valid image (JPEG/PNG/JPG only)');
          return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.fileSize > maxSize) {
          setError(`File size should be less than ${maxSize/1024/1024}MB`);
          return;
        }

        setPaymentData(prev => ({
          ...prev,
          proofDocument: file
        }));
        setError(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to select image. Please try again.');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    // Amount validation
    if (!paymentData.amount || isNaN(paymentData.amount)) {
      return 'Please enter a valid amount';
    }
    if (parseFloat(paymentData.amount) <= 0) {
      return 'Amount must be greater than zero';
    }

    // Transaction ID validation
    if (!paymentData.transactionId || paymentData.transactionId.trim() === '') {
      return 'Transaction ID is required';
    }

    // File validation
    if (!paymentData.proofDocument) {
      return 'Payment proof is required';
    }

    return null; // No errors
  };

  // Handle form submission with proper error handling
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      
     // Get email and token from AsyncStorage
      const email = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('paymentMethod', paymentData.paymentMethod);
      formData.append('transactionId', paymentData.transactionId);
      formData.append('date', paymentData.date);
      
      // Append the image file
      formData.append('proofDocument', {
        uri: paymentData.proofDocument.uri,
        type: paymentData.proofDocument.type,
        name: `payment_proof_${Date.now()}.jpg`
      });

       // Debug: Log the request details
      console.log('Submitting payment to:', `${backendURL}/api/client/payments?email=${email}`);
      console.log('Form data:', {
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        date: paymentData.date,
        proofDocument: {
          uri: paymentData.proofDocument.uri,
          type: paymentData.proofDocument.type,
          name: `payment_proof_${Date.now()}.jpg`
        }
      });

      // Submit payment with progress tracking
      const response = await axios.post(
        `${backendURL}/api/client/payments?email=${email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': token
          },
          timeout: 30000, // 30 second timeout
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      ).catch((error) => {
        console.error('Axios post error:', error);
        throw error;
      });
      
      if (!response.data.success) {
        toast.show(response.data.message, { type: 'info' });
      }

      // Update UI with new transaction
      const newPayment = {
        ...response.data.payment,
        method: response.data.payment.paymentMethod,
        date: response.data.payment.paymentDate,
        proofDocument: response.data.payment.proofDocument
      };
      
      toast.show(response.data.message, { type: 'success' });
      setTransactions(prev => [newPayment, ...prev]);
      setSuccess('Payment submitted successfully! Status: Pending Verification');

      // Reset form
      setPaymentData({
        amount: '',
        paymentMethod: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        proofDocument: null
      });
      setUploadProgress(0);
      } catch (err) {
      console.error('Payment submission error:', err);
      toast.show('Error submitting payment', { type: 'danger' });
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || 'Payment submission failed. Please try again.');
      } else if (err.request) {
        // Request was made but no response
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add axios interceptor for debugging axios error[Network Error]
  axios.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
  });

  axios.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  }, error => {
    console.log('Response Error:', error);
    return Promise.reject(error);
  });

  // Download invoice with error handling
  const downloadInvoice = async (paymentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${backendURL}/api/client/payments/${paymentId}/invoice`,
        {
          responseType: 'blob',
          headers: {
            'token': token
          }
        }
      );

      const blob = new Blob([response.data], { type: 'text/plain' });
      saveAs(URL.createObjectURL(blob), `invoice_${paymentId}.txt`);
      setSuccess('Invoice downloaded successfully');
      toast.show('Invoice downloaded successfully', { type: 'success' });
    } catch (err) {
      console.error('Invoice download error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to download invoice. Please try again.'
      );
      toast.show('Failed to download invoice', { type: 'danger' });
    }
  };

  // View payment proof
  const viewProof = (proofUrl) => {
    if (!proofUrl) {
      setError('Proof document not available');
      return;
    }
    
    // For React Native, we can use Linking to open the URL
    // or display the image in a modal
    Alert.alert('View Proof', 'Proof document would be displayed here');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Payments</Text>

      {/* Error/Success Messages */}
      {error && (
        <View className="mb-4 p-3 bg-red-100 rounded-md">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}
      {success && (
        <View className="mb-4 p-3 bg-green-100 rounded-md">
          <Text className="text-green-700">{success}</Text>
        </View>
      )}

      {/* Add Payment Section */}
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <Text className="text-lg font-semibold text-gray-700 mb-4">Add New Payment</Text>
        
        {/* Amount Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Amount (₹)*</Text>
          <TextInput
            keyboardType="numeric"
            value={paymentData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter amount"
          />
        </View>

        {/* Payment Method Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Payment Method*</Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={paymentData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
            >
              <Picker.Item label="UPI" value="UPI" />
              <Picker.Item label="Bank Transfer" value="Bank Transfer" />
              <Picker.Item label="Cheque" value="Cheque" />
              <Picker.Item label="Cash" value="Cash" />
            </Picker>
          </View>
        </View>

        {/* Transaction ID Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Transaction ID/Reference*</Text>
          <TextInput
            value={paymentData.transactionId}
            onChangeText={(value) => handleInputChange('transactionId', value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter transaction ID"
          />
        </View>

        {/* Date Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Payment Date*</Text>
          <TextInput
            value={paymentData.date}
            onChangeText={(value) => handleInputChange('date', value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* File Upload Section */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Payment Proof (Screenshot)*</Text>
          <TouchableOpacity 
            onPress={pickImage}
            className="flex flex-col items-center p-4 bg-white rounded-md border border-gray-300"
          >
            {paymentData.proofDocument ? (
              <Image 
                source={{ uri: paymentData.proofDocument.uri }} 
                className="w-24 h-24 mb-2"
              />
            ) : (
              <>
                <Text className="text-2xl text-gray-500">📁</Text>
                <Text className="mt-1 text-sm text-gray-600">
                  Choose file (JPEG/PNG, max 2MB)
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {paymentData.proofDocument && (
            <TouchableOpacity 
              onPress={() => setPaymentData(prev => ({ ...prev, proofDocument: null }))}
              className="mt-2 p-2 bg-red-100 rounded-md self-start"
            >
              <Text className="text-red-600">Remove File</Text>
            </TouchableOpacity>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <View className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <View 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`p-3 rounded-md ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white">Submitting...</Text>
            </View>
          ) : (
            <Text className="text-white text-center">Submit Payment</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Transaction Status Section */}
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <Text className="text-lg font-semibold text-gray-700 mb-4">Transaction Status</Text>
        
        {isLoading && transactions.length === 0 ? (
          <View className="flex justify-center items-center h-32">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : transactions.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">No transactions found</Text>
        ) : (
          <ScrollView horizontal={true}>
            <View>
              {/* Table Header */}
              <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
                <Text className="w-20 font-bold text-gray-700">Date</Text>
                <Text className="w-24 font-bold text-gray-700">Amount</Text>
                <Text className="w-28 font-bold text-gray-700">Method</Text>
                <Text className="w-32 font-bold text-gray-700">Transaction ID</Text>
                <Text className="w-24 font-bold text-gray-700">Status</Text>
                <Text className="w-28 font-bold text-gray-700">Actions</Text>
              </View>
              
              {/* Table Rows */}
              {transactions.map((txn, i) => (
                <View key={txn._id || txn.transactionId} className="flex-row p-3 border-b border-gray-200">
                  <Text className="w-20 text-gray-500">
                    {new Date(txn.date || txn.date).toLocaleDateString('en-IN')}
                  </Text>
                  <Text className="w-24 text-gray-500">{formatINR(txn.amount)}</Text>
                  <Text className="w-28 text-gray-500">{txn.method || txn.paymentMethod}</Text>
                  <Text className="w-32 text-gray-500">{txn.transactionId}</Text>
                  <Text className="w-24">
                    <View className={`px-2 py-1 rounded-full ${
                      txn.status === 'approved' ? 'bg-green-100' :
                      txn.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs ${
                        txn.status === 'approved' ? 'text-green-800' :
                        txn.status === 'pending' ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {txn.status ? txn.status.charAt(0).toUpperCase() + txn.status.slice(1) : 'Pending'}
                      </Text>
                    </View>
                  </Text>
                  <View className="w-28 flex-row justify-around">
                    <TouchableOpacity 
                      onPress={() => viewProof(txn.proofDocument)}
                      className="p-1"
                    >
                      <Text className="text-blue-600">👁️</Text>
                    </TouchableOpacity>
                    {txn.invoice && (
                      <TouchableOpacity 
                        onPress={() => downloadInvoice(txn.id)}
                        className="p-1"
                      >
                        <Text className="text-green-600">📥</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};



export default Payments;