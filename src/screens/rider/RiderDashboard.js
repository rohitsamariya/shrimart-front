import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const RiderDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.is_online || false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, earnings: 0 });

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const response = await api.get('/orders/my');
      if (response.data.success) {
        const orders = response.data.data.filter(o => ['accepted', 'picked', 'out_for_delivery'].includes(o.status));
        setActiveOrders(orders);
        setStats({ totalOrders: response.data.data.length, earnings: response.data.data.filter(o => o.status === 'delivered').length * 40 });
      }
    } catch (error) {
      console.error('Rider orders fetch error', error);
    }
  };

  const toggleStatus = async (value) => {
    try {
      const response = await api.post('/rider/status', { is_online: value });
      if (response.data.success) {
        setIsOnline(value);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, {user?.name}</Text>
          <Text style={styles.statusLabel}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
        <Switch 
          value={isOnline} 
          onValueChange={toggleStatus} 
          trackColor={{ false: '#ddd', true: '#2a9d8f' }}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#E63946' }]}>₹{stats.earnings}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Active Orders ({activeOrders.length})</Text>
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard} 
            onPress={() => navigation.navigate('Delivery', { order: item })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{item._id.slice(-8)}</Text>
              <Text style={styles.orderStatus}>{item.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.orderLoc}>{item.customer_location.address || 'Koramangala, Bangalore'}</Text>
            <Text style={styles.orderAmount}>₹{item.total_amount}</Text>
          </TouchableOpacity>
        )}
        EmptyComponent={<Text style={styles.empty}>No active orders</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F1FAEE',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A8DADC',
  },
  statVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#457B9D',
  },
  orderStatus: {
    fontSize: 12,
    color: '#E63946',
    fontWeight: 'bold',
  },
  orderLoc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  orderAmount: {
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  logoutBtn: {
    marginTop: 'auto',
    alignSelf: 'center',
    padding: 10,
  },
  logoutText: {
    color: '#666',
    textDecorationLine: 'underline',
  }
});

export default RiderDashboard;
