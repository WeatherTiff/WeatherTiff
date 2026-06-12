import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash screen after app loads
SplashScreen.hide();

// Check if running natively
if (Capacitor.isNativePlatform()) {
  console.log('Running as native app');
  
  // Expose a function that your weather app can call
  window.getNativeLocation = async function() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Location error:', error);
      return null;
    }
  };
}
