import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, Eye, MousePointer, Clock, PartyPopper, X, Trophy, Star } from 'lucide-react';
import { Checkbox } from '../../components/Checkbox';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Step4Props {
  onComplete: () => void;
  appData: {
    appId: string;
    dataUrl: string;
    selectedVersion: 'saas' | 'private' | null;
  };
}

export const Step4AnalyticsStart: React.FC<Step4Props> = ({
  onComplete,
  appData
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [understood, setUnderstood] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // 테마 색상 가져오기
  const theme = colors;

  useEffect(() => {
    if (understood && !hasCompleted) {
      onComplete();
      setCelebrationShown(true);
      setHasCompleted(true);
      
      // 팝업이 표시될 때 팝업이 잘 보이도록 적절한 위치로 스크롤
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        // 팝업이 화면 중앙에 잘 보이도록 스크롤 위치 계산
        const scrollPosition = Math.max(0, (documentHeight - windowHeight) / 2);
        
        window.scrollTo({
          top: scrollPosition,
          left: 0,
          behavior: 'smooth'
        });
        
        // 대체 방법으로도 스크롤
        document.documentElement.scrollTop = scrollPosition;
        document.body.scrollTop = scrollPosition;
      }, 200);
    }
  }, [understood, hasCompleted, onComplete]);

  const dashboardSteps = [
    {
      step: 1,
      title: t('step4.dashboardTemplateSelect'),
      description: t('step4.dashboardTemplateSelectDesc'),
      icon: <BarChart size={20} color="#334155" />
    },
    {
      step: 2,
      title: t('step4.basicChartsAdd'),
      description: t('step4.basicChartsAddDesc'),
      icon: <TrendingUp size={20} color="var(--success)" />
    },
    {
      step: 3,
      title: t('step4.filterPeriodSettings'),
      description: t('step4.filterPeriodSettingsDesc'),
      icon: <Clock size={20} color="var(--warning)" />
    },
    {
      step: 4,
      title: t('step4.dashboardShare'),
      description: t('step4.dashboardShareDesc'),
      icon: <Users size={20} color="var(--info)" />
    }
  ];

  const recommendedMetrics = [
    {
      category: t('step4.userAnalysis'),
      icon: <Users size={24} color="#334155" />,
      metrics: [
        { name: t('step4.dauDaily'), description: t('step4.dauDailyDesc') },
        { name: t('step4.mauMonthly'), description: t('step4.mauMonthlyDesc') },
        { name: t('step4.newUsers'), description: t('step4.newUsersDesc') },
        { name: t('step4.returningUsers'), description: t('step4.returningUsersDesc') }
      ]
    },
    {
      category: t('step4.engagementAnalysis'),
      icon: <MousePointer size={24} color="var(--success)" />,
      metrics: [
        { name: t('step4.pageViews'), description: t('step4.pageViewsDesc') },
        { name: t('step4.sessions'), description: t('step4.sessionsDesc') },
        { name: t('step4.avgSessionTime'), description: t('step4.avgSessionTimeDesc') },
        { name: t('step4.bounceRate'), description: t('step4.bounceRateDesc') }
      ]
    },
    {
      category: t('step4.behaviorAnalysis'),
      icon: <Eye size={24} color="var(--warning)" />,
      metrics: [
        { name: t('step4.clickRate'), description: t('step4.clickRateDesc') },
        { name: t('step4.conversionRate'), description: t('step4.conversionRateDesc') },
        { name: t('step4.funnelAnalysis'), description: t('step4.funnelAnalysisDesc') },
        { name: t('step4.heatmap'), description: t('step4.heatmapDesc') }
      ]
    }
  ];

  return (
    <div style={{ color: theme.text }}>
      {/* 게이밍 스타일 Step Title */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          padding: '20px',
          background: `${colors.accent}20`,
          borderRadius: '16px',
          border: `1px solid ${colors.accent}30`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
            position: 'relative',
            zIndex: 1
          }}>
            <BarChart size={28} color="white" />
          </div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginBottom: '8px'
            }}>
              {t('step4.mission4Start')} 🚀
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={16} />
                {t('step4.rewardXP')}
              </span>
            </div>
          </div>
          {/* 단계 버튼 */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 2
          }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#8b5cf6',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ▷ 4/4 단계
            </div>
          </div>
        </div>
        <p style={{
          fontSize: '18px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          margin: 0,
          padding: '0 20px'
        }}>
          {t('step4.goalMaster')}
        </p>
      </div>

      {/* 게이밍 스타일 Configuration Summary */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '24px',
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '-20%',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
            }}>
              <Trophy size={24} color="white" />
            </div>
            <h4 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('step4.configCompleteQuest')}
            </h4>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ 
              padding: '16px', 
              background: `${colors.accent}15`,
              boxShadow: `0 4px 15px ${colors.accent}20`, 
              borderRadius: '16px',
              border: `1px solid ${colors.accent}30`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '8px', fontWeight: '600' }}>{t('step4.versionLabel')}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text }}>
                {appData.selectedVersion === 'saas' ? t('step4.saasVersion') : 
                 appData.selectedVersion === 'private' ? t('step4.privateVersion') : t('step4.notSelected')}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: `${colors.accentSecondary}15`,
              boxShadow: `0 4px 15px ${colors.accentSecondary}20`, 
              borderRadius: '16px',
              border: `1px solid ${colors.accentSecondary}30`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '8px', fontWeight: '600' }}>🆔 App ID</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text }}>
                {appData.appId || t('step4.notEntered')}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: `${colors.success}15`,
              boxShadow: `0 4px 15px ${colors.success}20`, 
              borderRadius: '16px',
              border: `1px solid ${colors.success}30`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '8px', fontWeight: '600' }}>🌐 Data URL</div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: theme.text,
                wordBreak: 'break-all'
              }}>
                {appData.dataUrl || t('step4.notEntered')}
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '20px',
            background: `${colors.success}15`,
            borderRadius: '16px',
            border: `1px solid ${colors.success}30`,
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trophy size={16} color="white" />
              </div>
              <h5 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#10b981'
              }}>
                {t('step4.configCompleteMission')}
              </h5>
            </div>
            <p style={{ 
              margin: 0, 
              color: theme.text,
              lineHeight: '1.5',
              fontSize: '15px'
            }}>
              {t('step4.allConfigComplete')} 
              {t('step4.realtimeAnalysis')}
            </p>
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Dashboard Creation Steps */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '24px',
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-40%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(50px)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
            }}>
              <BarChart size={24} color="white" />
            </div>
            <h4 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('step4.firstDashboardQuest')}
            </h4>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            {dashboardSteps.map((step, index) => (
              <div key={step.step} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px',
                padding: '20px',
                background: `${colors.accent}10`,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                border: `1px solid ${colors.accent}30`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${colors.accent}20`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${colors.accent}10`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${
                    step.step === 1 ? '#8b5cf6, #3b82f6' :
                    step.step === 2 ? '#10b981, #059669' :
                    step.step === 3 ? '#f59e0b, #d97706' :
                    '#ef4444, #dc2626'
                  })`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  {React.cloneElement(step.icon as React.ReactElement, { 
                    size: 20, 
                    color: 'white' 
                  })}
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    margin: '0 0 8px 0',
                    color: theme.text
                  }}>
                    🎯 {step.step}. {step.title}
                  </h5>
                  <p style={{ 
                    fontSize: '15px', 
                    color: theme.textSecondary, 
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* 게이밍 스타일 Recommended Metrics */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          background: `${colors.accent}15`,
          borderRadius: '16px',
          border: `1px solid ${colors.accent}30`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <h4 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('step4.recommendedMetrics')}
          </h4>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {recommendedMetrics.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{
              padding: '24px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                bottom: '-30%',
                right: '-20%',
                width: '120px',
                height: '120px',
                background: categoryIndex === 0 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
                  : categoryIndex === 1
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }} />

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: categoryIndex === 0 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : categoryIndex === 1
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  {React.cloneElement(category.icon as React.ReactElement, { 
                    size: 24, 
                    color: 'white' 
                  })}
                </div>
                <h5 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  margin: 0,
                  color: theme.text
                }}>
                  🎮 {category.category}
                </h5>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                position: 'relative',
                zIndex: 1
              }}>
                {category.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} style={{ 
                    padding: '16px',
                    background: `${colors.accent}10`,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: `1px solid ${colors.accent}30`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${colors.accent}20`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${colors.accent}10`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      color: theme.text,
                      marginBottom: '6px'
                    }}>
                      📊 {metric.name}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: theme.textSecondary,
                      lineHeight: '1.4'
                    }}>
                      {metric.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 게이밍 스타일 Next Steps */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '24px',
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-40%',
            left: '-20%',
            width: '180px',
            height: '180px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
            }}>
              <Star size={24} color="white" />
            </div>
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('step4.nextLevelUnlock')}
            </h4>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            fontSize: '15px',
            position: 'relative',
            zIndex: 1
          }}>
            <p style={{ 
              margin: '0 0 16px 0', 
              color: theme.text, 
              lineHeight: '1.5' 
            }}>
              {t('step4.advancedFeaturesDesc')}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              background: `${colors.accent}10`,
              borderRadius: '12px',
              border: `1px solid ${colors.accent}30`
            }}>
              <span style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>{t('step4.advancedBadge')}</span>
              <span style={{ color: theme.text }}>{t('step4.customEventSegmentation')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              background: `${colors.accent}10`,
              borderRadius: '12px',
              border: `1px solid ${colors.accent}30`
            }}>
              <span style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>{t('step4.advancedBadge')}</span>
              <span style={{ color: theme.text }}>🧪 {t('step4.abTestFunnelSetup')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              background: `${colors.accent}10`,
              borderRadius: '12px',
              border: `1px solid ${colors.accent}30`
            }}>
              <span style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>{t('step4.advancedBadge')}</span>
              <span style={{ color: theme.text }}>{t('step4.notificationAutoReports')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Completion */}
      <div style={{ 
        padding: '24px', 
        background: colors.cardBg,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', 
        borderRadius: '20px',
        border: `1px solid ${colors.cardBorder}`,
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '120px',
          height: '120px',
          background: understood 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
          borderRadius: '50%',
          filter: 'blur(30px)',
          transition: 'all 0.3s ease'
        }} />


        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: understood 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: understood 
              ? '0 8px 20px rgba(16, 185, 129, 0.4)'
              : '0 8px 20px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}>
            {understood ? (
              <Trophy size={24} color="white" />
            ) : (
              <Star size={24} color="white" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Checkbox
              checked={understood}
              onChange={setUnderstood}
              label={
                <span style={{ 
                  color: theme.text, 
                  fontSize: '16px', 
                  fontWeight: '600',
                  lineHeight: '1.5'
                }}>
                  {understood 
                    ? t('step4.finalMissionComplete')
                    : t('step4.analysisStepComplete')
                  }
                </span>
              }
            />
            {understood && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: `${colors.success}15`,
                borderRadius: '12px',
                border: `1px solid ${colors.success}30`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: colors.success,
                  fontWeight: '600'
                }}>
                  <Trophy size={16} />
                    {t('step4.finalRewardEarned')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 게이밍 스타일 Celebration Modal */}
      {celebrationShown && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '48px',
            borderRadius: '24px',
            maxWidth: '600px',
            margin: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3), 0 0 100px rgba(59, 130, 246, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              left: '-20%',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30%',
              right: '-20%',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />

            <button
              onClick={() => setCelebrationShown(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${theme.cardBorder}`,
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px',
                color: theme.textSecondary,
                fontSize: '0',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                (e.currentTarget as HTMLElement).style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                (e.currentTarget as HTMLElement).style.color = theme.textSecondary;
              }}
            >
              <X size={20} />
            </button>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                animation: 'pulse 2s infinite'
              }}>
                <PartyPopper size={40} color="white" />
              </div>
            </div>
            <h4 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              margin: '0 0 20px 0',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              zIndex: 1
            }}>
              {t('step4.congratulationsQuestComplete')}
            </h4>
            <p style={{ 
              fontSize: '18px', 
              margin: '0 0 36px 0',
              lineHeight: '1.6',
              color: theme.textSecondary,
              position: 'relative',
              zIndex: 1
            }}>
              <strong style={{ color: theme.text }}>{t('step4.quickStartComplete')}</strong><br/>
              {t('step4.exploreDataAnalysisWorld')}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                padding: '12px 20px',
                background: `${colors.success}15`,
                borderRadius: '12px',
                border: `1px solid ${colors.success}30`
              }}>
                <span style={{
                  fontSize: '14px',
                  color: theme.success,
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {t('step4.rewardEarned500XP')}
                </span>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}>
              <button
                onClick={() => window.open('http://localhost:3002/', '_blank')}
                style={{
                  padding: '14px 28px',
                  border: `2px solid ${theme.cardBorder}`,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: theme.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {t('step4.goHome')}
              </button>
              <button
                onClick={() => window.open('https://te-web-naver.thinkingdata.kr/', '_blank')}
                style={{
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                }}
              >
                {t('step4.startAnalysis')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};