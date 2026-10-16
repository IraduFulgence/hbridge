import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { useAuthStore } from '../src/stores/auth';
import { useEffect } from 'react';
import '../src/i18n'; 
import { syncLanguageWithI18n } from '../src/i18n/sync';
import { useLanguageStore } from '../src/stores/language';
import { MenuProvider } from 'react-native-popup-menu';
export default function RootLayout() {

  const hydrate = useAuthStore((state)=> state.hydrate);
const hydrateLanguage = useLanguageStore((state) => state.hydrate);
  useEffect(()=>{
    hydrate();
    hydrateLanguage();

  },[hydrate, hydrateLanguage]);

    useEffect(() => {
    // Set up i18n sync once, after the first render
    syncLanguageWithI18n();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>
         <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name ="(auth)" />
      <Stack.Screen name ="(app)" />
      <Stack.Screen name ="index" />
      
      </Stack>
      <StatusBar style="auto" />
      </MenuProvider>
    </QueryClientProvider>
  );
}