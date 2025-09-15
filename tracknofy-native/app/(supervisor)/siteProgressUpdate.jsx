// import { useState, useRef, useContext, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
// import { useAuth } from '../../contexts/AuthContext';

// const SiteProgressUpdate = () => {
//   const { backendURL } = useAuth();
//   const [sitedata, setSiteData] = useState([]);
//   const [textData, setTextData] = useState({
//     projectId: "",
//     description: "",
//     date: new Date().toISOString().split('T')[0],
//   });
//   const [photos, setPhotos] = useState([]);
//   const [progressHistory, setProgressHistory] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date available';
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US');
//   };

//   // Fetch projects assigned to the supervisor
//   const getProjectsDetail = async () => {
//     try {
//       const email = await AsyncStorage.getItem("email");
//       const token = await AsyncStorage.getItem("token");

//       const response = await fetch(`${backendURL}/api/allortedSite?email=${email}`, {
//         method: "GET",
//         headers: {
//           "content-type": "application/json",
//           "token": token
//         }
//       });

//       const result = await response.json();
//       if (!result.success) {
//         console.log(result.message);
//         return;
//       }
//       setSiteData(result.data);
//     } catch (error) {

//       console.error("Error fetching projects:", error);
//     }
//   };

//   // Fetch progress history
//   const getProgressDetails = async () => {
//     try {
//       const _id = await AsyncStorage.getItem("_id");
//       const token = await AsyncStorage.getItem("token");

//       const response = await fetch(`${backendURL}/api/getProgress/report/${_id}`, {
//         method: "GET",
//         headers: {
//           "Content-type": "application/json",
//           "token": token
//         },
//       });

//       const result = await response.json();
//       if(!result.success){
//         console.log(result.message);
//         return;
//       }
//       setProgressHistory(result.data);
//     } catch (error) {
//       toastAlert.error();
//       console.error("Error fetching progress details:", error);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (name, value) => {
//     setTextData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle photo selection from gallery or camera
//   const handlePhotoUpload = async () => {
//     // Request permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     // Launch image picker
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//       allowsMultipleSelection: true,
//     });

//     if (!result.canceled) {
//       if (result.assets.length + photos.length > 5) {
//         Alert.alert("You Can Upload Maximum of 5 Photos");
//         return;
//       }

//       setIsUploading(true);

//       const newPhotos = result.assets.map(asset => ({
//         id: Date.now() + Math.random(),
//         uri: asset.uri,
//         name: asset.fileName || `photo_${Date.now()}.jpg`,
//         type: 'image/jpeg',
//       }));

//       setPhotos(prev => [...prev, ...newPhotos]);
//       setIsUploading(false);
//     }
//   };

