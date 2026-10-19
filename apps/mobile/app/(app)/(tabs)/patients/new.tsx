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
                
            </Text>

         </ScrollView>


        </KeyboardAvoidingView>
        
        
        </View>
    );




}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
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
  submitButtonDisabled: { opacity: 0.5, shadowOpacity: 0, elevation: 0 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});