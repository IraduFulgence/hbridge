import { useState } from "react";
import  { View, Text, TextInput, Button, StyleSheet, Alert
    , ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity
 } from "react-native";

 import { router } from "expo-router";
 import { useLogin } from "../../src/api/auth";

 export default function LoginScreen() {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    // handle login request

    const handleSubmit = () =>{
        if(!phone || !password){
            Alert.alert('Error', 'Please enter both phone and password');
            return;
        }

        loginMutation.mutate({phone,password},
            {
            onSuccess: (data) =>{
                // go to the OTP screen

                router.push({
                    pathname: '/(auth)/verifyotp',
                    params: {tempToken: data.tempToken},
                });

            },
            onError: (error:any) =>{
                const message = error?.response?.data?.message || error?.message || 'Invalid credentials';
                Alert.alert('Login failed', Array.isArray(message) ? message.join(', ') : message);
            },
        
        },);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <View style={styles.logo}>
                <Text style={styles.logoText}>HB</Text>

            </View>

            <Text style= {styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your details to login</Text>
            <View style={styles.form}>
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+250788000003"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          editable={!loginMutation.isPending}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          editable={!loginMutation.isPending}
        />

        <TouchableOpacity
          style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

        </KeyboardAvoidingView>
    );

 }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#16A34A',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: -8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 48,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});