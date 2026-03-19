import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',

            toggleTheme: () => {
                const next = get().theme === 'light' ? 'dark' : 'light';
                applyTheme(next);
                set({ theme: next });
            },

            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme });
            },
        }),
        {
            name: 'mini-twitter:theme',
            onRehydrateStorage: () => (state) => {
                if (state) applyTheme(state.theme); // Aplica tema ao carregar a página
            },
        },
    ),
);

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}
