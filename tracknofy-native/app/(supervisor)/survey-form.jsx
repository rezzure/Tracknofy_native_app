// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   Platform,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Icon from 'react-native-vector-icons/FontAwesome';
// // import { useAuth } from '../../contexts/AuthContext';

// // Configuration
// const baseUrl = 'http://localhost:3000';
// // const { backendURL } = useAuth()
// const backendURL = "http://192.168.31.95:3000";
// // Create the floor options array
// const floorOptions = [
//   { value: 'basement-2', label: 'Basement 2' },
//   { value: 'basement-1', label: 'Basement 1' },
//   { value: 'ground', label: 'Ground Floor' },
//   { value: 'floor-1', label: 'Floor 1' },
//   { value: 'floor-2', label: 'Floor 2' },
//   { value: 'floor-3', label: 'Floor 3' },
//   { value: 'floor-4', label: 'Floor 4' },
//   { value: 'floor-5', label: 'Floor 5' },
//   { value: 'floor-6', label: 'Floor 6' },
//   { value: 'floor-7', label: 'Floor 7' },
//   { value: 'floor-8', label: 'Floor 8' },
//   { value: 'floor-9', label: 'Floor 9' },
//   { value: 'floor-10', label: 'Floor 10' }
// ];

// const clientDetailForm = {
//   _id: 'Client',
//   formName: 'Client Information',
//   formFields: [
//     {
//       id: 'clientName',
//       type: 'text',
//       label: 'Name',
//       required: true,
//     },
//     {
//       id: 'clientEmail',
//       type: 'email',
//       label: 'Email',
//       required: true
//     },
//     {
//       id: 'clientMobile',
//       type: 'number',
//       label: 'Mobile',
//       required: true
//     },
//     {
//       id: 'siteAddress',
//       type: 'textarea',
//       label: 'Address',
//       required: false
//     },
//     {
//       id: 'siteShortName',
//       type: 'text',
//       label: 'Site Short Name',
//       required: true
//     },
//   ]
// };

// // API service functions
// const useApiService = (backendURL) => {
//   // Client API functions
//   const submitClientData = async (clientData) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await fetch(`${backendURL}/api/client/submit`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': token
//         },
//         body: JSON.stringify(clientData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit client data');
//       }

//       const result = await response.json();

//       // Store client data in AsyncStorage as backup
//       await AsyncStorage.setItem('clientData', JSON.stringify(clientData));

//       return {
//         success: true,
//         message: 'Client information saved successfully!',
//         clientId: result.clientId || `client-${Date.now()}`
//       };
//     } catch (error) {
//       console.error('Error submitting client data:', error);
//       // Fallback to AsyncStorage if API fails
//       await AsyncStorage.setItem('clientData', JSON.stringify(clientData));
//       return {
//         success: true,
//         message: 'Client information saved locally!',
//         clientId: `client-${Date.now()}`
//       };
//     }
//   };

//   const getClientData = async () => {
//     try {
//       const data = await AsyncStorage.getItem('clientData');
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Error getting client data:', error);
//       return null;
//     }
//   };

//   // Form data management (using AsyncStorage for form responses)
//   const saveRoomData = async (floor, roomId, formId, formData) => {
//     try {
//       const key = `roomData_${floor}_${roomId}_${formId}`;
//       await AsyncStorage.setItem(key, JSON.stringify(formData));
//       return { success: true, formData };
//     } catch (error) {
//       console.error('Error saving room data:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   const getRoomData = async (floor, roomId, formId) => {
//     try {
//       const key = `roomData_${floor}_${roomId}_${formId}`;
//       const data = await AsyncStorage.getItem(key);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Error getting room data:', error);
//       return null;
//     }
//   };

//   const getAllRoomsForFloor = async (floor) => {
//     try {
//       const allKeys = await AsyncStorage.getAllKeys();
//       const roomKeys = allKeys.filter(key => key.startsWith(`roomData_${floor}_`));

//       const rooms = {};
//       for (const key of roomKeys) {
//         const data = await AsyncStorage.getItem(key);
//         const parts = key.split('_');
//         const roomId = parts[2];
//         const formId = parts[3];

//         if (!rooms[roomId]) {
//           rooms[roomId] = {};
//         }

//         rooms[roomId][formId] = JSON.parse(data);
//       }
//       return rooms;
//     } catch (error) {
//       console.error('Error getting all rooms:', error);
//       return {};
//     }
//   };

//   const deleteRoomData = async (floor, roomId) => {
//     try {
//       const allKeys = await AsyncStorage.getAllKeys();
//       const keysToDelete = allKeys.filter(key => key.startsWith(`roomData_${floor}_${roomId}_`));

//       for (const key of keysToDelete) {
//         await AsyncStorage.removeItem(key);
//       }
//       return { success: true };
//     } catch (error) {
//       console.error('Error deleting room data:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   // Final submission to backend
//   const submitFinalData = async (clientData, allRoomData) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const submissionData = {
//         clientDetails: clientData,
//         ...allRoomData
//       };

//       const response = await fetch(`${backendURL}/api/submit/final`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': token
//         },
//         body: JSON.stringify(submissionData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit final data');
//       }

//       const result = await response.json();

//       // Clear all data after successful submission
//       await AsyncStorage.removeItem('clientData');
//       const allKeys = await AsyncStorage.getAllKeys();
//       const roomKeys = allKeys.filter(key => key.startsWith('roomData_'));

//       for (const key of roomKeys) {
//         await AsyncStorage.removeItem(key);
//       }

//       return {
//         success: true,
//         message: 'Survey data submitted successfully!',
//         submissionId: result.submissionId || `sub-${Date.now()}`
//       };
//     } catch (error) {
//       console.error('Error submitting final data:', error);
//       return {
//         success: false,
//         message: 'Failed to submit survey data. Please try again.',
//         error: error.message
//       };
//     }
//   };

//   // Fetch forms from database
//   const fetchUserForms = async () => {
//     try {
//       // Get email from AsyncStorage
//       const email = await AsyncStorage.getItem('email');
//       const token = await AsyncStorage.getItem('token');

//       if (!email) {
//         throw new Error('User email not found in AsyncStorage');
//       }

//       const response = await fetch(`${backendURL}/api/get/form?email=${email}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           "token": token
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch forms from server');
//       }

//       const forms = await response.json();
//       console.log(forms);

//       // Transform the data to match expected format if needed
//       const transformedForms = forms.data.map(form => ({
//         _id: form._id,
//         formName: form.formName,
//         formFields: form.formFields.map(field => ({
//           id: field.id,
//           type: field.type,
//           label: field.label,
//           required: field.required || false,
//           options: field.options || []
//         }))
//       }));

//       return transformedForms;
//     } catch (error) {
//       console.error('Error fetching forms:', error);

