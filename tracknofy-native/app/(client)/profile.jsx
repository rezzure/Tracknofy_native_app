import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'expo-router';



export default function Profile() {

  // const auth = getAuth()


//   const handleLogout = async() => {
//     try {
//       // 1st methods
//       // await AsyncStorage.removeItem('userEmail')
//       // router.push("/signin")

//       // 2nd methods
//       // firebase provide methods thats help to signout

//       await signOut(auth)
//       await AsyncStorage.removeItem('userEmail')
//       setUserEmail(null)

//       Alert.alert("Success", "User Logout Success")
//       router.push("/signin")

//     } catch (error) {
//       console.log("Error in Logout", error.message)
//       Alert.alert("Logged Error", "Error while Logging out")
//     }
     

//   }


  return (
    <View className='flex-1 justify-center items-center bg-[#2b2b2b]'>
      <Text className='text-xl text-[#f49b33] font-semibold mb-4'>User profile</Text>
      
          <TouchableOpacity
           
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10" >
            <Text className="text-lg font-semibold text-center">
              Log Out
            </Text>
          </TouchableOpacity>
        
          <TouchableOpacity
           
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"

          >
            <Text className="text-lg font-semibold text-center">
              Sign Up
            </Text>
          </TouchableOpacity>
      
      
    </View>
  )
}