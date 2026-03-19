import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';

// Customer Screens
import CustomerHome from '../screens/customer/HomeScreen';
import CartScreen from '../screens/customer/CartScreen';
import OrderTracking from '../screens/customer/OrderTrackingScreen';

// Rider Screens
import RiderDashboard from '../screens/rider/RiderDashboard';
import DeliveryScreen from '../screens/rider/DeliveryScreen';
import IncomingOrder from '../screens/rider/IncomingOrderScreen';

import { useEffect } from 'react';
import { setupNotificationListeners, registerForPushNotificationsAsync } from '../services/notificationService';
import { startLocationTracking } from '../services/locationService';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, token, loading } = useAuth();

  useEffect(() => {
    let unsubscribeNotif;
    let stopLocation;

    if (token) {
        // Setup Push Notifications
        registerForPushNotificationsAsync();
        
        // Setup Location for Rider
        if (user?.role === 'rider') {
            const runner = async () => {
                stopLocation = await startLocationTracking(user.role);
            };
            runner();
        }
    }

    return () => {
        if (unsubscribeNotif) unsubscribeNotif();
        if (stopLocation) stopLocation();
    };
  }, [token, user]);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!token ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyOTP" component={OTPScreen} options={{ title: 'Verify OTP' }} />
          </>
        ) : user?.role === 'rider' ? (
          // Rider Stack
          <>
            <Stack.Screen name="RiderHome" component={RiderDashboard} options={{ title: 'Rider Dashboard' }} />
            <Stack.Screen name="Delivery" component={DeliveryScreen} options={{ title: 'Delivery Details' }} />
            <Stack.Screen name="IncomingOrder" component={IncomingOrder} options={{ presentation: 'modal', headerShown: false }} />
          </>
        ) : (
          // Customer Stack
          <>
            <Stack.Screen name="Home" component={CustomerHome} options={{ title: 'Shrimart' }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
            <Stack.Screen name="Tracking" component={OrderTracking} options={{ title: 'Track Order' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
