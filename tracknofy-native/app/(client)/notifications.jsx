import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, Animated, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

const Notifications = () => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(400)).current; // Start from right

  // useEffect(() => {
  //   // Reset animation to start position
  //   slideAnim.setValue(400);
  //   // Animate in from right when component mounts
  //   Animated.timing(slideAnim, {
  //     toValue: 0,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // }, []);

   useFocusEffect(
    useCallback(() => {
      // Reset animation to start position when screen gains focus

      slideAnim.setValue(400);
      
      // Animate in from right when component mounts
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Cleanup function to reset animation when screen loses focus
      return () => {
        slideAnim.setValue(400);
      };
    }, [])
  );


  const goBack = () => {
    // Animate out to right when going back
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Use navigation back instead of push to avoid adding to history stack
      router.back();
    });
  };

  // Sample notification data
  const notifications = [
   
  ];

  const renderNotification = ({ item }) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="font-bold text-lg text-gray-800">{item.title}</Text>
      <Text className="text-gray-600 my-1">{item.message}</Text>
      <Text className="text-gray-400 text-sm">{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Animated.View 
        style={{ transform: [{ translateX: slideAnim }] }}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 ">
          <TouchableOpacity onPress={goBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-black text-xl font-bold ml-4">Notifications</Text>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          className="flex-1 bg-white"
          ListEmptyComponent={
            <View className="p-5 items-center justify-center">
              <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg mt-4">No notifications yet</Text>
            </View>
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Notifications;