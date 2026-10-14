export const UserRole = {
  CHW: 'CHW',
  CHO: 'CHO',
  NURSE: 'NURSE',
  DOCTOR: 'DOCTOR',
  MH_PROFESSIONAL: 'MH_PROFESSIONAL',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: string;
  phone: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  district: string | null;
  sector: string | null;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tempToken: string;
  requiresOtp: boolean;
}

export interface VerifyOtpRequest {
  tempToken: string;
  code: string;
}

export interface VerifyOtpResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}