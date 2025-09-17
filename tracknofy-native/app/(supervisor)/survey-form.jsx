// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import CheckBox from 'expo-checkbox';
// import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// // import { useAuth } from '../../contexts/AuthContext';

// // const { backendURL} = useAuth()
//   const backendURL = "http://192.168.31.94:3000";

// // API service functions - replace with your actual API calls
// const apiService = {
//   fetchUserForms: async (email) => {
//     try {
//       const response = await fetch(`${backendURL}/api/get/form`);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching forms:', error);
//       throw error;
//     }
//   },

//   //without object ids
//   fetchFormById: async (formId) => {
//   try {
//     const response = await fetch(`${backendURL}/api/get/form/${formId}`);
//     const data = await response.json();
//     console.log('fetched through id', data);
    
//     // Return the actual form data from the response
//     if (data.success && data.data) {
//       return data.data;
//     } else {
//       throw new Error(data.message || 'Form not found');
//     }
//   } catch (error) {
//     console.error('Error fetching form by ID:', error);
//     throw error;
//   }
// },

//   submitFormData: async (formId, formData) => {
//     try {
//       const response = await fetch(`${backendURL}/api/submit/form`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ formId, formData }),
//       });
//       const data = await response.json();
//       console.log('Submit formdata', data)
//       return data;
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw error;
//     }
//   },
// };

// const SurveyForm = () => {
//   const [forms, setForms] = useState([]);
//   const [selectedFormId, setSelectedFormId] = useState('');
//   const [selectedForm, setSelectedForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [completedForms, setCompletedForms] = useState(new Set());
//   const [selectedFloor, setSelectedFloor] = useState('');
//   const [imageUris, setImageUris] = useState({});
//   const navigation = useNavigation();

//   // Floor options
//   const floorOptions = [
//     { value: 'basement-5', label: 'Basement 5' },
//     { value: 'basement-4', label: 'Basement 4' },
//     { value: 'basement-3', label: 'Basement 3' },
//     { value: 'basement-2', label: 'Basement 2' },
//     { value: 'basement-1', label: 'Basement 1' },
//     { value: 'ground', label: 'Ground Floor' },
//     { value: 'floor-1', label: 'Floor 1' },
//     { value: 'floor-2', label: 'Floor 2' },
//     { value: 'floor-3', label: 'Floor 3' },
//     { value: 'floor-4', label: 'Floor 4' },
//     { value: 'floor-5', label: 'Floor 5' },
//     { value: 'floor-6', label: 'Floor 6' },
//     { value: 'floor-7', label: 'Floor 7' },
//     { value: 'floor-8', label: 'Floor 8' },
//     { value: 'floor-9', label: 'Floor 9' },
//     { value: 'floor-10', label: 'Floor 10' },
//   ];

//   // Get user email from storage (you might want to use AsyncStorage or secure storage)
//   const userEmail = 'user@example.com'; // Replace with actual user email

//   useEffect(() => {
//     fetchUserForms();
//   }, []);

//   // Fetch all forms from the API
//   const fetchUserForms = async () => {
//     setIsLoading(true);
//     try {
//       const userForms = await apiService.fetchUserForms(userEmail);
//       setForms(userForms.data);
//       setMessage('');
//     } catch (error) {
//       setMessage('Failed to load forms. Please try again.');
//       console.error('Error fetching forms:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFormSelect = async (formId) => {
//   console.log("Selected form ID:", formId);
//   setSelectedFormId(formId);
  
//   if (!formId) {
//     setSelectedForm(null);
//     return;
//   }

//   setIsLoading(true);
//   try {
//     console.log("Fetching form with ID:", formId);
//     const form = await apiService.fetchFormById(formId);
//     console.log("Fetched form:", form);
    
//     if (!form) {
//       throw new Error('Form not found');
//     }
    
//     setSelectedForm(form);
    
//     // Initialize form data with empty values
//     const initialData = {};
//     if (form.formFields && Array.isArray(form.formFields)) {
//       form.formFields.forEach(field => {
//         if (field.type === 'checkbox-group') {
//           initialData[field.id] = [];
//         } else if (field.type === 'radio') {
//           initialData[field.id] = '';
//         } else {
//           initialData[field.id] = '';
//         }
//       });
//     }
//     setFormData(initialData);
//     setMessage('');
//   } catch (error) {
//     console.error('Error fetching form:', error);
//     setMessage('Failed to load form. Please try again.');
//     Alert.alert('Error', `Failed to load form: ${error.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // Handle input change for text fields
//   const handleInputChange = (fieldId, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldId]: value
//     }));
//   };

