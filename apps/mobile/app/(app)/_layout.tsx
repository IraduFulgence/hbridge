import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../src/stores/auth";

export default function AppLayout() {

    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);

    if(!isAuthenticated){
        return <Redirect href="/(auth)/login" />;
    }
    return (
        <Stack screenOptions={{headerShown:false, animation: 'slide_from_right'}}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}