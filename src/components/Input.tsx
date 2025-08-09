import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'url';
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  id,
  type = 'text',
  disabled = false,
  required = false,
  className = ''
}) => {
  const { colors, theme } = useTheme();

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: colors.text,
            marginBottom: '6px'
          }}
        >
          {label}
          {required && <span style={{ color: colors.error }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '12px',
          fontSize: '16px',
          backgroundColor: disabled 
            ? `${colors.cardBorder}50` 
            : theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(255, 255, 255, 0.9)',
          color: disabled ? colors.textSecondary : colors.text,
          outline: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          fontFamily: 'inherit',
          backdropFilter: 'blur(10px)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.accent;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.cardBorder;
        }}
      />
    </div>
  );
};