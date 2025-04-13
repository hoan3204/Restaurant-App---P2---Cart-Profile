import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const deliveryFee = 30000; // 30.000 VND

  // Hàm xử lý nguồn ảnh an toàn
  const getImageSource = (item) => {
    if (typeof item.image === 'string') {
      return { uri: item.image };
    } else if (typeof item.image === 'number') {
      return item.image;
    }
    return require('../../assets/placeholder.png');
  };

  // Load giỏ hàng khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCartItems);
    return unsubscribe;
  }, [navigation]);

  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        setCartItems(items);
        calculateTotal(items);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  // Tính tổng tiền
  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(subtotal);
  };

  // Cập nhật giỏ hàng trong AsyncStorage
  const updateCart = async (updatedItems) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedItems));
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật giỏ hàng');
    }
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = (itemId) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    updateCart(updatedItems);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (itemId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            updateCart(updatedItems);
          }
        }
      ]
    );
  };

  // Xác nhận đặt hàng
  const handleConfirmOrder = () => {
    Alert.alert(
      'Xác nhận đặt hàng',
      `Tổng cộng: ${(totalPrice + deliveryFee).toLocaleString()} VND`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            completeOrder();
          }
        }
      ]
    );
  };

  // Hoàn tất đặt hàng
  const completeOrder = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCartItems([]);
      setTotalPrice(0);
      Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt thành công!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hoàn tất đơn hàng');
    }
  };

  // Hiển thị loading khi đang tải
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Danh sách sản phẩm */}
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={getImageSource(item)}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString()} VND</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Ionicons name="remove" size={16} color="#6C63FF" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Ionicons name="add" size={16} color="#6C63FF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff5252" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Tổng kết đơn hàng */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính:</Text>
              <Text style={styles.summaryValue}>{totalPrice.toLocaleString()} VND</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
              <Text style={styles.summaryValue}>{deliveryFee.toLocaleString()} VND</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{(totalPrice + deliveryFee).toLocaleString()} VND</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.checkoutText}>XÁC NHẬN ĐẶT HÀNG</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#cccccc" />
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>MUA SẮM NGAY</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 180,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  checkoutButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginVertical: 20,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;