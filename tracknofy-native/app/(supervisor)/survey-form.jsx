

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../contexts/AuthContext';

// Configuration
const baseUrl = 'http://localhost:3000';
// const { backendURL } = useAuth()
const backendURL = "http://192.168.1.7:3000";
// Create the floor options array
const floorOptions = [
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
  { value: 'floor-10', label: 'Floor 10' }
];

const clientDetailForm = {
  _id: 'Client',
  formName: 'Client Information',
  formFields: [
    {
      id: 'clientName',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      id: 'clientEmail',
      type: 'email',
      label: 'Email',
      required: true
    },
    {
      id: 'clientMobile',
      type: 'number',
      label: 'Mobile',
      required: true
    },
    {
      id: 'siteAddress',
      type: 'textarea',
      label: 'Address',
      required: false
    },
    {
      id: 'siteShortName',
      type: 'text',
      label: 'Site Short Name',
      required: true
    },
  ]
};

// API service functions
const useApiService = (backendURL) => {
  // Client API functions
  const submitClientData = async (clientData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${backendURL}/api/client/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(clientData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit client data');
      }
      
      const result = await response.json();
      
      // Store client data in AsyncStorage as backup
      await AsyncStorage.setItem('clientData', JSON.stringify(clientData));
      
      return { 
        success: true, 
        message: 'Client information saved successfully!',
        clientId: result.clientId || `client-${Date.now()}`
      };
    } catch (error) {
      console.error('Error submitting client data:', error);
      // Fallback to AsyncStorage if API fails
      await AsyncStorage.setItem('clientData', JSON.stringify(clientData));
      return { 
        success: true, 
        message: 'Client information saved locally!',
        clientId: `client-${Date.now()}`
      };
    }
  };

  const getClientData = async () => {
    try {
      const data = await AsyncStorage.getItem('clientData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting client data:', error);
      return null;
    }
  };

  // Form data management (using AsyncStorage for form responses)
  const saveRoomData = async (floor, roomId, formId, formData) => {
    try {
      const key = `roomData_${floor}_${roomId}_${formId}`;
      await AsyncStorage.setItem(key, JSON.stringify(formData));
      return { success: true, formData };
    } catch (error) {
      console.error('Error saving room data:', error);
      return { success: false, error: error.message };
    }
  };

  const getRoomData = async (floor, roomId, formId) => {
    try {
      const key = `roomData_${floor}_${roomId}_${formId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting room data:', error);
      return null;
    }
  };

  const getAllRoomsForFloor = async (floor) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const roomKeys = allKeys.filter(key => key.startsWith(`roomData_${floor}_`));
      
      const rooms = {};
      for (const key of roomKeys) {
        const data = await AsyncStorage.getItem(key);
        const parts = key.split('_');
        const roomId = parts[2];
        const formId = parts[3];
        
        if (!rooms[roomId]) {
          rooms[roomId] = {};
        }
        
        rooms[roomId][formId] = JSON.parse(data);
      }
      return rooms;
    } catch (error) {
      console.error('Error getting all rooms:', error);
      return {};
    }
  };

  const deleteRoomData = async (floor, roomId) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToDelete = allKeys.filter(key => key.startsWith(`roomData_${floor}_${roomId}_`));
      
      for (const key of keysToDelete) {
        await AsyncStorage.removeItem(key);
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting room data:', error);
      return { success: false, error: error.message };
    }
  };

  // Final submission to backend
  const submitFinalData = async (clientData, allRoomData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const submissionData = {
        clientDetails: clientData,
        ...allRoomData
      };
      
      const response = await fetch(`${backendURL}/api/submit/final`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit final data');
      }
      
      const result = await response.json();
      
      // Clear all data after successful submission
      await AsyncStorage.removeItem('clientData');
      const allKeys = await AsyncStorage.getAllKeys();
      const roomKeys = allKeys.filter(key => key.startsWith('roomData_'));
      
      for (const key of roomKeys) {
        await AsyncStorage.removeItem(key);
      }
      
      return { 
        success: true, 
        message: 'Survey data submitted successfully!',
        submissionId: result.submissionId || `sub-${Date.now()}`
      };
    } catch (error) {
      console.error('Error submitting final data:', error);
      return { 
        success: false, 
        message: 'Failed to submit survey data. Please try again.',
        error: error.message
      };
    }
  };

  // Fetch forms from database
  const fetchUserForms = async () => {
    try {
      // Get email from AsyncStorage
      const email = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      
      if (!email) {
        throw new Error('User email not found in AsyncStorage');
      }

      const response = await fetch(`${backendURL}/api/get/form?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "token": token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forms from server');
      }

      const forms = await response.json();
      console.log(forms);
      
      // Transform the data to match expected format if needed
      const transformedForms = forms.data.map(form => ({
        _id: form._id,
        formName: form.formName,
        formFields: form.formFields.map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required || false,
          options: field.options || []
        }))
      }));

      return transformedForms;
    } catch (error) {
      console.error('Error fetching forms:', error);
      
      // Fallback to mock data if API fails
      return [
        {
          _id: 'step1',
          formName: 'Step 1: General Room Information',
          formFields: [
            {
              id: 'roomType',
              type: 'select',
              label: 'Room Name/Type',
              required: true,
              options: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Office', 'Kids Room', 'Utility', 'Balcony', 'Other']
            },
            {
              id: 'floorLocation',
              type: 'text',
              label: 'Floor/Location',
              required: true
            },
            {
              id: 'purpose',
              type: 'text',
              label: 'Purpose/Usage',
              required: true
            },
            {
              id: 'roomPhoto',
              type: 'image',
              label: 'Room Photo (Entry View)',
              required: false
            }
          ]
        },
        {
          _id: 'step2',
          formName: 'Step 2: Dimensions & Structure',
          formFields: [
            {
              id: 'length',
              type: 'number',
              label: 'Length (in meters)',
              required: true
            },
            {
              id: 'width',
              type: 'number',
              label: 'Width (in meters)',
              required: true
            },
            {
              id: 'height',
              type: 'number',
              label: 'Height (in meters)',
              required: true
            },
            {
              id: 'floorLevelDiff',
              type: 'number',
              label: 'Floor Level Difference (optional)',
              required: false
            },
            {
              id: 'beamsPillars',
              type: 'text',
              label: 'Beams/Pillars Location',
              required: false
            },
            {
              id: 'beamsPillarsPhoto',
              type: 'image',
              label: 'Beams/Pillars Photo',
              required: false
            }
          ]
        }
      ];
    }
  };

  const fetchFormById = async (formId) => {
    try {
      const userForms = await fetchUserForms();
      return userForms.find(form => form._id === formId) || null;
    } catch (error) {
      console.error('Error fetching form by ID:', error);
      return null;
    }
  };

  return {
    submitClientData,
    getClientData,
    saveRoomData,
    getRoomData,
    getAllRoomsForFloor,
    deleteRoomData,
    submitFinalData,
    fetchUserForms,
    fetchFormById
  };
};

