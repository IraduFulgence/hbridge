import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../src/stores/auth';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../src/components/Header';
import {usePatients} from '../../../src/api/patients';
import { Ionicons } from '@expo/vector-icons';


export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);


  const { t } = useTranslation();
  const {data:patients} = usePatients();
  const patientCount = patients?.length ?? 0;
  const previewPatients = (patients ?? []).slice(0, 3);
  const today = new Date().toLocaleDateString('en-GB',{
    weekday:'long',
    day:'numeric',
    month:'long',
    year:'numeric'
  });
  
  
  const handleLogout = async () => {
    await clearSession();
    router.replace('/(auth)/login');
  };

  return (
   <View style= {styles.root}>
    <Header />
    <ScrollView contentContainerStyle={styles.container} >

    {/* greeting box */}
      <Text style={styles.greeting}>
        {t('home.greeting', {lastName: user?.lastName})}
      </Text>
      {/* calendar icon */}
      
      <Text style={styles.date}><Ionicons name='calendar' size={16} /> {today}</Text>
    {/* end of greeting box */}

    {/* follow up alert */}
    <TouchableOpacity style={styles.alertCard} activeOpacity={0.8}>
            {/* start of alert icon */}
            <View style={styles.alertIcon}>
              <Ionicons name='notifications' size={20} color="#F59E0B"/>

            </View>
            {/* end of start alert icon */}
            <View style={styles.alertContent}>  
              <Text style={styles.alertTitle}>
                {t('home.followupDue', {count: 3})}
              </Text>

              <Text style={styles.alertSubtitle}>
                  {t('home.followupMessage')}
              </Text>

            </View>
            <Ionicons name='chevron-forward' size={20} color="#F59E0B" />
    </TouchableOpacity>
     {/* quick action */}
     <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
     <View style={styles.actionsRow}>
       <TouchableOpacity 
       style ={styles.actionCard}
       activeOpacity={0.7}
       onPress={() => router.push('/(app)/patients/new')}
       >
        <View style={styles.actionIcon}>
              <Ionicons name="add" size={24} color="#16A34A" />
            </View>
            <Text style={styles.actionTitle}>{t('home.newPatient')}</Text>
            <Text style={styles.actionSubtitle}>
              {t('home.newPatientHint')}
            </Text>
       </TouchableOpacity>

        <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(`/(app)/patients/${previewPatients[0]?.id ?? ''}`)
            }
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="clipboard" size={22} color="#16A34A" />
            </View>
            <Text style={styles.actionTitle}>{t('home.screening')}</Text>
            <Text style={styles.actionSubtitle}>
              {t('home.screeningHint')}
            </Text>
          </TouchableOpacity>
     </View>

     {/* my patients */}
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
            {t('home.myPatients',{count:patientCount})}
      </Text>
      <TouchableOpacity>
        <Text style={styles.viewAll}>
            {t('patients.viewAll')}
        </Text>
      </TouchableOpacity>
    </View>
   
   {previewPatients.length === 0 ?(
    <View style={styles.emptyState}>
      <Ionicons name='people-outline' size={40} color="#D1D5DB" />
      <Text style={styles.emptyText}>{t('patients.empty')}</Text>
    </View>


  ):(
    previewPatients.map((p) =>(
      <PatientPreviewRow key={p.id} patient={p} />
    ))
  )  
  }
    </ScrollView>
   
   </View>
  );
}

function PatientPreviewRow({patient}:{patient:any}){
  const {t} = useTranslation();
  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`;
  const status: 'stable' | 'review' | 'high' = 'stable';

  const condition = patient.hasHypertension
    ? t('patients.hypertension')
    : patient.hasDiabetes
    ? t('patients.diabetes')
    : t('patients.noConditions');

  const statusColor =
   status === 'high' ? '#DC2626' : status === 'review' ? '#F59E0B' : '#16A34A';
  const statusBg =
    status === 'high' ? '#FEE2E2' : status === 'review' ? '#FEF3C7' : '#DCFCE7';
  const statusLabel =
    status === 'high'
      ? t('patients.statusHigh')
      : status === 'review'
      ? t('patients.statusReview')
      : t('patients.statusStable');

  return (
    <TouchableOpacity
      style={styles.patientRow}
      onPress={() => router.push(`/(app)/patients/${patient.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.patientAvatar}>
        <Text style={styles.patientAvatarText}>{initials}</Text>
      </View>
      <View style={styles.patientContent}>
        <Text style={styles.patientName}>
          {patient.firstName} {patient.lastName}
        </Text>
        <Text style={styles.patientMeta}>
          {patient.age ? `${patient.age} · ` : ''}
          {condition}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          ● {statusLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
    root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    marginLeft:15
  },
   date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
    marginLeft:24,
  },
  // alert box

  alertCard:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    backgroundColor:'#FEF3C7',
    borderRadius:14,
    padding:14,
     marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
    alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#92400E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textTransform:'capitalize',
    marginLeft:17
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  viewAll: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 13,
    marginRight:25
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginLeft:12,
    marginRight:12
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginLeft:12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientAvatarText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 15,
  },
  patientContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  patientMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyText: {
    marginTop: 10,
    color: '#9CA3AF',
    fontSize: 14,
  },
 
});