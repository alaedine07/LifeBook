import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserRole = 'USER' | 'THERAPIST';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,

      login: (token, role) =>
        set({
          token,
          role,
          isAuthenticated: true,
        }),

      logout: () => set({ token: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'lifebook-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, role: state.role }),
    }
  )
);
