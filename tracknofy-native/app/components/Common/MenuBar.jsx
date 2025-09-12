// // import React, { useState } from 'react';
// // import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useRouter } from 'expo-router';

// // const MenuBar = ({setProfileModalVisible}) => {
// //   const [isMenuVisible, setIsMenuVisible] = useState(false);
// //   const [slideAnim] = useState(new Animated.Value(-300)); // Start off-screen to the left
// //   const [overlayOpacity] = useState(new Animated.Value(0)); // For overlay opacity
// //   const router = useRouter();

// //   // Toggle menu visibility with smooth animation
// //   const toggleMenu = () => {
// //     if (isMenuVisible) {
// //       // Hide menu with animation
// //       Animated.parallel([
// //         Animated.timing(slideAnim, {
// //           toValue: -300,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(overlayOpacity, {
// //           toValue: 0,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //       ]).start(() => setIsMenuVisible(false));
// //     } else {
// //       // Show menu with animation
// //       setIsMenuVisible(true);
// //       Animated.parallel([
// //         Animated.timing(slideAnim, {
// //           toValue: 0,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(overlayOpacity, {
// //           toValue: 0.5,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     }
// //   };

// //   // Navigate to a screen and close the menu
// //   const navigateTo = (screen) => {
// //     router.push(`/client/${screen}`);
// //     toggleMenu(); // Close menu after navigation
// //   };

// //   return (
// //     <View className="flex-row justify-between items-center px-4 py-3 bg-blue-600">
// //       {/* Left side - Menu Icon */}
// //       <TouchableOpacity onPress={toggleMenu} className="p-2">
// //         <Ionicons name="menu" size={28} color="white" />
// //       </TouchableOpacity>

// //       {/* Right side - Profile Icon */}
// //       {/* onPress={() => setProfileModalVisible(true)} */}
// //       {/*  onPress={() => router.push('/client/profile')} */}

// //       <TouchableOpacity 
// //         onPress={() => setProfileModalVisible(true)}
// //         className="p-2"
// //       >
// //         <Ionicons name="person-circle" size={28} color="white" />
// //       </TouchableOpacity>

// //       {/* Side Menu Overlay */}
// //       {isMenuVisible && (
// //         <Animated.View 
// //           style={[StyleSheet.absoluteFill, { 
// //             backgroundColor: 'rgba(0,0,0,0.5)',
// //             opacity: overlayOpacity,
// //             zIndex: 10,
// //           }]} 
// //           onTouchEnd={toggleMenu} // Close menu when tapping outside
// //         />
// //       )}

// //       {/* Side Menu */}
// //       {isMenuVisible && (
// //         <Animated.View 
// //           style={[
// //             styles.menuContainer,
// //             { 
// //               transform: [{ translateX: slideAnim }],
// //             },
// //           ]}
// //           className="bg-white"
// //         >
// //           {/* Menu Header */}
// //           <View className="p-4 border-b border-gray-200">
// //             <Text className="text-lg font-bold text-blue-800">Menu</Text>
// //           </View>
          
// //           {/* Menu Items */}
// //           <TouchableOpacity 
// //             onPress={() => navigateTo('dashboard')}
// //             className="flex-row items-center p-4 border-b border-gray-100"
// //           >
// //             <Ionicons name="home" size={22} className="text-blue-600 mr-3" />
// //             <Text className="text-gray-800">Home</Text>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity 
// //             onPress={() => navigateTo('payments')}
// //             className="flex-row items-center p-4 border-b border-gray-100"
// //           >
// //             <Ionicons name="card" size={22} className="text-blue-600 mr-3" />
// //             <Text className="text-gray-800">Payment</Text>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity 
// //             onPress={() => navigateTo('siteUpdate')}
// //             className="flex-row items-center p-4 border-b border-gray-100"
// //           >
// //             <Ionicons name="document-text" size={22} className="text-blue-600 mr-3" />
// //             <Text className="text-gray-800">Progress</Text>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity 
// //             onPress={() => navigateTo('helpDesk')}
// //             className="flex-row items-center p-4 border-b border-gray-100"
// //           >
// //             <Ionicons name="chatbubble-ellipses" size={22} className="text-blue-600 mr-3" />
// //             <Text className="text-gray-800">Message</Text>
// //           </TouchableOpacity>
// //         </Animated.View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   menuContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     bottom: 0,
// //     width: 300, // Adjust width as needed
// //     zIndex: 20, // Higher than overlay
// //   },
// // });

// // export default MenuBar;



// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Animated,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../../contexts/AuthContext';

