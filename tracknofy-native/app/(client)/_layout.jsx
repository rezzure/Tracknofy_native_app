
// // import React, { useState, useEffect } from 'react';
// // import { Tabs } from 'expo-router';
// // import { View, Text, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // // import { AuthProvider } from '../../contexts/AuthContext';
// // import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
// // import CustomHeader from '../components/Common/MenuBar';


// // export default function ClientLayout() {
// //   // const { user } = useAuth();
// //   const router = useRouter();
// //   const segments = useSegments();
// //   const rootNavigationState = useRootNavigationState();
// //   const [activeTab, setActiveTab] = useState('dashboard');
// //   const [scaleAnims] = useState({
// //     dashboard: new Animated.Value(1),
// //     payments: new Animated.Value(1),
// //     siteUpdate: new Animated.Value(1),
// //     helpdesk: new Animated.Value(1),
// //   });

// //   // Set active tab based on current route
// //   useEffect(() => {
// //     if (rootNavigationState?.key) {
// //       const currentSegment = segments[segments.length - 1];
// //       if (currentSegment && scaleAnims[currentSegment]) {
// //         setActiveTab(currentSegment);
// //       }
// //     }
// //   }, [segments, rootNavigationState]);

// //   // Smooth press animation for tabs
// //   const animateTabPress = (tabName) => {
// //     // Reset all animations first
// //     Object.keys(scaleAnims).forEach(key => {
// //       Animated.timing(scaleAnims[key], {
// //         toValue: 1,
// //         duration: 150,
// //         easing: Easing.ease,
// //         useNativeDriver: true,
// //       }).start();
// //     });

// //     // Animate the pressed tab
// //     Animated.sequence([
// //       Animated.timing(scaleAnims[tabName], {
// //         toValue: 0.85,
// //         duration: 100,
// //         easing: Easing.ease,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(scaleAnims[tabName], {
// //         toValue: 1,
// //         duration: 100,
// //         easing: Easing.ease,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   };

  
// //   return (
// //     // <AuthProvider>
// //       <Tabs
// //         screenOptions={{
// //           headerShown: false,
// //           tabBarHideOnKeyboard: true,
// //         }}
// //       >
// //       {/* Dashboard Tab */}
// //       <Tabs.Screen
// //         name="dashboard"
// //         options={{
// //           title: 'Home',
// //           tabBarIcon: ({ color, size, focused }) => (
// //             <Ionicons 
// //               name={focused ? 'home' : 'home-outline'} 
// //               size={size} 
// //               color={color} 
// //             />
// //           ),
// //         }}
// //         listeners={{
// //           tabPress: () => animateTabPress('dashboard'),
// //         }}
// //       />

// //       {/* Payments Tab */}
// //       <Tabs.Screen
// //         name="payments"
// //         options={{
// //           title: 'Payment',
// //           tabBarIcon: ({ color, size, focused }) => (
// //             <Ionicons 
// //               name={focused ? 'card' : 'card-outline'} 
// //               size={size} 
// //               color={color} 
// //             />
// //           ),
// //         }}
// //         listeners={{
// //           tabPress: () => animateTabPress('payments'),
// //           focus: () => {
// //             // API CALL: Fetch payments data when tab is focused
// //             // Example: api.get('/client/payments').then(...).catch(...)
// //             console.log('Fetching payments data...');
// //           },
// //         }}
// //       />

// //       {/* Site Update Tab */}
// //       <Tabs.Screen
// //         name="siteUpdate"
// //         options={{
// //           title: 'Progress',
// //           tabBarIcon: ({ color, size, focused }) => (
// //             <Ionicons 
// //               name={focused ? 'document-text' : 'document-text-outline'} 
// //               size={size} 
// //               color={color} 
// //             />
// //           ),
// //         }}
// //         listeners={{
// //           tabPress: () => animateTabPress('siteUpdate'),
// //           focus: () => {
// //             // API CALL: Fetch site updates when tab is focused
// //             // Example: api.get('/client/site-updates').then(...).catch(...)
// //             console.log('Fetching site updates...');
// //           },
// //         }}
// //       />