//       // Fallback to mock data if API fails
//       return [
//         {
//           _id: 'step1',
//           formName: 'Step 1: General Room Information',
//           formFields: [
//             {
//               id: 'roomType',
//               type: 'select',
//               label: 'Room Name/Type',
//               required: true,
//               options: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Office', 'Kids Room', 'Utility', 'Balcony', 'Other']
//             },
//             {
//               id: 'floorLocation',
//               type: 'text',
//               label: 'Floor/Location',
//               required: true
//             },
//             {
//               id: 'purpose',
//               type: 'text',
//               label: 'Purpose/Usage',
//               required: true
//             },
//             {
//               id: 'roomPhoto',
//               type: 'image',
//               label: 'Room Photo (Entry View)',
//               required: false
//             }
//           ]
//         },
//         {
//           _id: 'step2',
//           formName: 'Step 2: Dimensions & Structure',
//           formFields: [
//             {
//               id: 'length',
//               type: 'number',
//               label: 'Length (in meters)',
//               required: true
//             },
//             {
//               id: 'width',
//               type: 'number',
//               label: 'Width (in meters)',
//               required: true
//             },
//             {
//               id: 'height',
//               type: 'number',
//               label: 'Height (in meters)',
//               required: true
//             },
//             {
//               id: 'floorLevelDiff',
//               type: 'number',
//               label: 'Floor Level Difference (optional)',
//               required: false
//             },
//             {
//               id: 'beamsPillars',
//               type: 'text',
//               label: 'Beams/Pillars Location',
//               required: false
//             },
//             {
//               id: 'beamsPillarsPhoto',
//               type: 'image',
//               label: 'Beams/Pillars Photo',
//               required: false
//             }
//           ]
//         }
//       ];
//     }
//   };

//   const fetchFormById = async (formId) => {
//     try {
//       const userForms = await fetchUserForms();
//       return userForms.find(form => form._id === formId) || null;
//     } catch (error) {
//       console.error('Error fetching form by ID:', error);
//       return null;
//     }
//   };

//   return {
//     submitClientData,
//     getClientData,
//     saveRoomData,
//     getRoomData,
//     getAllRoomsForFloor,
//     deleteRoomData,
//     submitFinalData,
//     fetchUserForms,
//     fetchFormById
//   };
// };

