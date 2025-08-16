import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface StepProgressProps {
  steps: Array<{
    id: number;
    key: string;
    title: string;
    icon: React.ReactNode;
    completed: boolean;
    gradient: string;
    description: string;
  }>;
  currentStep: number;
  onStepChange: (stepId: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  onStepChange
}) => {
  const { colors } = useTheme();

  return (
    <div style={{
      background: colors.cardBg,
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      border: `1px solid ${colors.cardBorder}`,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = step.completed;
          const canNavigate = isCompleted || isActive;

          return (
            <div
              key={step.id}
              onClick={() => canNavigate && onStepChange(step.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: canNavigate ? 'pointer' : 'default',
                opacity: canNavigate ? 1 : 0.5,
                transition: 'all 0.3s ease',
                padding: '16px',
                borderRadius: '16px',
                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
              }}
            >
              {/* Step Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: isCompleted 
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isActive 
                  ? step.gradient 
                  : 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (isCompleted || isActive) 
                  ? '0 8px 20px rgba(139, 92, 246, 0.4)' 
                  : 'none',
                transition: 'all 0.3s ease',
                color: 'white'
              }}>
                {step.icon}
              </div>

              {/* Step Title */}
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isActive ? colors.text : colors.textSecondary,
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                {step.title}
              </div>

              {/* Step Status Indicator */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isCompleted 
                  ? '#10b981'
                  : isActive 
                  ? '#8b5cf6' 
                  : 'rgba(139, 92, 246, 0.3)',
                transition: 'all 0.3s ease'
              }} />

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '100%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '2px',
                  background: step.completed 
                    ? 'linear-gradient(90deg, #10b981, #8b5cf6)'
                    : 'rgba(139, 92, 246, 0.2)',
                  zIndex: -1
                }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};