// //       {/* HelpDesk Tab */}
// //       <Tabs.Screen
// //         name="helpDesk"
// //         options={{
// //           title: 'Message',
// //           tabBarIcon: ({ color, size, focused }) => (
// //             <Ionicons 
// //               name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
// //               size={size} 
// //               color={color} 
// //             />
// //           ),
// //         }}
// //         listeners={{
// //           tabPress: () => animateTabPress('helpdesk'),
// //           focus: () => {
// //             // API CALL: Fetch help desk messages when tab is focused
// //             // Example: api.get('/client/helpdesk').then(...).catch(...)
// //             console.log('Fetching help desk messages...');
// //           },
// //         }}
// //       />


// //        <Tabs.Screen
// //         name="profile"
// //         options={{
// //           href: null, // This hides the screen from the tab bar
// //         }}
// //       />
// //     </Tabs>
// //     // </AuthProvider>
// //   );
// // }




// import React, { useState, useEffect } from 'react';
// import { Tabs } from 'expo-router';
// import { View, Text, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
// import MenuBar from '../components/Common/MenuBar';
// import ProfileModal from '../components/Common/ProfileModal';
// // import MenuBar from '../components/Common/MenuBar';
// // import ProfileModal from '../components/Common/ProfileModal';

// export default function ClientLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const rootNavigationState = useRootNavigationState();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [scaleAnims] = useState({
//     dashboard: new Animated.Value(1),
//     payments: new Animated.Value(1),
//     siteUpdate: new Animated.Value(1),
//     helpdesk: new Animated.Value(1),
//   });
//   const [profileModalVisible, setProfileModalVisible] = useState(false);

//   // Sample user data - replace with actual data from your context/auth
//   const userData = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     mobile: "+1234567890"
//   };

//   // Set active tab based on current route
//   useEffect(() => {
//     if (rootNavigationState?.key) {
//       const currentSegment = segments[segments.length - 1];
//       if (currentSegment && scaleAnims[currentSegment]) {
//         setActiveTab(currentSegment);
//       }
//     }
//   }, [segments, rootNavigationState]);

//   // Smooth press animation for tabs
//   const animateTabPress = (tabName) => {
//     // Reset all animations first
//     Object.keys(scaleAnims).forEach(key => {
//       Animated.timing(scaleAnims[key], {
//         toValue: 1,
//         duration: 150,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }).start();
//     });

//     // Animate the pressed tab
//     Animated.sequence([
//       Animated.timing(scaleAnims[tabName], {
//         toValue: 0.85,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnims[tabName], {
//         toValue: 1,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   return (
//     <View className="flex-1">
//       {/* Menu Bar at the top */}
//       <MenuBar setProfileModalVisible={setProfileModalVisible}/>
      
//       {/* Tab Navigator */}
//       <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarHideOnKeyboard: true,
//         }}
//       >
//         {/* Dashboard Tab */}
//         <Tabs.Screen
//           name="dashboard"
//           options={{
//             title: 'Home',
//             tabBarIcon: ({ color, size, focused }) => (
//               <Ionicons 
//                 name={focused ? 'home' : 'home-outline'} 
//                 size={size} 
//                 color={color} 
//               />
//             ),
//           }}
//           listeners={{
//             tabPress: () => animateTabPress('dashboard'),
//           }}
//         />

//         {/* Payments Tab */}
//         <Tabs.Screen
//           name="payments"
//           options={{
//             title: 'Payment',
//             tabBarIcon: ({ color, size, focused }) => (
//               <Ionicons 
//                 name={focused ? 'card' : 'card-outline'} 
//                 size={size} 
//                 color={color} 
//               />
//             ),
//           }}
//           listeners={{
//             tabPress: () => animateTabPress('payments'),
//             focus: () => {
//               console.log('Fetching payments data...');
//             },
//           }}
//         />

