import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useVerifyOtp } from '../../src/api/auth';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { tempToken } = useLocalSearchParams<{ tempToken: string }>();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  const verifyMutation = useVerifyOtp();

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = (codeToVerify?: string) => {
    const finalCode = codeToVerify ?? code;

    if (finalCode.length !== OTP_LENGTH) {
      Alert.alert('Invalid code', 'Please enter all 6 digits.');
      return;
    }

    if (!tempToken) {
      Alert.alert('Session error', 'Please log in again.');
      router.replace('/(auth)/login');
      return;
    }

    verifyMutation.mutate(
      { tempToken, code: finalCode },
      {
        onSuccess: () => {
          router.replace('/(app)/home');
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || 'Invalid or expired code';
          Alert.alert(
            'Verification failed',
            Array.isArray(message) ? message.join(', ') : message,
          );
          setCode('');
          setTimeout(() => inputRef.current?.focus(), 200);
        },
      },
    );
  };

  const handleChange = (text: string) => {
    const numeric = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(numeric);

    if (numeric.length === OTP_LENGTH) {
      setTimeout(() => handleVerify(numeric), 200);
    }
  };

  // Tap anywhere on the OTP row to focus the hidden input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to your phone</Text>

      {/* The 6 boxes are tappable and forward focus to the hidden input */}
      <Pressable style={styles.otpRow} onPress={focusInput}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => {
          const digit = code[i] ?? '';
          const isFocused = code.length === i; // current cursor position
          return (
            <View
              key={i}
              style={[styles.otpBox, isFocused && styles.otpBoxFocused]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden input — captures actual keyboard input */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        editable={!verifyMutation.isPending}
        autoFocus
        caretHidden
        // Make it tappable even at height 0
        pointerEvents="auto"
      />

      <TouchableOpacity
        style={[
          styles.button,
          (verifyMutation.isPending || code.length !== OTP_LENGTH) &&
            styles.buttonDisabled,
        ]}
        onPress={() => handleVerify()}
        disabled={verifyMutation.isPending || code.length !== OTP_LENGTH}
      >
        {verifyMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.backLink}>← Back to sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    top: -100, // off-screen but focusable
  },
  button: {
    height: 48,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    marginTop: 24,
    fontSize: 14,
    color: '#16A34A',
    textAlign: 'center',
    fontWeight: '500',
  },
});