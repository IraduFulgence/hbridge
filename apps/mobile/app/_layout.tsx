import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { useAuthStore } from '../src/stores/auth';
import { useEffect } from 'react';
export default function RootLayout() {

  const hydrate = useAuthStore((state)=> state.hydrate);

  useEffect(()=>{
    hydrate();

  },[hydrate]);
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name ="(auth)" />
      <Stack.Screen name ="(app)" />
      <Stack.Screen name ="index" />
      
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}