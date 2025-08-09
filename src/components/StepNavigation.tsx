import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

interface StepButtonsProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  onStepChange
}) => {
  const { t } = useLanguage();
  const { theme: currentTheme, colors } = useTheme();
  const currentStepIndex = currentStep - 1;
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // 테마 색상 가져오기
  const theme = colors;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* 게이밍 스타일 Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          width: '100%',
          height: '12px',
          background: currentTheme === 'dark' ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.5)',
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: currentTheme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
            borderRadius: '20px',
            boxShadow: `0 0 20px ${theme.accent}60`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}>
            {/* 반짝임 효과 */}
            {progressPercentage > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          fontSize: '14px',
          color: theme.textSecondary,
          fontWeight: '600'
        }}>
          <span>🎮 {t('navigation.questProgress')}</span>
          <span style={{ color: theme.accent }}>{completedSteps}/{steps.length} {t('navigation.missionComplete')}</span>
        </div>
      </div>

      {/* 게이밍 스타일 Step Indicators */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        gap: '16px',
        overflowX: 'auto',
        padding: '24px',
        background: theme.cardBg,
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              onClick={() => step.completed && onStepChange(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: step.completed ? 'pointer' : 'default',
                minWidth: '140px',
                padding: '12px',
                borderRadius: '16px',
                background: currentStep === step.id 
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'transparent',
                border: currentStep === step.id 
                  ? `1px solid ${theme.cardBorder}`
                  : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (step.completed || currentStep === step.id) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (step.completed || currentStep === step.id) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }
              }}
            >
              {/* 게이밍 스타일 Step Circle */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                background: step.completed 
                  ? `linear-gradient(135deg, ${theme.success}, ${theme.success}cc)` 
                  : currentStep === step.id 
                  ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` 
                  : `${theme.accent}20`,
                color: step.completed || currentStep === step.id 
                  ? 'white' 
                  : theme.textSecondary,
                border: currentStep === step.id 
                  ? `3px solid ${theme.accent}` 
                  : step.completed
                  ? `3px solid ${theme.success}`
                  : `3px solid ${theme.accent}30`,
                boxShadow: step.completed 
                  ? `0 8px 20px ${theme.success}40`
                  : currentStep === step.id
                  ? `0 8px 20px ${theme.accent}40`
                  : currentTheme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: currentStep === step.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                {step.completed ? <Check size={24} /> : step.icon}
              </div>
              
              {/* Step Title */}
              <span style={{
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: currentStep === step.id ? '700' : '600',
                color: currentStep === step.id 
                  ? theme.text
                  : step.completed 
                  ? theme.success
                  : theme.textSecondary,
                lineHeight: '1.3',
                textShadow: currentStep === step.id ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {step.title}
              </span>

              {/* 레벨 표시 */}
              {currentStep === step.id && (
                <div style={{
                  marginTop: '6px',
                  padding: '2px 8px',
                  background: `${theme.accent}20`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: theme.accent,
                  fontWeight: '600'
                }}>
                  {t('navigation.currentMission')}
                </div>
              )}
              {step.completed && (
                <div style={{
                  marginTop: '6px',
                  padding: '2px 8px',
                  background: `${theme.success}20`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: theme.success,
                  fontWeight: '600'
                }}>
                  {t('navigation.completed')}
                </div>
              )}
            </div>

            {/* 게이밍 스타일 Connector Line */}
            {index < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '6px',
                background: step.completed 
                  ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` 
                  : `${theme.accent}20`,
                borderRadius: '20px',
                minWidth: '30px',
                boxShadow: step.completed ? `0 0 15px ${theme.accent}50` : 'none',
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {step.completed && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const StepButtons: React.FC<StepButtonsProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev
}) => {
  const { t } = useLanguage();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      background: 'var(--glass-bg)',
      borderRadius: 'var(--radius-xl)',
      backdropFilter: 'var(--glass-backdrop)',
      border: '1px solid var(--glass-border)',
      marginTop: 'var(--space-8)'
    }} className="glass-card animate-slide-up">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={!canGoPrev}
        style={{ minWidth: '120px' }}
      >
        <ChevronLeft size={16} />
        {t('navigation.previousStep')}
      </Button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--font-size-lg)',
        color: 'var(--gray-700)',
        fontWeight: '600',
        background: 'var(--gradient-text)'
      }} className="gradient-text">
        <span>{currentStep}</span>
        <span>/</span>
        <span>{totalSteps}</span>
      </div>

      {currentStep === totalSteps ? (
        <Button
          variant="primary"
          onClick={() => window.open('https://www.thinkingdata.kr/', '_blank')}
          style={{ minWidth: '120px' }}
        >
          {t('navigation.goHome')}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canGoNext}
          style={{ minWidth: '120px' }}
        >
          {t('navigation.nextStep')}
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
};

// 기존 StepNavigation을 호환성을 위해 유지 (deprecated)
export const StepNavigation: React.FC<StepNavigationProps> = (props) => {
  return <StepProgress steps={props.steps} currentStep={props.currentStep} onStepChange={props.onStepChange} />;
};