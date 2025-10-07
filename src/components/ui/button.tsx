// Reusable touch-optimized button component
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'default' | 'large' | 'touch';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';

  const variantStyles = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeStyles = {
    default: 'px-8 py-4 text-lg min-w-[150px] min-h-[60px]',
    large: 'px-12 py-6 text-2xl min-w-[200px] min-h-[80px]',
    touch: 'px-16 py-8 text-3xl min-w-touch min-h-[150px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

