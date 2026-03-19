import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';

const PRODUCTS = [
  { id: '1', name: 'Fresh Milk 1L', price: 60, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Brown Bread', price: 45, image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Amul Butter 100g', price: 55, image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Organic Eggs (6pcs)', price: 70, image: 'https://via.placeholder.com/100' },
  { id: '5', name: 'Basmati Rice 1kg', price: 120, image: 'https://via.placeholder.com/100' },
  { id: '6', name: 'Maggi Noodles', price: 14, image: 'https://via.placeholder.com/100' },
];

const HomeScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.cartBar} 
          onPress={() => navigation.navigate('Cart', { cartItems: cart })}
        >
          <View style={styles.cartInfo}>
            <ShoppingCart color="#fff" size={24} />
            <Text style={styles.cartText}>{cart.length} Items | ₹{cartTotal}</Text>
          </View>
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#E63946',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1D3557',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
