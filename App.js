import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import AuthScreen from "./src/screens/AuthScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Auth");

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const user = await AsyncStorage.getItem("currentUser");
        setInitialRoute(user ? "Main" : "Auth");
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };
    prepareApp();
  }, []);

  if (!isReady) return null; // Hoặc màn hình splash

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}