import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../src/components/Header';
export default function ScreeningsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Header />
      <View style={styles.container}>
        <Ionicons name="clipboard-outline" size={64} color="#D1D5DB" />
        <Text style={styles.title}>{t('screenings.comingSoon')}</Text>
        <Text style={styles.subtitle}>{t('screenings.comingSoonHint')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});