import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';

const LANGUAGE_KEY = 'hbridge_language';

export type Language = 'en' | 'rw';

interface LanguageState {
  language: Language;
  isHydrating: boolean;

  setLanguage: (lang: Language) => Promise<void>;
  hydrate: () => Promise<void>;
}

function detectDefaultLanguage(): Language {
  try {
    const locales = getLocales();
    const primary = locales[0]?.languageCode;
    return primary === 'rw' ? 'rw' : 'en';
  } catch {
    return 'en';
  }
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  isHydrating: true,

  setLanguage: async (lang) => {
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
    set({ language: lang });
  },

  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'rw') {
        set({ language: stored, isHydrating: false });
      } else {
        set({ language: detectDefaultLanguage(), isHydrating: false });
      }
    } catch {
      set({ language: detectDefaultLanguage(), isHydrating: false });
    }
  },
}));