// // Modal Component for Viewing Form Data
// const ViewFormModal = ({ isVisible, onClose, formData, formName }) => {
//   return (
//     <Modal
//       visible={isVisible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>{formName}</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <Icon name="times" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalBody}>
//             {formData && Object.keys(formData).length > 0 ? (
//               <View style={styles.formDataContainer}>
//                 {Object.entries(formData).map(([key, value]) => (
//                   <View key={key} style={styles.formDataItem}>
//                     <Text style={styles.formDataLabel}>
//                       {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
//                     </Text>
//                     <Text style={styles.formDataValue}>
//                       {Array.isArray(value) ? value.join(', ') : value.toString()}
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             ) : (
//               <Text style={styles.noDataText}>No data available for this form.</Text>
//             )}
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
//               <Text style={styles.closeModalButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // Main Survey Form Component
// const SurveyForm = () => {
//   // const { backendURL } = useContext(AuthContext);
//   const backendURL = "http://192.168.1.7:3000";
//   const apiService = useApiService(backendURL);

//   // State for client form
//   const [showClientForm, setShowClientForm] = useState(true);
//   const [clientData, setClientData] = useState({});
//   const [isSubmittingClient, setIsSubmittingClient] = useState(false);
//   const [clientSubmitted, setClientSubmitted] = useState(false);

//   // State for survey forms
//   const [forms, setForms] = useState([]);
//   const [selectedFormId, setSelectedFormId] = useState('');
//   const [selectedForm, setSelectedForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [selectedFloor, setSelectedFloor] = useState('');
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [roomId, setRoomId] = useState('');
//   const [rooms, setRooms] = useState({});
//   const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [viewFormData, setViewFormData] = useState(null);
//   const [viewFormName, setViewFormName] = useState('');
//   const [floorModalVisible, setFloorModalVisible] = useState(false);
//   const [formModalVisible, setFormModalVisible] = useState(false);

//   // Check if client data exists on component mount
//   useEffect(() => {
//     const loadClientData = async () => {
//       const existingClientData = await apiService.getClientData();
//       if (existingClientData) {
//         setClientData(existingClientData);
//         setClientSubmitted(true);
//         setShowClientForm(false);
//       } else {
//         // Initialize empty client data
//         const emptyClientData = {};
//         clientDetailForm.formFields.forEach(field => {
//           emptyClientData[field.id] = '';
//         });
//         setClientData(emptyClientData);
//       }
//     };

//     loadClientData();
//   }, []);

//   // Load forms when client form is completed
//   useEffect(() => {
//     if (!showClientForm) {
//       const fetchUserForms = async () => {
//         setIsLoading(true);
//         try {
//           const userForms = await apiService.fetchUserForms();
//           setForms(userForms);
//           setMessage('');
//         } catch (error) {
//           setMessage('Failed to load forms. Please try again.');
//           console.error('Error fetching forms:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchUserForms();
//     }
//   }, [showClientForm]);

//   // Load rooms data when floor is selected
//   const loadRoomsData = useCallback(async () => {
//     if (selectedFloor) {
//       const roomsData = await apiService.getAllRoomsForFloor(selectedFloor);
//       setRooms(roomsData);
//     }
//   }, [selectedFloor]);

//   useEffect(() => {
//     if (selectedFloor && !showClientForm) {
//       loadRoomsData();

//       if (!selectedFormId && forms.length > 0) {
//         const firstFormId = forms[0]._id;
//         setSelectedFormId(firstFormId);
//       }
//     }
//   }, [selectedFloor, forms, showClientForm, selectedFormId]);

//   // Load form data when form is selected
//   const loadFormData = useCallback(async (formId) => {
//     if (!formId || !selectedFloor || !roomId) {
//       setSelectedForm(null);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const form = await apiService.fetchFormById(formId);
//       setSelectedForm(form);

//       const existingData = await apiService.getRoomData(selectedFloor, roomId, formId);
//       if (existingData) {
//         setFormData(existingData);
//       } else {
//         setFormData(createEmptyFormData(form.formFields));
//       }

//       setMessage('');
//     } catch (error) {
//       setMessage('Failed to load form. Please try again.');
//       console.error('Error fetching form:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedFloor, roomId]);

//   useEffect(() => {
//     if (selectedFormId && selectedFloor && roomId && !showClientForm) {
//       loadFormData(selectedFormId);

//       const index = forms.findIndex(form => form._id === selectedFormId);
//       if (index !== -1) {
//         setCurrentStepIndex(index);
//       }
//     }
//   }, [selectedFormId, selectedFloor, roomId, showClientForm, forms]);

//   const createEmptyFormData = (formFields) => {
//     const emptyData = {};
//     formFields.forEach(field => {
//       if (field.type === 'checkbox' || field.type === 'checkbox-group') {
//         emptyData[field.id] = [];
//       } else if (field.type === 'radio') {
//         emptyData[field.id] = '';
//       } else {
//         emptyData[field.id] = '';
//       }
//     });
//     return emptyData;
//   };

//   // Client form handlers
//   const handleClientInputChange = (fieldId, value) => {
//     setClientData(prev => ({
//       ...prev,
//       [fieldId]: value
//     }));
//   };

//   const handleClientSubmit = async () => {
//     setIsSubmittingClient(true);
//     try {
//       const result = await apiService.submitClientData(clientData);
//       setMessage(result.message);
//       if (result.success) {
//         setClientSubmitted(true);
//         setShowClientForm(false);
//       }
//     } catch (error) {
//       setMessage('Failed to submit client information. Please try again.');
//       console.error('Error submitting client data:', error);
//     } finally {
//       setIsSubmittingClient(false);
//     }
//   };

//   const handleFloorSelect = (floor) => {
//     setSelectedFloor(floor);
//     setSelectedFormId('');
//     setSelectedForm(null);
//     setFormData({});
//     setRoomId('');
//     loadRoomsData();
//     setFloorModalVisible(false);
//   };

//   const handleRoomIdChange = (id) => {
//     setRoomId(id);
//     setSelectedFormId('');
//     setSelectedForm(null);
//     setFormData({});
//   };

//   const handleFormSelect = (formId) => {
//     setSelectedFormId(formId);
//     setFormModalVisible(false);
//   };

//   const handleInputChange = (fieldId, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldId]: value
//     }));
//   };

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

//   const handleSubmit = async (isFinalStep = false) => {
//     if (!selectedFormId || !selectedFloor || !roomId) return;

//     setIsLoading(true);
//     try {
//       // Save form data for this room
//       await apiService.saveRoomData(selectedFloor, roomId, selectedFormId, formData);

//       setMessage('Form data saved successfully!');

//       if (isFinalStep) {
//         const emptyFormData = createEmptyFormData(selectedForm.formFields);
//         setFormData(emptyFormData);

//         // Move to the next form if available
//         const nextIndex = currentStepIndex + 1;
//         if (nextIndex < forms.length) {
//           const nextFormId = forms[nextIndex]._id;
//           setSelectedFormId(nextFormId);
//           setCurrentStepIndex(nextIndex);
//         }
//       } else {
//         // Move to the next form
//         const nextIndex = currentStepIndex + 1;
//         if (nextIndex < forms.length) {
//           const nextFormId = forms[nextIndex]._id;
//           setSelectedFormId(nextFormId);
//           setCurrentStepIndex(nextIndex);
//         } else {
//           setMessage('All forms completed for this room!');
//         }
//       }

//       // Reload rooms data to reflect changes
//       loadRoomsData();
//     } catch (error) {
//       setMessage('Failed to save form. Please try again.');
//       console.error('Error saving form:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFinalSubmit = async () => {
//     if (!clientSubmitted) {
//       setMessage('Please complete client information first');
//       return;
//     }

//     setIsSubmittingFinal(true);
//     try {
//       // Get all room data for all floors
//       const allRoomData = {};

//       for (const floor of floorOptions) {
//         const floorData = await apiService.getAllRoomsForFloor(floor.value);
//         if (Object.keys(floorData).length > 0) {
//           allRoomData[floor.value] = floorData;
//         }
//       }

//       const result = await apiService.submitFinalData(clientData, allRoomData);
//       setMessage(result.message);

//       if (result.success) {
//         // Reset everything for a new survey
//         setShowClientForm(true);
//         setClientSubmitted(false);
//         setClientData(createEmptyFormData(clientDetailForm.formFields));
//         setSelectedFloor('');
//         setRoomId('');
//         setRooms({});
//         setSelectedFormId('');
//         setSelectedForm(null);
//         setFormData({});
//       }
//     } catch (error) {
//       setMessage('Failed to submit final data. Please try again.');
//       console.error('Error submitting final data:', error);
//     } finally {
//       setIsSubmittingFinal(false);
//     }
//   };

//   const editClientInfo = () => {
//     setShowClientForm(true);
//     setMessage('');
//   };

//   const handleViewForm = async (roomIdToView, formId) => {
//     const formData = await apiService.getRoomData(selectedFloor, roomIdToView, formId);
//     const form = forms.find(f => f._id === formId);
//     setViewFormData(formData);
//     setViewFormName(form ? form.formName : 'Unknown Form');
//     setViewModalVisible(true);
//   };

//   const handleEditForm = (roomIdToEdit, formId) => {
//     setRoomId(roomIdToEdit);
//     setSelectedFormId(formId);
//   };

//   const handleDeleteRoom = async (roomIdToDelete) => {
//     Alert.alert(
//       'Delete Room',
//       'Are you sure you want to delete this room?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Delete',
//           onPress: async () => {
//             await apiService.deleteRoomData(selectedFloor, roomIdToDelete);
//             loadRoomsData();
//             setMessage('Room deleted successfully');

//             // If we're currently editing this room, clear the form
//             if (roomId === roomIdToDelete) {
//               setRoomId('');
//               setSelectedFormId('');
//               setSelectedForm(null);
//               setFormData({});
//             }
//           },
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   const renderField = (field, isClientForm = false) => {
//     const { id, type, label, required, options } = field;
//     const value = isClientForm ? (clientData[id] || '') : (formData[id] || '');
//     const handleChange = isClientForm ? handleClientInputChange : handleInputChange;

//     switch (type) {
//       case 'text':
//       case 'email':
//       case 'number':
//       case 'date':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <TextInput
//               style={styles.textInput}
//               value={value}
//               onChangeText={(text) => handleChange(id, text)}
//               keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );

//       case 'textarea':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <TextInput
//               style={[styles.textInput, styles.textArea]}
//               value={value}
//               onChangeText={(text) => handleChange(id, text)}
//               multiline={true}
//               numberOfLines={4}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );

//       case 'select':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => handleChange(id, itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select an option" value="" />
//                 {options && options.map((option, index) => (
//                   <Picker.Item key={index} label={option} value={option} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         );

//       case 'checkbox':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <View style={styles.checkboxContainer}>
//               {options && options.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.checkboxOption}
//                   onPress={() => {
//                     const isChecked = Array.isArray(value) && value.includes(option);
//                     handleCheckboxChange(id, option, !isChecked);
//                   }}
//                 >
//                   <View style={[
//                     styles.checkbox,
//                     Array.isArray(value) && value.includes(option) && styles.checkboxChecked
//                   ]}>
//                     {Array.isArray(value) && value.includes(option) && (
//                       <Icon name="check" size={12} color="white" />
//                     )}
//                   </View>
//                   <Text style={styles.checkboxLabel}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         );

//       case 'radio':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <View style={styles.radioContainer}>
//               {options && options.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.radioOption}
//                   onPress={() => handleChange(id, option)}
//                 >
//                   <View style={styles.radio}>
//                     {value === option && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioLabel}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         );

//       case 'image':
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <TouchableOpacity style={styles.imageUploadButton}>
//               <Icon name="camera" size={20} color="#3b82f6" />
//               <Text style={styles.imageUploadText}>Upload Image</Text>
//             </TouchableOpacity>
//           </View>
//         );

//       default:
//         return (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {label}
//               {required && <Text style={styles.required}> *</Text>}
//             </Text>
//             <TextInput
//               style={styles.textInput}
//               value={value}
//               onChangeText={(text) => handleChange(id, text)}
//               placeholder={`Enter ${label}`}
//             />
//           </View>
//         );
//     }
//   };

//   const isLastStep = currentStepIndex === forms.length - 1;

//   // Client Information Form
//   if (showClientForm) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Icon name="user" size={24} color="#3b82f6" />
//             <Text style={styles.cardTitle}>Client Information</Text>
//           </View>

//           {/* Message display */}
//           {message ? (
//             <View style={[
//               styles.messageContainer,
//               message.includes('success') ? styles.successMessage : styles.infoMessage
//             ]}>
//               <Text style={styles.messageText}>{message}</Text>
//             </View>
//           ) : null}

//           <ScrollView style={styles.formContainer}>
//             {clientDetailForm.formFields.map(field => (
//               <View key={field.id}>
//                 {renderField(field, true)}
//               </View>
//             ))}

//             <TouchableOpacity
//               onPress={handleClientSubmit}
//               disabled={isSubmittingClient}
//               style={[styles.submitButton, isSubmittingClient && styles.disabledButton]}
//             >
//               {isSubmittingClient ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <View style={styles.buttonContent}>
//                   <Text style={styles.submitButtonText}>Save & Continue</Text>
//                   <Icon name="arrow-right" size={16} color="white" />
//                 </View>
//               )}
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     );
//   }

//   // Survey Forms
//   return (
//     <View style={styles.container}>
//       {/* View Form Modal */}
//       <ViewFormModal
//         isVisible={viewModalVisible}
//         onClose={() => setViewModalVisible(false)}
//         formData={viewFormData}
//         formName={viewFormName}
//       />

//       {/* Floor Selection Modal */}
//       <Modal
//         visible={floorModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFloorModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Floor</Text>
//               <TouchableOpacity onPress={() => setFloorModalVisible(false)} style={styles.closeButton}>
//                 <Icon name="times" size={20} color="#6b7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               {floorOptions.map(floor => (
//                 <TouchableOpacity
//                   key={floor.value}
//                   style={[
//                     styles.modalOption,
//                     selectedFloor === floor.value && styles.modalOptionSelected
//                   ]}
//                   onPress={() => handleFloorSelect(floor.value)}
//                 >
//                   <Text style={[
//                     styles.modalOptionText,
//                     selectedFloor === floor.value && styles.modalOptionTextSelected
//                   ]}>
//                     {floor.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Form Selection Modal */}
//       <Modal
//         visible={formModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFormModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Form Step</Text>
//               <TouchableOpacity onPress={() => setFormModalVisible(false)} style={styles.closeButton}>
//                 <Icon name="times" size={20} color="#6b7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               {forms.map(form => (
//                 <TouchableOpacity
//                   key={form._id}
//                   style={[
//                     styles.modalOption,
//                     selectedFormId === form._id && styles.modalOptionSelected
//                   ]}
//                   onPress={() => handleFormSelect(form._id)}
//                 >
//                   <Text style={[
//                     styles.modalOptionText,
//                     selectedFormId === form._id && styles.modalOptionTextSelected
//                   ]}>
//                     {form.formName}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Client Info Header */}
//       {clientSubmitted && (
//         <View style={styles.clientInfoCard}>
//           <View style={styles.clientInfoHeader}>
//             <View style={styles.clientInfo}>
//               <Icon name="user" size={16} color="#3b82f6" />
//               <Text style={styles.clientInfoText}>
//                 Client: <Text style={styles.clientInfoBold}>{clientData.clientName}</Text>
//                 <Text style={styles.clientInfoLight}> ({clientData.siteShortName})</Text>
//               </Text>
//             </View>
//             <View style={styles.clientActions}>
//               <TouchableOpacity onPress={editClientInfo} style={styles.clientActionButton}>
//                 <Icon name="edit" size={14} color="#3b82f6" />
//                 <Text style={styles.clientActionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleFinalSubmit}
//                 disabled={isSubmittingFinal}
//                 style={[styles.finalSubmitButton, isSubmittingFinal && styles.disabledButton]}
//               >
//                 {isSubmittingFinal ? (
//                   <ActivityIndicator color="white" size="small" />
//                 ) : (
//                   <View style={styles.buttonContent}>
//                     <Icon name="paper-plane" size={14} color="white" />
//                     <Text style={styles.finalSubmitText}>Final Submit</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Header Section with Selection Buttons */}
//       <View style={styles.selectionCard}>
//         <View style={styles.selectionRow}>
//           {/* Floor Selection */}
//           <View style={styles.selectionGroup}>
//             <Text style={styles.selectionLabel}>Select Floor</Text>
//             <TouchableOpacity
//               style={styles.selectionButton}
//               onPress={() => setFloorModalVisible(true)}
//               disabled={isLoading}
//             >
//               <Text style={styles.selectionButtonText}>
//                 {selectedFloor
//                   ? floorOptions.find(f => f.value === selectedFloor)?.label
//                   : "Select Floor"}
//               </Text>
//               <Icon name="chevron-down" size={16} color="#6b7280" />
//             </TouchableOpacity>
//           </View>

//           {/* Room ID Input */}
//           <View style={styles.selectionGroup}>
//             <Text style={styles.selectionLabel}>Room ID</Text>
//             <TextInput
//               style={styles.roomIdInput}
//               value={roomId}
//               onChangeText={handleRoomIdChange}
//               placeholder="Enter Room ID"
//               editable={!!selectedFloor && !isLoading}
//             />
//           </View>
//         </View>

//         {/* Form Selection */}
//         <View style={styles.selectionGroup}>
//           <Text style={styles.selectionLabel}>Select Form Step</Text>
//           <TouchableOpacity
//             style={styles.selectionButton}
//             onPress={() => setFormModalVisible(true)}
//             disabled={isLoading || !selectedFloor || !roomId}
//           >
//             <Text style={styles.selectionButtonText}>
//               {selectedFormId
//                 ? forms.find(f => f._id === selectedFormId)?.formName
//                 : "Select Form"}
//             </Text>
//             <Icon name="chevron-down" size={16} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Saved Rooms Section */}
//       {selectedFloor && Object.keys(rooms).length > 0 && (
//         <View style={styles.savedRoomsCard}>
//           <Text style={styles.sectionTitle}>
//             Saved Rooms for {floorOptions.find(f => f.value === selectedFloor)?.label}:
//           </Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {Object.entries(rooms).map(([roomId, roomData]) => (
//               <View key={roomId} style={styles.roomCard}>
//                 <View style={styles.roomCardHeader}>
//                   <Text style={styles.roomCardTitle}>Room: {roomId}</Text>
//                   <TouchableOpacity
//                     onPress={() => handleDeleteRoom(roomId)}
//                     style={styles.deleteButton}
//                   >
//                     <Icon name="trash" size={16} color="#ef4444" />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.roomForms}>
//                   {forms.map(form => (
//                     <View key={form._id} style={styles.roomFormItem}>
//                       <Text style={styles.roomFormName} numberOfLines={1}>
//                         {form.formName}
//                       </Text>
//                       <View style={styles.roomFormActions}>
//                         <TouchableOpacity
//                           onPress={() => handleViewForm(roomId, form._id)}
//                           style={styles.viewButton}
//                         >
//                           <Icon name="eye" size={14} color="#3b82f6" />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleEditForm(roomId, form._id)}
//                           style={styles.editButton}
//                         >
//                           <Icon name="edit" size={14} color="#10b981" />
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       )}