// const MenuBar = ({ userData = { name: 'shiv kumar', email: 'shivkumar@gmail.com' } }) => {
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen to the left
//   const overlayAnim = useRef(new Animated.Value(0)).current; // For overlay opacity
//   const router = useRouter();
 
//   const { logout } = useAuth()
//   // Toggle menu visibility with smooth animation

//   const toggleMenu = () => {
//     if (isMenuVisible) {
//       // Close menu
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: -300,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(overlayAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => setIsMenuVisible(false));
//     } else {
//       // Open menu
//       setIsMenuVisible(true);
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(overlayAnim, {
//           toValue: 0.5,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   };

//   // Navigate to a screen and close menu
//   const navigateTo = (screen) => {
//     toggleMenu();
//     router.push(`/${screen}`);
//   };


//   // Navigate to notification screen with right-to-left animation
//   const navigateToNotifications = (e) => {
//     // Prevent event from bubbling to parent elements
//     // important notification was work on first mount but after second click not work
//     if (e && e.stopPropagation) e.stopPropagation();
    
//     // Close menu if it's open
//     if (isMenuVisible) {
//       toggleMenu();
//     }
    
//     // Use a slight delay to ensure menu closes before navigation
//     setTimeout(() => {
//       router.push('notifications');
//     }, 100);
//   };

//   // Navigate to profile editing screen
//   const navigateToProfileEdit = () => {
//     toggleMenu();
//     router.replace('/profile');
//   };

//   return (
//     <>
//       {/* Main Menu Bar */}
//       <SafeAreaView className="bg-[#1d3557]">
//         <View className="flex-row justify-between items-center px-4 py-3">
//           {/* Left Side - Menu Icon */}
//           <TouchableOpacity onPress={toggleMenu} className="p-2">
//             <Ionicons name="menu" size={28} color="white" />
//           </TouchableOpacity>

//           {/* Center - App Title (optional) */}
//           <Text className="text-white text-xl font-bold">Tracknofy</Text>

//           {/* Right Side - Notification Icon */}
//            {/* Add this to ensure the touch event doesn't bubble */}
//           <TouchableOpacity onPress={navigateToNotifications} onPressIn={(e) => e.stopPropagation()} className="p-2">
//             <Ionicons name="notifications" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>

//       {/* Overlay when menu is open */}
//       {isMenuVisible && (
//         <Animated.View
//           style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: overlayAnim }]}
//           className="z-10"
//         >
//           <TouchableOpacity
//             style={StyleSheet.absoluteFill}
//             onPress={toggleMenu}
//             activeOpacity={1}
//           />
//         </Animated.View>
//       )}

//       {/* Side Menu */}
//       {isMenuVisible && (
//         <Animated.View
//           style={[
//             styles.menuContainer,
//             {
//               transform: [{ translateX: slideAnim }],
//             },
//           ]}
//           className="z-20"
//         >
//           <SafeAreaView className="flex-1 bg-white">
//             {/* User Profile Section */}
//             <View className="p-5 bg-[#1d3557]">
//               <View className="flex-row items-center">
//                 <View className="w-16 h-16 rounded-full bg-blue-300 items-center justify-center mr-4">
//                   <Ionicons name="person" size={32} color="white" />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="text-white text-lg font-bold">{userData.name}</Text>
//                   <Text className="text-blue-100">{userData.email}</Text>
//                 </View>
//                 <TouchableOpacity onPress={navigateToProfileEdit} className="p-2">
//                   <Ionicons name="create-outline" size={22} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Menu Items */}
//             <View className="flex-1 p-4">
//               <TouchableOpacity
//                 onPress={() => navigateTo('dashboard')}
//                 className="flex-row items-center py-4 border-b border-gray-200"
//               >
//                 <Ionicons name="home-outline" size={22} className="text-blue-600 mr-4" />
//                 <Text className="text-lg text-gray-800">Dashboard</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => navigateTo('payments')}
//                 className="flex-row items-center py-4 border-b border-gray-200"
//               >
//                 <Ionicons name="card-outline" size={22} className="text-blue-600 mr-4" />
//                 <Text className="text-lg text-gray-800">Payments</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => navigateTo('siteUpdate')}
//                 className="flex-row items-center py-4 border-b border-gray-200"
//               >
//                 <Ionicons name="document-text-outline" size={22} className="text-blue-600 mr-4" />
//                 <Text className="text-lg text-gray-800">Site Updates</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => navigateTo('helpDesk')}
//                 className="flex-row items-center py-4 border-b border-gray-200"
//               >
//                 <Ionicons name="chatbubble-ellipses-outline" size={22} className="text-blue-600 mr-4" />
//                 <Text className="text-lg text-gray-800">Help Desk</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Footer with logout button */}
//             <View className="p-2 border-t border-b border-gray-200 m-5">
//               <TouchableOpacity className="flex-row items-center py-3" onPress={()=> logout()}>
//                 <Ionicons name="log-out-outline" size={22} className="text-red-500 mr-4" />
//                 <Text className="text-lg text-red-500">Logout</Text>
//               </TouchableOpacity>
//             </View>
//           </SafeAreaView>
//         </Animated.View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   menuContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     width: 300, // Adjust width as needed
//     backgroundColor: 'white',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 2,
//       height: 0,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 20,
//   },
// });

// export default MenuBar;



import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Icon mapping for menu items
const iconMap = {
  FiHome: 'home-outline',
  FiDollarSign: 'card-outline',
  FiClipboard: 'document-text-outline',
  FiClock: 'time-outline',
  FiBox: 'cube-outline',
  FiBriefcase: 'briefcase-outline',
  FiUserPlus: 'person-add-outline',
  FiUser: 'person-outline',
  FiTool: 'construct-outline',
  MdHelp: 'help-circle-outline',
};

const MenuBar = ({ userData = { name: 'User', email: 'user@example.com' } }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { logout, backendURL } = useAuth();

  // Fetch menu items based on user role
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      
      if (!token || !role) {
        console.error('No token or role found');
        return;
      }

      const response = await fetch(`${backendURL}/api/get/role`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          token: token,
        },
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to fetch roles:', data.message);
        return;
      }
      
      // Find the user's role in the response
      const userRole = data.data.find(item => item.roleName === role);
      console.log(userRole)
      if (userRole && userRole.features) {
        setMenuItems(userRole.features);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      fetchMenuItems();
    }
  }, [isMenuVisible]);

  // Toggle menu visibility with smooth animation
  const toggleMenu = () => {
    if (isMenuVisible) {
      // Close menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsMenuVisible(false));
    } else {
      // Open menu
      setIsMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Navigate to a screen and close menu
  const navigateTo = (path) => {
    toggleMenu();
    router.push(`/${path}`);
  };

  // Navigate to notification screen
  const navigateToNotifications = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (isMenuVisible) {
      toggleMenu();
    }
    
    setTimeout(() => {
      router.push('notifications');
    }, 100);
  };

  // Navigate to profile editing screen
  const navigateToProfileEdit = () => {
    toggleMenu();
    router.replace('/profile');
  };

  return (
    <>
      {/* Main Menu Bar */}
      <SafeAreaView className="bg-[#1d3557]">
        <View className="flex-row justify-between items-center mt-6 px-4 py-3">
          {/* Left Side - Menu Icon */}
          <TouchableOpacity onPress={toggleMenu} className="p-2">
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>

          {/* Center - App Title */}
          <Text className="text-white text-xl font-bold">Tracknofy</Text>

          {/* Right Side - Notification Icon */}
          <TouchableOpacity 
            onPress={navigateToNotifications} 
            onPressIn={(e) => e.stopPropagation()} 
            className="p-2"
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Overlay when menu is open */}
      {isMenuVisible && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: overlayAnim }]}
          className="z-10"
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Side Menu */}
      {isMenuVisible && (
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
          className="z-20"
        >
          <SafeAreaView className="flex-1">
            {/* User Profile Section */}
            <View className="p-5 bg-[#1d3557] pt-10">
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-blue-300 items-center justify-center mr-4">
                  <Ionicons name="person" size={32} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold">{userData.name}</Text>
                  <Text className="text-blue-100">{userData.email}</Text>
                </View>
                <TouchableOpacity onPress={navigateToProfileEdit} className="p-2">
                  <Ionicons name="create-outline" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Items */}
            <View className="flex-1 p-4">
              {loading ? (
                <ActivityIndicator size="large" color="#1d3557" className="py-8" />
              ) : menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => navigateTo(item.path)}
                    className="flex-row items-center py-4 border-b border-gray-200"
                  >
                    <Ionicons 
                      name={iconMap[item.icon] || 'help-outline'} 
                      size={22} 
                      className="text-blue-600 mr-4" 
                    />
                    <Text className="text-lg text-gray-800">{item.featureName}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-gray-500 text-center py-8">
                  No menu items available
                </Text>
              )}
            </View>

            {/* Footer with logout button */}
            <View className="p-2 border-t border-b border-gray-200 m-5">
              <TouchableOpacity className="flex-row items-center py-3" onPress={() => logout()}>
                <Ionicons name="log-out-outline" size={22} className="text-red-500 mr-4" />
                <Text className="text-lg text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20,
  },
});

export default MenuBar;