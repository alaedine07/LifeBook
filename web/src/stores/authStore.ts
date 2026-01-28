import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserRole = 'USER' | 'THERAPIST';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: () => boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,

      login: (token, role) => set({ token, role }),

      logout: () => set({ token: null, role: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'lifebook-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