//   // Remove selected photo
//   const removePhoto = (id) => {
//     setPhotos(prev => prev.filter(photo => photo.id !== id));
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!textData.projectId) {
//       Alert.alert("Please Select a Project");
//       return;
//     }

//     if (!textData.description) {
//       Alert.alert('Please Enter a Description');
//       return;
//     }

//     if (photos.length === 0) {
//       Alert.alert("Please Upload Atleast One Photo");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('projectId', textData.projectId);
//     formData.append('description', textData.description);
//     formData.append('date', textData.date);

//     photos.forEach((photo) => {
//       formData.append('photos', {
//         uri: photo.uri,
//         name: photo.name,
//         type: photo.type,
//       });
//     });

//     try {
//       const id = await AsyncStorage.getItem("_id");
//       const token = await AsyncStorage.getItem("token");

//       const response = await fetch(`${backendURL}/api/report/progress/${id}`, {
//         method: "POST",
//         headers: {
//           "token": token,
//           "Accept": "application/json",
//         },
//         body: formData
//       });

//       const result = await response.json();
//       if (!result.success) {
//         Alert.alert(result.message);
//         setLoading(false);
//         return;
//       }

//       // Update progress history with the new update
//       const selectedProject = sitedata.find(project => project._id === textData.projectId);
//       const newProgressItem = {
//         ...result.data,
//         siteName: selectedProject?.siteName || "Unknown Project",
//       };

//       setProgressHistory(prev => [newProgressItem, ...prev]);

//       // Reset form
//       setTextData({
//         projectId: '',
//         description: '',
//         date: new Date().toISOString().split('T')[0],
//       });
//       setPhotos([]);
//       Alert.alert.success(result.message);
//     } catch (error) {
//       console.error("Error submitting progress:", error);
//       Alert.alert.error();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProjectsDetail();
//     getProgressDetails();
//   }, []);

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <ScrollView className="flex-1 p-4">
//         <Text className="text-2xl font-bold text-gray-800 mb-6">Site Progress Update</Text>

//         {/* Progress Update Form */}
//         <View className="bg-white rounded-lg shadow p-4 mb-6">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">New Progress Update</Text>

//           {/* Project Selection */}
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Project <Text className="text-red-500">*</Text>
//             </Text>
//             <View className="border border-gray-300 rounded-md p-2">
//               <ScrollView horizontal={true} className="flex-row">
//                 {sitedata.map(project => (
//                   <TouchableOpacity
//                     key={project._id}
//                     onPress={() => handleChange('projectId', project._id)}
//                     className={`px-4 py-2 mr-2 rounded-md ${
//                       textData.projectId === project._id ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <Text className={textData.projectId === project._id ? 'text-white' : 'text-gray-800'}>
//                       {project.siteName}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>

//           {/* Date */}
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">Date</Text>
//             <TextInput
//               value={textData.date}
//               onChangeText={(value) => handleChange('date', value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Select date"
//             />
//           </View>

//           {/* Photo Upload */}
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Upload Work Photos (Max 5)
//             </Text>

//             <ScrollView horizontal={true} className="flex-row mb-3">
//               {photos.map(photo => (
//                 <View key={photo.id} className="relative mr-2">
//                   <Image
//                     source={{ uri: photo.uri }}
//                     className="h-24 w-24 rounded-md border border-gray-200"
//                   />
//                   <TouchableOpacity
//                     onPress={() => removePhoto(photo.id)}
//                     className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
//                   >
//                     <Feather name="x" size={14} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               ))}

//               {photos.length < 5 && (
//                 <TouchableOpacity
//                   onPress={handlePhotoUpload}
//                   disabled={isUploading}
//                   className={`h-24 w-24 flex items-center justify-center border-2 border-dashed rounded-md ${
//                     isUploading ? 'border-gray-300 bg-gray-100' : 'border-blue-500'
//                   }`}
//                 >
//                   {isUploading ? (
//                     <ActivityIndicator size="small" color="#3B82F6" />
//                   ) : (
//                     <>
//                       <Feather name="upload" size={20} color="#3B82F6" />
//                       <Text className="text-xs text-gray-600 mt-1">Add Photo</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               )}
//             </ScrollView>

//             <Text className="text-xs text-gray-500 mt-1">
//               Supported formats: JPG, PNG. Maximum file size: 5MB per photo.
//             </Text>
//           </View>

//           {/* Description */}
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Progress Description <Text className="text-red-500">*</Text>
//             </Text>
//             <TextInput
//               value={textData.description}
//               onChangeText={(value) => handleChange('description', value)}
//               multiline={true}
//               numberOfLines={4}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Describe today's progress, work completed, challenges faced, etc."
//             />
//           </View>

//           {/* Submit Button */}
//           <View className="flex justify-end">
//             <TouchableOpacity
//               onPress={handleSubmit}
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 rounded-md flex-row justify-center items-center"
//             >
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <>
//                   <Text className="text-white font-medium">Submit Progress Update</Text>
//                   <Feather name="send" size={16} color="white" className="ml-2" />
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Progress History */}
//         <View className="bg-white rounded-lg shadow p-4">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">Progress History</Text>

