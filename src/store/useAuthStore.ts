import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { TOKEN_KEY } from '@/lib/axios';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                localStorage.setItem(TOKEN_KEY, token);
                set({ user, token, isAuthenticated: true });
            },

            clearAuth: () => {
                localStorage.removeItem(TOKEN_KEY);
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'mini-twitter:auth',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        },
    ),
);
