import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const DeliveryScreen = ({ route, navigation }) => {
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    setLoading(true);
    try {
      const response = await api.patch(`/orders/${order._id}/status`, { status });
      if (response.data.success) {
        setOrder(response.data.data);
        if (status === 'delivered') {
          Alert.alert('Completed!', 'Order delivered successfully');
          navigation.navigate('RiderHome');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getButtonConfig = () => {
    switch (order.status) {
      case 'accepted': return { label: 'CONFIRM PICKUP', status: 'picked', color: '#457B9D' };
      case 'picked': return { label: 'OUT FOR DELIVERY', status: 'out_for_delivery', color: '#1D3557' };
      case 'out_for_delivery': return { label: 'MARK DELIVERED', status: 'delivered', color: '#2a9d8f' };
      default: return null;
    }
  };

  const config = getButtonConfig();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Text style={styles.custName}>{order.customer_id.name}</Text>
        <Text style={styles.custPhone}>{order.customer_id.phone}</Text>
        <Text style={styles.custAddress}>Koramangala, 5th Block, Bangalore</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text>{item.name}</Text>
            <Text>₹{item.price}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalVal}>₹{order.total_amount}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Status</Text>
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>

      {config && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: config.color }]} 
          onPress={() => updateStatus(config.status)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionText}>{config.label}</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  custName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  custPhone: {
    fontSize: 16,
    color: '#457B9D',
    marginTop: 5,
  },
  custAddress: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#f1faee',
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalVal: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#E63946',
  },
  statusBadge: {
    backgroundColor: '#F1FAEE',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#1D3557',
    fontWeight: 'bold',
  },
  actionButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default DeliveryScreen;
