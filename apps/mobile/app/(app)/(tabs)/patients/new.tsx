import { useEffect, useState } from "react";
import usePatient from "../../../../src/api/patients";
import { View, Text,StyleSheet, ScrollView, TextInput,TouchableOpacity,ActivityIndicator,Alert, KeyboardAvoidingView,Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useCreatePatient } from "../../../../src/api/patients";
import { Header } from "../../../../src/components/Header";
import { Gender } from "@hbridge/shared";
import { useHouseholdByHeadId } from "../../../../src/api/households";
const GENDERS:{
    value:Gender; labelKey:string
}[]=[
      { value: 'MALE', labelKey: 'patients.male' },
  { value: 'FEMALE', labelKey: 'patients.female' },
  
]

export default function CreatPatientScreen(){
    const {t} = useTranslation();
    const createPatient = useCreatePatient();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState<Gender>('MALE');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [hasHypertension, setHasHypertension] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasEpilepsy, setHasEpilepsy] = useState(false);
    // household checking
    const [headId, setHeadId] = useState('');
    const[headName, setHeadName] = useState('');
    // live household lookup

    const {data: existingHouse, isFetching: isSearchingHouse} = useHouseholdByHeadId(headId);
    // if house is found auto fill head name and village
    useEffect(() =>{

        if (existingHouse){
            setHeadName(existingHouse.headName);
            if (!village && existingHouse.village){
                setVillage(existingHouse.village)
            }
        }
    },[existingHouse]);

    const SavePatient = () =>{
          if(!firstName.trim() || !lastName.trim()){
              Alert.alert(
        t('patients.errors.validation', { defaultValue: 'Check your inputs' }),
        t('patients.errors.nameRequired', {
          defaultValue: 'First and last name are required.',
        }),
      );
      return;
      }

      // create patient mutation

      createPatient.mutate({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        age:age ? parseInt(age,10): undefined,
        phone: phone.trim() || undefined,
        village: village.trim() || undefined,
        headId: headId.trim() || undefined,
        headName: headName.trim() || undefined,
        hasDiabetes,
        hasHypertension,
        hasEpilepsy,
      

      },
    {
      onSuccess: (patient) => {
        router.replace(`/(app)/patients/${patient.id}`);
      },
      onError: (error:any) => {

        const message = error?.response?.data?.message || error?.message || t('common.error');
        Alert.alert(
          t('patients.errors.createFailed'),
          Array.isArray(message) ? message.join(', '):message,
        );
      },
    },
    );
    };

    return (
        <View style={styles.root}>
            <Header showBack title={t('patients.newTitle',{defaultValue: 'New Patient'})} />
        
        <KeyboardAvoidingView
        behavior={Platform.OS ==='ios'? 'padding':undefined}
        style={{flex:1}}
        >
         <ScrollView 
         contentContainerStyle={styles.content}
         keyboardShouldPersistTaps="handled"
         >
  
            <Text style={styles.sectionTitle}>
                {t('patients.basicInfo')}
            </Text>

            {/* text inputs */}

            {/* HOUSEHOLD SECTION */}
          <Text style={styles.sectionTitle}>
            Household (Family)
          </Text>

          <Text style={styles.label}>Head of Household ID</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { paddingRight: 40, marginBottom: 0 }]}
              value={headId}
              onChangeText={setHeadId}
              placeholder="1199680187192050"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              editable={!createPatient.isPending}
            />
            {isSearchingHouse && (
              <ActivityIndicator 
                style={styles.inputIcon} 
                size="small" 
                color="#16A34A" 
              />
            )}
            {!isSearchingHouse && existingHouse && (
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color="#16A34A" 
                style={styles.inputIcon} 
              />
            )}
          </View>

          {/* Live preview of existing household */}
          {existingHouse && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#16A34A" />
              <Text style={styles.infoText}>
                Found Household: <Text style={{fontWeight: '700'}}>{existingHouse.headName}</Text>
              </Text>
            </View>
          )}

          {/* Only show headName and village inputs if it's a NEW household */}
          {!existingHouse && (
            <>
              <Text style={styles.label}>Head Name</Text>
              <TextInput
                style={styles.input}
                value={headName}
                onChangeText={setHeadName}
                placeholder="Eduard UWIMANA"
                placeholderTextColor="#9CA3AF"
                editable={!createPatient.isPending}
              />

              <Text style={styles.label}>Village</Text>
              <TextInput
                style={styles.input}
                value={village}
                onChangeText={setVillage}
                placeholder="Remera"
                placeholderTextColor="#9CA3AF"
                editable={!createPatient.isPending}
              />
            </>
          )}

            <Text style={styles.label}>
              {t('patients.fields.firstName')}

            </Text>
            <TextInput
             style={styles.input}
             value={firstName}
             onChangeText={setFirstName}
             placeholder="Fulgence"
             placeholderTextColor="#9CA3AF"
             editable={!createPatient.isPending}
            />

            <Text style={styles.label}>
              {t('patients.fields.lastName')}
            </Text>

            <TextInput style={styles.input}
             value={lastName}
             onChangeText={setLastName}
             placeholder="IRADUKUNDA"
             placeholderTextColor="#9CA3AF"
             editable={!createPatient.isPending}
            />

            <Text style={styles.label}>
            {t('patients.fields.gender', { defaultValue: 'Gender' })} *
          </Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => {
              const isActive = gender === g.value;
              return (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.genderChip,
                    isActive && styles.genderChipActive,
                  ]}
                  onPress={() => setGender(g.value)}
                  disabled={createPatient.isPending}
                >
                  <Text
                    style={[
                      styles.genderText,
                      isActive && styles.genderTextActive,
                    ]}
                  >
                    {t(g.labelKey, { defaultValue: g.value })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            {t('patients.fields.age', { defaultValue: 'Age' })}
          </Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="45"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={3}
            editable={!createPatient.isPending}
          />

          <Text style={styles.label}>
            {t('patients.fields.phone', {
              defaultValue: 'Phone (optional)',
            })}
          </Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+250 788 123 456"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            editable={!createPatient.isPending}
          />

          

          <Text style={styles.sectionTitle}>
            {t('patients.sections.conditions', {
              defaultValue: 'Conditions',
            })}
          </Text>

          <ConditionCheckbox
            label={t('patients.hypertension', {
              defaultValue: 'Hypertension',
            })}
            value={hasHypertension}
            onChange={setHasHypertension}
            disabled={createPatient.isPending}
          />
          <ConditionCheckbox
            label={t('patients.diabetes', { defaultValue: 'Diabetes' })}
            value={hasDiabetes}
            onChange={setHasDiabetes}
            disabled={createPatient.isPending}
          />
          <ConditionCheckbox
            label={t('patients.epilepsy', { defaultValue: 'Epilepsy' })}
            value={hasEpilepsy}
            onChange={setHasEpilepsy}
            disabled={createPatient.isPending}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              createPatient.isPending && styles.submitButtonDisabled,
            ]}
            onPress={()=>SavePatient()}
            disabled={createPatient.isPending}
          >
            {createPatient.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>
                {t('patients.create', {
                  defaultValue: 'Create patient',
                })}
              </Text>
            )}
          </TouchableOpacity>

         </ScrollView>


        </KeyboardAvoidingView>
        
        
        </View>
    );




}

function ConditionCheckbox({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={() => onChange(!value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    textAlign:'center',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  genderRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  genderChip: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipActive: { borderColor: '#16A34A', backgroundColor: '#DCFCE7' },
  genderText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  genderTextActive: { color: '#16A34A' },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  checkboxLabel: { fontSize: 15, fontWeight: '500', color: '#111827' },
  submitButton: {
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#16A34A',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
    inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#166534',
    flex: 1,
  },
  submitButtonDisabled: { opacity: 0.5, shadowOpacity: 0, elevation: 0 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});