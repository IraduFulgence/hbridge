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
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVerifyOtp, useResendOtp } from '../../src/api/auth';
import { apiClient } from '../../src/api/client';
import { ApiResponse, LoginResponse, ResendOtpResponse } from '@hbridge/shared';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function OtpScreen() {
  const { tempToken, phone } = useLocalSearchParams<{
    tempToken: string;
    phone?: string;
  }>();
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);
  const [isResending, setIsResending] = useState(false);
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  // Auto-focus the hidden input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, []);

  // Resend countdown
  useEffect(() => {
  const timer = setInterval(() => {
    setSecondsLeft((s) => {
      if (s <= 1) {
        clearInterval(timer);
        return 0;
      }
      return s - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const handleVerify = (codeToVerify?: string) => {
    const finalCode = codeToVerify ?? code;

    if (finalCode.length !== OTP_LENGTH) {
      Alert.alert(t('auth.invalidCode'), t('auth.invalidCodeMessage'));
      return;
    }

    if (!tempToken) {
      Alert.alert(t('auth.verificationFailed'), t('auth.invalidOrExpired'));
      router.replace('/(auth)/login');
      return;
    }

    verifyMutation.mutate(
      { tempToken, code: finalCode },
      {
        onSuccess: () => router.replace('/(app)/home'),
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || t('auth.invalidOrExpired');
          Alert.alert(
            t('auth.verificationFailed'),
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

  const focusInput = () => inputRef.current?.focus();

  const formatPhone = (raw?: string) => {
    if (!raw) return '+250 788 000 003';
    
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 12) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }
    return raw;
  };
const handleResend = () => {
  if (!tempToken) return;

  resendMutation.mutate(
    { tempToken },
    {
      onSuccess: () => {
        // Reset countdown
        setSecondsLeft(RESEND_SECONDS);
        setCode('');
        setTimeout(() => inputRef.current?.focus(), 200);

        Alert.alert(
          t('auth.codeSent'),
          t('auth.checkYourPhone'),
        );
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || t('common.error');
        Alert.alert(
          t('common.error'),
          Array.isArray(message) ? message.join(', ') : message,
        );
      },
    },
  );
};
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(auth)/login')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      {/* Icon circle */}
      <View style={styles.iconCircle}>
        <Ionicons name="call" size={28} color="#16A34A" />
      </View>

      {/* Title */}
      <Text style={styles.title}>{t('auth.otpTitle')}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        {t('auth.otpSubtitle')}
      </Text>
      <Text style={styles.phoneText}>{formatPhone(phone)}</Text>

      {/* OTP boxes */}
      <Pressable style={styles.otpRow} onPress={focusInput}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => {
          const digit = code[i] ?? '';
          const isCursor = code.length === i;
          const isFilled = !!digit;
          return (
            <View
              key={i}
              style={[
                styles.otpBox,
                isCursor && styles.otpBoxActive,
                isFilled && !isCursor && styles.otpBoxFilled,
              ]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden input that captures keystrokes */}
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
      />

      {/* Resend countdown */}
  <View style={styles.resendRow}>
  <Ionicons
    name="reload-circle-outline"
    size={18}
    color={secondsLeft > 0 ? '#9CA3AF' : '#16A34A'}
  />
  {secondsLeft > 0 ? (
    <Text style={styles.resendText}>
      {t('auth.resendIn')} 0:{secondsLeft.toString().padStart(2, '0')}
    </Text>
  ) : (
    <TouchableOpacity onPress={handleResend} disabled={resendMutation.isPending}>
      <Text style={[styles.resendText, styles.resendTextActive]}>
        {resendMutation.isPending ? t('common.loading') : t('auth.resendNow')}
      </Text>
    </TouchableOpacity>
  )}
</View>

      {/* Verify button */}
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
          <Text style={styles.buttonText}>{t('auth.verify')}</Text>
        )}
      </TouchableOpacity>

      {/* Help link */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(t('auth.needHelp'), t('auth.contactSupport'))
        }
      >
        <Text style={styles.helpLink}>
          {t('auth.didntReceive')}{' '}
          <Text style={styles.helpLinkAccent}>{t('auth.getHelp')}</Text>
        </Text>
      </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  otpBoxFilled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    top: -100,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  resendText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  button: {
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  helpLink: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  helpLinkAccent: {
    color: '#16A34A',
    fontWeight: '700',
  },
  resendTextActive: {
  color: '#16A34A',
  fontWeight: '700',
  textDecorationLine: 'underline',
},
});