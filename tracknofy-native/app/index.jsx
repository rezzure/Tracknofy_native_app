
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";// important'
import { enableScreens } from 'react-native-screens';
// const logo = require('../assets/images/dinetime.png');
import logo from '../assets/images/tracknofy3.jpg'

import { useRouter } from "expo-router";
// import entryImg from '../assets/images/Frame.png'

// import AsyncStorage from "@react-native-async-storage/async-storage";

enableScreens();

export default function Index() {

  //import from expo-routerr
  const router = useRouter();
  
  return (
    <SafeAreaView className={`bg-[#ffff]`}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <StatusBar barStyle={"light-content"} backgroundColor={"#3e3"} />
        <View className="m-2 flex justify-center items-center mt-10">
          <Image source={logo} style={{ width: 200, height: 200}}  />
          
          <View className="w-3/4">
          <View className='flex flex-row'>
            <View className="border-b-2 border-[#0d2b55] mb-1 w-14 relative bottom-2" /> 
            <Text className="text-xl font-bold text-center text-black mt-10 ">
                Welcome To Tracknofy
            </Text>
            <View className="border-b-2 border-[#0d2b55] mb-1 w-14 relative bottom-2"/> 
            </View>
             <Text className="text-lg font-semibold text-center text-black mt-10">
                 Click here to Login to Your account
            </Text>
            {/* onPress={()=> router.push('(client)/dashboard')} */}
            {/* onPress={() => router.push("/login")} */}
            <TouchableOpacity onPress={() => router.push("/login")} className="p-2 my-2 bg-[#0d2b55] rounded-lg mt-6">
              <Text className="text-lg font-semibold text-center text-white" >
                Login
              </Text>
            </TouchableOpacity>
          </View> 
        </View>
        
      {/* for image section */}
      <View className="flex-1">
        <Image  className="w-full h-full " resizeMode="contain"/>
      </View>

      </ScrollView>

    </SafeAreaView>

  );
}
