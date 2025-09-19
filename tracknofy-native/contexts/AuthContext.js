import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  console.log("AuthProvider is being rendered");

  const [user, setUser] = useState({});
  console.log("user", user);

  const backendURL = "http://192.168.31.95:3000";
  // const backendURL = "http://192.168.1.7:3000";

  const router = useRouter();

  // Call this function when you need to see user details


  useEffect(() => {
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
        setUser(userDetails);
      } catch (error) {
        console.error("Error getting user details:", error);
        return null;
      }
    };

   getUserDetails()
  }, [])
  

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "name",
        "email",
        "mobile",
        "role",
        "_id",
        "superAdminExist",
      ]);
      setUser(null);
      Alert.alert("Success", "User Logout Success");
      router.push("/login");

      return true;
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("Failed", "Failed to Logout");
      return false;
    }
  };

  const value = {
    user,
    backendURL,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
