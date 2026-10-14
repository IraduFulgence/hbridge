export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Patient {
  id: string;
  householdId: string;
  nationalId: string | null;
  mutuelleId: string | null;
  firstName: string;
  lastName: string;
  age: number | null;
  dateOfBirth: string | null;
  gender: Gender;
  phone: string | null;
  address: string | null;
  hasHypertension: boolean;
  hasDiabetes: boolean;
  hasEpilepsy: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  household?: {
    id: string;
    village: string;
    chwId: string;
    chw?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  age?: number;
  phone?: string;
  nationalId?: string;
  address?: string;
  village?: string;
  headName?: string;
  hasHypertension?: boolean;
  hasDiabetes?: boolean;
}