import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ProfileModal = ({ visible, onClose, userData }) => {
  const [slideAnim] = useState(new Animated.Value(height));
  
  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.timing(slideAnim, {
        toValue: height * 0.2, // Stop at 20% from top (mid-screen)
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to top
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none" // We're handling animation manually
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity 
        className="absolute inset-0 bg-black opacity-50"
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Profile Content */}
      <Animated.View 
        style={{ 
          transform: [{ translateY: slideAnim }],
        }}
        className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl p-6"
      >
        {/* Close button */}
        <TouchableOpacity 
          onPress={onClose}
          className="absolute top-4 right-4"
        >
          <Ionicons name="close" size={24} color="#4B5563" />
        </TouchableOpacity>
        
        {/* Profile Header */}
        <View className="items-center mb-6">
          <Ionicons name="person-circle" size={80} color="#3B82F6" />
          <Text className="text-2xl font-bold text-gray-800 mt-2">
            {userData?.name || 'User Name'}
          </Text>
        </View>
        
        {/* Profile Details */}
        <View className="space-y-4">
          <View className="flex-row items-center">
            <Ionicons name="mail" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-700">{userData?.email || 'user@example.com'}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="call" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-700">{userData?.mobile || '+1234567890'}</Text>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          onPress={() => {
            // Handle logout logic here
            console.log('Logout pressed');
            onClose();
          }}
          className="bg-red-500 rounded-lg p-4 mt-8"
        >
          <Text className="text-white text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default ProfileModal;