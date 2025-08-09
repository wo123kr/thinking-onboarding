import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  type = 'info',
  title,
  className = '',
  style = {}
}) => {
  const { colors } = useTheme();

  const getTypeStyles = () => {
    switch (type) {
      case 'info':
        return {
          backgroundColor: `${colors.accentSecondary}15`,
          borderColor: `${colors.accentSecondary}40`,
          color: colors.accentSecondary,
          textColor: colors.text,
          icon: Info
        };
      case 'warning':
        return {
          backgroundColor: `${colors.warning}15`,
          borderColor: `${colors.warning}40`,
          color: colors.warning,
          textColor: colors.text,
          icon: AlertTriangle
        };
      case 'success':
        return {
          backgroundColor: `${colors.success}15`,
          borderColor: `${colors.success}40`,
          color: colors.success,
          textColor: colors.text,
          icon: CheckCircle
        };
      case 'danger':
        return {
          backgroundColor: `${colors.error}15`,
          borderColor: `${colors.error}40`,
          color: colors.error,
          textColor: colors.text,
          icon: XCircle
        };
      default:
        return {
          backgroundColor: `${colors.accent}15`,
          borderColor: `${colors.accent}40`,
          color: colors.accent,
          textColor: colors.text,
          icon: Info
        };
    }
  };

  const typeStyles = getTypeStyles();
  const Icon = typeStyles.icon;

  return (
    <div
      className={className}
      style={{
        backgroundColor: typeStyles.backgroundColor,
        border: `1px solid ${typeStyles.borderColor}`,
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        gap: '16px',
        backdropFilter: 'blur(10px)',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        ...style
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: '2px' }}>
        <Icon size={22} color={typeStyles.color} />
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: typeStyles.textColor
          }}>
            {title}
          </h4>
        )}
        <div style={{
          fontSize: '15px',
          color: typeStyles.textColor,
          lineHeight: '1.6'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};