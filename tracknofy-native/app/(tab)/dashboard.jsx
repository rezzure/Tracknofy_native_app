import {Text, Image, Platform, ScrollView, ImageBackground, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/tracknofy3.jpg'

import { BlurView } from 'expo-blur';


import { router, useRouter } from 'expo-router'

import { boolean } from 'yup'


export default function Dashboard() {

//   const router = useRouter()



  // const restaurants = restaurants; //bevakoofi

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => router.push(`/restaurant/${item.name}`)} className='bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md'>
//       <Image resizeMode='cover' source={{ uri: item.image }} className='h-28 mt-2 mb-1 rounded-lg' />
//       <Text className='text-white text-lg font-bold mb-2'>{item.name}</Text>
//       <Text className='text-white text-base mb-2'>{item.address}</Text>
//       <Text className='text-white text-base mb-2'>Open: {item.opening} - Close: {item.closing}</Text>
//     </TouchableOpacity>
//   )




  return (
    // type arrays stylling
    <SafeAreaView style={[{ backgroundColor: "#2b2b2b" }, Platform.OS === "android" && { paddingBottom: 50 }, Platform.OS === 'ios' && { paddingBottom: 20 }]}>

      <View className='flex items-center '>
        <View className='bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-center items-center flex flex-row p-2'>
          <View className='flex flex-row items-center justify-center'>
            <Text className={`text-base h-10 ${Platform.OS === "ios" ? "pt-[8px]" : "pt-1"} align-middle text-white`}> {" "} Welcome to {" "}</Text>
            <Image source={logo} resizeMethod='cover' className={"w-20 h-12"} />
           
          </View>

        </View>
      </View>


      {/* It will help you in scrolling */}
      {/* ScrollView --less amount of data(less static) */}
      {/* FlatList --large amount of data(more efficient) */}
      <ScrollView stickyHeaderIndices={[0]} >
        <ImageBackground source='' resizeMode='cover' className='mb
        -4 w-full h-52 items-center justify-center bg-[#2b2b2b]'>
          <BlurView intensity={Platform.OS === 'android' ? 100 : 25} tint='dark' className='w-full p-4 shadow-lg ' >
            <Text className='text-center text-3xl font-bold text-white'>Dine with your loved ones</Text>
          </BlurView>
        </ImageBackground>

        <View className='p-4 bg-[#2b2b2b] flex-row items-center'>
          <Text className='text-3xl text-white mr-2 font-semibold'>
            Special Discount %
          </Text>
        </View>

        {/* ye scollview ke bahar scrolable nhi hai */}

      


        <View className='p-4 bg-[#2b2b2b] flex-row items-center'>
          <Text className='text-3xl text-[#fb9b33] mr-2 font-semibold'>
            Our Restaurants
          </Text>
        </View>

        {/* ye scollview ke bahar scrolable nhi hai */}

      </ScrollView>



    </SafeAreaView>
  )
}
