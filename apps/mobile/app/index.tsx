import { Redirect } from "expo-router";
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import { useAuthStore } from "../src/stores/auth";

export default function Index(){
  const isHydrating = useAuthStore((state)=> state.isHydrating);
  const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);

  // if the app is still hydrating, we show a loading screen
  if(isHydrating){
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }
  // if the user is authenticated,
  if(isAuthenticated){

  return <Redirect href="/(app)/home" />;
  }
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});