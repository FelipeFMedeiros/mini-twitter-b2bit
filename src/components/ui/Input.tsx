import { forwardRef, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    registration?: Partial<UseFormRegisterReturn>;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, registration, icon, type = 'text', className = '', id, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
        const inputId = id ?? registration?.name;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-twitter-light-text dark:text-twitter-dark-text"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        className={[
                            'w-full bg-transparent rounded-md px-4 py-3 text-sm',
                            'border-2 transition-all duration-200',
                            'text-twitter-light-text dark:text-twitter-dark-text',
                            'placeholder:text-twitter-light-text-secondary dark:placeholder:text-twitter-dark-text-secondary',
                            'focus:outline-none',
                            error
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-twitter-light-border dark:border-twitter-dark-border focus:border-twitter-blue dark:focus:border-twitter-blue',
                            isPassword || icon ? 'pr-11' : '',
                            className,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        {...registration}
                        {...props}
                    />

                    {isPassword ? (
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary hover:text-twitter-light-text dark:hover:text-twitter-dark-text transition-colors"
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    ) : icon ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary pointer-events-none">
                            {icon}
                        </div>
                    ) : null}
                </div>

                {error && (
                    <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500 mt-0.5">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
