import { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const WorkForceEntry = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPartner, setViewingPartner] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [allPartners, setAllPartners] = useState([]);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [formData, setFormData] = useState({
    partnerType: "",
    partnerName: "",
    partnerMobile: "",
    partnerAddress: "",
    partnerPhoto: null,
    partnerIdProof: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [idProofPreview, setIdProofPreview] = useState("");
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedImageType, setEnlargedImageType] = useState("");
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const searchInputRef = useRef(null);
  const { backendURL } = useAuth();

  // Load selected partners from AsyncStorage on component mount
  useEffect(() => {
    loadSelectedPartners();
  }, []);

  const loadSelectedPartners = async () => {
    try {
      const savedPartners = await AsyncStorage.getItem("selectedPartners");
      if (savedPartners) {
        setSelectedPartners(JSON.parse(savedPartners));
      }
    } catch (error) {
      console.error("Error loading selected partners:", error);
    }
  };

  // Save selectedPartners to AsyncStorage whenever it changes
  useEffect(() => {
    const saveSelectedPartners = async () => {
      try {
        await AsyncStorage.setItem(
          "selectedPartners",
          JSON.stringify(selectedPartners)
        );
      } catch (error) {
        console.error("Error saving selected partners:", error);
      }
    };

    saveSelectedPartners();
  }, [selectedPartners]);

  // Fetch all partners from backend on component mount
  useEffect(() => {
    fetchPartners();
  }, [backendURL]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${backendURL}/api/get/partnerDetail`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch partners");
      }

      const data = await response.json();
      let partnersArray = [];

      if (Array.isArray(data)) {
        partnersArray = data;
      } else if (data.partners && Array.isArray(data.partners)) {
        partnersArray = data.partners;
      } else if (data.data && Array.isArray(data.data)) {
        partnersArray = data.data;
      }

      setAllPartners(partnersArray);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = allPartners.filter(
        (partner) =>
          partner.partnerName &&
          partner.partnerName.toLowerCase().startsWith(value.toLowerCase())
      );

      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a partner from search suggestions
  const handleSelectPartner = (partner) => {
    const isAlreadySelected = selectedPartners.some(
      (p) => p._id === partner._id
    );

    if (!isAlreadySelected) {
      const updatedPartners = [...selectedPartners, partner];
      setSelectedPartners(updatedPartners);
      // Alert.alert("Partner added successfully");
    } else {
      Alert.alert("Partner already selected");
    }

    setSearchTerm("");
    setSearchResults([]);
    setShowSuggestions(false);

    // Blur the input to close the keyboard
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Remove a partner from the selected list
  const removePartner = (partnerId) => {
    const updatedPartners = selectedPartners.filter(
      (partner) => partner._id !== partnerId
    );
    setSelectedPartners(updatedPartners);
    // Alert.alert("Partner removed");
  };

  // Clear all selected partners and AsyncStorage
  const clearSelectedPartners = async () => {
    setSelectedPartners([]);
    try {
      await AsyncStorage.removeItem("selectedPartners");
    } catch (error) {
      console.error("Error clearing selected partners:", error);
    }
  };

  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";

    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-indigo-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const handleViewDetails = (partner) => {
    setViewingPartner(partner);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingPartner(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (filename) => {
    if (!filename) return "";
    return `${backendURL}/uploads/${filename}`;
  };

  // Show confirmation for exporting all partners
  const showExportConfirmationPopup = () => {
    setShowExportConfirmation(true);
  };

  // Export all selected partners after confirmation
  const confirmExportAllPartners = () => {
    exportPartners();
    setShowExportConfirmation(false);
  };

  // Cancel exporting partners
  const cancelExportAllPartners = () => {
    setShowExportConfirmation(false);
  };

  // Show confirmation for clearing all partners
  const showClearConfirmationPopup = () => {
    setShowClearConfirmation(true);
  };

  // Clear all selected partners after confirmation
  const confirmClearAllPartners = () => {
    clearSelectedPartners();
    setShowClearConfirmation(false);
    Alert.alert("All partners have been removed");
  };

  // Cancel clearing partners
  const cancelClearAllPartners = () => {
    setShowClearConfirmation(false);
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      return {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      // Return default coordinates (Delhi)
      return { longitude: 77.1025, latitude: 28.7041 };
    }
  };

  // Export partners function
  const exportPartners = async () => {
    if (selectedPartners.length === 0) {
      Alert.alert("No partners selected to Check-In");
      return;
    }

    try {
      const currentLocation = await getCurrentLocation();
      const partnersWithLocation = selectedPartners.map((partner) => ({
        ...partner,
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
      }));

      const email = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${backendURL}/api/dailyPartnerDetails/export/dailyPartners?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            partners: partnersWithLocation,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(data.message);
        clearSelectedPartners();
      } else {
        Alert.alert(data.message || "Failed to export partners");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Failed to export partners");
    }
  };

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection for photo
  const handlePhotoUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          partnerPhoto: result.assets[0],
        }));
        setPhotoPreview(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Failed to select image");
    }
  };

  // Handle image selection for ID proof
  const handleIdProofUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          partnerIdProof: result.assets[0],
        }));
        setIdProofPreview(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Failed to select image");
    }
  };

  // Handle form submission
  const handlePartnerSubmit = async () => {
    if (
      !formData.partnerType ||
      !formData.partnerName ||
      !formData.partnerMobile ||
      !formData.partnerAddress
    ) {
      Alert.alert("Please fill all required fields");
      return;
    }

    const submitData = new FormData();

    // Add text fields
    submitData.append("partnerType", formData.partnerType);
    submitData.append("partnerName", formData.partnerName);
    submitData.append("partnerMobile", formData.partnerMobile);
    submitData.append("partnerAddress", formData.partnerAddress);

    // Handle file uploads correctly
    if (formData.partnerPhoto) {
      const photoUri = formData.partnerPhoto.uri;
      const photoName = photoUri.split("/").pop();
      const photoType = "image/jpeg";

      submitData.append("partnerPhoto", {
        uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
        name: photoName,
        type: photoType,
      });
    }
    if (formData.partnerIdProof) {
      const idProofUri = formData.partnerIdProof.uri;
      const idProofName = idProofUri.split("/").pop();
      const idProofType = "image/jpeg";

      submitData.append("partnerIdProof", {
        uri:
          Platform.OS === "ios"
            ? idProofUri.replace("file://", "")
            : idProofUri,
        name: idProofName,
        type: idProofType,
      });
    }

    try {
      const email = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${backendURL}/api/add/partnerManagement?email=${email}`,
        {
          method: "POST",
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
          body: submitData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        Alert.alert(data.message);
        return;
      }

      Alert.alert(data.message);

      // Add the new partner to the local state
      if (data.data) {
        const newPartner = data.data;
        setAllPartners((prev) => [...prev, newPartner]);
        setSelectedPartners((prev) => [...prev, newPartner]);
      }

      // Reset form
      setFormData({
        partnerType: "",
        partnerName: "",
        partnerMobile: "",
        partnerAddress: "",
        partnerPhoto: null,
        partnerIdProof: null,
      });
      setPhotoPreview("");
      setIdProofPreview("");

      // Close the form
      setShowPartnerForm(false);
    } catch (error) {
      Alert.alert("Partner creation failed");
      console.error("Partner creation error:", error);
    }
  };

  // Close partner form
  const closePartnerForm = () => {
    setShowPartnerForm(false);
    setFormData({
      partnerType: "",
      partnerName: "",
      partnerMobile: "",
      partnerAddress: "",
      partnerPhoto: null,
      partnerIdProof: null,
    });
    setPhotoPreview("");
    setIdProofPreview("");
  };

  // Function to open enlarged image view
  const openEnlargedImage = (imageUrl, imageType) => {
    setEnlargedImage(imageUrl);
    setEnlargedImageType(imageType);
  };

  // Function to close enlarged image view
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
    setEnlargedImageType("");
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading partners...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <View className="bg-white p-6 rounded-lg shadow-md items-center">
          <Ionicons name="warning" size={40} color="#ef4444" className="mb-3" />
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Error Loading Data
          </Text>
          <Text className="text-gray-600 mb-4 text-center">{error}</Text>
          <TouchableOpacity
            onPress={fetchPartners}
            className="bg-blue-600 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      {/* Header */}
      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <Ionicons
            name="people-outline"
            size={24}
            color="#3b82f6"
            className="mr-2"
          />
          <Text className="text-xl font-bold text-gray-800">
            WorkForce Entry
          </Text>
        </View>
        <Text className="text-gray-600 text-sm">
          Search for partners and add them to your selection
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View className="bg-white rounded-lg shadow p-4 mb-4">
          <View className="relative mb-4">
            <View className="absolute left-3 top-3 z-10">
              <Ionicons name="search" size={20} color="#9ca3af" />
            </View>
            <TextInput
              ref={searchInputRef}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded text-sm"
              placeholder="Search partner by name..."
              value={searchTerm}
              onChangeText={handleSearchChange}
              onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            />

            {/* Search Suggestions */}
            {showSuggestions && searchResults.length > 0 && (
              <View className="absolute z-50 mt-12 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                <ScrollView>
                  {searchResults.map((partner) => (
                    <TouchableOpacity
                      key={partner._id || partner.id}
                      className="px-4 py-3 border-b border-gray-100"
                      onPress={() => handleSelectPartner(partner)}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            partner.partnerName
                          )} items-center justify-center mr-3`}
                        >
                          <Text className="text-white text-xs font-bold">
                            {partner.partnerName?.charAt(0).toUpperCase() ||
                              "P"}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-sm font-medium text-gray-800">
                            {partner.partnerName}
                          </Text>
                          <Text className="text-xs text-gray-500 capitalize">
                            {partner.partnerType}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* No Results Found */}
            {showSuggestions &&
              searchTerm.length > 0 &&
              searchResults.length === 0 && (
                <View className="absolute z-50 mt-12 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <View className="px-4 py-3 items-center">
                    <Text className="text-sm text-gray-600 text-center">
                      No partner found with name "{searchTerm}"
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowPartnerForm(true);
                        setShowSuggestions(false);
                        if (searchInputRef.current) {
                          searchInputRef.current.blur();
                        }
                      }}
                      className="mt-2 bg-blue-600 px-3 py-1 rounded"
                    >
                      <Text className="text-white font-medium text-sm">
                        Add New Partner
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
          </View>

          {/* Selected Partners Box */}
          <View className="bg-white rounded-lg shadow p-4 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Selected Partners ({selectedPartners.length})
              </Text>
              {selectedPartners.length > 0 && (
                <View className="flex-row space-x-2">
                  
                  <TouchableOpacity
                    onPress={showExportConfirmationPopup}
                    className="p-2 bg-white rounded-md shadow-xs border border-gray-100"
                  >
                    <Ionicons
                      name="checkmark-done-outline"
                      size={20}
                      color="#10b981"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showClearConfirmationPopup}
                    className="p-2 bg-white rounded-md shadow-xs border border-gray-100"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {selectedPartners.length > 0 ? (
              <View className="space-y-3">
                {selectedPartners.map((partner) => (
                  <View
                    key={partner._id || partner.id}
                    className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                          partner.partnerName
                        )} items-center justify-center mr-3`}
                      >
                        <Text className="text-white text-sm font-bold">
                          {partner.partnerName?.charAt(0).toUpperCase() || "P"}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-sm font-medium text-gray-800"
                          numberOfLines={1}
                        >
                          {partner.partnerName}
                        </Text>
                        <Text className="text-xs text-gray-500 capitalize">
                          {partner.partnerType}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                    onPress={showExportConfirmationPopup}
                    className="p-2 bg-white rounded-md shadow-xs border border-gray-100"
                  >
                    <Ionicons
                      name="checkmark-done-outline"
                      size={20}
                      color="#10b981"
                    />
                  </TouchableOpacity>
                      

                      <TouchableOpacity
                        onPress={() => removePartner(partner._id || partner.id)}
                        className="p-2 bg-white rounded-md shadow-xs border border-gray-100"
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                        {/* <Ionicons name="close-outline" size={20} color="#ef4444"/> */}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleViewDetails(partner)}
                        className="p-2 bg-white rounded-md shadow-xs border border-gray-100"
                      >
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color="#3b82f6"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <Ionicons
                  name="people-outline"
                  size={48}
                  color="#9ca3af"
                  className="mb-2"
                />
                <Text className="text-gray-500 text-center">
                  No partners selected yet. Search for partners above to add
                  them.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Export All Confirmation Modal */}
      <Modal
        visible={showExportConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelExportAllPartners}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text className="text-lg font-medium text-gray-900 mb-2">
              Check-In Partners
            </Text>
            <Text className="text-sm text-gray-500 mb-6">
              Are you sure you want to Check-In all partners?
            </Text>
            <View className="flex-row gap-3 justify-end">
              <TouchableOpacity
                onPress={cancelExportAllPartners}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmExportAllPartners}
                className="px-4 py-2 bg-blue-600 rounded-md"
              >
                <Text className="text-white font-medium">Check-In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        visible={showClearConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelClearAllPartners}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text className="text-lg font-medium text-gray-900 mb-2">
              Delete Partners
            </Text>
            <Text className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete all partners?
            </Text>
            <View className="flex-row gap-3 justify-end">
              <TouchableOpacity
                onPress={cancelClearAllPartners}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmClearAllPartners}
                className="px-4 py-2 bg-red-600 rounded-md"
              >
                <Text className="text-white font-medium">Remove All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Partner Details Modal */}
      <Modal
        visible={showViewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeViewModal}
      >
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-20 mx-4 rounded-lg max-h-4/5">
            {/* Header */}
            <View className="bg-blue-600 p-4 rounded-t-lg">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-white">
                  WorkForce Entry - {viewingPartner?.partnerName}
                </Text>
                <TouchableOpacity onPress={closeViewModal}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="p-4">
              {/* Photos Section */}
              <View className="flex-row justify-between mb-4">
                {/* Partner Photo */}
                <View className="items-center flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Partner Photo
                  </Text>
                  {viewingPartner?.partnerPhoto ? (
                    <TouchableOpacity
                      onPress={() =>
                        openEnlargedImage(
                          getImageUrl(viewingPartner.partnerPhoto),
                          "Partner Photo"
                        )
                      }
                    >
                      <Image
                        source={{
                          uri: getImageUrl(viewingPartner.partnerPhoto),
                        }}
                        className="w-32 h-32 rounded-md"
                        resizeMode="cover"
                        onError={() => {}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View className="w-32 h-32 bg-gray-100 items-center justify-center rounded-md border border-dashed border-gray-300">
                      <Text className="text-sm text-gray-500">No photo</Text>
                    </View>
                  )}
                </View>

                {/* ID Proof */}
                <View className="items-center flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    ID Proof
                  </Text>
                  {viewingPartner?.partnerIdProof ? (
                    <TouchableOpacity
                      onPress={() =>
                        openEnlargedImage(
                          getImageUrl(viewingPartner.partnerIdProof),
                          "ID Proof"
                        )
                      }
                    >
                      <Image
                        source={{
                          uri: getImageUrl(viewingPartner.partnerIdProof),
                        }}
                        className="w-32 h-32 rounded-md"
                        resizeMode="cover"
                        onError={() => {}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View className="w-32 h-32 bg-gray-100 items-center justify-center rounded-md border border-dashed border-gray-300">
                      <Text className="text-sm text-gray-500">No photo</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Partner Information */}
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-3">
                  Partner Information
                </Text>

                <View className="gap-3">
                  <View className="bg-white p-3 rounded shadow-sm">
                    <Text className="text-xs font-medium text-gray-500">
                      Partner Type
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800 capitalize">
                      {viewingPartner?.partnerType || "N/A"}
                    </Text>
                  </View>

                  <View className="bg-white p-3 rounded shadow-sm">
                    <Text className="text-xs font-medium text-gray-500">
                      Partner Name
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800 capitalize">
                      {viewingPartner?.partnerName || "N/A"}
                    </Text>
                  </View>

                  <View className="bg-white p-3 rounded shadow-sm">
                    <Text className="text-xs font-medium text-gray-500">
                      Mobile Number
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {viewingPartner?.partnerMobile || "N/A"}
                    </Text>
                  </View>

                  <View className="bg-white p-3 rounded shadow-sm">
                    <Text className="text-xs font-medium text-gray-500">
                      Created On
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {formatDate(viewingPartner?.createdAt)}
                    </Text>
                  </View>

                  <View className="bg-white p-3 rounded shadow-sm">
                    <Text className="text-xs font-medium text-gray-500">
                      Address
                    </Text>
                    <Text className="text-sm text-gray-800">
                      {viewingPartner?.partnerAddress || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Enlarged Image Modal */}
      <Modal
        visible={!!enlargedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEnlargedImage}
      >
        <TouchableOpacity
          className="flex-1 bg-black/90 items-center justify-center p-4"
          onPress={closeEnlargedImage}
          activeOpacity={1}
        >
          <View className="bg-white p-4 rounded-t-lg w-full">
            <Text className="text-lg font-bold text-gray-800 text-center">
              {enlargedImageType}
            </Text>
          </View>
          <Image
            source={{ uri: enlargedImage }}
            className="w-full h-2/6"
            resizeMode= "contain"
          />
          <TouchableOpacity
            onPress={closeEnlargedImage}
            className="absolute top-10 right-4"
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Partner Form Modal */}
      <Modal
        visible={showPartnerForm}
        transparent={true}
        animationType="slide"
        onRequestClose={closePartnerForm}
      >
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-10 mx-4 rounded-lg max-h-5/6">
            {/* Header */}
            <View className="bg-blue-600 p-4 rounded-t-lg">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-white">
                  Add New Partner
                </Text>
                <TouchableOpacity onPress={closePartnerForm}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="p-4">
              <View className="gap-4 mb-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Partner Type*
                  </Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={formData.partnerType}
                      onValueChange={(value) =>
                        handleInputChange("partnerType", value)
                      }
                      style={{ height: 50 }}
                    >
                      <Picker.Item label="Select Partner Type" value="" style={{ fontSize: 14 }}/>
                      <Picker.Item label="Carpenter" value="carpenter" />
                      <Picker.Item label="Plumber" value="plumber" />
                      <Picker.Item label="Electrician" value="electrician" />
                      <Picker.Item label="Painter" value="painter" />
                      <Picker.Item label="Fabricator" value="fabricator" />
                      <Picker.Item label="Tile Mistri" value="tileMistri" />
                      <Picker.Item label="Raj Mistri" value="rajMistri" />
                      <Picker.Item
                        label="Granite Mistri"
                        value="graniteMistri"
                      />
                      <Picker.Item label="Others" value="others" />
                    </Picker>
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Partner Name*
                  </Text>
                  <TextInput
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter partner name"
                    value={formData.partnerName}
                    onChangeText={(value) =>
                      handleInputChange("partnerName", value)
                    }
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Mobile Number*
                  </Text>
                  <TextInput
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter mobile number"
                    value={formData.partnerMobile}
                    onChangeText={(value) =>
                      handleInputChange("partnerMobile", value)
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </Text>
                  <TextInput
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter address"
                    value={formData.partnerAddress}
                    onChangeText={(value) =>
                      handleInputChange("partnerAddress", value)
                    }
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Partner Photo */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Partner Photo
                  </Text>
                  <View className="flex-row items-center space-x-4 gap-4">
                    <View className="relative">
                      {photoPreview ? (
                        <Image
                          source={{ uri: photoPreview }}
                          className="w-16 h-16 rounded-full border-2 border-gray-300"
                        />
                      ) : (
                        <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center border-2 border-dashed border-gray-300">
                          <Ionicons
                            name="image-outline"
                            size={24}
                            color="#9ca3af"
                          />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handlePhotoUpload}
                      className="flex-row items-center px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-600"
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color="#3b82f6"
                        className="mr-2"
                      />
                      <Text className="font-medium text-blue-600">
                        Upload Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ID Proof Upload */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    ID Proof Document *
                  </Text>
                  <View className="flex-row items-center space-x-4 gap-4">
                    <View className="relative">
                      {idProofPreview ? (
                        <Image
                          source={{ uri: idProofPreview }}
                          className="w-16 h-16 rounded border border-gray-300"
                        />
                      ) : (
                        <View className="w-16 h-16 bg-gray-200 items-center justify-center border-2 border-dashed border-gray-300 rounded">
                          <FontAwesome
                            name="file-text-o"
                            size={24}
                            color="#9ca3af"
                          />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handleIdProofUpload}
                      className="flex-row items-center px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-600"
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color="#3b82f6"
                        className="mr-2"
                      />
                      <Text className="font-medium text-blue-600">
                        Upload ID Proof
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    Accepted: Aadhar, PAN card, driving license, etc.
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-end space-x-3 mt-4 gap-4">
                <TouchableOpacity
                  onPress={closePartnerForm}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePartnerSubmit}
                  className="px-4 py-2 bg-blue-600 rounded-md"
                >
                  <Text className="text-white font-medium">Add & Check-In</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button for Adding New Partner */}
      <TouchableOpacity
        onPress={() => setShowPartnerForm(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default WorkForceEntry;
