
// import { Tabs } from 'expo-router';

// // import CustomHeader from '../../components/common/CustomHeader';
// // import TabBarIcon from '../../components/common/TabBarIcon';

// // import { useAuth } from '../contexts/AuthContext';
// import { Colors } from '../../assets/Color';
// import { Alert } from 'react-native';
// import CustomHeader from '../components/Common/CustomHeader';
// import { Ionicons } from '@expo/vector-icons';

// export default function ClientLayout() {
// //   const { user } = useAuth();

// //   if (user?.role !== 'client') {
// //     return <Redirect href="/" />;
// //   }

// //   if (user?.role !== 'client') {
// //     return ( Alert.alert('user is not client'));
// //   }



//   return (
//     <Tabs
//       screenOptions={{
//        header: ()=> <CustomHeader/>,
        
//         tabBarActiveTintColor: Colors.PRIMARY,
//         tabBarInactiveTintColor: Colors.dark.text,
//         tabBarStyle: {
//           backgroundColor: Colors.SECONDARY,
//           paddingBottom: 8,
//           height: 60,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: 'bold',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="dashboard"
//         options={{
//           title: 'Dashboard',
//           tabBarIcon: ({ color, focused }) => (
//             // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
//              <Ionicons name="home" size={24} color={"white"} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="helpDesk"
//         options={{
//           title: 'Message',
//           tabBarIcon: ({ color, focused }) => (
           
//              <Ionicons name="help" size={24} color={color} />
//           ),
//         }}
//       />
     
    
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, focused }) => (
//             // <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
//              <Ionicons name="person-sharp" size={24} color={"black"} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

// Tailwind-inspired color palette
const Colors = {
  primary: '#3B82F6',     // Blue-500
  primaryDark: '#2563EB', // Blue-600
  secondary: '#10B981',   // Emerald-500
  accent: '#F59E0B',      // Amber-500
  light: '#F3F4F6',       // Gray-100
  dark: '#1F2937',        // Gray-800
  white: '#FFFFFF',
  gray: '#9CA3AF',        // Gray-400
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Red-500
};

export default function ClientLayout() {
  // const { user } = useAuth();
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

  // Custom tab bar component for better control
  // const CustomTabBar = ({ state, descriptors, navigation }) => {
  //   return (
  //     <View style={styles.tabBar}>
  //       {state.routes.map((route, index) => {
  //         const { options } = descriptors[route.key];
  //         const label = options.tabBarLabel || options.title || route.name;
  //         const isFocused = state.index === index;
  //         const tabName = route.name.toLowerCase();

  //         const onPress = () => {
  //           const event = navigation.emit({
  //             type: 'tabPress',
  //             target: route.key,
  //             canPreventDefault: true,
  //           });

  //           if (!isFocused && !event.defaultPrevented) {
  //             animateTabPress(tabName);
  //             // Navigate to the tab screen
  //             navigation.navigate(route.name);
  //           }
  //         };

  //         const onLongPress = () => {
  //           navigation.emit({
  //             type: 'tabLongPress',
  //             target: route.key,
  //           });
  //         };

  //         return (
  //           <TouchableOpacity
  //             key={route.key}
  //             accessibilityRole="button"
  //             accessibilityState={isFocused ? { selected: true } : {}}
  //             accessibilityLabel={options.tabBarAccessibilityLabel}
  //             testID={options.tabBarTestID}
  //             onPress={onPress}
  //             onLongPress={onLongPress}
  //             style={styles.tabItem}
  //           >
  //             <Animated.View style={[
  //               styles.tabIconContainer,
  //               isFocused && styles.activeTab,
  //               { transform: [{ scale: scaleAnims[tabName] }] }
  //             ]}>
  //               {options.tabBarIcon({
  //                 focused: isFocused,
  //                 color: isFocused ? Colors.primary : Colors.gray,
  //                 size: 24,
  //               })}
  //             </Animated.View>
  //             <Text style={[
  //               styles.tabLabel,
  //               { color: isFocused ? Colors.primary : Colors.gray }
  //             ]}>
  //               {label}
  //             </Text>
  //           </TouchableOpacity>
  //         );
  //       })}
  //     </View>
  //   );
  // };

  return (
    <Tabs
      // tabBar={props => <CustomTabBar {...props} />}
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
            // API CALL: Fetch payments data when tab is focused
            // Example: api.get('/client/payments').then(...).catch(...)
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
            // API CALL: Fetch site updates when tab is focused
            // Example: api.get('/client/site-updates').then(...).catch(...)
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
            // API CALL: Fetch help desk messages when tab is focused
            // Example: api.get('/client/helpdesk').then(...).catch(...)
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
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.light,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     height: 80,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.light,
//     paddingBottom: 10,
//     paddingTop: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabIconContainer: {
//     padding: 8,
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   activeTab: {
//     backgroundColor: `${Colors.primary}10`, // 10% opacity
//   },
//   tabLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     height: 60,
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.light,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.dark,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     right: -6,
//     top: -6,
//     backgroundColor: Colors.error,
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: Colors.white,
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
// });