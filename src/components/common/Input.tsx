import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const hasIcon = !!icon;
    const paddingClass = hasIcon
      ? iconPosition === 'left'
        ? 'pl-11'
        : 'pr-11'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-surface-elevated border
              ${error ? 'border-red-500/50 focus:border-red-500' : 'border-neutral-700 focus:border-blue-500'}
              text-white placeholder-neutral-500
              focus:outline-none focus:ring-2
              ${error ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${paddingClass}
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