//       {/* Form Display Area */}
//       <View style={styles.formCard}>
//         {/* Loading indicator */}
//         {isLoading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#3b82f6" />
//             <Text style={styles.loadingText}>Loading...</Text>
//           </View>
//         )}

//         {/* Message display */}
//         {message ? (
//           <View style={[
//             styles.messageContainer,
//             message.includes('success') ? styles.successMessage : styles.infoMessage
//           ]}>
//             <Text style={styles.messageText}>{message}</Text>
//           </View>
//         ) : null}

//         {/* Form display */}
//         {selectedForm && !isLoading && (
//           <ScrollView>
//             <View style={styles.formHeader}>
//               <Text style={styles.formTitle}>
//                 {selectedForm.formName}
//               </Text>
//               <Text style={styles.formStep}>
//                 (Step {currentStepIndex + 1} of {forms.length})
//               </Text>
//             </View>

//             <View style={styles.formFields}>
//               {selectedForm.formFields.map(field => (
//                 <View key={field.id}>
//                   {renderField(field)}
//                 </View>
//               ))}
//             </View>

//             {/* Action buttons */}
//             <TouchableOpacity
//               onPress={() => handleSubmit(isLastStep)}
//               disabled={isLoading}
//               style={[styles.saveButton, isLoading && styles.disabledButton]}
//             >
//               <View style={styles.buttonContent}>
//                 <Text style={styles.saveButtonText}>
//                   {isLastStep ? 'Save Form' : 'Save & Next'}
//                 </Text>
//                 {isLastStep ? (
//                   <Icon name="check" size={16} color="white" />
//                 ) : (
//                   <Icon name="arrow-right" size={16} color="white" />
//                 )}
//               </View>
//             </TouchableOpacity>
//           </ScrollView>
//         )}

