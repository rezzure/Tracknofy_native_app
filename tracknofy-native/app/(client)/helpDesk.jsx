// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   FlatList,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';
// // import { useAuth } from '../context/AuthContext';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon } from 'react-native-heroicons/outline';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HelpDesk = () => {
//   // const { backendURL } = useAuth();
//   // const backendURL = 'http://localhost:3000'
//   // const backendURL = 'http://192.168.31.94:3000'
//   //  const backendURL = useAuth()
//   const backendURL = 'http://192.168.31.94:3000'
//   const navigation = useNavigation();

  
//   // State for form data
//   const [formData, setFormData] = useState({
//     queryType: "",
//     description: "",
//     photos: [],
//   });
  
//   const [queryTypes, setQueryTypes] = useState([
//     "Material Related",
//     "Supervisor Related",
//     "Fund Related",
//     "Design Related",
//     "Labour Related",
//   ]);
  
//   const [queryHistory, setQueryHistory] = useState([]);
//   const [selectedQuery, setSelectedQuery] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showQueryTypeModal, setShowQueryTypeModal] = useState(false);
//   const [newQueryType, setNewQueryType] = useState("");
//   const [clientReply, setClientReply] = useState("");

//   // Fetch client queries
//   const fetchClientQueries = async () => {
//     try {
//       setLoading(false);
//       const clientId = await AsyncStorage.getItem('_id');
//       const token = await AsyncStorage.getItem('token');
//       console.log(clientId)
//       console.log(token)
      
//       const response = await fetch(
//         `${backendURL}/api/queries/client/${clientId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//         }
//       );
      
//       const result = await response.json();
      
//       if (result && result.success) {
//         setQueryHistory(Array.isArray(result.data) ? result.data : []);
//       } else {
//         setQueryHistory([]);
//         Alert.alert('Error', result?.message || 'Failed to fetch queries');
//       }
//     } catch (error) {
//       console.error("Error fetching queries:", error);
//       Alert.alert('Error', 'Failed to fetch queries');
//       setQueryHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClientQueries();
//   }, []);

