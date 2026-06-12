import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash screen after app loads
SplashScreen.hide();

// Check if running natively
if (Capacitor.isNativePlatform()) {
  console.log('Running as native app');
  
  // Listen for messages from your web app
  window.addEventListener('message', async (event) => {
    if (event.data.type === 'REQUEST_LOCATION') {
      try {
        const position = await Geolocation.getCurrentPosition();
        // Send location back to web app
        document.querySelector('iframe')?.contentWindow?.postMessage({
          type: 'LOCATION_RESULT',
          coords: position.coords
        }, 'https://weather-tiff.vercel.app');
      } catch (error) {
        console.error('Location error:', error);
      }
    }
  });
}