//           {progressHistory.length === 0 ? (
//             <Text className="text-gray-500 text-center py-4">No progress updates yet</Text>
//           ) : (
//             <View className="space-y-4">
//               {progressHistory.map((update, index) => (
//                 <View key={update._id || index} className="border-b border-gray-200 pb-4">
//                   <View className="flex-row justify-between items-start mb-1">
//                     <Text className="font-medium text-gray-900">{update.siteName || "Unknown Project"}</Text>
//                     <Text className="text-sm text-gray-500">{formatDate(update.reportDate)}</Text>
//                   </View>
//                   <Text className="text-gray-700 mb-2">{update.description}</Text>

//                   {update.photos && update.photos.length > 0 && (
//                     <View className="mt-2">
//                       <ScrollView horizontal={true} className="flex-row">
//                         {update.photos.map((photo, idx) => (
//                           <TouchableOpacity key={idx} className="mr-2">
//                             <View className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
//                               <Image
//                                 source={{ uri: `${backendURL}/${photo.path.replace(/\\/g, '/')}` }}
//                                 className="h-full w-full"
//                                 resizeMode="cover"
//                               />
//                             </View>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                     </View>
//                   )}
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SiteProgressUpdate;

import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const SiteProgressUpdate = () => {
  const { backendURL } = useAuth();
  const [sitedata, setSiteData] = useState([]);
  const [textData, setTextData] = useState({
    projectId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [photos, setPhotos] = useState([]);
  console.log(photos);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US");
  };

  // Get projects assigned to the supervisor
  const getProjectsDetail = async () => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${backendURL}/api/allortedSite?email=${email}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );

      const result = await response.json();
      if (!result.success) {
        Alert.alert("Info", result.message || "No projects found");
        return;
      }
      setSiteData(result.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch projects");
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get progress history
  const getProgressDetails = async () => {
    try {
      setLoading(true);
      const _id = await AsyncStorage.getItem("_id");
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${backendURL}/api/getProgress/report/${_id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            token: token,
          },
        }
      );

      const result = await response.json();
      if (!result.success) {
        Alert.alert("Info", result.message || "No progress history found");
        return;
      }
      setProgressHistory(result.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch progress history");
      console.error("Error fetching progress details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (name, value) => {
    setTextData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle photo selection from gallery or camera
  const handlePhotoUpload = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        if (result.assets.length + photos.length > 5) {
          Alert.alert("Limit Exceeded", "You can upload maximum of 5 photos");
          return;
        }

        const newPhotos = result.assets.map((asset) => ({
          id: Date.now() + Math.random(),
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select photos");
      console.error("Error picking images:", error);
    }
  };

  // Remove selected photo
  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  // Submit progress update
  const handleSubmit = async () => {
    if (!textData.projectId) {
      Alert.alert("Validation", "Please select a project");
      return;
    }

    if (!textData.description.trim()) {
      Alert.alert("Validation", "Please enter a description");
      return;
    }

    if (photos.length === 0) {
      Alert.alert("Validation", "Please upload at least one photo");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("projectId", textData.projectId);
      formData.append("description", textData.description);
      formData.append("date", textData.date);

      // Append photos to form data - FIXED: Use proper file objects
      photos.forEach((photo, index) => {
        // Extract filename from URI for better handling
        const filename = photo.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("photos", {
          uri: photo.uri,
          type: type,
          name: `site_photo_${index}_${Date.now()}.${match ? match[1] : "jpg"}`,
        });
      });

      const id = await AsyncStorage.getItem("_id");
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${backendURL}/api/report/progress/${id}`, {
        method: "POST",
        headers: {
          token: token,
          // Don't set Content-Type header - let React Native set it automatically
          // for multipart/form-data with proper boundary
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Response:", result);

      if (!result.success) {
        Alert.alert("Error", result.message);
        return;
      }

      // Handle photos in response properly
      if (result.data && result.data.photos) {
        console.log("Uploaded photos:", result.data.photos);
      }

      // Update progress history
      const selectedProject = sitedata.find(
        (project) => project._id === textData.projectId
      );
      const newProgressItem = {
        ...result.data,
        siteName: selectedProject?.siteName || "Unknown Project",
      };

      setProgressHistory((prev) => [newProgressItem, ...prev]);

      // Reset form
      setTextData({
        projectId: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setPhotos([]);

      Alert.alert("Success", result.message || "Progress updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to submit progress");
      console.error("Error submitting progress:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getProjectsDetail();
    getProgressDetails();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Site Progress Update
          </Text>
          <Text className="text-gray-600 mt-1">
            Track and update your project progress
          </Text>
        </View>

        {/* Progress Update Form */}
        <View className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            New Progress Update
          </Text>

          {/* Project Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Project <Text className="text-red-500">*</Text>
            </Text>
            <View className="border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={textData.projectId}
                onValueChange={(value) => handleChange("projectId", value)}
                style={{ color: "#374151" }}
              >
                <Picker.Item label="Select Project" value="" />
                {sitedata.map((project) => (
                  <Picker.Item
                    key={project._id}
                    label={project.siteName}
                    value={project._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Date</Text>
            <TextInput
              value={textData.date}
              onChangeText={(value) => handleChange("date", value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Photo Upload */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Upload Work Photos (Max 5)
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
            >
              <View className="flex-row gap-3">
                {photos.map((photo) => (
                  <View key={photo.id} className="relative">
                    <Image
                      source={{ uri: photo.uri }}
                      className="h-20 w-20 rounded-lg border border-gray-200"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <MaterialIcons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {photos.length < 5 && (
                  <TouchableOpacity
                    onPress={handlePhotoUpload}
                    disabled={isUploading}
                    className="h-20 w-20 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-lg bg-blue-50"
                  >
                    {isUploading ? (
                      <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                      <>
                        <FontAwesome
                          name="cloud-upload"
                          size={24}
                          color="#3B82F6"
                        />
                        <Text className="text-xs text-blue-600 mt-1">
                          Add Photo
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <Text className="text-xs text-gray-500">
              Supported formats: JPG, PNG. Maximum file size: 5MB per photo.
            </Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Progress Description <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={textData.description}
              onChangeText={(value) => handleChange("description", value)}
              multiline
              numberOfLines={4}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
              placeholder="Describe today's progress, work completed, challenges faced, etc."
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isUploading}
            className="bg-blue-600 py-3 rounded-lg flex items-center justify-center"
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold">
                Submit Progress Update
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress History */}
        <View className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Progress History
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" className="py-8" />
          ) : progressHistory.length === 0 ? (
            <Text className="text-gray-500 text-center py-6">
              No progress updates yet
            </Text>
          ) : (
            <View className="space-y-4">
              {progressHistory.map((update, index) => (
                <View
                  key={update._id || index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold text-gray-900 flex-1">
                      {update.siteName || "Unknown Project"}
                    </Text>
                    <Text className="text-sm text-gray-500 ml-2">
                      {formatDate(update.reportDate)}
                    </Text>
                  </View>
                  <Text className="text-gray-700 mb-3">
                    {update.description}
                  </Text>

                  {update.photos && update.photos.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mt-2"
                    >
                      <View className="flex-row gap-2">
                        {update.photos.map((photo, idx) => (
                          <TouchableOpacity key={idx} className="relative">
                            <View className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {photo.path ? (
                                <Image
                                  // Remove the "public/" part from the path
                                  //prev -- source={{ uri: `${backendURL}/${photo.path.replace(/\\/g, '/')}` }}
                                  source={{
                                    uri: `${backendURL}/${photo.path.replace(/^public[\\/]/, "").replace(/\\/g, "/")}`,
                                  }}
                                  className="h-full w-full"
                                  resizeMode="cover"
                                />
                              ) : (
                                <Ionicons
                                  name="image"
                                  size={24}
                                  color="#9CA3AF"
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SiteProgressUpdate;
