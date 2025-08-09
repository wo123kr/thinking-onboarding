import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className = ''
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className={className}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '20px',
          height: '20px',
          border: `2px solid ${checked ? 'var(--brand-primary)' : 'var(--gray-300)'}`,
          borderRadius: '4px',
          backgroundColor: checked ? 'var(--brand-primary)' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1
        }}
      >
        {checked && <Check size={14} color="white" />}
      </div>
      {label && (
        <label
          htmlFor={id}
          onClick={() => !disabled && onChange(!checked)}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: disabled ? 'var(--gray-400)' : 'var(--gray-700)',
            userSelect: 'none'
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};