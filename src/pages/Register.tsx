import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { registerSchema, type RegisterFormData } from '@/features/auth/schemas';
import { authApi } from '@/services/auth.api';
import { useThemeStore } from '@/store/useThemeStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { User, Mail, Sun, Moon } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeStore();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            navigate('/login', {
                state: { successMessage: 'Conta criada com sucesso! Faça login para continuar.' },
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            const msg = error.response?.data?.error ?? 'Ocorreu um erro. Tente novamente.';
            setServerError(msg);
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        setServerError('');
        mutate(data);
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-16 px-4 bg-twitter-light-background dark:bg-[#0b0f19] relative">
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors hover:cursor-pointer"
                title="Alternar Tema"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="w-full max-w-105">
                <Link
                    to="/"
                    className="text-[32px] sm:text-[40px] font-bold text-center text-twitter-blue dark:text-white mb-10"
                >
                    Mini Twitter
                </Link>

                <div className="flex w-full border-b border-twitter-light-border dark:border-[#1e293b] mb-10">
                    <Link
                        to="/login"
                        className="flex-1 text-center py-3.5 font-semibold text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary border-b-2 border-transparent hover:text-twitter-blue dark:hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="flex-1 text-center py-3.5 font-semibold text-twitter-blue dark:text-white border-b-2 border-twitter-blue"
                    >
                        Cadastrar
                    </Link>
                </div>

                <div className="mb-8">
                    <h2 className="text-[28px] font-bold text-twitter-blue dark:text-white mb-2">
                        Olá, vamos começar!
                    </h2>
                    <p className="text-[15px] text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary">
                        Por favor, insira os dados solicitados para fazer cadastro.
                    </p>
                </div>

                {serverError && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                    <Input
                        label="Nome"
                        placeholder="Insira o seu nome"
                        autoComplete="name"
                        registration={register('name')}
                        error={errors.name?.message}
                        icon={<User size={20} />}
                        className="dark:bg-twitter-dark-background-secondary dark:border-twitter-dark-border"
                    />
                    <Input
                        label="E-mail"
                        type="email"
                        placeholder="Insira o seu e-mail"
                        autoComplete="email"
                        registration={register('email')}
                        error={errors.email?.message}
                        icon={<Mail size={20} />}
                        className="dark:bg-twitter-dark-background-secondary dark:border-twitter-dark-border"
                    />
                    <Input
                        label="Senha"
                        type="password"
                        placeholder="Insira a sua senha"
                        autoComplete="new-password"
                        registration={register('password')}
                        error={errors.password?.message}
                        className="dark:bg-twitter-dark-background-secondary dark:border-twitter-dark-border"
                    />

                    <Button type="submit" size="lg" fullWidth isLoading={isPending} className="mt-4 py-3.5 text-base">
                        Continuar
                    </Button>
                </form>

                <p className="mt-6 text-center text-xs text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary max-w-80 mx-auto leading-relaxed">
                    Ao clicar em continuar, você concorda com nossos{' '}
                    <a href="#" className="underline hover:text-twitter-light-text dark:hover:text-twitter-dark-text">
                        Termos de Serviço
                    </a>{' '}
                    e{' '}
                    <a href="#" className="underline hover:text-twitter-light-text dark:hover:text-twitter-dark-text">
                        Política de Privacidade
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
