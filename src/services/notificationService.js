import * as Notifications from 'expo-notifications';
import * as Device from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    // Save token to backend
    await api.post('/rider/fcm-token', { fcm_token: token });
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export function setupNotificationListeners(navigation) {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
    const data = notification.request.content.data;
    if (data.orderId) {
      // If it's a new order notification, show the incoming order screen
      navigation.navigate('IncomingOrder', { 
        orderId: data.orderId, 
        amount: data.amount || '0', 
        distance: data.distance || '0' 
      });
    }
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Tapped:', response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}
