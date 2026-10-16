import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import usePatient from '../../../../src/api/patients';
import { Header } from '../../../../src/components/Header';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: patient, isLoading, isError, refetch } = usePatient(id);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Header  />
        
      </View>
    );
  }

  if (isError || !patient) {
    return (
      <View style={styles.root}>
        <Header  />
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={56} color="#9CA3AF" />
          <Text style={styles.errorTitle}>
            {t('patients.notFound', { defaultValue: 'Patient not found' })}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>
              {t('common.retry', { defaultValue: 'Retry' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`;

  const conditions: string[] = [];
  if (patient.hasHypertension)
    conditions.push(
      t('patients.hypertension', { defaultValue: 'Hypertension' }),
    );
  if (patient.hasDiabetes)
    conditions.push(t('patients.diabetes', { defaultValue: 'Diabetes' }));
  if (patient.hasEpilepsy)
    conditions.push(t('patients.epilepsy', { defaultValue: 'Epilepsy' }));

  return (
    <View style={styles.root}>
      <Header
        showBack
        title={`${patient.firstName} ${patient.lastName}`}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {patient.firstName} {patient.lastName}
              </Text>
              <Text style={styles.meta}>
                {patient.age ? `${patient.age} · ` : ''}
                {(patient.gender ?? '').toLowerCase()}
              </Text>
            </View>
          </View>

          {patient.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{patient.phone}</Text>
            </View>
          )}
          {patient.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{patient.address}</Text>
            </View>
          )}
          {patient.household?.village && (
            <View style={styles.infoRow}>
              <Ionicons name="home-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{patient.household.village}</Text>
            </View>
          )}
        </View>

        {/* Conditions */}
        <Text style={styles.sectionTitle}>
          {t('patients.conditions', { defaultValue: 'Conditions' })}
        </Text>

        {conditions.length > 0 ? (
          <View style={styles.chipsRow}>
            {conditions.map((c) => (
              <View key={c} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              {t('patients.noConditions', {
                defaultValue: 'No conditions recorded',
              })}
            </Text>
          </View>
        )}

        {/* Screenings placeholder */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          {t('patients.recentScreenings', {
            defaultValue: 'Recent screenings',
          })}
        </Text>
        <View style={styles.placeholderCard}>
          <Ionicons name="clipboard-outline" size={32} color="#D1D5DB" />
          <Text style={styles.placeholderText}>
            {t('patients.noScreenings', {
              defaultValue: 'No screenings recorded yet.',
            })}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() =>
            router.push(`/screenings/new?patientId=${patient.id}`)
          }
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>
            {t('patients.recordScreening', {
              defaultValue: 'Record screening',
            })}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
  },
  chipText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 13,
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    marginTop: 8,
    color: '#9CA3AF',
    fontSize: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: '#16A34A',
    borderRadius: 12,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});