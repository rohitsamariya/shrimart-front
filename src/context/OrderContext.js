import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);

  const createOrder = async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      if (response.data.success) {
        setActiveOrder(response.data.data);
        return { success: true, order: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Order failed' };
    }
  };

  const fetchMyOrders = async () => {
    try {
      const response = await api.get('/orders/my');
      if (response.data.success) {
        setPastOrders(response.data.data);
      }
    } catch (error) {
      console.error('Fetch orders error', error);
    }
  };

  return (
    <OrderContext.Provider value={{ activeOrder, setActiveOrder, pastOrders, createOrder, fetchMyOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