// Modal Component for Viewing Form Data
const ViewFormModal = ({ isVisible, onClose, formData, formName }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{formName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {formData && Object.keys(formData).length > 0 ? (
              <View style={styles.formDataContainer}>
                {Object.entries(formData).map(([key, value]) => (
                  <View key={key} style={styles.formDataItem}>
                    <Text style={styles.formDataLabel}>
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                    </Text>
                    <Text style={styles.formDataValue}>
                      {Array.isArray(value) ? value.join(', ') : value.toString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No data available for this form.</Text>
            )}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Survey Form Component
const SurveyForm = () => {
  // const { backendURL } = useContext(AuthContext);
  const backendURL = "http://192.168.1.7:3000";
  const apiService = useApiService(backendURL);

  // State for client form
  const [showClientForm, setShowClientForm] = useState(true);
  const [clientData, setClientData] = useState({});
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [clientSubmitted, setClientSubmitted] = useState(false);

  // State for survey forms
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState({});
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewFormData, setViewFormData] = useState(null);
  const [viewFormName, setViewFormName] = useState('');
  const [floorModalVisible, setFloorModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);

  // Check if client data exists on component mount
  useEffect(() => {
    const loadClientData = async () => {
      const existingClientData = await apiService.getClientData();
      if (existingClientData) {
        setClientData(existingClientData);
        setClientSubmitted(true);
        setShowClientForm(false);
      } else {
        // Initialize empty client data
        const emptyClientData = {};
        clientDetailForm.formFields.forEach(field => {
          emptyClientData[field.id] = '';
        });
        setClientData(emptyClientData);
      }
    };
    
    loadClientData();
  }, []);

  // Load forms when client form is completed
  useEffect(() => {
    if (!showClientForm) {
      const fetchUserForms = async () => {
        setIsLoading(true);
        try {
          const userForms = await apiService.fetchUserForms();
          setForms(userForms);
          setMessage('');
        } catch (error) {
          setMessage('Failed to load forms. Please try again.');
          console.error('Error fetching forms:', error);
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
  const loadFormData = useCallback(async (formId) => {
    if (!formId || !selectedFloor || !roomId) {
      setSelectedForm(null);
      return;
    }

    setIsLoading(true);
    try {
      const form = await apiService.fetchFormById(formId);
      setSelectedForm(form);
      
      const existingData = await apiService.getRoomData(selectedFloor, roomId, formId);
      if (existingData) {
        setFormData(existingData);
      } else {
        setFormData(createEmptyFormData(form.formFields));
      }
      
      setMessage('');
    } catch (error) {
      setMessage('Failed to load form. Please try again.');
      console.error('Error fetching form:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFloor, roomId]);

  useEffect(() => {
    if (selectedFormId && selectedFloor && roomId && !showClientForm) {
      loadFormData(selectedFormId);
      
      const index = forms.findIndex(form => form._id === selectedFormId);
      if (index !== -1) {
        setCurrentStepIndex(index);
      }
    }
  }, [selectedFormId, selectedFloor, roomId, showClientForm, forms]);

  const createEmptyFormData = (formFields) => {
    const emptyData = {};
    formFields.forEach(field => {
      if (field.type === 'checkbox' || field.type === 'checkbox-group') {
        emptyData[field.id] = [];
      } else if (field.type === 'radio') {
        emptyData[field.id] = '';
      } else {
        emptyData[field.id] = '';
      }
    });
    return emptyData;
  };

  // Client form handlers
  const handleClientInputChange = (fieldId, value) => {
    setClientData(prev => ({
      ...prev,
      [fieldId]: value
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
      setMessage('Failed to submit client information. Please try again.');
      console.error('Error submitting client data:', error);
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setSelectedFormId('');
    setSelectedForm(null);
    setFormData({});
    setRoomId('');
    loadRoomsData();
    setFloorModalVisible(false);
  };

  const handleRoomIdChange = (id) => {
    setRoomId(id);
    setSelectedFormId('');
    setSelectedForm(null);
    setFormData({});
  };

  const handleFormSelect = (formId) => {
    setSelectedFormId(formId);
    setFormModalVisible(false);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
    setFormData(prev => {
      const currentValues = prev[fieldId] || [];
      if (isChecked) {
        return {
          ...prev,
          [fieldId]: [...currentValues, optionValue]
        };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter(item => item !== optionValue)
        };
      }
    });
  };

  const handleSubmit = async (isFinalStep = false) => {
    if (!selectedFormId || !selectedFloor || !roomId) return;
    
    setIsLoading(true);
    try {
      // Save form data for this room
      await apiService.saveRoomData(selectedFloor, roomId, selectedFormId, formData);
      
      setMessage('Form data saved successfully!');
      
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
          setMessage('All forms completed for this room!');
        }
      }
      
      // Reload rooms data to reflect changes
      loadRoomsData();
    } catch (error) {
      setMessage('Failed to save form. Please try again.');
      console.error('Error saving form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!clientSubmitted) {
      setMessage('Please complete client information first');
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
        setSelectedFloor('');
        setRoomId('');
        setRooms({});
        setSelectedFormId('');
        setSelectedForm(null);
        setFormData({});
      }
    } catch (error) {
      setMessage('Failed to submit final data. Please try again.');
      console.error('Error submitting final data:', error);
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  const editClientInfo = () => {
    setShowClientForm(true);
    setMessage('');
  };

  const handleViewForm = async (roomIdToView, formId) => {
    const formData = await apiService.getRoomData(selectedFloor, roomIdToView, formId);
    const form = forms.find(f => f._id === formId);
    setViewFormData(formData);
    setViewFormName(form ? form.formName : 'Unknown Form');
    setViewModalVisible(true);
  };

  const handleEditForm = (roomIdToEdit, formId) => {
    setRoomId(roomIdToEdit);
    setSelectedFormId(formId);
  };

  const handleDeleteRoom = async (roomIdToDelete) => {
    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            await apiService.deleteRoomData(selectedFloor, roomIdToDelete);
            loadRoomsData();
            setMessage('Room deleted successfully');
            
            // If we're currently editing this room, clear the form
            if (roomId === roomIdToDelete) {
              setRoomId('');
              setSelectedFormId('');
              setSelectedForm(null);
              setFormData({});
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderField = (field, isClientForm = false) => {
    const { id, type, label, required, options } = field;
    const value = isClientForm ? (clientData[id] || '') : (formData[id] || '');
    const handleChange = isClientForm ? handleClientInputChange : handleInputChange;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={(text) => handleChange(id, text)}
              keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
              placeholder={`Enter ${label}`}
            />
          </View>
        );
      
      case 'textarea':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={value}
              onChangeText={(text) => handleChange(id, text)}
              multiline={true}
              numberOfLines={4}
              placeholder={`Enter ${label}`}
            />
          </View>
        );
      
      case 'select':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => handleChange(id, itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select an option" value="" />
                {options && options.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        );
      
      case 'checkbox':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.checkboxContainer}>
              {options && options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxOption}
                  onPress={() => {
                    const isChecked = Array.isArray(value) && value.includes(option);
                    handleCheckboxChange(id, option, !isChecked);
                  }}
                >
                  <View style={[
                    styles.checkbox,
                    Array.isArray(value) && value.includes(option) && styles.checkboxChecked
                  ]}>
                    {Array.isArray(value) && value.includes(option) && (
                      <Icon name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 'radio':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.radioContainer}>
              {options && options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioOption}
                  onPress={() => handleChange(id, option)}
                >
                  <View style={styles.radio}>
                    {value === option && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 'image':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Icon name="camera" size={20} color="#3b82f6" />
              <Text style={styles.imageUploadText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={(text) => handleChange(id, text)}
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
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="user" size={24} color="#3b82f6" />
            <Text style={styles.cardTitle}>Client Information</Text>
          </View>

          {/* Message display */}
          {message ? (
            <View style={[
              styles.messageContainer,
              message.includes('success') ? styles.successMessage : styles.infoMessage
            ]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.formContainer}>
            {clientDetailForm.formFields.map(field => (
              <View key={field.id}>
                {renderField(field, true)}
              </View>
            ))}
            
            <TouchableOpacity
              onPress={handleClientSubmit}
              disabled={isSubmittingClient}
              style={[styles.submitButton, isSubmittingClient && styles.disabledButton]}
            >
              {isSubmittingClient ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>Save & Continue</Text>
                  <Icon name="arrow-right" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }

  // Survey Forms
  return (
    <View style={styles.container}>
      {/* View Form Modal */}
      <ViewFormModal 
        isVisible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        formData={viewFormData}
        formName={viewFormName}
      />
      
      {/* Floor Selection Modal */}
      <Modal
        visible={floorModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFloorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Floor</Text>
              <TouchableOpacity onPress={() => setFloorModalVisible(false)} style={styles.closeButton}>
                <Icon name="times" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {floorOptions.map(floor => (
                <TouchableOpacity
                  key={floor.value}
                  style={[
                    styles.modalOption,
                    selectedFloor === floor.value && styles.modalOptionSelected
                  ]}
                  onPress={() => handleFloorSelect(floor.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedFloor === floor.value && styles.modalOptionTextSelected
                  ]}>
                    {floor.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Form Selection Modal */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Form Step</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)} style={styles.closeButton}>
                <Icon name="times" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {forms.map(form => (
                <TouchableOpacity
                  key={form._id}
                  style={[
                    styles.modalOption,
                    selectedFormId === form._id && styles.modalOptionSelected
                  ]}
                  onPress={() => handleFormSelect(form._id)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedFormId === form._id && styles.modalOptionTextSelected
                  ]}>
                    {form.formName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Client Info Header */}
      {clientSubmitted && (
        <View style={styles.clientInfoCard}>
          <View style={styles.clientInfoHeader}>
            <View style={styles.clientInfo}>
              <Icon name="user" size={16} color="#3b82f6" />
              <Text style={styles.clientInfoText}>
                Client: <Text style={styles.clientInfoBold}>{clientData.clientName}</Text>
                <Text style={styles.clientInfoLight}> ({clientData.siteShortName})</Text>
              </Text>
            </View>
            <View style={styles.clientActions}>
              <TouchableOpacity onPress={editClientInfo} style={styles.clientActionButton}>
                <Icon name="edit" size={14} color="#3b82f6" />
                <Text style={styles.clientActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleFinalSubmit} 
                disabled={isSubmittingFinal}
                style={[styles.finalSubmitButton, isSubmittingFinal && styles.disabledButton]}
              >
                {isSubmittingFinal ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Icon name="paper-plane" size={14} color="white" />
                    <Text style={styles.finalSubmitText}>Final Submit</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Header Section with Selection Buttons */}
      <View style={styles.selectionCard}>
        <View style={styles.selectionRow}>
          {/* Floor Selection */}
          <View style={styles.selectionGroup}>
            <Text style={styles.selectionLabel}>Select Floor</Text>
            <TouchableOpacity 
              style={styles.selectionButton}
              onPress={() => setFloorModalVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.selectionButtonText}>
                {selectedFloor 
                  ? floorOptions.find(f => f.value === selectedFloor)?.label 
                  : "Select Floor"}
              </Text>
              <Icon name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {/* Room ID Input */}
          <View style={styles.selectionGroup}>
            <Text style={styles.selectionLabel}>Room ID</Text>
            <TextInput
              style={styles.roomIdInput}
              value={roomId}
              onChangeText={handleRoomIdChange}
              placeholder="Enter Room ID"
              editable={!!selectedFloor && !isLoading}
            />
          </View>
        </View>
        
        {/* Form Selection */}
        <View style={styles.selectionGroup}>
          <Text style={styles.selectionLabel}>Select Form Step</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setFormModalVisible(true)}
            disabled={isLoading || !selectedFloor || !roomId}
          >
            <Text style={styles.selectionButtonText}>
              {selectedFormId 
                ? forms.find(f => f._id === selectedFormId)?.formName 
                : "Select Form"}
            </Text>
            <Icon name="chevron-down" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Saved Rooms Section */}
      {selectedFloor && Object.keys(rooms).length > 0 && (
        <View style={styles.savedRoomsCard}>
          <Text style={styles.sectionTitle}>
            Saved Rooms for {floorOptions.find(f => f.value === selectedFloor)?.label}:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(rooms).map(([roomId, roomData]) => (
              <View key={roomId} style={styles.roomCard}>
                <View style={styles.roomCardHeader}>
                  <Text style={styles.roomCardTitle}>Room: {roomId}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteRoom(roomId)}
                    style={styles.deleteButton}
                  >
                    <Icon name="trash" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.roomForms}>
                  {forms.map(form => (
                    <View key={form._id} style={styles.roomFormItem}>
                      <Text style={styles.roomFormName} numberOfLines={1}>
                        {form.formName}
                      </Text>
                      <View style={styles.roomFormActions}>
                        <TouchableOpacity
                          onPress={() => handleViewForm(roomId, form._id)}
                          style={styles.viewButton}
                        >
                          <Icon name="eye" size={14} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleEditForm(roomId, form._id)}
                          style={styles.editButton}
                        >
                          <Icon name="edit" size={14} color="#10b981" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Form Display Area */}
      <View style={styles.formCard}>
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        
        {/* Message display */}
        {message ? (
          <View style={[
            styles.messageContainer,
            message.includes('success') ? styles.successMessage : styles.infoMessage
          ]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
        
        {/* Form display */}
        {selectedForm && !isLoading && (
          <ScrollView>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {selectedForm.formName}
              </Text>
              <Text style={styles.formStep}>
                (Step {currentStepIndex + 1} of {forms.length})
              </Text>
            </View>
            
            <View style={styles.formFields}>
              {selectedForm.formFields.map(field => (
                <View key={field.id}>
                  {renderField(field)}
                </View>
              ))}
            </View>
            
            {/* Action buttons */}
            <TouchableOpacity
              onPress={() => handleSubmit(isLastStep)}
              disabled={isLoading}
              style={[styles.saveButton, isLoading && styles.disabledButton]}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.saveButtonText}>
                  {isLastStep ? 'Save Form' : 'Save & Next'}
                </Text>
                {isLastStep ? (
                  <Icon name="check" size={16} color="white" />
                ) : (
                  <Icon name="arrow-right" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
        
        {/* Empty state */}
        {!selectedForm && !isLoading && !message && (
          <View style={styles.emptyState}>
            <Icon name="file-text" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>
              {!selectedFloor 
                ? "Please select a floor first" 
                : !roomId
                  ? "Please enter a Room ID"
                  : "Please select a form step to begin"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  radioLabel: {
    fontSize: 16,
    color: '#374151',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  imageUploadText: {
    marginLeft: 8,
    color: '#3b82f6',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successMessage: {
    backgroundColor: '#dcfce7',
  },
  infoMessage: {
    backgroundColor: '#dbeafe',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 14,
  },
  clientInfoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  clientInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientInfoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  clientInfoBold: {
    fontWeight: 'bold',
  },
  clientInfoLight: {
    color: '#6b7280',
  },
  clientActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  clientActionText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 14,
  },
  finalSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  finalSubmitText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  selectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectionGroup: {
    flex: 1,
    marginRight: 12,
  },
  selectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  roomIdInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  savedRoomsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  roomCard: {
    width: 280,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  roomCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  deleteButton: {
    padding: 4,
  },
  roomForms: {
    marginTop: 4,
  },
  roomFormItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomFormName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  roomFormActions: {
    flexDirection: 'row',
  },
  viewButton: {
    padding: 4,
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  formCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  formStep: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  formFields: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  closeModalButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeModalButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOptionSelected: {
    backgroundColor: '#dbeafe',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: '#1d4ed8',
    fontWeight: '500',
  },
  formDataContainer: {
    marginBottom: 16,
  },
  formDataItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  formDataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  formDataValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 20,
  },
});

export default SurveyForm;