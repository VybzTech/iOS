import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Hubot-Regular': require('@/assets/fonts/HubotSans-Regular.ttf'),
          'Hubot-Medium': require('@/assets/fonts/HubotSans-Medium.ttf'),
          'Hubot-SemiBold': require('@/assets/fonts/HubotSans-SemiBold.ttf'),
          'Hubot-Bold': require('@/assets/fonts/HubotSans-Bold.ttf'),
          'Hubot-ExtraBold': require('@/assets/fonts/HubotSans-ExtraBold.ttf'),
        });
        setFontsLoaded(true);
      } catch (err) {
        console.error('❌ Font loading error:', err);
        // Continue anyway with default font
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}