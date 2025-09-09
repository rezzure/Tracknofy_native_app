
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';


// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    console.log("AuthProvider is being rendered"); 


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 const backendURL = 'http://192.168.31.94:3000'

 const router = useRouter()

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const userData = {
//           token,
//           name: await AsyncStorage.getItem("name"),
//           email: await AsyncStorage.getItem("email"),
//           mobile: await AsyncStorage.getItem("mobile"),
//           role: await AsyncStorage.getItem("role"),
//           _id: await AsyncStorage.getItem("_id"),
//           superAdminExist: await AsyncStorage.getItem("superAdminExist") 
//           // ==='true'
//         };
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Auth check error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };



  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token", "name", "email", "mobile", "role", "_id", "superAdminExist"
      ]);
      setUser(null);
      Alert.alert("Success", "User Logout Success")
      router.push('/login')
    
      return true;
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert("Failed", "Failed to Logout")
      return false;
    }
  };


  const value = {
    user,
    loading,
    backendURL,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;




