import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../assets/Color'
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{headerShown: false, tabBarActiveTintColor: Colors.PRIMARY,
            tabBarInactiveTintColor : Colors.dark.text,
            tabBarStyle : {
                backgroundColor : Colors.SECONDARY,
                paddingBottom : 14,
                height : 75,
            },
            tabBarLabelStyle : {fontSize : 12, fontWeight : "bold"}
           
         }}>
            <Tabs.Screen name='dashboard' options={{ title: "Dashboard", tabBarIcon:({color})=>{
              <Ionicons name="home" size={24} color={color} />
            },}} />
            <Tabs.Screen name='helpdesk' options={{ title: "HelpDesk", tabBarIcon : ({color})=>{
             <Ionicons name="message" size={24} color={color} />
            },}} />
            <Tabs.Screen name='profile' options={{ title: "Profile", tabBarIcon:({color})=>{
             <Ionicons name="person-sharp" size={24} color={color} />
            },}} />
        </Tabs>
    )
}

export default TabLayout


