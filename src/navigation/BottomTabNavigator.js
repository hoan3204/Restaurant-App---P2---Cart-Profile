import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import InboxScreen from "../screens/InboxScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Alert } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();

  // Kiểm tra đăng nhập khi tab được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const user = await AsyncStorage.getItem("currentUser");
        if (!user) {
          navigation.navigate("Auth");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể kiểm tra phiên đăng nhập");
      }
    });

    return unsubscribe;
  }, [navigation]);

  // Render icon cho các tab
  const getTabIcon = (route, focused, color, size) => {
    const iconMap = {
      Home: focused ? "home" : "home-outline",
      Cart: focused ? "cart" : "cart-outline",
      Inbox: focused ? "chatbox" : "chatbox-outline",
      Profile: focused ? "person" : "person-outline",
    };

    return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabIcon(route, focused, color, size),
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
          marginBottom: 5,
          fontWeight: "bold",
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: "#f3f3f3",
          backgroundColor: "#fff",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Giỏ hàng",
          // Uncomment nếu muốn thêm badge
          // tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{ title: "Tin nhắn" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;