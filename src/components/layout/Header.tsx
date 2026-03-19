import { type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Search, LogOut, Sun, Moon } from 'lucide-react';

import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/services/auth.api';

interface HeaderProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
}

export default function Header({ searchInput, onSearchChange }: HeaderProps) {
    const navigate = useNavigate();
    const { isAuthenticated, clearAuth } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            clearAuth();
            navigate('/login');
        },
    });

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-twitter-dark-background border-b border-gray-100 dark:border-gray-800 shadow-sm px-6 h-18 flex items-center justify-between transition-colors duration-200">
            <div className="flex-1">
                <Link to="/" className="text-twitter-blue font-bold text-xl hover:opacity-90 transition-opacity">
                    Mini Twitter
                </Link>
            </div>

            <div className="flex-1 max-w-120">
                <form onSubmit={handleSearchSubmit} className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-twitter-blue transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por post..."
                        value={searchInput}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-twitter-blue dark:focus:border-twitter-blue focus:ring-1 focus:ring-twitter-blue transition-all"
                    />
                </form>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors hover:cursor-pointer"
                    title="Alternar Tema"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {isAuthenticated ? (
                    <button
                        onClick={() => logoutMutation.mutate()}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-twitter-blue text-white hover:opacity-90 transition-opacity shadow-md hover:cursor-pointer"
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/register"
                            className="px-5 py-2 rounded-full font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-700"
                        >
                            Registrar-se
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-2 rounded-full font-bold bg-twitter-blue text-white shadow-md hover:bg-twitter-blue-hover transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
