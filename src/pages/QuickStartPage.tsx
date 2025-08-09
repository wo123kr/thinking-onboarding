import React, { useState, useEffect } from 'react';
import { Users, Database, Trophy, Zap, ChevronUp } from 'lucide-react';
import { StepProgress } from '../components/StepNavigation';
import { Layout } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Step1ProjectCreation } from './steps/Step1ProjectCreation';
import { Step2AccountSetup } from './steps/Step2AccountSetup';
import { Step3DataIntegration } from './steps/Step3DataIntegration';
import { Step4AnalyticsStart } from './steps/Step4AnalyticsStart';

interface StepCompletion {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

interface AppData {
  appId: string;
  dataUrl: string;
  selectedVersion: 'saas' | 'private' | null;
}

export const QuickStartPage: React.FC = () => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });
  const [appData, setAppData] = useState<AppData>({
    appId: '',
    dataUrl: '',
    selectedVersion: null
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300); // 300px 스크롤하면 버튼 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    // 부드러운 스크롤로 한번에 맨 위로
    window.scrollTo({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  };

  const steps = [
    {
      id: 1,
      title: t('step1.title'),
      icon: <Zap size={20} />,
      completed: stepCompletion.step1,
      gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      description: t('step1.description')
    },
    {
      id: 2,
      title: t('step2.title'),
      icon: <Users size={20} />,
      completed: stepCompletion.step2,
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      description: t('step2.description')
    },
    {
      id: 3,
      title: t('step3.title'),
      icon: <Database size={20} />,
      completed: stepCompletion.step3,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      description: t('step3.description')
    },
    {
      id: 4,
      title: t('step4.title'),
      icon: <Trophy size={20} />,
      completed: stepCompletion.step4,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      description: t('step4.description')
    }
  ];

  const handleStepComplete = (step: number) => {
    setStepCompletion(prev => ({
      ...prev,
      [`step${step}`]: true
    }));
    // 단계 완료 표시만 하고 자동으로 넘어가지 않음
  };

  const handleNext = () => {
    if (currentStep < 4 && stepCompletion[`step${currentStep}` as keyof StepCompletion]) {
      setCurrentStep(prev => prev + 1);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  };

  const handleStepChange = (stepId: number) => {
    // Only allow navigation to completed steps or the next incomplete step
    const canNavigate = steps.find(s => s.id === stepId)?.completed || stepId === currentStep;
    if (canNavigate) {
      setCurrentStep(stepId);
      // React 상태 업데이트 후에 스크롤하도록 대기
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  };

  const canGoNext = stepCompletion[`step${currentStep}` as keyof StepCompletion];
  const canGoPrev = currentStep > 1;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ProjectCreation
            onComplete={() => handleStepComplete(1)}
            onVersionSelect={(version) => setAppData(prev => ({ ...prev, selectedVersion: version }))}
            selectedVersion={appData.selectedVersion}
          />
        );
      case 2:
        return (
          <Step2AccountSetup
            onComplete={() => handleStepComplete(2)}
          />
        );
      case 3:
        return (
          <Step3DataIntegration
            onComplete={() => handleStepComplete(3)}
            appData={appData}
            onAppDataChange={setAppData}
          />
        );
      case 4:
        return (
          <Step4AnalyticsStart
            onComplete={() => handleStepComplete(4)}
            appData={appData}
          />
        );
      default:
        return null;
    }
  };

  // 테마 색상 가져오기
  const theme = colors;

  return (
    <Layout>
      <div style={{ 
        padding: '24px',
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* 게이밍 스타일 헤더 */}
        <div style={{ 
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          marginBottom: '32px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '-10%',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',
              marginBottom: '24px'
            }}>
            </div>
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: theme.text,
              margin: '0 0 16px 0'
            }}>
              🚀 {t('quickstart.title')}
            </h2>
            
            <p style={{ 
              fontSize: '18px', 
              color: theme.textSecondary,
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 24px'
            }}>
              {t('quickstart.description')}<br />
              {t('quickstart.goal')}
            </p>

            {/* 퀵 스타트 통계 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '24px'
            }}>
              {[
                { label: t('quickstart.completedMissions'), value: `${Object.values(stepCompletion).filter(Boolean).length}/4`, color: '#10b981' },
                { label: t('quickstart.currentLevel'), value: `${currentStep}${t('quickstart.currentLevel').includes('단계') ? '' : ' Level'}`, color: '#8b5cf6' },
                { label: t('quickstart.progress'), value: `${Math.round((Object.values(stepCompletion).filter(Boolean).length / 4) * 100)}%`, color: '#f59e0b' }
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: stat.color,
                    textShadow: `0 0 10px ${stat.color}40`
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginTop: '4px'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />

        {/* 게이밍 스타일 Step Content */}
        <div style={{
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          minHeight: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {renderCurrentStep()}
          </div>
        </div>

        {/* 게이밍 스타일 Step Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          background: theme.cardBg,
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.cardBorder}`,
          marginTop: '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: canGoPrev ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
              border: `1px solid ${canGoPrev ? theme.cardBorder : 'rgba(139, 92, 246, 0.1)'}`,
              borderRadius: '12px',
              color: canGoPrev ? theme.text : theme.textSecondary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: canGoPrev ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (canGoPrev) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (canGoPrev) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }
            }}
          >
{t('quickstart.currentLevel').includes('단계') ? '← 이전' : '← Previous'}
          </button>

          {/* 진행률 표시 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: step.completed 
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : currentStep === step.id 
                    ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
                    : 'rgba(139, 92, 246, 0.2)',
                  boxShadow: (step.completed || currentStep === step.id) 
                    ? '0 0 10px rgba(139, 92, 246, 0.5)' 
                    : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {currentStep === steps.length ? (
            <button
              onClick={() => window.location.href = '/'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '120px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
              }}
            >
{t('quickstart.currentLevel').includes('단계') ? '🏠 홈으로' : '🏠 Home'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: canGoNext 
                  ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
                  : 'rgba(139, 92, 246, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: canGoNext ? 'white' : theme.textSecondary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                minWidth: '120px',
                boxShadow: canGoNext ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (canGoNext) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (canGoNext) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                }
              }}
            >
{t('quickstart.currentLevel').includes('단계') ? '다음 →' : 'Next →'}
            </button>
          )}
        </div>

        {/* 게이밍 스타일 글로벌 CSS */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
          }

          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* 커스텀 스크롤바 */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(139, 92, 246, 0.5) transparent;
          }
          
          *::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          *::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          
          *::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border-radius: 8px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          
          *::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #7c3aed, #2563eb);
            background-clip: content-box;
          }
        `}</style>

        {/* 게이밍 스타일 스크롤 투 탑 버튼 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              transition: 'all 0.3s ease',
              transform: showScrollTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              opacity: showScrollTop ? 1 : 0
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6), 0 6px 18px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
title={t('navigation.scrollToTop')}
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </Layout>
  );
};