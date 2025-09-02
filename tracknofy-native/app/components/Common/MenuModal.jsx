import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function MenuModal({ isVisible, onClose }) {
//   const { user, logout } = useAuth();
  const router = useRouter();

  const [user, setuser] = useState({role:"client"})


  const menuItems = [
    { label: 'Dashboard', screen: 'dashboard', icon: 'home' },
    { label: 'Notifications', screen: 'notifications', icon: 'notifications' },
    { label: 'Settings', screen: 'settings', icon: 'settings' },
    { label: 'Help & Support', screen: 'support', icon: 'help' },
    { label: 'Logout', action: "logout", icon: 'log-out' },
  ];

  // Add role-specific menu items
  if (user?.role === 'client') {
    menuItems.splice(1, 0, 
      { label: 'My Projects', screen: 'projects', icon: 'briefcase' },
      { label: 'Financial Overview', screen: 'finances', icon: 'cash' }
    );
  } else if (user?.role === 'supervisor') {
    menuItems.splice(1, 0, 
      { label: 'Site Management', screen: 'sites', icon: 'construct' },
      { label: 'Team Management', screen: 'team', icon: 'people' }
    );
  } else if (user?.role === 'admin') {
    menuItems.splice(1, 0, 
      { label: 'User Management', screen: 'users', icon: 'people' },
      { label: 'Financial Reports', screen: 'finances', icon: 'document' }
    );
  } else if (user?.role === 'superadmin') {
    menuItems.splice(1, 0, 
      { label: 'System Settings', screen: 'system', icon: 'settings' },
      { label: 'Audit Logs', screen: 'audit', icon: 'list' }
    );
  }

  const handleMenuItemPress = (item) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      router.push(`/${user.role}/${item.screen}`);
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role}</Text>
          </View>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
            >
              <Ionicons name={item.icon} size={22} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '70%',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  userInfo: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: 'gray',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
  },
  menuItemText: {
    fontSize: 16,
  },
});