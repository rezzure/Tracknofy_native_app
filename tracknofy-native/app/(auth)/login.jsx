
import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/tracknofy3.jpg'

import { Formik } from 'formik';
// import validationSchema from '../../utils/authSchema'
import { useRouter } from 'expo-router';
import validationSchema from '../../utils/authSuperAdminSchema';
//firebase provide automatic create user with email and password
// import { createUserWithEmailAndPassword } from "firebase/auth"
// import { doc, setDoc } from 'firebase/firestore'
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth, db } from '../../config/firebaseConfig'

const Signup = () => {

    // [Note: Make sure setup on firebase when you started implement signup functionality]

    //import from expo-router
    const router = useRouter();


    // //import from "firebase/auth"
    // const auth = getAuth();
    // //firestore provide db
    // const db = getFirestore()

    //actually handleSubmit submitting the handleSignup
    //firebase provide automatic create user with email and password

    // const handleSignup = async (values, { resetForm }) => {
    //     try {
    //         console.log("Attempting signup with:", values.email);

    //         // Create user with email and password
    //         const userCredentials = await createUserWithEmailAndPassword(
    //             auth,
    //             values.email,
    //             values.password
    //         );

    //         const user = userCredentials.user;
    //         console.log("User created successfully:", user.uid);

    //         // Add user data to Firestore
    //         try {
    //             await setDoc(doc(db, 'users', user.uid), {
    //                 email: values.email,
    //                 createdAt: new Date(),
    //                 uid: user.uid  //will create ids automatic
    //             });
    //             console.log("User data saved to Firestore");
    //         } catch (firestoreError) {
    //             console.error("Firestore error:", firestoreError.message);
    //             // Don't throw here, just log the error
    //         }

    //         // Save to AsyncStorage
    //         await AsyncStorage.setItem("userEmail", values.email);
    //         await AsyncStorage.setItem("userId", user.uid);
    //         await AsyncStorage.setItem("isGuest", "false");

    //         // Get and log stored values properly
    //         const storedEmail = await AsyncStorage.getItem("userEmail");
    //         console.log("Stored email:", storedEmail);
    //         console.log("Firebase user:", user);

    //         // Show success message
    //         Alert.alert("Success", "Account created successfully!");

    //         // Reset form and navigate
    //         resetForm();
    //         router.push("/home");

    //     } catch (error) {
    //         //for server error
    //         console.error("Signup error:", error.code, error.message);

    //         // User-friendly error messages
    //         let errorMessage = "An error occurred during signup. Please try again.";

    //         if (error.code === 'auth/email-already-in-use') {
    //             errorMessage = "This email is already registered. Please use a different email or sign in.";
    //         } else if (error.code === 'auth/invalid-email') {
    //             errorMessage = "The email address is invalid. Please check and try again.";
    //         } else if (error.code === 'auth/weak-password') {
    //             errorMessage = "Password is too weak. Please use at least 6 characters.";
    //         }

    //         Alert.alert("Signup Failed", errorMessage);
    //     }
    // }

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
                            // onSubmit={handleSignup}
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
                                    />
                                    {touched.password && errors.password && (
                                        <Text className='text-red-500 text-xs mb-2'>{errors.password}</Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={()=> router.push('/dashboard')}
                                        className="p-2 my-2 bg-[#0d2b55] rounded-lg mt-6"
                                        disabled={isSubmitting}
                                    >
                                        <Text className="text-lg font-semibold text-center text-white">
                                            {isSubmitting ? "Login....." : "Login"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>

                {/* <View className="flex-1">
                    <Image source={entryImg} className="w-full h-full" resizeMode="contain" />
                </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Signup;