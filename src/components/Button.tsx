import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {}
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
          color: 'white',
          border: `1px solid ${colors.accent}`,
          boxShadow: `0 4px 15px ${colors.accent}40`
        };
      case 'secondary':
        return {
          background: `linear-gradient(135deg, ${colors.success}, ${colors.warning})`,
          color: 'white',
          border: `1px solid ${colors.success}`,
          boxShadow: `0 4px 15px ${colors.success}40`
        };
      case 'outline':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: colors.accent,
          border: `1px solid ${colors.cardBorder}`,
          backdropFilter: 'blur(8px)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: colors.text,
          border: '1px solid transparent',
          transition: 'all 0.3s ease'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '14px'
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '18px'
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px'
        };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        textAlign: 'center' as const,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
        fontFamily: 'inherit',
        transform: 'translateY(0)',
        ...style
      }}
    >
      {children}
    </button>
  );
};