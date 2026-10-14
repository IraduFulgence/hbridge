import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import rw from './locales/rw.json';

export const resources = {
  en: { translation: en },
  rw: { translation: rw },
} as const;

export const supportedLanguages = ['en', 'rw'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3', 
});

export default i18n;