//   // Handle form input changes
//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle photo upload
//   const handlePhotoUpload = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Please allow access to your photos');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaType?.Images,
//         allowsMultipleSelection: true,
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setFormData(prev => ({
//           ...prev,
//           photos: [...prev.photos, ...result.assets],
//         }));
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       Alert.alert('Error', 'Failed to select image');
//     }
//   };

//   // Remove photo from upload list
//   const removePhoto = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       photos: prev.photos.filter((_, i) => i !== index),
//     }));
//   };

//   // Submit the query form
//   const handleSubmit = async () => {
//     if (!formData.queryType || !formData.description) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // const clientId = await AsyncStorage.getItem('_id');
//       const token = await AsyncStorage.getItem('token');
      
//       const formDataToSend = new FormData();
//       formDataToSend.append("queryType", formData.queryType);
//       formDataToSend.append("description", formData.description);
      
//       // Append photos
//       formData.photos.forEach((photo, index) => {
//         formDataToSend.append("photos", {
//           uri: photo.uri,
//           type: 'image/jpeg',
//           name: `photo_${index}.jpg`
//         });
//       });

//       const response = await fetch(`${backendURL}/api/queries`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         },
//         body: formDataToSend,
//       });

//       const result = await response.json();
//       console.log(result)

//       if (result.success) {
//         Alert.alert('Success', 'Query submitted successfully');
//         resetForm();
//         fetchClientQueries();
//       } else {
//         throw new Error(result.message || 'Failed to submit query');
//       }
//     } catch (error) {
//       console.error("Failed to submit query:", error);
//       Alert.alert('Error', error.message || 'Failed to submit query');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Submit client reply
//   const handleClientReply = async (queryId) => {
//     if (!clientReply.trim()) {
//       Alert.alert('Error', 'Reply message is required');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       const response = await fetch(
//         `${backendURL}/api/queries/${queryId}/reply`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ replyMessage: clientReply }),
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         Alert.alert('Success', 'Reply submitted successfully');
//         setClientReply('');
//         fetchClientQueries();
//         setSelectedQuery(prev => ({
//           ...prev,
//           communications: result.data.communications,
//         }));
//       } else {
//         throw new Error(result.message || 'Failed to submit reply');
//       }
//     } catch (error) {
//       console.error("Failed to submit reply:", error);
//       Alert.alert('Error', error.message || 'Failed to submit reply');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       queryType: "",
//       description: "",
//       photos: [],
//     });
//     setSelectedQuery(null);
//     setClientReply('');
//   };

//   // Add new query type
//   const addQueryType = () => {
//     if (newQueryType.trim() && !queryTypes.includes(newQueryType)) {
//       setQueryTypes(prev => [...prev, newQueryType]);
//       setNewQueryType("");
//       Alert.alert('Success', 'Query type added successfully');
//     }
//   };

//   // Format time ago
//   const formatTimeAgo = (date) => {
//     const d = new Date(date);
//     const seconds = Math.floor((new Date() - d) / 1000);
    
//     if (seconds < 60) return 'just now';
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//     return `${Math.floor(seconds / 86400)}d ago`;
//   };

//   // Truncate description
//   const truncateDescription = (text, length = 50) => {
//     if (typeof text !== 'string') return '';
//     return text.length > length ? `${text.substring(0, length)}...` : text;
//   };

//   //queries that visibe in a coneversation history
//   const renderQueryItem = ({ item, index }) => (
//     <TouchableOpacity
//       onPress={() => setSelectedQuery(item)}
//       className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
//     >
//       <View className="flex-row justify-between items-center">
//         <Text className="text-lg font-semibold text-gray-800 capitalize">
//           {item.queryType}
//         </Text>
//         <View className={`px-3 py-1 rounded-full ${
//           item.status === 'open' ? 'bg-yellow-100' : 'bg-green-100'
//         }`}>
//           <Text className={`text-xs font-medium ${
//             item.status === 'open' ? 'text-yellow-800' : 'text-green-800'
//           }`}>
//             {item.status}
//           </Text>
//         </View>
//       </View>
      
//       <Text className="text-gray-600 mt-2">
//         {truncateDescription(item.description)}
//       </Text>
      
//       <View className="flex-row justify-between items-center mt-3">
//         <Text className="text-sm text-gray-500">
//           {formatTimeAgo(item.createdAt)}
//         </Text>
//         <Text className="text-sm text-blue-600">
//           View Details
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="mt-4 text-gray-600">Loading queries...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50 py-4">
//       {/* Header */}
//       <View className="bg-white px-6 py-4 shadow-sm flex-row items-center">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
//           <ArrowLeftIcon size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="text-2xl font-bold text-gray-800">Help Desk</Text>
//       </View>

//       <ScrollView className="flex-1 px-4">
//         {/* Query Type Modal */}
//         <Modal
//           visible={showQueryTypeModal}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={() => setShowQueryTypeModal(false)}
//         >
//           <View className="flex-1 justify-center items-center bg-black/50">
//             <View className="bg-white p-6 rounded-lg w-11/12">
//               <Text className="text-xl font-semibold text-gray-800 mb-4">
//                 Add New Query Type
//               </Text>
              
//               <TextInput
//                 value={newQueryType}
//                 onChangeText={setNewQueryType}
//                 placeholder="Enter new query type"
//                 className="border border-gray-300 rounded-md p-3 mb-4"
//               />
              
//               <View className="flex-row justify-between">
//                 <TouchableOpacity
//                   onPress={() => setShowQueryTypeModal(false)}
//                   className="px-4 py-2 bg-gray-300 rounded-md"
//                 >
//                   <Text className="text-gray-700">Cancel</Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity
//                   onPress={addQueryType}
//                   className="px-4 py-2 bg-blue-500 rounded-md"
//                 >
//                   <Text className="text-white">Add</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Action Buttons */}
//         <View className="flex-row justify-between my-4">
//           <TouchableOpacity
//             onPress={() => setShowQueryTypeModal(true)}
//             className="px-4 py-2 bg-gray-200 rounded-md"
//           >
//             <Text className="text-blue-600 font-semibold">
//               + Add Query Type
//             </Text>
//           </TouchableOpacity>
          
//           {selectedQuery && (
//             <TouchableOpacity
//               onPress={resetForm}
//               className="px-4 py-2 bg-gray-600 rounded-md"
//             >
//               <Text className="text-white">New Query</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Query Form */}
//         <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
//           <Text className="text-xl font-semibold text-gray-800 mb-4">
//             {selectedQuery ? 'Query Details' : 'Submit New Query'}
//           </Text>

//           {/* Query Type */}
//           <View className="mb-4">
//             <Text className="text-gray-700 font-medium mb-2">
//               Query Type *
//             </Text>
//             <View className="border border-gray-300 rounded-md">
//               <Picker
//                 selectedValue={formData.queryType}
//                 onValueChange={(value) => handleChange('queryType', value)}
//                 enabled={!selectedQuery}
//               >
//                 <Picker.Item label="Select a query type" value="" />
//                 {queryTypes.map((type, index) => (
//                   <Picker.Item key={index} label={type} value={type} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           {/* Description */}
//           <View className="mb-4">
//             <Text className="text-gray-700 font-medium mb-2">
//               Description *
//             </Text>
//             <TextInput
//               value={formData.description}
//               onChangeText={(value) => handleChange('description', value)}
//               placeholder="Describe your query in detail..."
//               multiline
//               numberOfLines={4}
//               editable={!selectedQuery}
//               className="border border-gray-300 rounded-md p-3 text-gray-800"
//             />
//           </View>

//           {/* Photo Upload */}
//           <View className="mb-4">
//             <Text className="text-gray-700 font-medium mb-2">
//               Upload Photos {!selectedQuery && '(Optional)'}
//             </Text>
            
//             {!selectedQuery ? (
//               <>
//                 <TouchableOpacity
//                   onPress={handlePhotoUpload}
//                   className="flex-row items-center bg-gray-100 p-3 rounded-md mb-3"
//                 >
//                   <PhotoIcon size={20} color="#6b7280" />
//                   <Text className="text-gray-600 ml-2">Choose Photos</Text>
//                 </TouchableOpacity>

//                 {formData.photos.length > 0 && (
//                   <View className="flex-row flex-wrap">
//                     {formData.photos.map((photo, index) => (
//                       <View key={index} className="relative mr-2 mb-2">
//                         <Image
//                           source={{ uri: photo.uri }}
//                           className="w-20 h-20 rounded-md"
//                         />
//                         <TouchableOpacity
//                           onPress={() => removePhoto(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
//                         >
//                           <Text className="text-white text-xs">×</Text>
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View className="flex-row flex-wrap">
//                 {selectedQuery.photos && selectedQuery.photos.length > 0 ? (
//                   selectedQuery.photos.map((photo, index) => (
//                     <Image
//                       key={index}
//                       source={{ uri: photo.url || photo }}
//                       className="w-20 h-20 rounded-md mr-2 mb-2"
//                     />
//                   ))
//                 ) : (
//                   <Text className="text-gray-500">No photos uploaded</Text>
//                 )}
//               </View>
//             )}
//           </View>

//           {/* Conversation History */}
//           {selectedQuery && selectedQuery.communications && (
//             <View className="mb-4 bg-gray-50 p-4 rounded-md">
//               <Text className="text-lg font-medium text-blue-600 mb-3">
//                 Conversation History
//               </Text>

//               <FlatList
//                 data={selectedQuery.communications}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item }) => (
//                   <View className={`p-3 rounded-lg mb-2 ${
//                     item.sender === 'admin' 
//                       ? 'bg-blue-100 border-l-4 border-blue-500' 
//                       : 'bg-green-100 border-l-4 border-green-500'
//                   }`}>
//                     <Text className="font-semibold text-gray-800">
//                       {item.sender === 'admin' ? 'Admin' : 'You'}
//                     </Text>
//                     <Text className="text-gray-700 mt-1">{item.message}</Text>
//                     <Text className="text-xs text-gray-500 mt-1">
//                       {new Date(item.sentAt).toLocaleString()}
//                     </Text>
//                   </View>
//                 )}
//               />

//               {/* Client Reply */}
//               {selectedQuery.status !== 'closed' && (
//                 <View className="mt-4">
//                   <Text className="text-gray-700 font-medium mb-2">
//                     Your Reply
//                   </Text>
//                   <TextInput
//                     value={clientReply}
//                     onChangeText={setClientReply}
//                     placeholder="Write your reply..."
//                     multiline
//                     numberOfLines={3}
//                     className="border border-gray-300 rounded-md p-3 bg-white"
//                   />
//                   <TouchableOpacity
//                     onPress={() => handleClientReply(selectedQuery._id)}
//                     disabled={isSubmitting}
//                     className="bg-green-500 p-3 rounded-md mt-2 flex-row items-center justify-center"
//                   >
//                     <PaperAirplaneIcon size={20} color="white" />
//                     <Text className="text-white font-medium ml-2">
//                       {isSubmitting ? 'Sending...' : 'Send Reply'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Submit Button */}
//           {!selectedQuery && (
//             <TouchableOpacity
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//               className="bg-blue-500 p-3 rounded-md items-center"
//             >
//               <Text className="text-white font-medium">
//                 {isSubmitting ? 'Submitting...' : 'Submit Query'}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Query History */}
//         <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
//           <Text className="text-xl font-semibold text-gray-800 mb-4">
//             Query History
//           </Text>

//           {queryHistory.length === 0 ? (
//             <Text className="text-gray-500 text-center py-4">
//               No queries submitted yet
//             </Text>
//           ) : (
//             <FlatList
//               data={queryHistory}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderQueryItem}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default HelpDesk;


// Replaced all nested FlatList components with direct array mapping using .map()
//Converted render functions to work with direct mapping instead of FlatList renderItem
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

const HelpDesk = () => {
  const { backendURL } = useAuth()
  

  const navigation = useNavigation();

  // State for form data
  const [formData, setFormData] = useState({
    queryType: "",
    description: "",
    photos: [],
  });
  
  const [queryTypes, setQueryTypes] = useState([
    "Material Related",
    "Supervisor Related",
    "Fund Related",
    "Design Related",
    "Labour Related",
  ]);
  
  const [queryHistory, setQueryHistory] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQueryTypeModal, setShowQueryTypeModal] = useState(false);
  const [newQueryType, setNewQueryType] = useState("");
  const [clientReply, setClientReply] = useState("");

  // Fetch client queries
  const fetchClientQueries = async () => {
    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('_id');
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(
        `${backendURL}/api/queries/client/${clientId}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      const result = await response.json();
      
      if (result && result.success) {
        setQueryHistory(Array.isArray(result.data) ? result.data : []);
      } else {
        setQueryHistory([]);
        Alert.alert('Error', result?.message || 'Failed to fetch queries');
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      Alert.alert('Error', 'Failed to fetch queries');
      setQueryHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientQueries();
  }, []);

  // Handle form input changes
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...result.assets],
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Remove photo from upload list
  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Submit the query form
  const handleSubmit = async () => {
    if (!formData.queryType || !formData.description) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append("queryType", formData.queryType);
      formDataToSend.append("description", formData.description);
      
      // Append photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos", {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`
        });
      });

      const response = await fetch(`${backendURL}/api/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Query submitted successfully');
        resetForm();
        fetchClientQueries();
      } else {
        throw new Error(result.message || 'Failed to submit query');
      }
    } catch (error) {
      console.error("Failed to submit query:", error);
      Alert.alert('Error', error.message || 'Failed to submit query');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit client reply
  const handleClientReply = async (queryId) => {
    if (!clientReply.trim()) {
      Alert.alert('Error', 'Reply message is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(
        `${backendURL}/api/queries/${queryId}/reply`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ replyMessage: clientReply }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Reply submitted successfully');
        setClientReply('');
        fetchClientQueries();
        setSelectedQuery(prev => ({
          ...prev,
          communications: result.data.communications,
        }));
      } else {
        throw new Error(result.message || 'Failed to submit reply');
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
      Alert.alert('Error', error.message || 'Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      queryType: "",
      description: "",
      photos: [],
    });
    setSelectedQuery(null);
    setClientReply('');
  };

  // Add new query type
  const addQueryType = () => {
    if (newQueryType.trim() && !queryTypes.includes(newQueryType)) {
      setQueryTypes(prev => [...prev, newQueryType]);
      setNewQueryType("");
      Alert.alert('Success', 'Query type added successfully');
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const d = new Date(date);
    const seconds = Math.floor((new Date() - d) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Truncate description
  const truncateDescription = (text, length = 50) => {
    if (typeof text !== 'string') return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // Check if admin has responded to a query
  const hasAdminResponded = (query) => {
    return query.communications && query.communications.some(comm => comm.sender === 'admin');
  };

  // Handle query selection from history
  const handleQuerySelect = (query) => {
    setSelectedQuery(query);
    // Pre-fill form with query data for viewing
    setFormData({
      queryType: query.queryType,
      description: query.description,
      photos: [],
    });
  };

  // Render communication items
  const renderCommunicationItem = (item, index) => (
    <View key={index} className={`p-3 rounded-lg mb-2 ${
      item.sender === 'admin' 
        ? 'bg-blue-100 border-l-4 border-blue-500' 
        : 'bg-green-100 border-l-4 border-green-500'
    }`}>
      <Text className="font-semibold text-gray-800">
        {item.sender === 'admin' ? 'Admin' : 'You'}
      </Text>
      <Text className="text-gray-700 mt-1">{item.message}</Text>
      <Text className="text-xs text-gray-500 mt-1">
        {new Date(item.sentAt).toLocaleString()}
      </Text>
    </View>
  );

  // Render query history items
  const renderQueryItem = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleQuerySelect(item)}
      className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-800 capitalize">
          {item.queryType}
        </Text>
        <View className={`px-3 py-1 rounded-full ${
          item.status === 'open' ? 'bg-yellow-100' : 'bg-green-100'
        }`}>
          <Text className={`text-xs font-medium ${
            item.status === 'open' ? 'text-yellow-800' : 'text-green-800'
          }`}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text className="text-gray-600 mt-2">
        {truncateDescription(item.description)}
      </Text>
      
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-sm text-gray-500">
          {formatTimeAgo(item.createdAt)}
        </Text>
        <Text className="text-sm text-blue-600">
          View Details
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading queries...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 mt-2">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeftIcon size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Help Desk</Text>
      </View>

      {/* Main Content - Using ScrollView instead of FlatList */}
      <ScrollView className="flex-1 px-4">
        {/* Query Type Modal */}
        <Modal
          visible={showQueryTypeModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowQueryTypeModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-11/12">
              <Text className="text-xl font-semibold text-gray-800 mb-4">
                Add New Query Type
              </Text>
              
              <TextInput
                value={newQueryType}
                onChangeText={setNewQueryType}
                placeholder="Enter new query type"
                className="border border-gray-300 rounded-md p-3 mb-4"
              />
              
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setShowQueryTypeModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={addQueryType}
                  className="px-4 py-2 bg-blue-500 rounded-md"
                >
                  <Text className="text-white">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Action Buttons */}
        <View className="flex-row justify-between my-4">
          <TouchableOpacity
            onPress={() => setShowQueryTypeModal(true)}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            <Text className="text-blue-600 font-semibold">
              + Add Query Type
            </Text>
          </TouchableOpacity>
          
          {selectedQuery && (
            <TouchableOpacity
              onPress={resetForm}
              className="px-4 py-2 bg-gray-600 rounded-md"
            >
              <Text className="text-white">New Query</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Query Form */}
        <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            {selectedQuery ? 'Query Details' : 'Submit New Query'}
          </Text>

          {/* Query Type */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              Query Type *
            </Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={selectedQuery ? selectedQuery.queryType : formData.queryType}
                onValueChange={(value) => handleChange('queryType', value)}
                enabled={!selectedQuery}
              >
                <Picker.Item label="Select a query type" value="" />
                {queryTypes.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              Description *
            </Text>
            <TextInput
              value={selectedQuery ? selectedQuery.description : formData.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Describe your query in detail..."
              multiline
              numberOfLines={4}
              editable={!selectedQuery}
              className="border border-gray-300 rounded-md p-3 text-gray-800"
            />
          </View>

          {/* Photo Upload */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              Upload Photos {!selectedQuery && '(Optional)'}
            </Text>
            
            {!selectedQuery ? (
              <>
                <TouchableOpacity
                  onPress={handlePhotoUpload}
                  className="flex-row items-center bg-gray-100 p-3 rounded-md mb-3"
                >
                  <PhotoIcon size={20} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">Choose Photos</Text>
                </TouchableOpacity>

                {formData.photos.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {formData.photos.map((photo, index) => (
                      <View key={index} className="relative mr-2 mb-2">
                        <Image
                          source={{ uri: photo.uri }}
                          className="w-20 h-20 rounded-md"
                        />
                        <TouchableOpacity
                          onPress={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                          <Text className="text-white text-xs">×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <View className="flex-row flex-wrap">
                {selectedQuery.photos && selectedQuery.photos.length > 0 ? (
                  selectedQuery.photos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo.url || photo.uri || photo }}
                      className="w-20 h-20 rounded-md mr-2 mb-2"
                    />
                  ))
                ) : (
                  <Text className="text-gray-500">No photos uploaded</Text>
                )}
              </View>
            )}
          </View>

          {/* Conversation History and Reply Section */}
          {selectedQuery && selectedQuery.communications && (
            <View className="mb-4 bg-gray-50 p-4 rounded-md">
              <Text className="text-lg font-medium text-blue-600 mb-3">
                Conversation History
              </Text>

              {/* Replace FlatList with direct mapping */}
              {selectedQuery.communications.map((item, index) => 
                renderCommunicationItem(item, index)
              )}

              {/* Client Reply - Only show if admin has responded and query is not closed */}
              {selectedQuery.status !== 'closed' && hasAdminResponded(selectedQuery) && (
                <View className="mt-4">
                  <Text className="text-gray-700 font-medium mb-2">
                    Your Reply
                  </Text>
                  <TextInput
                    value={clientReply}
                    onChangeText={setClientReply}
                    placeholder="Write your reply..."
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 rounded-md p-3 bg-white"
                  />
                  <TouchableOpacity
                    onPress={() => handleClientReply(selectedQuery._id)}
                    disabled={isSubmitting}
                    className="bg-green-500 p-3 rounded-md mt-2 flex-row items-center justify-center"
                  >
                    <PaperAirplaneIcon size={20} color="white" />
                    <Text className="text-white font-medium ml-2">
                      {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Submit Button */}
          {!selectedQuery && (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#465274] p-3 rounded-md items-center"
            >
              <Text className="text-white font-medium">
                {isSubmitting ? 'Submitting...' : 'Submit Query'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Query History */}
        <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Query History
          </Text>

          {queryHistory.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No queries submitted yet
            </Text>
          ) : (
            // Replace FlatList with direct mapping
            <View>
              {queryHistory.map((item, index) => 
                renderQueryItem(item, index)
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpDesk;
