import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useOrders } from '../../context/OrderContext';

const CartScreen = ({ route, navigation }) => {
  const { cartItems } = route.params;
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({ product_id: item.id, name: item.name, price: item.price })),
        total_amount: totalAmount,
        warehouse_location: { type: 'Point', coordinates: [77.5946, 12.9716] }, // Bangalore HSR
        customer_location: { type: 'Point', coordinates: [77.6101, 12.9304] }, // Example Koramangala
      };

      const result = await createOrder(orderPayload);
      if (result.success) {
        navigation.replace('Tracking', { orderId: result.order._id });
      } else {
        Alert.alert('Order Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalPrice}>₹{totalAmount}</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.orderButton} 
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.orderButtonText}>Place Order - ₹{totalAmount}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E63946',
  },
  orderButton: {
    backgroundColor: '#E63946',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
