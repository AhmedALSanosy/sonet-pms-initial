// ============================================================
// Sonet PMS — Auth Store
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; role: string; email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (email: string, _password: string) => {
        // TODO: Replace with real API call
        // const res = await api.post('/auth/login', { email, password });
        if (email && _password) {
          set({
            isAuthenticated: true,
            token: 'mock-jwt-token-sonet-pms',
            user: { name: 'د. أحمد محمد', role: 'مدير المعمل', email },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    { name: 'sonet-auth' }
  )
);
