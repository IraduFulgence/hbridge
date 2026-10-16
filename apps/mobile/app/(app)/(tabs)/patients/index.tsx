import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { usePatients } from '../../../../src/api/patients';
import { Header } from '../../../../src/components/Header';
import type { Patient } from '@hbridge/shared';

export default function PatientsScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data: patients, isLoading, isError, refetch, isRefetching } =
    usePatients();

  const filtered = useMemo(() => {
    if (!patients) return [];
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        (p.phone ?? '').includes(q),
    );
  }, [patients, search]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={56} color="#9CA3AF" />
          <Text style={styles.errorTitle}>{t('common.error')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header />

      {/* Page title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>
          {t('patients.title')} ({patients?.length ?? 0})
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t('patients.searchPlaceholder')}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* List or empty */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={56} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>
            {search ? t('patients.noResults') : t('patients.empty')}
          </Text>
          <Text style={styles.emptySubtitle}>
            {search ? t('patients.tryDifferent') : t('patients.emptyHint')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#16A34A"
            />
          }
          renderItem={({ item }) => (
            <PatientRow
              patient={item}
              onPress={() => router.push(`/patients/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

function PatientRow({
  patient,
  onPress,
}: {
  patient: Patient;
  onPress: () => void;
}) {
  const { t } = useTranslation();

  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`;
  const conditions = [
    patient.hasHypertension && t('patients.hypertension'),
    patient.hasDiabetes && t('patients.diabetes'),
    patient.hasEpilepsy && t('patients.epilepsy'),
  ].filter(Boolean);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowName}>
          {patient.firstName} {patient.lastName}
        </Text>
        <Text style={styles.rowMeta}>
          {patient.age ? `${patient.age} · ` : ''}
          {conditions.length > 0
            ? conditions.join(' · ')
            : t('patients.noConditions')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#16A34A',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 15,
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  rowMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});