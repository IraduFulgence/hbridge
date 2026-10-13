
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen(){

    return(
        <View style = {styles.container}>
            <Text style ={styles.title}>Hello from hBridge</Text>
            <Text style ={styles.subtitle}>Mobile App is running</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent:'center'
    },
    title:{
        fontSize: 24,
        fontWeight: '700',
        color: '#111827'
    },
    subtitle:{
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
});