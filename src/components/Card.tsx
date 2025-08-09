import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  selected = false,
  style = {}
}) => {
  const { colors } = useTheme();

  return (
    <div 
      className={`card ${selected ? 'selected animate-bounce-in' : 'animate-fade-in hover-lift'} ${className}`}
      onClick={onClick}
      style={{
        background: selected 
          ? `linear-gradient(135deg, ${colors.accent}20, ${colors.accentSecondary}20)`
          : colors.cardBg,
        border: selected ? `2px solid ${colors.accent}` : `1px solid ${colors.cardBorder}`,
        borderRadius: '20px',
        padding: '24px',
        boxShadow: selected ? '0 10px 30px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(20px)',
        transform: selected ? 'translateY(-2px)' : 'none',
        color: colors.text,
        ...style
      }}
    >
      {children}
    </div>
  );
};