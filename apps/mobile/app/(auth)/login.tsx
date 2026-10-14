import { useState } from "react";
import  { View, Text, TextInput, Button, StyleSheet, Alert
    , ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity
 } from "react-native";

 import { router } from "expo-router";
 import { useLogin } from "../../src/api/auth";
 import { Ionicons } from "@expo/vector-icons";
 import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

 
 
 export default function LoginScreen() {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useLogin();
    const { t } = useTranslation();
    // handle login request

    const handleSubmit = () =>{
        if(!phone || !password){
            Alert.alert('Error', t('auth.missingInfoMessage'));
            return;
        }

        // what happens when user forgets +250
        const formatphone = phone.startsWith('+') ?phone : `+250${phone.replace(/^0/, '')}`;

        loginMutation.mutate({phone: formatphone, password},
            {
            onSuccess: (data) =>{
                // go to the OTP screen

                router.push({
                    pathname: '/(auth)/verifyotp',
                    params: {tempToken: data.tempToken},
                });

            },
            onError: (error:any) =>{
                const message = error?.response?.data?.message || error?.message || t('auth.invalidCredentials');
                Alert.alert(t('auth.loginFailed'), Array.isArray(message) ? message.join(', ') : message);
            },
        
        },);
    };
    


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <LanguageSwitcher compact />

            {/* header */}
            <View style={styles.brand}>
                <View style={styles.logoBox}>
                    
                <Ionicons name="heart" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.brandName}>Hbridge</Text>
              </View>

              {/* heading texts */}
             <Text style={styles.eyebrow}>{t('auth.eyebrow')}</Text>
             <Text style={styles.title}>{t('auth.welcome')}</Text>
             <Text style={styles.subtitle}>
              {t('auth.subtitle')}
             </Text>


            {/* Phone input */}


        <Text style={styles.label}>{t('auth.phoneLabel')}</Text>
        <View style={styles.inputContainer}>
        <View style={styles.phonePrefix}>
          <Ionicons name="call-outline" size={16} color="#000000" />
          <Text style={styles.prefixText}>+250</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder={t('auth.phonePlaceholder')}
          placeholderTextColor="#9CA3AF"
          editable={!loginMutation.isPending}
        />
       </View>
            
        {/* Password input */}
      <Text style={styles.label}>{t('auth.passwordLabel')}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={16} color="#000000" />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder={t('auth.passwordPlaceholder')}
          placeholderTextColor="#9CA3AF"
          editable={!loginMutation.isPending}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          style={styles.eyeButton}
        >
         <Ionicons
         name={showPassword ? 'eye-off-outline' : 'eye-outline'}
         size={20}
        color="#000000"
        />
        </TouchableOpacity>
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{t('auth.signIn')}</Text>
        )}
      </TouchableOpacity>

      {/* Forgot password link */}
      <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Password reset is not yet available.')}>
        <Text style={styles.forgotLink}>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

      {/* Footer trust badge */}
      <View style={styles.footer}>
        <Text style={styles.footerIcon}>🔒</Text>
        <Text style={styles.footerText}>	{t('auth.footer')}</Text>
      </View>
        </KeyboardAvoidingView>
    );

 }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },

  // Brand
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
 
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: -0.3,
  },

  // Headings
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 22,
  },

  // Inputs
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
 
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  
  eyeButton: {
    padding: 4,
  },


  // Button
  button: {
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#16A34A',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Forgot
  forgotLink: {
    marginTop: 20,
    fontSize: 14,
    color: '#16A34A',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    gap: 6,
  },
  footerIcon: {
    fontSize: 11,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
