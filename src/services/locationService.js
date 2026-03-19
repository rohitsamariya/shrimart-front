import * as Location from 'expo-location';
import api from '../services/api';

export async function startLocationTracking(role) {
  if (role !== 'rider') return;

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  // Poll location every 20 seconds for MVP
  const interval = setInterval(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = location.coords;
      
      await api.post('/rider/location', { 
        coordinates: [longitude, latitude] 
      });
      console.log('Rider location updated:', [longitude, latitude]);
    } catch (error) {
      console.error('Location update error', error);
    }
  }, 20000);

  return () => clearInterval(interval);
}
