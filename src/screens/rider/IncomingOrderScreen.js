import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import api from '../../services/api';

const IncomingOrderScreen = ({ route, navigation }) => {
  const { orderId, amount, distance } = route.params;
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      navigation.goBack();
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/orders/${orderId}/accept`);
      if (response.data.success) {
        Alert.alert('Success', 'Order Accepted!');
        navigation.navigate('Delivery', { order: response.data.data });
      } else {
        Alert.alert('Too late', response.data.message);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>New Order Alert!</Text>
        <Text style={styles.timer}>{timer}s</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Earnings:</Text>
          <Text style={styles.value}>₹40.00</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Order Value:</Text>
          <Text style={styles.value}>₹{amount}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Distance:</Text>
          <Text style={styles.value}>{distance} mins</Text>
        </View>

        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={handleAccept}
          disabled={loading}
        >
          <Text style={styles.buttonText}>ACCEPT ORDER</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.rejectButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E63946',
    marginBottom: 10,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#2a9d8f',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rejectButton: {
    marginTop: 20,
  },
  rejectText: {
    color: '#666',
    fontSize: 16,
  }
});

export default IncomingOrderScreen;
