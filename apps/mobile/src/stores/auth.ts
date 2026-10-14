import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '@hbridge/shared';

const ACCESS_TOKEN_KEY = 'hbridge_access_token';
const REFRESH_TOKEN_KEY = 'hbridge_refresh_token';
const USER_KEY = 'hbridge_user';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrating: boolean;
  isAuthenticated: boolean;

  // Actions
  setSession: (params: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrating: true,
  isAuthenticated: false,

  setSession: async ({ user, accessToken, refreshToken }) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isHydrating: false,
    });
  },

  clearSession: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  },

  hydrate: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as AuthUser;
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isHydrating: false,
        });
      } else {
        set({ isHydrating: false });
      }
    } catch (err) {
      console.error('Auth hydration failed:', err);
      set({ isHydrating: false });
    }
  },
}));