//         {/* Site Update Tab */}
//         <Tabs.Screen
//           name="siteUpdate"
//           options={{
//             title: 'Progress',
//             tabBarIcon: ({ color, size, focused }) => (
//               <Ionicons 
//                 name={focused ? 'document-text' : 'document-text-outline'} 
//                 size={size} 
//                 color={color} 
//               />
//             ),
//           }}
//           listeners={{
//             tabPress: () => animateTabPress('siteUpdate'),
//             focus: () => {
//               console.log('Fetching site updates...');
//             },
//           }}
//         />

//         {/* HelpDesk Tab */}
//         <Tabs.Screen
//           name="helpDesk"
//           options={{
//             title: 'Message',
//             tabBarIcon: ({ color, size, focused }) => (
//               <Ionicons 
//                 name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
//                 size={size} 
//                 color={color} 
//               />
//             ),
//           }}
//           listeners={{
//             tabPress: () => animateTabPress('helpdesk'),
//             focus: () => {
//               console.log('Fetching help desk messages...');
//             },
//           }}
//         />

//         <Tabs.Screen
//           name="profile"
//           options={{
//             href: null, // This hides the screen from the tab bar
//           }}
//         />
//       </Tabs>
      
//       {/* Profile Modal */}
//       <ProfileModal 
//         visible={profileModalVisible}
//         onClose={() => setProfileModalVisible(false)}
//         userData={userData}
//       />
//     </View>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import MenuBar from '../components/Common/MenuBar';
import ProfileModal from '../components/Common/ProfileModal';

export default function ClientLayout() {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scaleAnims] = useState({
    dashboard: new Animated.Value(1),
    payments: new Animated.Value(1),
    siteUpdate: new Animated.Value(1),
    helpdesk: new Animated.Value(1),
  });
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Sample user data - replace with actual data from your context/auth
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+1234567890"
  };

  // Set active tab based on current route
  useEffect(() => {
    if (rootNavigationState?.key) {
      const currentSegment = segments[segments.length - 1];
      if (currentSegment && scaleAnims[currentSegment]) {
        setActiveTab(currentSegment);
      }
    }
  }, [segments, rootNavigationState]);

  // Smooth press animation for tabs
  const animateTabPress = (tabName) => {
    // Reset all animations first
    Object.keys(scaleAnims).forEach(key => {
      Animated.timing(scaleAnims[key], {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });

    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(scaleAnims[tabName], {
        toValue: 0.85,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[tabName], {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="flex-1">
      {/* Menu Bar at the top */}
      <MenuBar onProfilePress={() => setProfileModalVisible(true)} />
      
      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* Dashboard Tab */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
          listeners={{
            tabPress: () => animateTabPress('dashboard'),
          }}
        />

        {/* Payments Tab */}
        <Tabs.Screen
          name="payments"
          options={{
            title: 'Payment',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'card' : 'card-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
          listeners={{
            tabPress: () => animateTabPress('payments'),
            focus: () => {
              console.log('Fetching payments data...');
            },
          }}
        />

        {/* Site Update Tab */}
        <Tabs.Screen
          name="siteUpdate"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'document-text' : 'document-text-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
          listeners={{
            tabPress: () => animateTabPress('siteUpdate'),
            focus: () => {
              console.log('Fetching site updates...');
            },
          }}
        />

        {/* HelpDesk Tab */}
        <Tabs.Screen
          name="helpDesk"
          options={{
            title: 'Message',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
          listeners={{
            tabPress: () => animateTabPress('helpdesk'),
            focus: () => {
              console.log('Fetching help desk messages...');
            },
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            href: null, // This hides the screen from the tab bar
          }}
        />
      </Tabs>
      
      {/* Profile Modal */}
      <ProfileModal 
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        userData={userData}
      />
    </View>
  );
}