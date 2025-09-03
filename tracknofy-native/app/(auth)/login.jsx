
// import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import logo from '../../assets/images/tracknofy3.jpg'

// import { Formik } from 'formik';
// // import validationSchema from '../../utils/authSchema'
// import { useRouter } from 'expo-router';
// import validationSchema from '../../utils/authSuperAdminSchema';
// import { useAuth } from '../contexts/AuthContext';

// // import AsyncStorage from "@react-native-async-storage/async-storage";


// const Login = () => {

   
//     const router = useRouter();
//     const backendURL = 'http://192.168.31.94:3000'

//     // const {backendURL} = useAuth()
    

//     const handleLogin = async(values)=>{

//     const formDataToSend = new FormData();
//      formDataToSend.append('email' , values.email)
//      formDataToSend.append('password', values.password)
//           try {
//             const response = await fetch(`${backendURL}/api/auth/login`, {
//                 method : 'POST',
//                 headers : {
//                     "Content-Type" : "multipart/form-data"
//                 },
//                 body: formDataToSend
//             })

//             console.log(response)
//           } catch (error) {
//             console.log('failed to submit login', error.message)
//           }
//     }



//     return (
//         <SafeAreaView className={`bg-[#ffff]`}>
//             <ScrollView contentContainerStyle={{ height: '100%' }}>
//                 <StatusBar barStyle={"light-content"} backgroundColor={"#3e3"} />
//                 <View className="m-2 flex justify-center items-center">
//                     <Image source={logo} style={{ width: 200, height: 160 }} />
//                     <Text className="text-2xl text-center text-black font-bold mb-5 "> Tracknofy Login</Text>

//                     <View className="w-full p-5 border rounded-lg">
//                         <Formik
//                             initialValues={{ email: "", password: "" }}
//                             validationSchema={validationSchema}
//                             onSubmit={handleLogin}
//                         >
//                             {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
//                                 <View className="w-full">
//                                     <Text className='text-black mt-4 mb-2'>Email*</Text>
//                                     <TextInput
//                                         className="h-10 border border-black text-black rounded px-2"
//                                         keyboardType='email-address'
//                                         onChangeText={handleChange('email')}
//                                         onBlur={handleBlur('email')}
//                                         value={values.email}
//                                         placeholder="Enter your email"
//                                         placeholderTextColor="#999"
                                       
//                                     />
//                                     {touched.email && errors.email && (
//                                         <Text className='text-red-500 text-xs mb-2'>{errors.email}</Text>
//                                     )}

//                                     <Text className='text-black mt-4 mb-2'>Password*</Text>
//                                     <TextInput
//                                         className="h-10 border border-black text-black rounded px-2"
//                                         secureTextEntry
//                                         onChangeText={handleChange('password')}
//                                         onBlur={handleBlur('password')}
//                                         value={values.password}
//                                         placeholder="Enter your password"
//                                         placeholderTextColor="#999"
//                                     />
//                                     {touched.password && errors.password && (
//                                         <Text className='text-red-500 text-xs mb-2'>{errors.password}</Text>
//                                     )}

//                                     <TouchableOpacity
//                                         onPress={()=> router.push('/dashboard')}
//                                         className="p-2 my-2 bg-[#0d2b55] rounded-lg mt-6"
//                                         disabled={isSubmitting}
//                                     >
//                                         <Text className="text-lg font-semibold text-center text-white">
//                                             {isSubmitting ? "Login....." : "Login"}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             )}
//                         </Formik>
//                     </View>
//                 </View>

//                 {/* <View className="flex-1">
//                     <Image source={entryImg} className="w-full h-full" resizeMode="contain" />
//                 </View> */}
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default Login;



import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/tracknofy3.jpg'

import { Formik } from 'formik';
import validationSchema from '../../utils/authSuperAdminSchema';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const router = useRouter();
    const backendURL = 'http://192.168.31.94:3000';
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //important code
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                }),
            });

            const data = await response.json();
            console.log(data)
            
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
                router.replace("/superadmin/dashboard");
            } else {
                // Store regular user data
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("name", data.data.name);
                await AsyncStorage.setItem("email", data.data.email);
                await AsyncStorage.setItem("mobile", data.data.mobile);
                await AsyncStorage.setItem("role", data.data.role);
                await AsyncStorage.setItem("_id", data.data._id);
                
                Alert.alert("Success", "Login Successful");
                
                // Redirect based on role
                if (data.data.role === "admin") {
                    router.replace("/admin");
                } else if (data.data.role === "client" || data.data.role === "supervisor") {
                    router.replace("/common-layout");
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