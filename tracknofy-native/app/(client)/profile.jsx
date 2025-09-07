import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const profile = () => {
  const router = useRouter();
  const [name, setName] = useState('shiv kumar');
  const [email, setEmail] = useState('shiv@gmail.com');
  const [phone, setPhone] = useState('+91767574667');

  const handleSave = () => {
    // Here you would typically save the changes to your backend
    console.log('Saving profile:', { name, email, phone });
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-black">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-xl font-bold ml-4">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} className="ml-auto">
          <Text className="text-black text-lg font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Profile Photo */}
        <View className="items-center my-6">
          <View className="w-32 h-32 rounded-full bg-[#1d3557] items-center justify-center">
            <Ionicons name="person" size={64} color="white" />
          </View>
          <TouchableOpacity className="mt-4 flex-row items-center">
            <Ionicons name="camera" size={20} color="#1d3557" />
            <Text className="text-[#1d3557] ml-2">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-gray-500 text-sm mb-1">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border-b border-gray-200 pb-2 text-lg"
            placeholder="Enter your name"
          />
        </View>

        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-gray-500 text-sm mb-1">Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border-b border-gray-200 pb-2 text-lg"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-gray-500 text-sm mb-1">Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="border-b border-gray-200 pb-2 text-lg"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default profile;