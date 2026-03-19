import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated } from 'react-native';
import api from '../../services/api';

const OrderTrackingScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await api.get('/orders/my');
        if (response.data.success) {
          const currentOrder = response.data.data.find(o => o._id === orderId);
          setOrder(currentOrder);
        }
      } catch (error) {
        console.error('Tracking fetch error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000); // Poll every 5s for MVP
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading || !order) return <View style={styles.center}><Text>Loading Tracking Info...</Text></View>;

  const getStatusMessage = () => {
    switch (order.status) {
      case 'pending': return 'Looking for a nearby rider...';
      case 'accepted': return 'Rider assigned! Preparing order...';
      case 'picked': return 'Rider has picked up your order';
      case 'out_for_delivery': return 'Rider is on the way to you!';
      case 'delivered': return 'Order Delivered! Enjoy your meal.';
      case 'cancelled': return 'Order Cancelled';
      default: return 'Processing...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>{getStatusMessage()}</Text>
        <Text style={styles.etaText}>ETA: {order.eta} mins</Text>
      </View>

      <View style={styles.trackerContainer}>
        {['pending', 'accepted', 'picked', 'out_for_delivery', 'delivered'].map((step, index) => {
            const stepIndex = ['pending', 'accepted', 'picked', 'out_for_delivery', 'delivered'].indexOf(order.status);
            const isCompleted = index <= stepIndex;
            return (
                <View key={step} style={styles.stepRow}>
                    <View style={[styles.dot, isCompleted && styles.dotActive]} />
                    <Text style={[styles.stepText, isCompleted && styles.textActive]}>{step.replace('_', ' ').toUpperCase()}</Text>
                </View>
            )
        })}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <Text style={styles.orderId}>ID: #{order._id.slice(-8)}</Text>
        <Text style={styles.amount}>Total: ₹{order.total_amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHeader: {
    backgroundColor: '#F1FAEE',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8DADC',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3557',
    textAlign: 'center',
  },
  etaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E63946',
    marginTop: 10,
  },
  trackerContainer: {
    paddingLeft: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginRight: 20,
  },
  dotActive: {
    backgroundColor: '#457B9D',
  },
  stepText: {
    color: '#999',
    fontSize: 14,
  },
  textActive: {
    color: '#1D3557',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  orderId: {
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  }
});

export default OrderTrackingScreen;
