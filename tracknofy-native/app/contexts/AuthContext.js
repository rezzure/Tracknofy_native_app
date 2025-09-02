import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
    const [user, setUser] = useState({role:"client"});
  const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Error checking login status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (userData, token) => {
//     try {
//       await AsyncStorage.setItem('userData', JSON.stringify(userData));
//       await AsyncStorage.setItem('authToken', token);
//       setUser(userData);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem('userData');
//       await AsyncStorage.removeItem('authToken');
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

  const value = {
    user,
    // login,
    // logout,
    loading,
    // isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};