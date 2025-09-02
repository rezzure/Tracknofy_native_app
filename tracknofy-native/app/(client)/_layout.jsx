
import { Tabs } from 'expo-router';

// import CustomHeader from '../../components/common/CustomHeader';
// import TabBarIcon from '../../components/common/TabBarIcon';

// import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../../assets/Color';
import { Alert } from 'react-native';
import CustomHeader from '../components/Common/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

export default function ClientLayout() {
//   const { user } = useAuth();

//   if (user?.role !== 'client') {
//     return <Redirect href="/" />;
//   }

//   if (user?.role !== 'client') {
//     return ( Alert.alert('user is not client'));
//   }



  return (
    <Tabs
      screenOptions={{
       header: ()=> <CustomHeader/>,
        
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.dark.text,
        tabBarStyle: {
          backgroundColor: Colors.SECONDARY,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
             <Ionicons name="home" size={24} color={"white"} />
          ),
        }}
      />
      <Tabs.Screen
        name="helpDesk"
        options={{
          title: 'Message',
          tabBarIcon: ({ color, focused }) => (
           
             <Ionicons name="help" size={24} color={color} />
          ),
        }}
      />
     
    
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
             <Ionicons name="person-sharp" size={24} color={"black"} />
          ),
        }}
      />
    </Tabs>
  );
}