//         {/* Empty state */}
//         {!selectedForm && !isLoading && !message && (
//           <View style={styles.emptyState}>
//             <Icon name="file-text" size={48} color="#d1d5db" />
//             <Text style={styles.emptyStateText}>
//               {!selectedFloor
//                 ? "Please select a floor first"
//                 : !roomId
//                   ? "Please enter a Room ID"
//                   : "Please select a form step to begin"}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AuthContext } from '../../ContextApi/AuthContext';
import {
  ArrowRight,
  Check,
  Home,
  Edit,
  Trash2,
  Send,
  User,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

// Floor options array
const floorOptions = [
  { value: "basement-2", label: "Basement 2" },
  { value: "basement-1", label: "Basement 1" },
  { value: "ground", label: "Ground Floor" },
  { value: "floor-1", label: "Floor 1" },
  { value: "floor-2", label: "Floor 2" },
  { value: "floor-3", label: "Floor 3" },
  { value: "floor-4", label: "Floor 4" },
  { value: "floor-5", label: "Floor 5" },
  { value: "floor-6", label: "Floor 6" },
  { value: "floor-7", label: "Floor 7" },
  { value: "floor-8", label: "Floor 8" },
  { value: "floor-9", label: "Floor 9" },
  { value: "floor-10", label: "Floor 10" },
];

// Client detail form configuration
const clientDetailForm = {
  _id: "Client",
  formName: "Client Information",
  formFields: [
    {
      id: "clientName",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      id: "clientEmail",
      type: "email",
      label: "Email",
      required: true,
    },
    {
      id: "clientMobile",
      type: "number",
      label: "Mobile",
      required: true,
    },
    {
      id: "siteAddress",
      type: "textarea",
      label: "Address",
      required: false,
    },
    {
      id: "siteShortName",
      type: "text",
      label: "Site Short Name",
      required: true,
    },
  ],
};

// Custom hook for API service
const useApiService = (backendURL) => {
  const apiService = {
    // Client API functions
    submitClientData: async (clientData) => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${backendURL}/api/client/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(clientData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit client data");
        }

        const result = await response.json();

        // Store client data in AsyncStorage as backup
        await AsyncStorage.setItem("clientData", JSON.stringify(clientData));

        return {
          success: true,
          message: "Client information saved successfully!",
          clientId: result.clientId || `client-${Date.now()}`,
        };
      } catch (error) {
        console.error("Error submitting client data:", error);
        // Fallback to AsyncStorage if API fails
        await AsyncStorage.setItem("clientData", JSON.stringify(clientData));
        return {
          success: true,
          message: "Client information saved locally!",
          clientId: `client-${Date.now()}`,
        };
      }
    },

    getClientData: async () => {
      try {
        const data = await AsyncStorage.getItem("clientData");
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Error getting client data:", error);
        return null;
      }
    },

    // Form data management (using AsyncStorage for form responses)
    saveRoomData: async (floor, roomId, formId, formData) => {
      try {
        const key = `roomData_${floor}_${roomId}_${formId}`;
        await AsyncStorage.setItem(key, JSON.stringify(formData));
        return { success: true, formData };
      } catch (error) {
        console.error("Error saving room data:", error);
        return { success: false, error: error.message };
      }
    },

    getRoomData: async (floor, roomId, formId) => {
      try {
        const key = `roomData_${floor}_${roomId}_${formId}`;
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Error getting room data:", error);
        return null;
      }
    },

    getAllRoomsForFloor: async (floor) => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const roomKeys = allKeys.filter((key) =>
          key.startsWith(`roomData_${floor}_`)
        );
        const rooms = {};

        for (const key of roomKeys) {
          const data = await AsyncStorage.getItem(key);
          const parts = key.split("_");
          const roomId = parts[2];
          const formId = parts[3];

          if (!rooms[roomId]) {
            rooms[roomId] = {};
          }

          rooms[roomId][formId] = JSON.parse(data);
        }

        return rooms;
      } catch (error) {
        console.error("Error getting all rooms for floor:", error);
        return {};
      }
    },

    deleteRoomData: async (floor, roomId) => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToDelete = allKeys.filter((key) =>
          key.startsWith(`roomData_${floor}_${roomId}_`)
        );

        for (const key of keysToDelete) {
          await AsyncStorage.removeItem(key);
        }

        return { success: true };
      } catch (error) {
        console.error("Error deleting room data:", error);
        return { success: false, error: error.message };
      }
    },

    // Final submission to backend
    submitFinalData: async (clientData, allRoomData) => {
      try {
        const token = await AsyncStorage.getItem("token");
        const submissionData = {
          clientDetails: clientData,
          ...allRoomData,
        };

        const response = await fetch(`${backendURL}/api/submit/final`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit final data");
        }

        const result = await response.json();

        // Clear all data after successful submission
        await AsyncStorage.removeItem("clientData");
        const allKeys = await AsyncStorage.getAllKeys();
        const roomKeys = allKeys.filter((key) => key.startsWith("roomData_"));

        for (const key of roomKeys) {
          await AsyncStorage.removeItem(key);
        }

        return {
          success: true,
          message: "Survey data submitted successfully!",
          submissionId: result.submissionId || `sub-${Date.now()}`,
        };
      } catch (error) {
        console.error("Error submitting final data:", error);
        return {
          success: false,
          message: "Failed to submit survey data. Please try again.",
          error: error.message,
        };
      }
    },

    // Fetch forms from database
    fetchUserForms: async () => {
      try {
        // Get email from AsyncStorage
        const email = await AsyncStorage.getItem("email");
        const token = await AsyncStorage.getItem("token");

        if (!email) {
          throw new Error("User email not found in AsyncStorage");
        }

        const response = await fetch(
          `${backendURL}/api/get/form?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch forms from server");
        }

        const result = await response.json();
        const forms = result.data || result;

        // Transform the data to match expected format if needed
        const transformedForms = forms.map((form) => ({
          _id: form._id,
          formName: form.formName,
          formFields: form.formFields.map((field) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required || false,
            options: field.options || [],
          })),
        }));

        return transformedForms;
      } catch (error) {
        console.error("Error fetching forms:", error);

        // Fallback to mock data if API fails
        return [
          {
            _id: "step1",
            formName: "Step 1: General Room Information",
            formFields: [
              {
                id: "roomType",
                type: "select",
                label: "Room Name/Type",
                required: true,
                options: [
                  "Living Room",
                  "Bedroom",
                  "Kitchen",
                  "Bathroom",
                  "Dining",
                  "Office",
                  "Kids Room",
                  "Utility",
                  "Balcony",
                  "Other",
                ],
              },
              {
                id: "floorLocation",
                type: "text",
                label: "Floor/Location",
                required: true,
              },
              {
                id: "purpose",
                type: "text",
                label: "Purpose/Usage",
                required: true,
              },
              {
                id: "roomPhoto",
                type: "image",
                label: "Room Photo (Entry View)",
                required: false,
              },
            ],
          },
          {
            _id: "step2",
            formName: "Step 2: Dimensions & Structure",
            formFields: [
              {
                id: "length",
                type: "number",
                label: "Length (in meters)",
                required: true,
              },
              {
                id: "width",
                type: "number",
                label: "Width (in meters)",
                required: true,
              },
              {
                id: "height",
                type: "number",
                label: "Height (in meters)",
                required: true,
              },
              {
                id: "floorLevelDiff",
                type: "number",
                label: "Floor Level Difference (optional)",
                required: false,
              },
              {
                id: "beamsPillars",
                type: "text",
                label: "Beams/Pillars Location",
                required: false,
              },
              {
                id: "beamsPillarsPhoto",
                type: "image",
                label: "Beams/Pillars Photo",
                required: false,
              },
            ],
          },
        ];
      }
    },

    fetchFormById: async (formId) => {
      try {
        const userForms = await apiService.fetchUserForms();
        return userForms.find((form) => form._id === formId) || null;
      } catch (error) {
        console.error("Error fetching form by ID:", error);
        return null;
      }
    },
  };

  return apiService;
};

// Modal Component for Viewing Form Data
const ViewFormModal = ({ isVisible, onClose, formData, formName }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
        <View
          className="bg-white rounded-lg w-full max-w-md"
          style={{ maxHeight: height * 0.8 }}
        >
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              {formName}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            {formData && Object.keys(formData).length > 0 ? (
              <View className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <View key={key} className="border-b border-gray-100 pb-2">
                    <Text className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : value.toString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4">
                No data available for this form.
              </Text>
            )}
          </ScrollView>

          <View className="flex-row justify-end p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              <Text className="text-gray-800">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Custom Picker Component for better mobile experience
const CustomPicker = ({
  items,
  selectedValue,
  onValueChange,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        className={`flex-row justify-between items-center px-4 py-3 border border-gray-300 rounded-lg ${disabled ? "bg-gray-100" : "bg-white"}`}
        disabled={disabled}
      >
        <Text className={selectedValue ? "text-gray-800" : "text-gray-500"}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        {disabled ? null : isOpen ? (
          <ChevronUp size={20} color="#6b7280" />
        ) : (
          <ChevronDown size={20} color="#6b7280" />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View
            className="bg-white rounded-lg w-full max-w-md"
            style={{ maxHeight: height * 0.6 }}
          >
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">
                Select {placeholder}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text
                    className={
                      selectedValue === item.value
                        ? "text-blue-600 font-medium"
                        : "text-gray-800"
                    }
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SurveyForm = () => {
  const backendURL = "http://192.168.31.95:3000";
  const apiService = useApiService(backendURL);

  // State for client form
  const [showClientForm, setShowClientForm] = useState(true);
  const [clientData, setClientData] = useState({});
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [clientSubmitted, setClientSubmitted] = useState(false);

  // State for survey forms
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState({});
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState(null);
  const [viewFormName, setViewFormName] = useState("");
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showFormStepModal, setShowFormStepModal] = useState(false);
  const [showSavedRooms, setShowSavedRooms] = useState(false);

  const scrollViewRef = useRef(null);

  const scrollToInput = (reactNode) => {
    scrollViewRef.current?.scrollToFocusedInput(reactNode);
  };
  // Check if client data exists on component mount
  useEffect(() => {
    const checkClientData = async () => {
      const existingClientData = await apiService.getClientData();
      if (existingClientData) {
        setClientData(existingClientData);
        setClientSubmitted(true);
        setShowClientForm(false);
      } else {
        // Initialize empty client data
        const emptyClientData = {};
        clientDetailForm.formFields.forEach((field) => {
          emptyClientData[field.id] = "";
        });
        setClientData(emptyClientData);
      }
    };

    checkClientData();
  }, []);

  // Load forms when client form is completed
  useEffect(() => {
    if (!showClientForm) {
      const fetchUserForms = async () => {
        setIsLoading(true);
        try {
          const userForms = await apiService.fetchUserForms();
          setForms(userForms);
          setMessage("");
        } catch (error) {
          setMessage("Failed to load forms. Please try again.");
          console.error("Error fetching forms:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserForms();
    }
  }, [showClientForm]);

  // Load rooms data when floor is selected
  const loadRoomsData = useCallback(async () => {
    if (selectedFloor) {
      const roomsData = await apiService.getAllRoomsForFloor(selectedFloor);
      setRooms(roomsData);
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (selectedFloor && !showClientForm) {
      loadRoomsData();

      if (!selectedFormId && forms.length > 0) {
        const firstFormId = forms[0]._id;
        setSelectedFormId(firstFormId);
      }
    }
  }, [selectedFloor, forms, showClientForm, selectedFormId]);

  // Load form data when form is selected
  const loadFormData = useCallback(
    async (formId) => {
      if (!formId || !selectedFloor || !roomId) {
        setSelectedForm(null);
        return;
      }

      setIsLoading(true);
      try {
        const form = await apiService.fetchFormById(formId);
        setSelectedForm(form);

        const existingData = await apiService.getRoomData(
          selectedFloor,
          roomId,
          formId
        );
        if (existingData) {
          setFormData(existingData);
        } else {
          setFormData(createEmptyFormData(form.formFields));
        }

        setMessage("");
      } catch (error) {
        setMessage("Failed to load form. Please try again.");
        console.error("Error fetching form:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFloor, roomId]
  );

  useEffect(() => {
    if (selectedFormId && selectedFloor && roomId && !showClientForm) {
      loadFormData(selectedFormId);

      const index = forms.findIndex((form) => form._id === selectedFormId);
      if (index !== -1) {
        setCurrentStepIndex(index);
      }
    }
  }, [selectedFormId, selectedFloor, roomId, showClientForm, forms]);

  const createEmptyFormData = (formFields) => {
    const emptyData = {};
    formFields.forEach((field) => {
      if (field.type === "checkbox" || field.type === "checkbox-group") {
        emptyData[field.id] = [];
      } else if (field.type === "radio") {
        emptyData[field.id] = "";
      } else {
        emptyData[field.id] = "";
      }
    });
    return emptyData;
  };

  // Client form handlers
  const handleClientInputChange = (fieldId, value) => {
    setClientData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleClientSubmit = async () => {
    setIsSubmittingClient(true);
    try {
      const result = await apiService.submitClientData(clientData);
      setMessage(result.message);
      if (result.success) {
        setClientSubmitted(true);
        setShowClientForm(false);
      }
    } catch (error) {
      setMessage("Failed to submit client information. Please try again.");
      console.error("Error submitting client data:", error);
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setSelectedFormId("");
    setSelectedForm(null);
    setFormData({});
    setRoomId("");
    loadRoomsData();
    setShowFloorModal(false);
  };

  const handleRoomIdChange = (id) => {
    setRoomId(id);
    setSelectedFormId("");
    setSelectedForm(null);
    setFormData({});
  };

  const handleFormSelect = (formId) => {
    setSelectedFormId(formId);
    setShowFormStepModal(false);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldId] || [];
      if (isChecked) {
        return {
          ...prev,
          [fieldId]: [...currentValues, optionValue],
        };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter((item) => item !== optionValue),
        };
      }
    });
  };

  const handleSubmit = async (isFinalStep = false) => {
    if (!selectedFormId || !selectedFloor || !roomId) return;

    setIsLoading(true);
    try {
      // Save form data for this room
      await apiService.saveRoomData(
        selectedFloor,
        roomId,
        selectedFormId,
        formData
      );

      setMessage("Form data saved successfully!");

      if (isFinalStep) {
        const emptyFormData = createEmptyFormData(selectedForm.formFields);
        setFormData(emptyFormData);

        // Move to the next form if available
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < forms.length) {
          const nextFormId = forms[nextIndex]._id;
          setSelectedFormId(nextFormId);
          setCurrentStepIndex(nextIndex);
        }
      } else {
        // Move to the next form
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < forms.length) {
          const nextFormId = forms[nextIndex]._id;
          setSelectedFormId(nextFormId);
          setCurrentStepIndex(nextIndex);
        } else {
          setMessage("All forms completed for this room!");
        }
      }

      // Reload rooms data to reflect changes
      loadRoomsData();
    } catch (error) {
      setMessage("Failed to save form. Please try again.");
      console.error("Error saving form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!clientSubmitted) {
      setMessage("Please complete client information first");
      return;
    }

    setIsSubmittingFinal(true);
    try {
      // Get all room data for all floors
      const allRoomData = {};

      for (const floor of floorOptions) {
        const floorData = await apiService.getAllRoomsForFloor(floor.value);
        if (Object.keys(floorData).length > 0) {
          allRoomData[floor.value] = floorData;
        }
      }

      const result = await apiService.submitFinalData(clientData, allRoomData);
      setMessage(result.message);

      if (result.success) {
        // Reset everything for a new survey
        setShowClientForm(true);
        setClientSubmitted(false);
        setClientData(createEmptyFormData(clientDetailForm.formFields));
        setSelectedFloor("");
        setRoomId("");
        setRooms({});
        setSelectedFormId("");
        setSelectedForm(null);
        setFormData({});
      }
    } catch (error) {
      setMessage("Failed to submit final data. Please try again.");
      console.error("Error submitting final data:", error);
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  const editClientInfo = () => {
    setShowClientForm(true);
    setMessage("");
  };

  const handleViewForm = async (roomIdToView, formId) => {
    const formData = await apiService.getRoomData(
      selectedFloor,
      roomIdToView,
      formId
    );
    const form = forms.find((f) => f._id === formId);
    setViewFormData(formData);
    setViewFormName(form ? form.formName : "Unknown Form");
    setViewModalOpen(true);
  };

  const handleEditForm = (roomIdToEdit, formId) => {
    setRoomId(roomIdToEdit);
    setSelectedFormId(formId);
  };

  const handleDeleteRoom = async (roomIdToDelete) => {
    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await apiService.deleteRoomData(selectedFloor, roomIdToDelete);
          loadRoomsData();
          setMessage("Room deleted successfully");

          // If we're currently editing this room, clear the form
          if (roomId === roomIdToDelete) {
            setRoomId("");
            setSelectedFormId("");
            setSelectedForm(null);
            setFormData({});
          }
        },
      },
    ]);
  };

  const renderField = (field, isClientForm = false) => {
    const { id, type, label, required, options } = field;
    const value = isClientForm ? clientData[id] || "" : formData[id] || "";
    const handleChange = isClientForm
      ? handleClientInputChange
      : handleInputChange;

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              keyboardType={type === "number" ? "numeric" : "default"}
              value={value}
              onChangeText={(text) => handleChange(id, text)}
              className="border border-gray-300 rounded-lg p-3 text-gray-800"
              placeholder={`Enter ${label}`}
              onFocus={(e) => {
                scrollToInput(e.target);
              }}
            />
          </View>
        );

      case "textarea":
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={(text) => handleChange(id, text)}
              className="border border-gray-300 rounded-lg p-3 text-gray-800"
              placeholder={`Enter ${label}`}
            />
          </View>
        );

      case "select":
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <CustomPicker
              items={
                options
                  ? options.map((opt) => ({ value: opt, label: opt }))
                  : []
              }
              selectedValue={value}
              onValueChange={(val) => handleChange(id, val)}
              placeholder={`Select ${label}`}
            />
          </View>
        );

      case "checkbox":
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View className="space-y-2">
              {options &&
                options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const isChecked =
                        Array.isArray(value) && value.includes(option);
                      handleCheckboxChange(id, option, !isChecked);
                    }}
                    className="flex-row items-center"
                  >
                    <View
                      className={`w-5 h-5 border border-gray-300 rounded mr-2 justify-center items-center ${Array.isArray(value) && value.includes(option) ? "bg-blue-500 border-blue-500" : "bg-white"}`}
                    >
                      {Array.isArray(value) && value.includes(option) && (
                        <Check size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700">{option}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        );

      case "radio":
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View className="space-y-2">
              {options &&
                options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChange(id, option)}
                    className="flex-row items-center"
                  >
                    <View className="w-5 h-5 border border-gray-300 rounded-full mr-2 justify-center items-center">
                      {value === option && (
                        <View className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </View>
                    <Text className="text-gray-700">{option}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        );

      default:
        return (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              value={value}
              onChangeText={(text) => handleChange(id, text)}
              className="border border-gray-300 rounded-lg p-3 text-gray-800"
              placeholder={`Enter ${label}`}
            />
          </View>
        );
    }
  };

  const isLastStep = currentStepIndex === forms.length - 1;

  // Client Information Form
  if (showClientForm) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="p-4">
            <View className="bg-white rounded-lg p-4 shadow-md">
              <View className="flex-row items-center mb-6">
                <User size={24} color="#2563eb" className="mr-3" />
                <Text className="text-xl font-bold text-gray-800">
                  Client Information
                </Text>
              </View>

              {/* Message display */}
              {message && (
                <View
                  className={`p-3 rounded-md mb-4 ${message.includes("success") ? "bg-green-100" : "bg-blue-100"}`}
                >
                  <Text
                    className={
                      message.includes("success")
                        ? "text-green-800 text-center"
                        : "text-blue-800 text-center"
                    }
                  >
                    {message}
                  </Text>
                </View>
              )}

              <View className="space-y-4">
                {clientDetailForm.formFields.map((field) => (
                  <View key={field.id}>{renderField(field, true)}</View>
                ))}

                <TouchableOpacity
                  onPress={handleClientSubmit}
                  disabled={isSubmittingClient}
                  className="bg-[#0d2b55] p-3 rounded-lg flex-row justify-center items-center mt-4 disabled:opacity-50"
                >
                  {isSubmittingClient ? (
                    <>
                      <ActivityIndicator color="white" className="mr-2" />
                      <Text className="text-white font-medium">
                        Submitting...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-white font-medium mr-2">
                        Save & Continue
                      </Text>
                      <ArrowRight size={16} color="white" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Survey Forms
  return (
    <SafeAreaView className="flex-1 bg-gray-100 ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* View Form Modal */}
        <ViewFormModal
          isVisible={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          formData={viewFormData}
          formName={viewFormName}
        />

        {/* Floor Selection Modal */}
        <Modal
          visible={showFloorModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowFloorModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
            <View
              className="bg-white rounded-lg w-full max-w-md"
              style={{ maxHeight: height * 0.6 }}
            >
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-lg font-semibold">Select Floor</Text>
                <TouchableOpacity onPress={() => setShowFloorModal(false)}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {floorOptions.map((floor) => (
                  <TouchableOpacity
                    key={floor.value}
                    onPress={() => handleFloorSelect(floor.value)}
                    className="px-4 py-3 border-b border-gray-100"
                  >
                    <Text
                      className={
                        selectedFloor === floor.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-800"
                      }
                    >
                      {floor.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Form Step Selection Modal */}
        <Modal
          visible={showFormStepModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowFormStepModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
            <View
              className="bg-white rounded-lg w-full max-w-md"
              style={{ maxHeight: height * 0.6 }}
            >
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-lg font-semibold">Select Form Step</Text>
                <TouchableOpacity onPress={() => setShowFormStepModal(false)}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {forms.map((form) => (
                  <TouchableOpacity
                    key={form._id}
                    onPress={() => handleFormSelect(form._id)}
                    className="px-4 py-3 border-b border-gray-100"
                  >
                    <Text
                      className={
                        selectedFormId === form._id
                          ? "text-blue-600 font-medium"
                          : "text-gray-800"
                      }
                    >
                      {form.formName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <ScrollView className="p-4">
          {/* Client Info Header */}
          {clientSubmitted && (
            <View className="bg-blue-50 rounded-lg p-4 mb-4 shadow-md">
              <View className="flex-row justify-between items-center">
                <View className="flex-col">
                  <View className="flex-row items-center">
                    <User size={16} color="#2563eb" className="mr-2" />
                    <Text className="text-sm font-medium text-gray-700">
                      Client:{" "}
                      <Text className="font-semibold text-gray-900">
                        {clientData.clientName}
                      </Text>
                    </Text>
                  </View>

                  <Text className="text-sm text-gray-600">
                    ({clientData.siteShortName})
                  </Text>
                </View>

                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={editClientInfo}
                    className="flex-row items-center mr-3"
                  >
                    <Edit size={14} color="#2563eb" className="mr-1" />
                    <Text className="text-blue-600 text-sm">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    disabled={isSubmittingFinal}
                    className="bg-green-600 px-3 py-1 rounded-md flex-row items-center disabled:opacity-50"
                  >
                    {isSubmittingFinal ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Send size={14} color="white" className="mr-1" />
                        <Text className="text-white text-sm">Final Submit</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Header Section with Selection */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <View className="space-y-3">
              {/* Floor Selection */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Select Floor
                </Text>
                <TouchableOpacity
                  onPress={() => setShowFloorModal(true)}
                  className="flex-row justify-between items-center px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <Text
                    className={
                      selectedFloor ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {selectedFloor
                      ? floorOptions.find((f) => f.value === selectedFloor)
                          ?.label
                      : "Select the Floor"}
                  </Text>
                  <ChevronDown size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Room ID Input */}
              {selectedFloor && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Room ID
                  </Text>
                  <TextInput
                    value={roomId}
                    onChangeText={handleRoomIdChange}
                    placeholder="Enter Room ID"
                    className="border border-gray-300 rounded-lg p-3 text-gray-800"
                  />
                </View>
              )}

              {/* Form Selection */}
              {selectedFloor && roomId && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Select Form Step
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowFormStepModal(true)}
                    className="flex-row justify-between items-center px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <Text
                      className={
                        selectedFormId ? "text-gray-800" : "text-gray-500"
                      }
                    >
                      {selectedFormId
                        ? forms.find((f) => f._id === selectedFormId)?.formName
                        : "Select a Form"}
                    </Text>
                    <ChevronDown size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Saved Rooms Section with Toggle */}
          {selectedFloor && Object.keys(rooms).length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <TouchableOpacity
                onPress={() => setShowSavedRooms(!showSavedRooms)}
                className="flex-row justify-between items-center mb-3"
              >
                <Text className="text-lg font-semibold text-gray-800 ">
                  Saved Rooms for{" "}
                  {floorOptions.find((f) => f.value === selectedFloor)?.label}
                  {!showSavedRooms && ` (${Object.keys(rooms).length})`}
                </Text>
                {showSavedRooms ? (
                  <ChevronUp size={20} color="#6b7280" />
                ) : (
                  <ChevronDown size={20} color="#6b7280" />
                )}
              </TouchableOpacity>

              {showSavedRooms && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  className="max-h-64"
                >
                  {Object.entries(rooms).map(([roomId, roomData]) => (
                    <View
                      key={roomId}
                      className="border border-gray-200 rounded-lg p-3 m-1 bg-gray-50 min-w-[280px]"
                    >
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-medium text-gray-800">
                          Room: {roomId}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteRoom(roomId)}
                          className="p-1"
                        >
                          <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      <View className="space-y-2">
                        {forms.map((form) => (
                          <View
                            key={form._id}
                            className="flex-row justify-between items-center"
                          >
                            <Text
                              className="text-gray-600 text-sm"
                              numberOfLines={1}
                            >
                              {form.formName}
                            </Text>
                            <View className="flex-row space-x-2">
                              <TouchableOpacity
                                onPress={() => handleViewForm(roomId, form._id)}
                                className="p-1"
                              >
                                <Eye size={16} color="#3b82f6" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleEditForm(roomId, form._id)}
                                className="p-1"
                              >
                                <Edit size={16} color="#10b981" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Form Display Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            style={{ flex: 1 }}
            className="bg-white rounded-lg p-4 shadow-md"
          >
            <ScrollView
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
              // showsVerticalScrollIndicator={false}
              // contentContainerStyle={{ flexGrow: 1 }}
              contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for keyboard
              automaticallyAdjustContentInsets={true}
            >
              {/* Loading indicator */}
              {isLoading && (
                <View className="flex-row justify-center items-center my-4">
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text className="text-gray-600 ml-2">Loading...</Text>
                </View>
              )}

              {/* Message display */}
              {message && (
                <View
                  className={`p-3 rounded-md mb-4 ${message.includes("success") ? "bg-green-100" : "bg-blue-100"}`}
                >
                  <Text
                    className={
                      message.includes("success")
                        ? "text-green-800 text-center"
                        : "text-blue-800 text-center"
                    }
                  >
                    {message}
                  </Text>
                </View>
              )}

              {/* Form display */}
              {selectedForm && !isLoading && (
                <View>
                  <Text className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedForm.formName}
                    <Text className="text-sm text-gray-500 ml-2">
                      (Step {currentStepIndex + 1} of {forms.length})
                    </Text>
                  </Text>

                  <View className="space-y-4">
                    {selectedForm.formFields.map((field) => (
                      <View key={field.id}>{renderField(field)}</View>
                    ))}
                  </View>

                  {/* Action buttons */}
                  <TouchableOpacity
                    onPress={() => handleSubmit(isLastStep)}
                    disabled={isLoading}
                    className="bg-green-600 p-3 rounded-lg flex-row justify-center items-center mt-6 disabled:opacity-50 mb-3"
                  >
                    <Text className="text-white font-medium mr-2">
                      {isLastStep ? "Save Form" : "Save & Next"}
                    </Text>
                    {isLastStep ? (
                      <Check size={16} color="white" />
                    ) : (
                      <ArrowRight size={16} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Empty state */}
              {!selectedForm && !isLoading && !message && (
                <View className="py-8 items-center">
                  <Text className="text-gray-500 text-center">
                    {!selectedFloor
                      ? "Please select a floor first"
                      : !roomId
                        ? "Please enter a Room ID"
                        : "Please select a form step to begin"}
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SurveyForm;
