import i18n from './index';
import { useLanguageStore } from '../stores/language';

/**
 * Subscribes to language changes and updates i18next whenever it changes.
 * Called once at app startup.
 */
export function syncLanguageWithI18n() {
  // Initial sync
  i18n.changeLanguage(useLanguageStore.getState().language);

  // Subscribe to changes
  useLanguageStore.subscribe((state) => {
    if (i18n.language !== state.language) {
      i18n.changeLanguage(state.language);
    }
  });
}