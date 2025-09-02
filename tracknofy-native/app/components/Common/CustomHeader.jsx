import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import MenuModal from './MenuModal';

export default function CustomHeader() {
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Site Management</Text>
      
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <MenuModal isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
  },
  notificationButton: {
    padding: 4,
    marginLeft: 16,
  },
});