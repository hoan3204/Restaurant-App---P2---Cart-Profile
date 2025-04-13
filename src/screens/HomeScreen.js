import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = [
  { id: "1", name: "PIZZA", icon: "pizza-outline" },
  { id: "2", name: "BURGER", icon: "fast-food-outline" },
  { id: "3", name: "DRINK", icon: "beer-outline" },
  { id: "4", name: "RICI", icon: "restaurant-outline" },
];

const popularItems = [
  {
    id: "101",
    name: "BURGER",
    price: 8.99,
    image: require("../../assets/burger.png"),
    description: "Delicious beef burger with cheese",
    rating: 4.9
  },
  {
    id: "102",
    name: "PIZZA",
    price: 12.99,
    image: require("../../assets/pizza.png"),
    description: "Pepperoni pizza with extra cheese",
    rating: 4.7
  }
];

export default function HomeScreen({ navigation }) {
  const addToCart = async (product) => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      let items = cartData ? JSON.parse(cartData) : [];

      const existingItem = items.find(item => item.id === product.id);

      if (existingItem) {
        items = items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        items.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(items));
      Alert.alert("Success", `${product.name} added to cart`);
    } catch (error) {
      Alert.alert("Error", "Could not add to cart");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallText}>Your Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#6C63FF" />
            <Text style={styles.locationText}>Hà Nội, Việt Nam</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search your food"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        <Ionicons name="search-outline" size={20} color="#999" />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((item) => (
          <TouchableOpacity key={item.id} style={styles.category}>
            <Ionicons name={item.icon} size={28} color="#6C63FF" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hot Offer */}
      <TouchableOpacity
        style={styles.hotOfferContainer}
        onPress={() => addToCart({
          id: "100",
          name: "BURGER",
          price: 8.99,
          discount: 10,
          image: require("../../assets/burger.png")
        })}
      >
        <View style={styles.hotOfferTextContainer}>
          <Text style={styles.hotOfferName}>BURGER</Text>
          <View style={styles.discountContainer}>
            <Text style={styles.hotOfferDiscount}>10%</Text>
            <Text style={styles.offText}>OFF</Text>
          </View>
          <Text style={styles.hotOfferDescription}>Today's Hot offer</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.hotOfferRating}>4.9 (3k+ Rating)</Text>
          </View>
        </View>
        <Image source={require("../../assets/burger.png")} style={styles.hotOfferImage} />
      </TouchableOpacity>

      {/* Popular Items */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularItemsContainer}
      >
        {popularItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.popularItem}
            onPress={() => addToCart(item)}
          >
            <Image source={item.image} style={styles.popularImage} />
            <Text style={styles.popularText}>{item.name}</Text>
            <Text style={styles.popularPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

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
  smallText: {
    fontSize: 12,
    color: "#999",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  categoriesContainer: {
    paddingBottom: 15,
  },
  category: {
    marginRight: 25,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  hotOfferContainer: {
    backgroundColor: "#6C63FF",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  hotOfferTextContainer: {
    flex: 1,
  },
  hotOfferName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 5,
  },
  hotOfferDiscount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  offText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  hotOfferDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hotOfferRating: {
    fontSize: 12,
    color: "#fff",
  },
  hotOfferImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "bold",
  },
  popularItemsContainer: {
    paddingBottom: 20,
  },
  popularItem: {
    marginRight: 15,
    alignItems: "center",
  },
  popularImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  popularText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  popularPrice: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "bold",
    marginTop: 5,
  },
});