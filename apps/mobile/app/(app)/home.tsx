import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth';
import { useHealth } from '../../src/api/health';
import { useTranslation } from 'react-i18next';
export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const { data: health, isLoading } = useHealth();

  const { t } = useTranslation();

  const handleLogout = async () => {
    await clearSession();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>
        {t('home.greeting')},{user?.firstName}
      </Text>
      <Text style={styles.role}>
        {user?.role?.replace(/_/g, ' ').toLowerCase()} · {user?.district ?? 'Rwanda'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('home.backendStatus')}</Text>
        {isLoading ? (
          <Text style={styles.row}>Loading...</Text>
        ) : health ? (
          <>
            <Text style={styles.status}> {health.data.service}</Text>
            <Text style={styles.row}>{t('home.database')}: {health.data.database.status}</Text>
            <Text style={styles.row}>{t('home.users')}: {health.data.database.userCount}</Text>
          </>
        ) : (
          <Text style={styles.row}>{t('home.cannotReachBackend')}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('home.signOut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
    marginBottom: 8,
  },
  row: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  logoutButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});