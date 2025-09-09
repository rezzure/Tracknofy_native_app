
import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/tracknofy3.jpg'
import { Formik } from 'formik';
import validationSchema from '../../utils/authSuperAdminSchema';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';



const Login = () => {
    const router = useRouter();
    
    const { backendURL } = useAuth()
      
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true); // For checking existing auth

    // Check if user is already logged in
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const role = await AsyncStorage.getItem("role");
                const superAdminExist = await AsyncStorage.getItem("superAdminExist");

                if (token) {
                    // Redirect based on role
                    if (superAdminExist === "true") {
                        router.replace("(superadmin)/dashboard");
                    } else if (role === "admin") {
                        router.replace("(admin)/dashboard");
                    } else if (role === "client") {
                        router.replace("(client)/dashboard");
                    } else if (role === "supervisor") {
                        router.replace("(supervisor)/dashboard");
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Function to fetch user details properly
    const fetchUserDetails = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const name = await AsyncStorage.getItem("name");
            const email = await AsyncStorage.getItem("email");
            const mobile = await AsyncStorage.getItem("mobile");
            const role = await AsyncStorage.getItem("role");
            const _id = await AsyncStorage.getItem("_id");
            const superAdminExist = await AsyncStorage.getItem("superAdminExist");

            console.log("User Details:", {
                token,
                name,
                email,
                mobile,
                role,
                _id,
                superAdminExist
            });

            return { token, name, email, mobile, role, _id, superAdminExist };
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    // Call this function when you need to see user details
    useEffect(() => {
        const getUserDetails = async () => {
            const userDetails = await fetchUserDetails();
            console.log("User Details:", userDetails);
        };

        getUserDetails();
    }, []);

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                }),
            });

            const data = await response.json();
            console.log("Login Response:", data);
            
            if (!data.success) {
                Alert.alert("Login Failed", data.message || "Invalid Login Credentials");
                return;
            }

            if (data.superAdminExist === true) {
                // Store Super Admin data
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("name", data.superAdminData.name);
                await AsyncStorage.setItem("email", data.superAdminData.email);
                await AsyncStorage.setItem("mobile", data.superAdminData.mobile);
                await AsyncStorage.setItem("role", data.superAdminData.role);
                await AsyncStorage.setItem("_id", data.superAdminData._id);
                await AsyncStorage.setItem('superAdminExist', "true");
                
                Alert.alert("Success", "Super Admin Login Successful");
                router.replace("(superadmin)/dashboard");
            } else {
                // Store regular user data
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("name", data.data.name);
                await AsyncStorage.setItem("email", data.data.email);
                await AsyncStorage.setItem("mobile", data.data.mobile);
                await AsyncStorage.setItem("role", data.data.role);
                await AsyncStorage.setItem("_id", data.data._id);
                await AsyncStorage.setItem('superAdminExist', "false");
                
                Alert.alert("Success", "Login Successful");
                
                // Redirect based on role
                if (data.data.role === "admin") {
                    router.replace("(admin)/dashboard");
                } else if (data.data.role === "client") {
                    router.replace("(client)/dashboard");
                } else if(data.data.role === "supervisor"){
                    router.replace("(supervisor)/dashboard");
                } else {
                    Alert.alert("Error", "Unknown user role");
                }
            }
        } catch (error) {
            console.error('Login error:', error.message);
            Alert.alert("Error", "Failed to connect to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading indicator while checking auth status
    if (checkingAuth) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#0d2b55" />
                <Text className="mt-4 text-black">Checking authentication...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={`bg-[#ffff]`}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <StatusBar barStyle={"light-content"} backgroundColor={"#3e3"} />
                <View className="m-2 flex justify-center items-center">
                    <Image source={logo} style={{ width: 200, height: 160 }} />
                    <Text className="text-2xl text-center text-black font-bold mb-5 "> Tracknofy Login</Text>

                    <View className="w-full p-5 border rounded-lg">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View className="w-full">
                                    <Text className='text-black mt-4 mb-2'>Email*</Text>
                                    <TextInput
                                        className="h-10 border border-black text-black rounded px-2"
                                        keyboardType='email-address'
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                    />
                                    {touched.email && errors.email && (
                                        <Text className='text-red-500 text-xs mb-2'>{errors.email}</Text>
                                    )}

                                    <Text className='text-black mt-4 mb-2'>Password*</Text>
                                    <TextInput
                                        className="h-10 border border-black text-black rounded px-2"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                    />
                                    {touched.password && errors.password && (
                                        <Text className='text-red-500 text-xs mb-2'>{errors.password}</Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="p-2 my-2 bg-[#0d2b55] rounded-lg mt-6"
                                        disabled={isSubmitting || isLoading}
                                    >
                                        <Text className="text-lg font-semibold text-center text-white">
                                            {(isSubmitting || isLoading) ? "Logging in..." : "Login"}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Button to test fetching user details */}
                                    <TouchableOpacity
                                        onPress={fetchUserDetails}
                                        className="p-2 my-2 bg-gray-500 rounded-lg mt-4"
                                    >
                                        <Text className="text-lg font-semibold text-center text-white">
                                            Test Get User Details
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Login;
