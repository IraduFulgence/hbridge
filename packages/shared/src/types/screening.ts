export const ScreeningType = {
  HYPERTENSION: 'HYPERTENSION',
  DIABETES: 'DIABETES',
  PHQ9: 'PHQ9',
  GAD7: 'GAD7',
  PSYCHOSIS: 'PSYCHOSIS',
  BIPOLAR: 'BIPOLAR',
  PTSD: 'PTSD',
  OCD: 'OCD',
  SUBSTANCE_USE: 'SUBSTANCE_USE',
  SUICIDE_RISK: 'SUICIDE_RISK',
  DELIRIUM: 'DELIRIUM',
  EPILEPSY: 'EPILEPSY',
} as const;

export type ScreeningType = (typeof ScreeningType)[keyof typeof ScreeningType];

export const TriageLevel = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
} as const;

export type TriageLevel = (typeof TriageLevel)[keyof typeof TriageLevel];

export interface Screening {
  id: string;
  individualId: string;
  chwId: string;
  screeningType: ScreeningType;
  responses: Record<string, unknown>;
  score: number | null;
  triageLevel: TriageLevel;
  notes: string | null;
  administeredAt: string;
  createdAt: string;
}

export interface CreateScreeningRequest {
  individualId: string;
  screeningType: ScreeningType;
  responses: Record<string, unknown>;
  notes?: string;
}

export interface Phq9Responses {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
}

export interface Gad7Responses {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
}

export interface HypertensionResponses {
  systolic: number;
  diastolic: number;
}

export interface DiabetesResponses {
  glucoseMgdl: number;
  isFasting?: boolean;
}