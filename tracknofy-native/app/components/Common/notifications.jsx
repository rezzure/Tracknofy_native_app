
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications = () => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  // Fetch user role from async storage
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("role");
        setUserRole(role || "Client");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("Client");
      }
    };

    fetchUserRole();
  }, []);

  // Sample notification data based on user role
  useEffect(() => {
    if (userRole) {
      // This would typically come from your backend API
      const roleBasedNotifications = {
        client: [
          {
            id: "1",
            title: "Payment Received",
            message: "Your payment of $5,000 has been received successfully.",
            time: "2 hours ago",
            type: "payment",
            read: false,
          },
          {
            id: "2",
            title: "Site Update",
            message: "Phase 1 construction is 75% complete. View details.",
            time: "1 day ago",
            type: "site_update",
            read: true,
          },
          {
            id: "3",
            title: "Help Desk Response",
            message: "Your query regarding material quality has been addressed.",
            time: "3 days ago",
            type: "helpdesk",
            read: true,
          },
        ],
        supervisor: [
          {
            id: "1",
            title: "New Task Assigned",
            message: "You have been assigned to oversee Site B construction.",
            time: "5 hours ago",
            type: "task",
            read: false,
          },
          {
            id: "2",
            title: "Material Delivery",
            message: "Cement shipment has arrived at Site A. Please confirm.",
            time: "1 day ago",
            type: "material",
            read: true,
          },
          {
            id: "3",
            title: "Vendor Approval Needed",
            message: "New vendor registration requires your approval.",
            time: "2 days ago",
            type: "vendor",
            read: true,
          },
        ],
        admin: [
          {
            id: "1",
            title: "Fund Transfer Required",
            message: "Site C requires additional funds for material purchase.",
            time: "1 hour ago",
            type: "funds",
            read: false,
          },
          {
            id: "2",
            title: "Expense Approval",
            message: "3 expense reports are pending your approval.",
            time: "5 hours ago",
            type: "expense",
            read: false,
          },
          {
            id: "3",
            title: "New User Registered",
            message: "A new supervisor has registered and needs role assignment.",
            time: "1 day ago",
            type: "user",
            read: true,
          },
        ],
      };

      setNotifications(roleBasedNotifications[userRole] || []);
    }
  }, [userRole]);

  useFocusEffect(
    useCallback(() => {
      // Reset animation state when screen is focused
      setIsExiting(false);
      
      // Immediately show content without animation
      slideAnim.setValue(0);

      return () => {
        // Clean up when screen loses focus
        slideAnim.setValue(0);
      };
    }, [])
  );

  const goBack = () => {
    if (isExiting) return; // Prevent multiple back presses
    
    setIsExiting(true);
    router.back();
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return "cash-outline";
      case "site_update":
        return "construct-outline";
      case "helpdesk":
        return "help-circle-outline";
      case "task":
        return "document-text-outline";
      case "material":
        return "cube-outline";
      case "vendor":
        return "business-outline";
      case "funds":
        return "wallet-outline";
      case "expense":
        return "receipt-outline";
      case "user":
        return "person-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "payment":
        return "#10B981"; // Green
      case "site_update":
        return "#3B82F6"; // Blue
      case "helpdesk":
        return "#8B5CF6"; // Purple
      case "task":
        return "#F59E0B"; // Amber
      case "material":
        return "#EF4444"; // Red
      case "vendor":
        return "#6366F1"; // Indigo
      case "funds":
        return "#06B6D4"; // Cyan
      case "expense":
        return "#F97316"; // Orange
      case "user":
        return "#EC4899"; // Pink
      default:
        return "#6B7280"; // Gray
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      style={[
        styles.notificationContainer,
        !item.read && styles.unreadNotification,
      ]}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getNotificationColor(item.type)}20` },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={[styles.animatedView, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Header with safe area padding */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={clearAllNotifications}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#9ca3af"
              />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubText}>
                We'll notify you when something arrives
              </Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  animatedView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 50 : 12, // Additional padding for iOS notch
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 16,
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    color: "#0d2b55",
    fontWeight: "500",
  },
  list: {
    flex: 1,
    backgroundColor: "white",
  },
  notificationContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  unreadNotification: {
    backgroundColor: "#F0F9FF",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0d2b55",
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default Notifications;