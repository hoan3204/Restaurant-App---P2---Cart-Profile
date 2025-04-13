import React from "react";
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("currentUser");
              navigation.replace("Auth");
            } catch (error) {
              Alert.alert("Lỗi", "Đăng xuất không thành công");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Nguyễn Đình Hoàn</Text>
        <Text style={styles.profileEmail}>hoan25913@gmail.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="home-outline"
          text="Home"
          onPress={() => navigation.navigate("Home")}
        />
        <MenuItem
          icon="card-outline"
          text="My Card"
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />
        <View style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color="black" />
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            thumbColor={isDarkMode ? "#6C63FF" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#6C63FF80" }}
          />
        </View>
        <MenuItem
          icon="cart-outline"
          text="Track Your Order"
          onPress={() => navigation.navigate("Cart")}
        />
        <MenuItem
          icon="settings-outline"
          text="Settings"
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />
        <MenuItem
          icon="help-circle-outline"
          text="Help Center"
          onPress={() => Alert.alert("Thông báo", "Liên hệ: hoan25913@gmail.com")}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="black" />
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
  },
  menuContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});