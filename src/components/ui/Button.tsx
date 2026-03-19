import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-twitter-blue hover:bg-twitter-blue-hover text-white font-bold disabled:opacity-60',
    secondary:
        'border-2 border-twitter-light-border dark:border-twitter-dark-border ' +
        'hover:bg-twitter-light-background-hover dark:hover:bg-twitter-dark-background-hover ' +
        'text-twitter-light-text dark:text-twitter-dark-text font-bold disabled:opacity-60',
    ghost:
        'bg-transparent hover:bg-twitter-light-background-hover dark:hover:bg-twitter-dark-background-hover ' +
        'text-twitter-light-text dark:text-twitter-dark-text disabled:opacity-60',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-bold disabled:opacity-60',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'py-1.5 px-4 text-sm',
    md: 'py-2.5 px-6 text-sm',
    lg: 'py-3 px-8 text-base',
};

const Spinner = () => (
    <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            disabled,
            children,
            className = '',
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={[
                    'inline-flex items-center justify-center gap-2',
                    'rounded-full transition-all duration-200 cursor-pointer',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-twitter-blue focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed select-none',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth ? 'w-full' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            >
                {isLoading && <Spinner />}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