//   // Handle checkbox change for checkbox groups
//   const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
//     setFormData(prev => {
//       const currentValues = prev[fieldId] || [];
//       if (isChecked) {
//         return {
//           ...prev,
//           [fieldId]: [...currentValues, optionValue]
//         };
//       } else {
//         return {
//           ...prev,
//           [fieldId]: currentValues.filter(item => item !== optionValue)
//         };
//       }
//     });
//   };

//   // Handle image selection for file fields
//   const pickImage = async (fieldId) => {
//     // Request permissions
//     if (Platform.OS !== 'web') {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Sorry, we need camera roll permissions to make this work!');
//         return;
//       }
//     }

//     // Launch image picker
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       // Store the image URI
//       setImageUris(prev => ({
//         ...prev,
//         [fieldId]: result.assets[0].uri
//       }));
      
//       // You might want to upload the image to your server here
//       // and store the URL in formData instead of the local URI
//       handleInputChange(fieldId, result.assets[0].uri);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (isFinal = false) => {
//     if (!selectedFormId) return;
    
//     setIsLoading(true);
//     try {
//       const result = await apiService.submitFormData(selectedFormId, formData);
      
//       // Mark this form as completed
//       setCompletedForms(prev => new Set(prev).add(selectedFormId));
      
//       if (isFinal) {
//         setMessage('All forms completed successfully!');
//         setSelectedFormId('');
//         setSelectedForm(null);
//         setFormData({});
//         setImageUris({});
        
//         // Show success alert
//         Alert.alert('Success', 'All forms completed successfully!');
//       } else {
//         setMessage(result.message);
//         // Reset the form selection to allow selecting another form
//         setSelectedFormId('');
//         setSelectedForm(null);
//         setFormData({});
//         setImageUris({});
//       }
//     } catch (error) {
//       setMessage('Failed to submit form. Please try again.');
//       console.error('Error submitting form:', error);
//       Alert.alert('Error', 'Failed to submit form. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Render different field types
//   const renderField = (field) => {
//     const { id, type, label, required, options } = field;
//     const value = formData[id] || '';
    
//     switch (type) {
//       case 'text':
//       case 'email':
//       case 'number':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <TextInput
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               onChangeText={(text) => handleInputChange(id, text)}
//               value={value}
//               keyboardType={type === 'number' ? 'numeric' : 'default'}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );
      
//       case 'textarea':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <TextInput
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               onChangeText={(text) => handleInputChange(id, text)}
//               value={value}
//               multiline
//               numberOfLines={4}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );
      
//       case 'select':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <View className="border border-gray-300 rounded-md">
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => handleInputChange(id, itemValue)}
//               >
//                 <Picker.Item label="Select an option" value="" />
//                 {options.map((option, index) => (
//                   <Picker.Item key={index} label={option} value={option} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         );
      
//       case 'checkbox-group':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <View className="space-y-2">
//               {options.map((option, index) => (
//                 <View key={index} className="flex flex-row items-center">
//                   <CheckBox
//                     value={Array.isArray(value) && value.includes(option)}
//                     onValueChange={(isChecked) => handleCheckboxChange(id, option, isChecked)}
//                     className="mr-2"
//                   />
//                   <Text>{option}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         );
      
//       case 'radio':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <View className="space-y-2">
//               {options.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   className="flex flex-row items-center"
//                   onPress={() => handleInputChange(id, option)}
//                 >
//                   <View className="h-4 w-4 rounded-full border border-gray-300 mr-2 items-center justify-center">
//                     {value === option && (
//                       <View className="h-2 w-2 rounded-full bg-blue-600" />
//                     )}
//                   </View>
//                   <Text>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         );
      
//       case 'file':
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <TouchableOpacity
//               className="flex flex-row items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md"
//               onPress={() => pickImage(id)}
//             >
//               <Feather name="upload" size={20} color="gray" />
//               <Text className="ml-2 text-gray-500">Upload Image</Text>
//             </TouchableOpacity>
//             {imageUris[id] && (
//               <Image
//                 source={{ uri: imageUris[id] }}
//                 className="w-full h-40 mt-2 rounded-md"
//                 resizeMode="cover"
//               />
//             )}
//           </View>
//         );
      
