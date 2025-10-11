import React from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 focus:ring-blue-500',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-0.5 focus:ring-emerald-500',
    outline: 'border-2 border-neutral-700 text-neutral-100 hover:border-neutral-600 hover:bg-neutral-800/50 focus:ring-neutral-600',
    ghost: 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white focus:ring-neutral-700',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/50 hover:-translate-y-0.5 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-base rounded-lg gap-2',
    lg: 'px-6 py-3.5 text-lg rounded-xl gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader className="h-4 w-4 animate-spin" />
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      {children}
      {!isLoading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
