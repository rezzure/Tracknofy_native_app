import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  FlatList,
  RefreshControl
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const SiteUpdates = () => {
  const { backendURL } = useAuth()
  
  // State for timeline updates and progress reports (combined)
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for photo gallery and lightbox
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  
  // // State for comments and new comment input
  const [comments, setComments] = useState([]);
  // const [newComment, setNewComment] = useState('');

  // Format date in Indian format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format time in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format currency in INR with proper handling of undefined values
  const formatINR = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      // Get email from AsyncStorage (React Native equivalent of localStorage)
      const email = await AsyncStorage.getItem('email');
      if (!email) {
        console.error('No email found in AsyncStorage');
        setIsLoading(false);
        setRefreshing(false);
        Alert.alert('Error', 'User email not found. Please login again.');
        return;
      }

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${backendURL}/api/progress/report?email=${email}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          "token": token || ""
        }
      });

      const result = await response.json();
      console.log('API Response:', result.message);
      
      if (!result.success) {
        console.log(result.message);
        Alert.alert('Info', result.message);
      }

      // Process the response data
      if (result.data && Array.isArray(result.data)) {
        const reports = result.data.map(data => ({
          _id: data._id,
          title: data.title || "Progress Report",
          date: data.reportDate || new Date().toISOString(),
          description: data.description || "No description provided",
          supervisor: data.supervisor || "N/A",
          costIncurred: data.costIncurred || 0,
          photos: Array.isArray(data.photos) ? data.photos : []
        }));

        setUpdates(reports);

        // Process photos from all reports
        const allPhotos = result.data.flatMap(data => {
          if (Array.isArray(data.photos) && data.photos.length > 0) {
            return data.photos.map(photo => ({
              url: photo.path || photo.url || '',
              caption: photo.caption || "Site photo",
              date: data.reportDate || new Date().toISOString()
            }));
          }
          return [];
        });

        setPhotos(allPhotos);
      } else {
        console.warn('No data found in response:', result);
        setUpdates([]);
        setPhotos([]);
      }

      // TODO: Replace with actual API call for comments when available
      const mockComments = [
        { 
          id: 1, 
          author: 'Client', 
          text: 'Great progress on the construction. Keep up the good work!', 
          date: new Date().toISOString(),
          avatar: 'C'
        },
        { 
          id: 2, 
          author: 'Site Supervisor', 
          text: 'Thank you! We\'re on schedule for the next milestone.', 
          date: new Date().toISOString(),
          avatar: 'S'
        }
      ];

      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching site updates:', error);
      // Set empty arrays on error to prevent UI issues
      setUpdates([]);
      setPhotos([]);
      setComments([]);
      Alert.alert('Error', 'Failed to fetch site updates. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Use useFocusEffect to refetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [backendURL])
  );

  // Pull to refresh functionality
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Handle comment submission
  // const handleCommentSubmit = async () => {
  //   if (!newComment.trim()) return;

  //   try {
  //     // TODO: Replace with actual API endpoint
  //     const mockComment = {
  //       id: comments.length + 1,
  //       author: 'Client',
  //       text: newComment,
  //       date: new Date().toISOString(),
  //       avatar: 'C'
  //     };
      
  //     setComments(prev => [...prev, mockComment]);
  //     setNewComment('');
  //   } catch (error) {
  //     console.error('Error submitting comment:', error);
  //     Alert.alert('Error', 'Failed to submit comment. Please try again.');
  //   }
  // };

  // Open lightbox with selected photo
  const openLightbox = (photo) => {
    if (!photo || !photo.url) return;
    setSelectedPhoto(photo);
    setShowLightbox(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhoto(null);
  };

  // Render each update item in the timeline
  const renderUpdateItem = ({ item }) => (
    <View className="relative pl-6 pb-6 border-l-2 border-blue-200 ml-4">
      {/* Timeline dot */}
      <View className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-1" />
      
      <View className="flex flex-row justify-between items-baseline">
        <Text className="text-base font-medium text-gray-800 flex-shrink mr-2">{item.title}</Text>
        <Text className="text-xs text-gray-500">{formatDate(item.date)}</Text>
      </View>
      
      <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
      
      <View className="mt-2 text-sm">
        <Text className="text-gray-500">
          Supervisor: <Text className="font-medium text-gray-700">{item.supervisor}</Text>
        </Text>
      </View>
      
      <View className="mt-1 text-sm">
        <Text className="text-gray-500">
          Cost Incurred: <Text className="font-medium text-gray-700">{formatINR(item.costIncurred)}</Text>
        </Text>
      </View>
      
      {/* Photo thumbnails */}
      {item.photos?.length > 0 && (
        <View className="mt-3 flex flex-row flex-wrap gap-2">
          {item.photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              className="w-16 h-16 rounded-md overflow-hidden"
              onPress={() => openLightbox({ 
                url: photo.path || photo, 
                caption: photo.caption || 'Site photo', 
                date: item.date 
              })}
            >
              <Image
                source={{ uri: photo.path || photo }}
                className="w-full h-full object-cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Render each photo in the gallery
  const renderPhotoItem = ({ item, index }) => (
    <TouchableOpacity
      className="relative group"
      onPress={() => openLightbox(item)}
    >
      <Image
        source={{ uri: item.url }}
        className="w-full h-32 object-cover rounded-md"
      />
      <View className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-200 rounded-md" />
      <View className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent rounded-b-md">
        <Text className="text-xs text-white truncate">{item.caption}</Text>
        <Text className="text-2xs text-gray-300">{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render each comment
  // const renderCommentItem = ({ item }) => (
  //   <View className="flex flex-row mb-4">
  //     <View className="flex-shrink-0 mr-3">
  //       <View className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
  //         item.author.includes('Supervisor') 
  //           ? 'bg-green-100' 
  //           : 'bg-blue-100'
  //       }`}>
  //         <Text className={item.author.includes('Supervisor') ? 'text-green-600' : 'text-blue-600'}>
  //           {item.avatar}
  //         </Text>
  //       </View>
  //     </View>
  //     <View className="flex-1 min-w-0">
  //       <View className="bg-gray-50 p-3 rounded-lg">
  //         <View className="flex flex-row justify-between items-baseline">
  //           <Text className={`text-sm font-medium ${
  //             item.author.includes('Supervisor') 
  //               ? 'text-green-800' 
  //               : 'text-blue-800'
  //           }`}>
  //             {item.author}
  //           </Text>
  //           <Text className="text-2xs text-gray-500">
  //             {formatDate(item.date)} at {formatTime(item.date)}
  //           </Text>
  //         </View>
  //         <Text className="text-sm text-gray-600 mt-1">{item.text}</Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">Loading site updates...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Lightbox Modal */}
        <Modal
          visible={showLightbox}
          transparent={true}
          animationType="fade"
          onRequestClose={closeLightbox}
        >
          <View className="flex-1 bg-black bg-opacity-90 justify-center items-center p-4">
            <TouchableOpacity 
              className="absolute top-10 right-4 z-10"
              onPress={closeLightbox}
            >
              <View className="w-10 h-10 rounded-full bg-gray-800 justify-center items-center">
                <Text className="text-white text-xl">×</Text>
              </View>
            </TouchableOpacity>
            
            <View className="bg-white rounded-lg overflow-hidden max-w-full">
              <Image
                source={{ uri: selectedPhoto?.url }}
                className="w-full h-80 object-contain"
                resizeMode="contain"
              />
              <View className="p-3 bg-white">
                <Text className="text-sm font-medium text-gray-800">{selectedPhoto?.caption}</Text>
                <Text className="text-xs text-gray-500">{formatDate(selectedPhoto?.date)}</Text>
              </View>
            </View>
          </View>
        </Modal>

        <Text className="text-xl font-bold text-gray-800 mb-4">Site Updates</Text>
        
        {/* Timeline Section */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-700 mb-4">Project Timeline</Text>
          {updates.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No updates available</Text>
          ) : (
            <FlatList
              data={updates}
              renderItem={renderUpdateItem}
              keyExtractor={item => item._id}
              scrollEnabled={false} // Since it's inside a ScrollView
            />
          )}
        </View>
        
        {/* Photo Gallery Section */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-700 mb-4">Photo Gallery</Text>
          {photos.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No photos available</Text>
          ) : (
            <FlatList
              data={photos}
              renderItem={renderPhotoItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              scrollEnabled={false}
            />
          )}
        </View>
        
     
       
      </ScrollView>
    </SafeAreaView>
  );
};

export default SiteUpdates;