//       default:
//         return (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               {label}
//               {required && <Text className="text-red-500 ml-1">*</Text>}
//             </Text>
//             <TextInput
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               onChangeText={(text) => handleInputChange(id, text)}
//               value={value}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-200 p-3">
//       {/* Header */}
//       <View className="bg-white rounded-lg p-4 mb-4 shadow-lg">
//         <View className="mb-4">
//           <Text className="text-lg font-semibold">Room Survey Form</Text>
//         </View>
        
//         {/* Floor Selection */}
//         <View className="mb-3">
//           <Text className="text-sm font-medium text-gray-700 mb-1">Select Floor</Text>
//           <View className="border border-gray-300 rounded-md">
//             <Picker
//               selectedValue={selectedFloor}
//               onValueChange={(itemValue) => setSelectedFloor(itemValue)}
//             >
//               <Picker.Item label="Select the Floor" value="" />
//               {floorOptions.map((floor, index) => (
//                 <Picker.Item key={index} label={floor.label} value={floor.value} />
//               ))}
//             </Picker>
//           </View>
//         </View>
        
//         {/* Form Selection */}
//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Select Form Step</Text>
//           <View className="border border-gray-300 rounded-md">
//             <Picker
//               selectedValue={selectedFormId}
//               onValueChange={handleFormSelect}
//               enabled={!!selectedFloor}
//             >
//               <Picker.Item label="Select a Form Step" value="" />
//               {forms.map(form => (
//                 <Picker.Item 
//                   key={form._id} 
//                   label={`${form.formName} ${completedForms.has(form._id) ? '✓' : ''}`}
//                   value={form._id}
//                 />
//               ))}
//             </Picker>
//           </View>
//         </View>
//       </View>
      
//       {/* Completed Forms List */}
//       {completedForms.size > 0 && (
//         <View className="bg-white rounded-lg p-4 mb-4 shadow-lg">
//           <Text className="text-lg font-semibold text-gray-800 mb-2">Completed Forms:</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View className="flex flex-row flex-wrap">
//               {forms
//                 .filter(form => completedForms.has(form._id))
//                 .map(form => (
//                   <View 
//                     key={form._id} 
//                     className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2"
//                   >
//                     <Text className="text-green-800 text-sm">
//                       {form.formName} ✓
//                     </Text>
//                   </View>
//                 ))}
//             </View>
//           </ScrollView>
//         </View>
//       )}
      
//       {/* Form Display Area */}
//       <View className="bg-white rounded-lg p-4 shadow-lg flex-1">
//         {isLoading && (
//           <View className="flex justify-center items-center my-6">
//             <ActivityIndicator size="large" color="#3b82f6" />
//             <Text className="ml-2 text-gray-600">Loading...</Text>
//           </View>
//         )}
        
//         {message ? (
//           <View className={`p-4 rounded-md mb-6 ${message.includes('completed') ? 'bg-green-100' : 'bg-blue-100'}`}>
//             <Text className={message.includes('completed') ? 'text-green-800' : 'text-blue-800'}>
//               {message}
//             </Text>
//           </View>
//         ) : null}
        
//         {selectedForm && !isLoading ? (
//           <ScrollView>
//             <Text className="text-xl font-semibold text-gray-800 mb-6">{selectedForm.formName}</Text>
            
//             {selectedForm.formFields.map(field => (
//               <View key={field.id}>
//                 {renderField(field)}
//               </View>
//             ))}
            
