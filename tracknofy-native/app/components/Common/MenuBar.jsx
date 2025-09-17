
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icon mapping for menu items
const iconMap = {
  FiHome: "home-outline",
  FiDollarSign: "card-outline",
  FiClipboard: "document-text-outline",
  FiClock: "time-outline",
  FiBox: "cube-outline",
  FiBriefcase: "briefcase-outline",
  FiUserPlus: "person-add-outline",
  FiUser: "person-outline",
  FiTool: "construct-outline",
  MdHelp: "help-circle-outline",
  FaClipboardList :"clipboard-outline"
};

const MenuBar = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { logout, backendURL } = useAuth();
  const insets = useSafeAreaInsets();

  //getting userDetails for showing name and email
  const getUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const mobile = await AsyncStorage.getItem("mobile");
      const role = await AsyncStorage.getItem("role");
      const _id = await AsyncStorage.getItem("_id");
      const superAdminExist = await AsyncStorage.getItem("superAdminExist");

      const userDetails = {
        token,
        name,
        email,
        mobile,
        role,
        _id,
        superAdminExist,
      };
      setUserData(userDetails);
    } catch (error) {
      console.error("Error getting user details:", error);
      return null;
    }
  };

  // Fetch menu items based on user role
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token || !role) {
        console.error("No token or role found");
        return;
      }

      const response = await fetch(`${backendURL}/api/get/role`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      });

      const data = await response.json();
      console.log("features Data", data);
      if (!data.success) {
        console.error("Failed to fetch roles:", data.message);
        return;
      }

      // Find the user's role in the response
      const userRole = data.data.find((item) => item.roleName === role);
      console.log(userRole);
      if (userRole && userRole.features) {
        setMenuItems(userRole.features);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      getUserDetails();
      fetchMenuItems();
    }
  }, [isMenuVisible]);

  // Toggle menu visibility with smooth animation
  const toggleMenu = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    console.log("Menu toggle pressed, current state:", isMenuVisible);

    try {
      setIsAnimating(true);

      if (isMenuVisible) {
        // Close menu
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -300,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            console.log("Menu closed");
            setIsMenuVisible(false);
            setIsAnimating(false);
          }
        });
      } else {
        // Open menu - First make the menu visible, then animate
        setIsMenuVisible(true);

        // Start animation after a tiny delay to ensure the component is rendered
        requestAnimationFrame(() => {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
              toValue: 0.5,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]).start(({ finished }) => {
            if (finished) {
              console.log("Menu opened");
              setIsAnimating(false);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error in toggleMenu:", error);
      setIsAnimating(false);
    }
  };

  // Navigate to a screen and close menu
  const navigateTo = (path) => {
    if (isMenuVisible) {
      toggleMenu();
    }
    setTimeout(() => {
      router.push(`/${path}`);
    }, 300); // Wait for menu to close
  };

  // Simplified notification navigation - FIXED
  const navigateToNotifications = () => {
    // If menu is open, close it immediately without waiting for animation
    if (isMenuVisible) {
      setIsMenuVisible(false);
      slideAnim.setValue(-300);
      overlayAnim.setValue(0);
    }
    
    // Navigate directly to notifications
    router.push("/notifications");
  };

  // Navigate to profile editing screen
  const navigateToProfileEdit = () => {
    if (isMenuVisible) {
      toggleMenu();
    }
    setTimeout(() => {
      router.replace("/profile");
    }, 300); // Wait for menu to close
  };

  return (
    <>
      {/* Main Menu Bar */}
      <View className="bg-[#1d3557]" style={{ paddingTop: insets.top }}>
        <View className="flex-row justify-between items-center px-4 py-3">
          {/* Left Side - Menu Icon */}
          <TouchableOpacity
            onPress={toggleMenu}
            className="p-2"
            disabled={isAnimating}
          >
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>

          {/* Center - App Title */}
          <Text className="text-white text-xl font-bold">Tracknofy</Text>

          {/* Right Side - Notification Icon */}
          <TouchableOpacity
            onPress={navigateToNotifications}
            className="p-2"
            disabled={isAnimating}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay - Always rendered but hidden when not needed */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "black",
            opacity: overlayAnim,
            zIndex: 10,
            display: isMenuVisible || isAnimating ? "flex" : "none",
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={toggleMenu}
          activeOpacity={1}
          disabled={isAnimating}
        />
      </Animated.View>

      {/* Side Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top,
          },
        ]}
      >
        {/* User Profile Section */}
        <View className="p-5 bg-[#1d3557] pt-5">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center mr-4">
              <Ionicons name="person" size={32} color="#1d3557" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                {userData?.name || "user"}
              </Text>
              <Text className="text-blue-100">
                {userData?.email || "user@gmail.com"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={navigateToProfileEdit}
              className="p-2"
              disabled={isAnimating}
            >
              <Ionicons name="create-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 p-4">
          {loading ? (
            <ActivityIndicator size="large" color="#1d3557" className="py-8" />
          ) : menuItems.length > 0 ? (
            menuItems.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => navigateTo(item.path)}
                className="flex-row items-center py-4 border-b border-gray-200"
                disabled={isAnimating}
              >
                <Ionicons
                  name={iconMap[item.icon] || "help-outline"}
                  size={22}
                  className="text-blue-600 mr-4"
                />
                <Text className="text-lg text-gray-800">
                  {item.featureName}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-8">
              No menu items available
            </Text>
          )}
        </View>

        {/* Footer with logout button */}
        <View className="p-2 border-t border-b border-gray-200 m-5">
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => logout()}
            disabled={isAnimating}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              className="text-red-500 mr-4"
            />
            <Text className="text-lg text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20,
  },
});

export default MenuBar;