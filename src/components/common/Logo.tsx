import React from 'react';
import { Music } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Music className={`${sizeClasses[size]} text-blue-600`} />
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight`}>
          Ledger Studio
        </h1>
      )}
    </div>
  );
};

export default Logo;
