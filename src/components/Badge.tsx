import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--gradient-primary)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'secondary':
        return {
          background: 'var(--gradient-secondary)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, var(--warning-400) 0%, var(--warning-500) 100%)',
          color: 'var(--gray-900)',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, var(--error-500) 0%, var(--error-600) 100%)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'info':
        return {
          background: 'var(--gradient-accent)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'md':
        return {
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--font-size-sm)'
        };
      default:
        return {
          padding: 'var(--space-1) var(--space-2)',
          fontSize: 'var(--font-size-xs)'
        };
    }
  };

  return (
    <span
      className={className}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        backdropFilter: 'blur(4px)',
        transform: 'translateY(0)',
        transition: 'var(--transition-fast)',
        ...style
      }}
    >
      {children}
    </span>
  );
};