//             {/* Action buttons */}
//             <View className="flex flex-row justify-between mt-8 mb-4">
//               <TouchableOpacity
//                 onPress={() => handleSubmit(false)}
//                 disabled={isLoading}
//                 className="flex flex-row items-center bg-blue-600 px-4 py-2 rounded-md"
//               >
//                 <Text className="text-white mr-2">Submit & Next</Text>
//                 <MaterialIcons name="arrow-forward" size={20} color="white" />
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 onPress={() => handleSubmit(true)}
//                 disabled={isLoading}
//                 className="flex flex-row items-center bg-green-600 px-4 py-2 rounded-md"
//               >
//                 <Text className="text-white mr-2">Final Submit</Text>
//                 <FontAwesome name="check" size={20} color="white" />
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         ) : (
//           !isLoading && (
//             <View className="flex justify-center items-center py-12">
//               <Text className="text-gray-500 text-lg">
//                 {!selectedFloor 
//                   ? "Please select a floor first" 
//                   : "Please select a form step from the dropdown above to begin"}
//               </Text>
//             </View>
//           )
//         )}
        
        
//         {/* Progress indicator */}
//         {forms.length > 0 && (
//           <View className="mt-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Progress: {completedForms.size} of {forms.length} forms completed
//             </Text>
//             <View className="w-full bg-gray-200 rounded-full h-2.5">
//               <View 
//                 className="bg-green-600 h-2.5 rounded-full" 
//                 style={{ width: `${(completedForms.size / forms.length) * 100}%` }}
//               />
//             </View>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default SurveyForm;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import CheckBox from 'expo-checkbox';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const backendURL = "http://192.168.31.94:3000";

// API service functions
const apiService = {
  fetchUserForms: async (email) => {
    try {
      const response = await fetch(`${backendURL}/api/get/form`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  },

  fetchFormById: async (formId) => {
    try {
      const response = await fetch(`${backendURL}/api/get/form/${formId}`);
      const data = await response.json();
      console.log('Fetched form by ID:', data);
      
      // Return the actual form data from the response
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Form not found');
      }
    } catch (error) {
      console.error('Error fetching form by ID:', error);
      throw error;
    }
  },

  submitFormData: async (formId, formData) => {
    try {
      const response = await fetch(`${backendURL}/api/submit/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId, formData }),
      });
      const data = await response.json();
      console.log('Submit formdata', data);
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },
};

const SurveyForm = () => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [completedForms, setCompletedForms] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState('');
  const [imageUris, setImageUris] = useState({});
  const navigation = useNavigation();

  const floorOptions = [
    { value: 'basement-5', label: 'Basement 5' },
    { value: 'basement-4', label: 'Basement 4' },
    { value: 'basement-3', label: 'Basement 3' },
    { value: 'basement-2', label: 'Basement 2' },
    { value: 'basement-1', label: 'Basement 1' },
    { value: 'ground', label: 'Ground Floor' },
    { value: 'floor-1', label: 'Floor 1' },
    { value: 'floor-2', label: 'Floor 2' },
    { value: 'floor-3', label: 'Floor 3' },
    { value: 'floor-4', label: 'Floor 4' },
    { value: 'floor-5', label: 'Floor 5' },
    { value: 'floor-6', label: 'Floor 6' },
    { value: 'floor-7', label: 'Floor 7' },
    { value: 'floor-8', label: 'Floor 8' },
    { value: 'floor-9', label: 'Floor 9' },
    { value: 'floor-10', label: 'Floor 10' },
  ];

  const userEmail = 'user@example.com';

  useEffect(() => {
    fetchUserForms();
  }, []);

  const fetchUserForms = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.fetchUserForms(userEmail);
      // Check the structure of your API response
      if (response.success && Array.isArray(response.data)) {
        setForms(response.data);
      } else if (Array.isArray(response)) {
        setForms(response);
      } else {
        throw new Error('Invalid forms data structure');
      }
      setMessage('');
    } catch (error) {
      setMessage('Failed to load forms. Please try again.');
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSelect = async (formId) => {
    console.log("Selected form ID:", formId);
    
    if (!formId) {
      setSelectedFormId('');
      setSelectedForm(null);
      return;
    }

    setSelectedFormId(formId);
    setIsLoading(true);
    
    try {
      console.log("Fetching form with ID:", formId);
      const form = await apiService.fetchFormById(formId);
      console.log("Fetched form data:", form);
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      setSelectedForm(form);
      
      // Initialize form data with empty values
      const initialData = {};
      if (form.formFields && Array.isArray(form.formFields)) {
        form.formFields.forEach(field => {
          if (field.type === 'checkbox-group') {
            initialData[field.id] = [];
          } else if (field.type === 'radio') {
            initialData[field.id] = '';
          } else {
            initialData[field.id] = '';
          }
        });
      }
      setFormData(initialData);
      setMessage('');
    } catch (error) {
      console.error('Error fetching form:', error);
      setMessage('Failed to load form. Please try again.');
      Alert.alert('Error', `Failed to load form: ${error.message}`);
      setSelectedForm(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (keep all the existing handleInputChange, handleCheckboxChange, pickImage, handleSubmit functions)

  const renderField = (field) => {
    // ... (keep the existing renderField function)
  };

  return (
    <View className="flex-1 bg-gray-200 p-3">
      {/* Header */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-lg">
        <View className="mb-4">
          <Text className="text-lg font-semibold">Room Survey Form</Text>
        </View>
        
        {/* Floor Selection */}
        <View className="mb-3">
          <Text className="text-sm font-medium text-gray-700 mb-1">Select Floor</Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={selectedFloor}
              onValueChange={(itemValue) => setSelectedFloor(itemValue)}
            >
              <Picker.Item label="Select the Floor" value="" />
              {floorOptions.map((floor, index) => (
                <Picker.Item key={index} label={floor.label} value={floor.value} />
              ))}
            </Picker>
          </View>
        </View>
        
        {/* Form Selection - FIXED: Pass formId directly to handleFormSelect */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Select Form Step</Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={selectedFormId}
              onValueChange={(itemValue) => handleFormSelect(itemValue)}
              enabled={!!selectedFloor}
            >
              <Picker.Item label="Select a Form Step" value="" />
              {forms.map(form => (
                <Picker.Item 
                  key={form._id} 
                  label={`${form.formName} ${completedForms.has(form._id) ? '✓' : ''}`}
                  value={form._id}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      
      {/* Debug information - You can remove this after testing */}
      <View className="bg-yellow-100 p-2 rounded mb-4">
        <Text className="text-xs">Debug Info:</Text>
        <Text className="text-xs">Selected Form ID: {selectedFormId}</Text>
        <Text className="text-xs">Selected Form: {selectedForm ? selectedForm.formName : 'None'}</Text>
        <Text className="text-xs">Forms Count: {forms.length}</Text>
      </View>
      
      {/* Completed Forms List */}
      {completedForms.size > 0 && (
        <View className="bg-white rounded-lg p-4 mb-4 shadow-lg">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Completed Forms:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row flex-wrap">
              {forms
                .filter(form => completedForms.has(form._id))
                .map(form => (
                  <View 
                    key={form._id} 
                    className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-green-800 text-sm">
                      {form.formName} ✓
                    </Text>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      )}
      
      {/* Form Display Area */}
      <View className="bg-white rounded-lg p-4 shadow-lg flex-1">
        {isLoading && (
          <View className="flex justify-center items-center my-6">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="ml-2 text-gray-600">Loading...</Text>
          </View>
        )}
        
        {message ? (
          <View className={`p-4 rounded-md mb-6 ${message.includes('completed') ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Text className={message.includes('completed') ? 'text-green-800' : 'text-blue-800'}>
              {message}
            </Text>
          </View>
        ) : null}
        
        {selectedForm && !isLoading ? (
          <ScrollView>
            <Text className="text-xl font-semibold text-gray-800 mb-6">{selectedForm.formName}</Text>
            
            {selectedForm.formFields && selectedForm.formFields.map(field => (
              <View key={field.id}>
                {renderField(field)}
              </View>
            ))}
            
            {/* Action buttons */}
            <View className="flex flex-row justify-between mt-8 mb-4">
              <TouchableOpacity
                onPress={() => handleSubmit(false)}
                disabled={isLoading}
                className="flex flex-row items-center bg-blue-600 px-4 py-2 rounded-md"
              >
                <Text className="text-white mr-2">Submit & Next</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleSubmit(true)}
                disabled={isLoading}
                className="flex flex-row items-center bg-green-600 px-4 py-2 rounded-md"
              >
                <Text className="text-white mr-2">Final Submit</Text>
                <FontAwesome name="check" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          !isLoading && (
            <View className="flex justify-center items-center py-12">
              <Text className="text-gray-500 text-lg">
                {!selectedFloor 
                  ? "Please select a floor first" 
                  : "Please select a form step from the dropdown above to begin"}
              </Text>
            </View>
          )
        )}
        
        {/* Progress indicator */}
        {forms.length > 0 && (
          <View className="mt-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Progress: {completedForms.size} of {forms.length} forms completed
            </Text>
            <View className="w-full bg-gray-200 rounded-full h-2.5">
              <View 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(completedForms.size / forms.length) * 100}%` }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SurveyForm;