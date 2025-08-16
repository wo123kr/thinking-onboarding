import React, { useState, useEffect, useRef } from 'react';
import { Zap, Database, BarChart, Shield, Star, Activity, TrendingUp, Settings, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { StepProgress } from '../components/StepProgress';
import { Layout } from '../components/Layout';
import { DragonQuestGame } from '../components/DragonQuestGame';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type StepType = 'overview' | 'data-structure' | 'tracking-policy' | 'data-simulation' | 'data-utilization';

interface StepCompletion {
  overview: boolean;
  'data-structure': boolean;
  'tracking-policy': boolean;
  'data-simulation': boolean;
  'data-utilization': boolean;
}

export const IntroPage: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  // 현재 활성 단계 상태
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    overview: false,
    'data-structure': false,
    'tracking-policy': false,
    'data-simulation': false,
    'data-utilization': false
  });
  
  // 테마 색상 가져오기
  const theme = colors;
  
  // 완료된 스텝 수 계산
  const completedCount = Object.values(stepCompletion).filter(Boolean).length;
  const totalCount = Object.keys(stepCompletion).length;
  const progressPercentage = (completedCount / totalCount) * 100;
  
  // JSON 로그 컨테이너 ref
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 데이터 수집 시뮬레이션 상태 (Step 4용)
  const [eventLogs, setEventLogs] = useState<any[]>([]);
  const [logCount, setLogCount] = useState(0);
  const [currentUser] = useState<any>({
    user_id: 'TD001',
    '#account_id': 'e926bc78-fbc9-4d20-856c-bb3ab18dbd37',
    '#uuid': '550e8400-e29b-41d4-a716-446655440000',
    active_time: new Date().toISOString(),
    reg_time: new Date().toISOString(),
    session_count: 1
  });
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // 플레이어 상태
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    experience: 0,
    gold: 100,
    health: 100
  });

  // 로그 업데이트 시 자동 스크롤
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [eventLogs]);

  // 스텝 정의
  const steps = [
    {
      id: 1,
      key: 'overview' as StepType,
      title: 'Thinking Engine 소개',
      icon: <Zap size={20} />,
      completed: stepCompletion.overview,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      description: 'Thinking Engine의 기본 개념과 핵심 기능을 소개합니다'
    },
    {
      id: 2,
      key: 'data-structure' as StepType,
      title: '데이터 구조',
      icon: <Settings size={20} />,
      completed: stepCompletion['data-structure'],
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      description: '유저 식별 체계와 이벤트/유저 속성 구조를 학습합니다'
    },
    {
      id: 3,
      key: 'tracking-policy' as StepType,
      title: '트래킹 정책 (이벤트 택소노미)',
      icon: <Database size={20} />,
      completed: stepCompletion['tracking-policy'],
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      description: '이벤트 테이블, 유저 테이블, 공통 속성 정의 방법을 알아봅니다'
    },
    {
      id: 4,
      key: 'data-simulation' as StepType,
      title: '데이터 수집 시뮬레이션',
      icon: <Activity size={20} />,
      completed: stepCompletion['data-simulation'],
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      description: '실시간 데이터 수집 과정을 체험해봅니다'
    },
    {
      id: 5,
      key: 'data-utilization' as StepType,
      title: '데이터 활용',
      icon: <BarChart size={20} />,
      completed: stepCompletion['data-utilization'],
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      description: '수집된 데이터를 분석하고 인사이트를 도출하는 방법을 배웁니다'
    }
  ];

  // 스텝 완료 처리 함수
  const handleStepComplete = (stepKey: StepType) => {
    setStepCompletion(prev => ({
      ...prev,
      [stepKey]: true
    }));
  };

  const handleNext = () => {
    const currentStepKey = steps[currentStep - 1]?.key;
    if (currentStep < 5 && stepCompletion[currentStepKey]) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepChange = (stepId: number) => {
    // Only allow navigation to completed steps or the next incomplete step
    const step = steps.find(s => s.id === stepId);
    const canNavigate = step?.completed || stepId === currentStep;
    if (canNavigate) {
      setCurrentStep(stepId);
    }
  };

  const canGoNext = stepCompletion[steps[currentStep - 1]?.key];
  const canGoPrev = currentStep > 1;

  // 이벤트 생성 함수 (Step 4용)
  const generateEvent = (eventType: string, data: any) => {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '.000');
    const uuid = `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;
    
    const eventData = {
      event_id: eventId,
      user_id: currentUser.user_id,
      event_name: eventType,
      timestamp: timestamp,
      json: {
        '#account_id': currentUser['#account_id'],
        '#time': timestamp,
        '#uuid': uuid,
        '#type': 'track',
        '#event_name': eventType,
        'properties': {
          '#lib_version': '2.0.3',
          '#lib': 'tga_javascript_sdk',
          '#data_source': 'Client_SDK',
          ...data,
          'user_id': currentUser.user_id,
          'session_id': `session_${Date.now()}`,
          'platform': 'web',
          'browser': 'Chrome',
          'os': 'MacOS',
          '#ip': '192.168.1.1'
        }
      }
    };
    
    setEventLogs(prev => [...prev.slice(-19), eventData]);
    setLogCount(prev => prev + 1);
    
    // 액션 표시
    setCurrentAction(`🎮 ${eventType} 이벤트 생성됨`);
    setTimeout(() => setCurrentAction(null), 3000);
  };

  // Step 1: Overview (Thinking Engine 소개)
  const renderStep1Overview = () => (
    <div>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: theme.text, 
        marginBottom: '16px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🚀 Thinking Engine이란?
      </h2>
      
      <p style={{
        fontSize: '18px',
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: '32px',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto 32px'
      }}>
        사용자 행동 데이터를 기반으로 심층적인 분석과 실행 가능한 인사이트를 제공하는<br />
        <strong style={{ color: theme.text }}>원스톱 데이터 분석 플랫폼</strong>입니다
      </p>

      {/* 핵심 가치 제안 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          "단순한 데이터 시각화를 넘어선 통합 솔루션"
        </h3>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.8',
          marginBottom: '24px'
        }}>
          데이터 <strong>수집</strong> → <strong>저장</strong> → <strong>모델링</strong> → <strong>분석</strong> → <strong>운영</strong><br />
          전 과정을 하나의 플랫폼에서 통합 관리하여 분산된 데이터를 한곳에 모아<br />
          사용자를 다각도로 이해하고 데이터 기반 의사결정을 지원합니다
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: '고객사', value: '1,500+', color: '#8b5cf6' },
            { label: '연결 프로덕트', value: '8,000+', color: '#3b82f6' },
            { label: '게임 특화', value: '13+', subtitle: '분석모델', color: '#10b981' }
          ].map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: stat.color,
                textShadow: `0 0 10px ${stat.color}40`
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: theme.text,
                fontWeight: '600',
                marginTop: '4px'
              }}>
                {stat.label}
              </div>
              {stat.subtitle && (
                <div style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginTop: '2px'
                }}>
                  {stat.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 기능 */}
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: theme.text,
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        🎯 핵심 기능 및 특징
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {[
          { 
            icon: <BarChart size={28} />, 
            title: '13가지 이상의 다각적 분석 모델', 
            desc: '퍼널 분석, 리텐션 분석, 경로 분석, 코호트 분석, LTV 분석 등을 통해 사용자 이탈 원인, 핵심 전환 구간, 고객 생애 가치를 심도 있게 분석합니다.',
            color: '#8b5cf6',
            details: ['사용자 이탈 원인 분석', '핵심 전환 구간 파악', '고객 생애 가치 측정']
          },
          { 
            icon: <Activity size={28} />, 
            title: '실시간 데이터 처리 및 분석', 
            desc: '사용자 행동 데이터를 실시간으로 수집하고 분석하여 급변하는 시장 상황과 사용자 반응에 신속하게 대응할 수 있도록 지원합니다.',
            color: '#3b82f6',
            details: ['실시간 데이터 수집', '즉시 분석 및 알림', '신속한 대응 지원']
          },
          { 
            icon: <Settings size={28} />, 
            title: '노코드(No-code) 분석 환경', 
            desc: '개발자나 데이터 분석가의 도움 없이도 현업 담당자가 직접 데이터를 분석하고 인사이트를 도출할 수 있는 직관적인 UI를 제공합니다.',
            color: '#10b981',
            details: ['직관적인 드래그&드롭 UI', '코딩 지식 불필요', '현업 담당자도 쉽게 사용']
          },
          { 
            icon: <Star size={28} />, 
            title: '정교한 사용자 세분화 및 타겟 운영', 
            desc: '수집된 데이터를 기반으로 사용자를 다양한 기준으로 그룹화하고 맞춤형 캠페인, 인앱 메시지, A/B 테스트를 실행하여 운영 효율을 극대화합니다.',
            color: '#f59e0b',
            details: ['다차원 사용자 세분화', '맞춤형 캠페인 실행', 'A/B 테스트 자동화']
          },
          { 
            icon: <Shield size={28} />, 
            title: '유연한 구축 방식', 
            desc: '클라우드 기반 SaaS와 기업 내부 서버 설치(On-premise) 방식을 모두 지원하여 기업의 데이터 정책과 보안 요구사항에 맞는 유연한 도입이 가능합니다.',
            color: '#ef4444',
            details: ['클라우드 SaaS 지원', 'On-premise 설치', '기업별 맞춤 보안']
          },
          { 
            icon: <Database size={28} />, 
            title: '폭넓은 데이터 통합', 
            desc: '클라이언트, 서버, 과거 로그 데이터는 물론 다양한 서드파티 플랫폼의 데이터를 통합하여 사용자의 전체 여정을 종합적으로 분석합니다.',
            color: '#06b6d4',
            details: ['멀티 플랫폼 데이터 통합', '과거 로그 데이터 활용', '전체 사용자 여정 분석']
          }
        ].map((feature, index) => (
          <div key={index} style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 상단 컬러 라인 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: feature.color
            }} />

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: feature.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'white',
              boxShadow: `0 8px 20px ${feature.color}40`
            }}>
              {feature.icon}
            </div>
            <h4 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: theme.text, 
              margin: '0 0 12px 0',
              lineHeight: '1.3'
            }}>
              {feature.title}
            </h4>
            <p style={{ 
              fontSize: '15px', 
              color: theme.textSecondary, 
              lineHeight: '1.6', 
              margin: '0 0 16px 0' 
            }}>
              {feature.desc}
            </p>
            
            <div style={{ marginTop: '16px' }}>
              {feature.details.map((detail, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: feature.color,
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: theme.textSecondary,
                    fontWeight: '500'
                  }}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 주요 활용 분야 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          🏭 주요 활용 분야 및 기대 효과
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {[
            {
              industry: '🎮 게임',
              icon: '🎯',
              effects: [
                '사용자 이탈 예측 및 방지',
                '핵심 유료화 모델(BM) 강화',
                '콘텐츠 및 밸런스 업데이트 방향성 수립',
                '부정행위 사용자 탐지'
              ],
              result: '게임 라이프 사이클 연장 및 수익성 극대화'
            },
            {
              industry: '🛒 이커머스',
              icon: '📈',
              effects: [
                '구매 전환율 높은 사용자 행동 패턴 분석',
                '구매 망설이는 고객 대상 개인화 추천',
                '맞춤형 프로모션 제공',
                '고객 여정 최적화'
              ],
              result: '매출 증대 및 고객 만족도 향상'
            },
            {
              industry: '📺 미디어',
              icon: '🎬',
              effects: [
                '콘텐츠 소비 패턴 분석',
                '시청 시간 및 이탈 지점 파악',
                '개인화된 콘텐츠 추천',
                '사용자 몰입도 측정'
              ],
              result: '사용자 만족도 및 retention 향상'
            }
          ].map((sector, index) => (
            <div key={index} style={{
              background: theme.cardBg === '#ffffff' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${theme.cardBorder}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '32px' }}>{sector.icon}</span>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: theme.text,
                  margin: 0
                }}>
                  {sector.industry}
                </h4>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 16px 0'
              }}>
                {sector.effects.map((effect, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: theme.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    <span style={{
                      color: '#10b981',
                      fontSize: '16px',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                      ✓
                    </span>
                    {effect}
                  </li>
                ))}
              </ul>

              <div style={{
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                borderLeft: '3px solid #10b981'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: theme.text,
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  💡 {sector.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 성공 사례 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '24px'
        }}>
          🏆 검증된 성공 사례
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {[
            {
              game: "궁수의 전설",
              company: "Habby",
              achievements: [
                { metric: "리텐션", value: "33%", trend: "향상" },
                { metric: "평균 LTV", value: "90%", trend: "증가" }
              ],
              icon: "🏹"
            },
            {
              game: "다그닥 기사단",
              company: "슈퍼엔진",
              achievements: [
                { metric: "매출", value: "200%", trend: "달성" },
                { metric: "글로벌 확장", value: "성공", trend: "완료" }
              ],
              icon: "⚔️"
            }
          ].map((case_study, index) => (
            <div key={index} style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>{case_study.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: theme.text,
                    margin: '0 0 4px 0'
                  }}>
                    {case_study.game}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: theme.textSecondary,
                    margin: 0
                  }}>
                    {case_study.company}
                  </p>
                </div>
              </div>

              {case_study.achievements.map((achievement, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < case_study.achievements.length - 1 ? `1px solid ${theme.cardBorder}` : 'none'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textSecondary
                  }}>
                    {achievement.metric}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    {achievement.value} {achievement.trend}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <button
          onClick={() => handleStepComplete('overview')}
          disabled={stepCompletion.overview}
          style={{
            background: stepCompletion.overview ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: stepCompletion.overview ? '1px solid #10b981' : 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: stepCompletion.overview ? '#10b981' : 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: stepCompletion.overview ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: stepCompletion.overview ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.4)'
          }}
        >
          {stepCompletion.overview ? (
            <>
              <CheckCircle size={20} />
              이해 완료
            </>
          ) : (
            <>
              ✅ Thinking Engine 이해 완료하기
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 2: Data Structure (데이터 구조)
  const renderStep2DataStructure = () => (
    <div>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: theme.text, 
        marginBottom: '16px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🏗️ Thinking Engine 데이터 구조 이해하기
      </h2>

      <p style={{
        fontSize: '18px',
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: '32px',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto 32px'
      }}>
        데이터 분석의 출발점! <strong style={{ color: theme.text }}>어떤 데이터를</strong> <strong style={{ color: theme.text }}>어떻게 구조화</strong>해서 수집하고 관리하는지<br />
        처음부터 차근차근 알아보겠습니다
      </p>

      {/* 데이터 구조 개요 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          "2개의 핵심 테이블로 모든 것을 관리"
        </h3>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.8',
          marginBottom: '24px',
          maxWidth: '600px',
          margin: '0 auto 24px'
        }}>
          Thinking Engine은 복잡해 보이지만 사실 <strong>2개의 테이블</strong>만으로<br />
          모든 사용자 데이터를 효율적으로 관리합니다
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap'
        }}>
          {[
            { 
              icon: '📊', 
              title: '이벤트 테이블', 
              subtitle: '"무엇을 했는지"',
              desc: '사용자의 모든 행동을 기록',
              color: '#3b82f6'
            },
            { 
              icon: '👤', 
              title: '유저 테이블', 
              subtitle: '"누가 어떤 상태인지"',
              desc: '사용자의 속성과 상태를 저장',
              color: '#10b981'
            }
          ].map((table, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '24px',
              background: theme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${theme.cardBorder}`,
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{table.icon}</div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: table.color,
                margin: '0 0 4px 0'
              }}>
                {table.title}
              </h4>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.text,
                margin: '0 0 8px 0'
              }}>
                {table.subtitle}
              </p>
              <p style={{
                fontSize: '13px',
                color: theme.textSecondary,
                margin: 0
              }}>
                {table.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. 유저 식별 체계 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Settings size={28} style={{ color: '#3b82f6' }} />
          1. 유저 식별 체계 - "누구인지 정확히 알아야 분석이 가능"
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          같은 사용자의 행동을 정확히 추적하려면 <strong>일관된 식별 체계</strong>가 필요합니다.<br />
          Thinking Engine은 3가지 ID를 조합해 완벽한 사용자 식별을 제공합니다.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          {[
            { 
              title: '#account_id', 
              purpose: '유저 계정 기반 식별',
              desc: '로그인한 사용자의 고유 계정 ID입니다. 회원가입 후 로그인한 상태에서 발생하는 모든 이벤트는 이 ID로 연결됩니다.',
              icon: '👤',
              color: '#3b82f6',
              example: 'user_12345, member@email.com',
              when: '로그인 후 모든 행동',
              pros: ['영구적 식별', '계정 연동', '크로스 디바이스 추적']
            },
            { 
              title: '#distinct_id', 
              purpose: '임시 유저 식별',
              desc: '비로그인 상태의 사용자나 익명 사용자를 구분하기 위한 임시 ID입니다. 디바이스나 브라우저별로 생성됩니다.',
              icon: '🔍',
              color: '#10b981',
              example: 'device_abc123, anonymous_xyz789',
              when: '앱 설치~로그인 전',
              pros: ['즉시 추적 시작', '로그인 전 행동 분석', '전환율 측정']
            },
            { 
              title: '#user_id', 
              purpose: '시스템 통합 ID',
              desc: '시스템에서 자동 생성하는 내부 통합 ID입니다. account_id와 distinct_id를 연결하는 마스터 키 역할을 합니다.',
              icon: '🔐',
              color: '#f59e0b',
              example: 'TD_001, unified_456',
              when: '시스템 내부 처리',
              pros: ['통합 관리', '데이터 일관성', '시스템 최적화']
            }
          ].map((item, index) => (
            <div key={index} style={{
              background: theme.cardBg === '#ffffff' ? `rgba(${item.color === '#3b82f6' ? '59, 130, 246' : item.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.05)` : `rgba(${item.color === '#3b82f6' ? '59, 130, 246' : item.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${item.color}30`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 상단 컬러 라인 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: item.color
              }} />

              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: theme.text, 
                    margin: '0 0 4px 0',
                    fontFamily: 'monospace'
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    color: item.color,
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {item.purpose}
                  </p>
                </div>
              </div>

              <p style={{ 
                fontSize: '14px', 
                color: theme.textSecondary, 
                lineHeight: '1.5', 
                marginBottom: '16px'
              }}>
                {item.desc}
              </p>

              <div style={{
                background: theme.cardBg === '#ffffff' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginBottom: '4px'
                }}>
                  📝 예시:
                </div>
                <code style={{
                  fontSize: '12px',
                  color: theme.text,
                  fontFamily: 'monospace'
                }}>
                  {item.example}
                </code>
              </div>

              <div style={{
                fontSize: '12px',
                color: theme.textSecondary,
                marginBottom: '12px'
              }}>
                🕐 <strong>사용 시점:</strong> {item.when}
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '6px'
                }}>
                  ✅ 주요 장점:
                </div>
                {item.pros.map((pro, idx) => (
                  <div key={idx} style={{
                    fontSize: '11px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px'
                  }}>
                    • {pro}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ID 연결 플로우 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🔄 ID 연결 플로우 - 실제 사용자 여정
          </h4>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { step: '1. 앱 설치', id: '#distinct_id', desc: 'device_abc123', color: '#10b981' },
              { step: '2. 회원가입', id: 'ID 연결', desc: '동일 사용자 확인', color: '#8b5cf6' },
              { step: '3. 로그인', id: '#account_id', desc: 'user_12345', color: '#3b82f6' },
              { step: '4. 통합관리', id: '#user_id', desc: 'TD_001', color: '#f59e0b' }
            ].map((phase, index) => (
              <React.Fragment key={index}>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: theme.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${phase.color}30`,
                  minWidth: '140px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginBottom: '4px'
                  }}>
                    {phase.step}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: phase.color,
                    marginBottom: '4px',
                    fontFamily: phase.id.includes('#') ? 'monospace' : 'inherit'
                  }}>
                    {phase.id}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: theme.textSecondary,
                    fontFamily: 'monospace'
                  }}>
                    {phase.desc}
                  </div>
                </div>
                {index < 3 && (
                  <div style={{
                    fontSize: '20px',
                    color: theme.textSecondary,
                    fontWeight: 'bold'
                  }}>
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 이벤트와 유저 속성 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Database size={28} style={{ color: '#8b5cf6' }} />
          2. 이벤트와 유저 속성 - "무엇을 어떻게 기록할까?"
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          사용자의 모든 행동과 상태를 체계적으로 관리하기 위해<br />
          <strong>이벤트 속성</strong>과 <strong>유저 속성</strong>을 구분해서 설계합니다.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* 이벤트 속성 */}
          <div style={{
            background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: '#8b5cf6'
            }} />

            <h4 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: theme.text,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📊
              </div>
              이벤트 속성
            </h4>

            <p style={{
              fontSize: '14px',
              color: theme.textSecondary,
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              <strong>"언제, 무엇을, 어떻게"</strong> 했는지를 기록<br />
              매 순간 발생하는 사용자의 행동 데이터
            </p>

            <div style={{
              background: theme.cardBg,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h5 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                marginBottom: '12px'
              }}>
                🎯 주요 이벤트 유형:
              </h5>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '6px'
                }}>
                  핵심 활동 (수익 직결)
                </div>
                {['결제 (purchase)', '회원가입 (sign_up)', '구독 시작 (subscribe)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px',
                    fontFamily: 'monospace'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '6px'
                }}>
                  일반 활동 (사용자 행동)
                </div>
                {['클릭 (button_click)', '화면 전환 (page_view)', '검색 (search)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px',
                    fontFamily: 'monospace'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>

              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '6px'
                }}>
                  자동 수집 (시스템 이벤트)
                </div>
                {['앱 설치 (ta_app_install)', '앱 시작 (ta_app_start)', '앱 종료 (ta_app_end)', '앱 크래시 (ta_app_crash)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px',
                    fontFamily: 'monospace'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#00ff88',
                marginBottom: '6px'
              }}>
                💡 실제 예시:
              </div>
              <pre style={{
                fontSize: '10px',
                color: '#00ff88',
                margin: 0,
                lineHeight: '1.4'
              }}>
{`purchase_item: {
  purchase_amount: 3000,
  item_id: "sword_001",
  payment_method: "credit_card",
  currency: "KRW"
}`}
              </pre>
            </div>

            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '8px'
              }}>
                ⚡ 속성 예시:
              </div>
              {[
                'purchase_amount: 결제 금액',
                'item_id: 구매한 아이템 ID', 
                'battle_duration: 전투 진행 시간',
                'level_reached: 도달한 레벨'
              ].map((example, idx) => (
                <div key={idx} style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginLeft: '12px',
                  marginBottom: '4px',
                  fontFamily: 'monospace'
                }}>
                  • {example}
                </div>
              ))}
            </div>
          </div>

          {/* 유저 속성 */}
          <div style={{
            background: theme.cardBg === '#ffffff' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: '#10b981'
            }} />

            <h4 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: theme.text,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                👤
              </div>
              유저 속성
            </h4>

            <p style={{
              fontSize: '14px',
              color: theme.textSecondary,
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              <strong>"누가, 어떤 상태인지"</strong>를 기록<br />
              사용자의 현재 상태와 누적된 특성
            </p>

            <div style={{
              background: theme.cardBg,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h5 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                marginBottom: '12px'
              }}>
                📋 속성 업데이트 방식:
              </h5>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '6px'
                }}>
                  고정값 (한 번 설정되면 변경되지 않음)
                </div>
                {['가입 날짜 (reg_date)', '유입 채널 (acquisition_channel)', '첫 구매 날짜 (first_purchase_date)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '6px'
                }}>
                  최신값 (가장 최근 상태로 업데이트)
                </div>
                {['최종 로그인 시간 (last_login)', '현재 레벨 (current_level)', '마지막 구매 아이템 (last_item)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>

              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '6px'
                }}>
                  누적값 (기존 값에 추가로 더해짐)
                </div>
                {['총 결제 금액 (total_revenue)', '총 로그인 횟수 (login_count)', '총 플레이 시간 (total_playtime)'].map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginLeft: '12px',
                    marginBottom: '2px'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#00ff88',
                marginBottom: '6px'
              }}>
                💡 실제 예시:
              </div>
              <pre style={{
                fontSize: '10px',
                color: '#00ff88',
                margin: 0,
                lineHeight: '1.4'
              }}>
{`user_profile: {
  reg_date: "2024-01-15", // 고정값
  current_level: 25,      // 최신값  
  total_revenue: 50000,   // 누적값
  vip_status: "gold"      // 최신값
}`}
              </pre>
            </div>

            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              borderLeft: '3px solid #10b981'
            }}>
              <p style={{
                fontSize: '13px',
                color: theme.text,
                fontWeight: '600',
                margin: 0,
                lineHeight: '1.4'
              }}>
                💡 <strong>효율성의 비밀:</strong> 이벤트 테이블에서 매번 계산하지 않고<br />
                유저 테이블에 미리 저장해두면 조회 속도가 10배 이상 빨라집니다!
              </p>
            </div>
          </div>
        </div>

        {/* 공통 이벤트 속성 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(245, 158, 11, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Star size={24} style={{ color: '#f59e0b' }} />
            공통 이벤트 속성 - "모든 이벤트에 자동으로 포함"
          </h4>

          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            매번 설정하지 않아도 자동으로 모든 이벤트에 포함되는 기본 속성들입니다.<br />
            환경 정보, 디바이스 정보, 시스템 정보 등이 자동으로 수집됩니다.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { category: '환경 정보', items: ['platform (iOS/Android/Web)', 'app_version (앱 버전)', 'os_version (OS 버전)', 'device_model (기기 모델)'] },
              { category: '세션 정보', items: ['session_id (세션 식별)', 'session_duration (세션 시간)', 'screen_resolution (화면 해상도)', 'network_type (네트워크 타입)'] },
              { category: '유저 상태', items: ['vip_level (VIP 등급)', 'user_level (유저 레벨)', 'country (국가)', 'language (언어)'] },
              { category: '시스템 정보', items: ['lib_version (SDK 버전)', 'data_source (데이터 소스)', 'ip_address (IP 주소)', 'timestamp (발생 시간)']}
            ].map((group, index) => (
              <div key={index} style={{
                background: theme.cardBg,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${theme.cardBorder}`
              }}>
                <h5 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  marginBottom: '12px'
                }}>
                  {group.category}
                </h5>
                {group.items.map((item, idx) => (
                  <div key={idx} style={{
                    fontSize: '11px',
                    color: theme.textSecondary,
                    marginBottom: '4px',
                    fontFamily: 'monospace'
                  }}>
                    • {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: theme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${theme.cardBorder}`
          }}>
            <h5 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme.text,
              marginBottom: '8px'
            }}>
              📊 제한 사항:
            </h5>
            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontSize: '13px',
                color: theme.textSecondary
              }}>
                • <strong>이벤트 속성:</strong> 최대 1,500개
              </div>
              <div style={{
                fontSize: '13px',
                color: theme.textSecondary
              }}>
                • <strong>이벤트 종류:</strong> 최대 1,000개
              </div>
              <div style={{
                fontSize: '13px',
                color: theme.textSecondary
              }}>
                • <strong>유저 속성:</strong> 무제한
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div style={{
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <button
          onClick={() => handleStepComplete('data-structure')}
          disabled={stepCompletion['data-structure']}
          style={{
            background: stepCompletion['data-structure'] ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: stepCompletion['data-structure'] ? '1px solid #10b981' : 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: stepCompletion['data-structure'] ? '#10b981' : 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: stepCompletion['data-structure'] ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: stepCompletion['data-structure'] ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}
        >
          {stepCompletion['data-structure'] ? (
            <>
              <CheckCircle size={20} />
              데이터 구조 이해 완료
            </>
          ) : (
            <>
              ✅ 데이터 구조 완벽 이해하기
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 3: Tracking Policy (트래킹 정책)
  const renderStep3TrackingPolicy = () => (
    <div>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: theme.text, 
        marginBottom: '16px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        📋 트래킹 정책 완벽 가이드 (이벤트 택소노미)
      </h2>

      <p style={{
        fontSize: '18px',
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: '32px',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto 32px'
      }}>
        실무에서 바로 사용할 수 있는 <strong style={{ color: theme.text }}>트래킹 정책 설계</strong>부터<br />
        <strong style={{ color: theme.text }}>이벤트 택소노미 구축</strong>까지 완벽하게 안내합니다
      </p>

      {/* 트래킹 정책 개요 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          "체계적인 데이터 수집 계획이 성공의 열쇠"
        </h3>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.8',
          marginBottom: '24px',
          maxWidth: '700px',
          margin: '0 auto 24px'
        }}>
          트래킹 정책(이벤트 택소노미)은 <strong>어떤 사용자 행동을</strong> <strong>어떻게 수집할지</strong>를 미리 계획하는 설계도입니다.<br />
          이 설계 없이는 데이터 분석이 불가능합니다!
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap'
        }}>
          {[
            { 
              icon: '🎯', 
              title: '목적 중심 설계', 
              desc: '비즈니스 목표에 맞는\n이벤트만 선별',
              color: '#06b6d4'
            },
            { 
              icon: '📊', 
              title: '표준화된 구조', 
              desc: '일관된 네이밍과\n속성 체계 구축',
              color: '#0891b2'
            },
            { 
              icon: '🚀', 
              title: '확장성 고려', 
              desc: '미래 요구사항까지\n고려한 유연한 설계',
              color: '#0e7490'
            }
          ].map((principle, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '20px',
              background: theme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${principle.color}30`,
              minWidth: '180px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{principle.icon}</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: principle.color,
                margin: '0 0 8px 0'
              }}>
                {principle.title}
              </h4>
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                margin: 0,
                lineHeight: '1.4',
                whiteSpace: 'pre-line'
              }}>
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. 이벤트 테이블 상세 가이드 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Database size={28} style={{ color: '#06b6d4' }} />
          1. 이벤트 테이블 - "사용자가 무엇을 했는지" 기록
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          모든 사용자 행동을 체계적으로 분류하고 필요한 속성을 정의합니다.<br />
          <strong>"누가, 언제, 어디서, 무엇을, 어떻게"</strong>의 5W1H 관점으로 설계합니다.
        </p>

        {/* 이벤트 카테고리 분류 */}
        <div style={{
          marginBottom: '24px'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px'
          }}>
            🎯 비즈니스 임팩트별 이벤트 분류
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              {
                category: '핵심 비즈니스 이벤트',
                priority: '최고 우선순위',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                events: [
                  'purchase (구매)',
                  'subscribe (구독 시작)',
                  'signup (회원가입)',
                  'first_purchase (첫 구매)'
                ],
                description: '수익과 직접 연결되는 핵심 전환 이벤트'
              },
              {
                category: '사용자 참여 이벤트',
                priority: '높은 우선순위',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                events: [
                  'login (로그인)',
                  'level_up (레벨업)',
                  'battle_complete (전투 완료)',
                  'tutorial_complete (튜토리얼 완료)'
                ],
                description: '사용자 참여도와 만족도를 측정하는 이벤트'
              },
              {
                category: '탐색 및 발견 이벤트',
                priority: '중간 우선순위',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                events: [
                  'page_view (화면 조회)',
                  'search (검색)',
                  'button_click (버튼 클릭)',
                  'item_view (아이템 조회)'
                ],
                description: '사용자의 탐색 패턴과 관심사를 파악'
              },
              {
                category: '시스템 자동 수집',
                priority: '기본 필수',
                color: '#8b5cf6',
                bgColor: 'rgba(139, 92, 246, 0.1)',
                events: [
                  'ta_app_install (앱 설치)',
                  'ta_app_start (앱 시작)',
                  'ta_app_end (앱 종료)',
                  'ta_app_crash (앱 크래시)'
                ],
                description: 'SDK가 자동으로 수집하는 기본 라이프사이클 이벤트'
              }
            ].map((eventGroup, index) => (
              <div key={index} style={{
                background: eventGroup.bgColor,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${eventGroup.color}30`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: eventGroup.color,
                  borderRadius: '16px 16px 0 0'
                }} />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: eventGroup.color,
                    margin: 0
                  }}>
                    {eventGroup.category}
                  </h5>
                  <span style={{
                    fontSize: '10px',
                    background: eventGroup.color,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    {eventGroup.priority}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {eventGroup.description}
                </p>
                
                {eventGroup.events.map((event, idx) => (
                  <div key={idx} style={{
                    fontSize: '11px',
                    color: theme.text,
                    fontFamily: 'monospace',
                    background: theme.cardBg,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginRight: '6px',
                    marginBottom: '4px'
                  }}>
                    • {event}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 실제 이벤트 테이블 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            📊 실제 이벤트 테이블 예시 - 게임 앱 기준
          </h4>
          
          <div style={{
            overflowX: 'auto',
            marginBottom: '16px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              background: theme.cardBg,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'rgba(6, 182, 212, 0.2)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>이벤트 이름</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>이벤트 별칭</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>이벤트 설명</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>이벤트 태그</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 이름</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 유형</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 설명</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    event: 'purchase_item',
                    alias: '아이템 구매',
                    desc: '사용자가 게임 내 아이템을 실제 결제로 구매할 때',
                    tag: 'revenue',
                    properties: [
                      { name: 'item_id', type: 'string', desc: '구매한 아이템의 고유 ID' },
                      { name: 'item_category', type: 'string', desc: '아이템 카테고리 (weapon, armor, potion)' },
                      { name: 'purchase_amount', type: 'number', desc: '실제 결제 금액 (KRW)' },
                      { name: 'currency_type', type: 'string', desc: '결제 통화 (KRW, USD)' },
                      { name: 'payment_method', type: 'string', desc: '결제 수단 (card, mobile, paypal)' }
                    ]
                  },
                  {
                    event: 'battle_complete',
                    alias: '전투 완료',
                    desc: '사용자가 던전이나 PvP 전투를 완료했을 때',
                    tag: 'engagement',
                    properties: [
                      { name: 'battle_type', type: 'string', desc: '전투 유형 (dungeon, pvp, raid)' },
                      { name: 'battle_result', type: 'string', desc: '전투 결과 (win, lose, draw)' },
                      { name: 'battle_duration', type: 'number', desc: '전투 진행 시간 (초)' },
                      { name: 'experience_gained', type: 'number', desc: '획득한 경험치' },
                      { name: 'gold_earned', type: 'number', desc: '획득한 골드' }
                    ]
                  },
                  {
                    event: 'level_up',
                    alias: '레벨업',
                    desc: '사용자 캐릭터가 레벨업을 달성했을 때',
                    tag: 'progression',
                    properties: [
                      { name: 'old_level', type: 'number', desc: '레벨업 이전 레벨' },
                      { name: 'new_level', type: 'number', desc: '레벨업 후 새로운 레벨' },
                      { name: 'exp_required', type: 'number', desc: '레벨업에 필요했던 경험치' },
                      { name: 'time_to_levelup', type: 'number', desc: '이전 레벨업부터 걸린 시간 (분)' }
                    ]
                  },
                  {
                    event: 'tutorial_step',
                    alias: '튜토리얼 진행',
                    desc: '신규 사용자가 튜토리얼의 각 단계를 진행할 때',
                    tag: 'onboarding',
                    properties: [
                      { name: 'step_number', type: 'number', desc: '현재 튜토리얼 단계 번호' },
                      { name: 'step_name', type: 'string', desc: '튜토리얼 단계 이름' },
                      { name: 'completion_time', type: 'number', desc: '해당 단계 완료까지 걸린 시간 (초)' },
                      { name: 'skip_used', type: 'boolean', desc: '스킵 기능 사용 여부' }
                    ]
                  }
                ].map((eventData, rowIndex) => 
                  eventData.properties.map((prop, propIndex) => (
                    <tr key={`${rowIndex}-${propIndex}`} style={{
                      background: propIndex === 0 ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                      borderBottom: propIndex === eventData.properties.length - 1 ? `2px solid ${theme.cardBorder}` : `1px solid ${theme.cardBorder}`
                    }}>
                      {propIndex === 0 && (
                        <>
                          <td rowSpan={eventData.properties.length} style={{
                            padding: '8px',
                            verticalAlign: 'top',
                            color: theme.text,
                            fontWeight: '600',
                            fontFamily: 'monospace',
                            background: 'rgba(6, 182, 212, 0.1)'
                          }}>
                            {eventData.event}
                          </td>
                          <td rowSpan={eventData.properties.length} style={{
                            padding: '8px',
                            verticalAlign: 'top',
                            color: theme.text,
                            fontWeight: '600'
                          }}>
                            {eventData.alias}
                          </td>
                          <td rowSpan={eventData.properties.length} style={{
                            padding: '8px',
                            verticalAlign: 'top',
                            color: theme.textSecondary,
                            lineHeight: '1.3',
                            maxWidth: '200px'
                          }}>
                            {eventData.desc}
                          </td>
                          <td rowSpan={eventData.properties.length} style={{
                            padding: '8px',
                            verticalAlign: 'top'
                          }}>
                            <span style={{
                              background: eventData.tag === 'revenue' ? '#ef4444' : 
                                        eventData.tag === 'engagement' ? '#3b82f6' : 
                                        eventData.tag === 'progression' ? '#10b981' : '#8b5cf6',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              fontSize: '9px',
                              fontWeight: '600'
                            }}>
                              {eventData.tag}
                            </span>
                          </td>
                        </>
                      )}
                      <td style={{
                        padding: '8px',
                        color: theme.text,
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        {prop.name}
                      </td>
                      <td style={{
                        padding: '8px',
                        color: prop.type === 'string' ? '#3b82f6' : 
                               prop.type === 'number' ? '#10b981' : 
                               prop.type === 'boolean' ? '#f59e0b' : theme.textSecondary,
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        {prop.type}
                      </td>
                      <td style={{
                        padding: '8px',
                        color: theme.textSecondary,
                        lineHeight: '1.3'
                      }}>
                        {prop.desc}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. 유저 테이블 상세 가이드 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Settings size={28} style={{ color: '#8b5cf6' }} />
          2. 유저 테이블 - "사용자가 어떤 상태인지" 관리
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          사용자의 현재 상태, 누적된 행동 결과, 그리고 변하지 않는 기본 정보를 체계적으로 관리합니다.<br />
          <strong>업데이트 방식</strong>에 따라 데이터가 어떻게 관리되는지 이해하는 것이 핵심입니다.
        </p>

        {/* 업데이트 방식 설명 */}
        <div style={{
          marginBottom: '24px'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px'
          }}>
            🔄 유저 속성 업데이트 방식별 분류
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {[
              {
                method: '고정값 (Fixed)',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '🔒',
                description: '한 번 설정되면 절대 변경되지 않는 값',
                use_case: '최초 가입일, 유입 채널, 첫 구매일 등',
                examples: [
                  'reg_date: 2024-01-15',
                  'acquisition_channel: google_ads',
                  'first_purchase_date: 2024-01-20',
                  'signup_country: KR'
                ]
              },
              {
                method: '최신값 (Latest)',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                icon: '🔄',
                description: '새로운 값이 들어올 때마다 기존 값을 덮어씀',
                use_case: '현재 상태나 마지막 행동 정보',
                examples: [
                  'current_level: 25 → 26',
                  'last_login: 2024-03-14',
                  'vip_status: bronze → silver',
                  'last_item_purchased: sword_001'
                ]
              },
              {
                method: '누적값 (Cumulative)',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '➕',
                description: '기존 값에 새로운 값을 더하거나 카운트 증가',
                use_case: '총합, 횟수, 누적 통계 등',
                examples: [
                  'total_revenue: 30000 + 5000 = 35000',
                  'login_count: 45 + 1 = 46',
                  'total_playtime: 120 + 30 = 150분',
                  'battle_wins: 28 + 1 = 29'
                ]
              }
            ].map((updateMethod, index) => (
              <div key={index} style={{
                background: updateMethod.bgColor,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${updateMethod.color}30`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: updateMethod.color,
                  borderRadius: '16px 16px 0 0'
                }} />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: updateMethod.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {updateMethod.icon}
                  </div>
                  <h5 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: updateMethod.color,
                    margin: 0
                  }}>
                    {updateMethod.method}
                  </h5>
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {updateMethod.description}
                </p>
                
                <div style={{
                  background: theme.cardBg,
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: theme.text,
                    fontWeight: '600',
                    marginBottom: '6px'
                  }}>
                    💡 활용 사례:
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: theme.textSecondary,
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    {updateMethod.use_case}
                  </p>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: theme.text,
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    📊 예시:
                  </div>
                  {updateMethod.examples.map((example, idx) => (
                    <div key={idx} style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      background: '#1a1a1a',
                      color: '#00ff88',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 실제 유저 테이블 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            👤 실제 유저 테이블 예시 - 게임 앱 기준
          </h4>
          
          <div style={{
            overflowX: 'auto',
            marginBottom: '16px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              background: theme.cardBg,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 이름</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 별칭</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 유형</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>업데이트 방식</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 설명</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 태그</th>
                </tr>
              </thead>
              <tbody>
                {[
                  // 고정값 속성
                  { name: 'reg_date', alias: '가입 날짜', type: 'date', method: '고정값', desc: '사용자가 최초로 가입한 날짜', tag: 'identity', color: '#ef4444' },
                  { name: 'first_country', alias: '최초 접속 국가', type: 'string', method: '고정값', desc: '최초 접속 시점의 국가 정보', tag: 'identity', color: '#ef4444' },
                  { name: 'acquisition_channel', alias: '유입 채널', type: 'string', method: '고정값', desc: '사용자 유입 경로 (google, facebook, organic)', tag: 'acquisition', color: '#ef4444' },
                  { name: 'first_purchase_date', alias: '첫 구매 날짜', type: 'date', method: '고정값', desc: '최초 결제를 진행한 날짜', tag: 'monetization', color: '#ef4444' },
                  // 최신값 속성
                  { name: 'current_level', alias: '현재 레벨', type: 'number', method: '최신값', desc: '캐릭터의 현재 레벨', tag: 'progression', color: '#3b82f6' },
                  { name: 'last_login', alias: '마지막 로그인', type: 'datetime', method: '최신값', desc: '가장 최근 로그인한 시점', tag: 'engagement', color: '#3b82f6' },
                  { name: 'vip_status', alias: 'VIP 등급', type: 'string', method: '최신값', desc: '현재 VIP 등급 (bronze, silver, gold, diamond)', tag: 'monetization', color: '#3b82f6' },
                  { name: 'last_item_purchased', alias: '마지막 구매 아이템', type: 'string', method: '최신값', desc: '가장 최근에 구매한 아이템 ID', tag: 'monetization', color: '#3b82f6' },
                  { name: 'current_stage', alias: '현재 진행 스테이지', type: 'string', method: '최신값', desc: '현재 진행 중인 게임 스테이지', tag: 'progression', color: '#3b82f6' },
                  // 누적값 속성
                  { name: 'total_revenue', alias: '총 결제 금액', type: 'number', method: '누적값', desc: '사용자의 총 누적 결제 금액 (원)', tag: 'monetization', color: '#10b981' },
                  { name: 'login_count', alias: '총 로그인 횟수', type: 'number', method: '누적값', desc: '누적 로그인 횟수', tag: 'engagement', color: '#10b981' },
                  { name: 'total_playtime', alias: '총 플레이 시간', type: 'number', method: '누적값', desc: '누적 게임 플레이 시간 (분)', tag: 'engagement', color: '#10b981' },
                  { name: 'battle_wins', alias: '총 전투 승리', type: 'number', method: '누적값', desc: '누적 전투 승리 횟수', tag: 'progression', color: '#10b981' },
                  { name: 'items_purchased', alias: '구매 아이템 수', type: 'number', method: '누적값', desc: '총 구매한 아이템 개수', tag: 'monetization', color: '#10b981' },
                  { name: 'friends_invited', alias: '친구 초대 수', type: 'number', method: '누적값', desc: '초대한 친구 총 수', tag: 'social', color: '#10b981' }
                ].map((userProp, index) => (
                  <tr key={index} style={{
                    borderBottom: `1px solid ${theme.cardBorder}`,
                    background: index % 2 === 0 ? 'rgba(139, 92, 246, 0.02)' : 'transparent'
                  }}>
                    <td style={{
                      padding: '8px',
                      color: theme.text,
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {userProp.name}
                    </td>
                    <td style={{
                      padding: '8px',
                      color: theme.text,
                      fontWeight: '600'
                    }}>
                      {userProp.alias}
                    </td>
                    <td style={{
                      padding: '8px',
                      color: userProp.type === 'string' ? '#3b82f6' : 
                             userProp.type === 'number' ? '#10b981' : 
                             userProp.type === 'date' || userProp.type === 'datetime' ? '#f59e0b' : theme.textSecondary,
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {userProp.type}
                    </td>
                    <td style={{
                      padding: '8px'
                    }}>
                      <span style={{
                        background: userProp.color,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {userProp.method}
                      </span>
                    </td>
                    <td style={{
                      padding: '8px',
                      color: theme.textSecondary,
                      lineHeight: '1.3',
                      maxWidth: '250px'
                    }}>
                      {userProp.desc}
                    </td>
                    <td style={{
                      padding: '8px'
                    }}>
                      <span style={{
                        background: userProp.tag === 'identity' ? '#6b7280' : 
                                  userProp.tag === 'acquisition' ? '#f59e0b' : 
                                  userProp.tag === 'monetization' ? '#ef4444' : 
                                  userProp.tag === 'progression' ? '#8b5cf6' : 
                                  userProp.tag === 'engagement' ? '#3b82f6' : '#10b981',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '9px',
                        fontWeight: '600'
                      }}>
                        {userProp.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. 공통 이벤트 속성 상세 가이드 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Star size={28} style={{ color: '#f59e0b' }} />
          3. 공통 이벤트 속성 - "자동으로 모든 이벤트에 포함"
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          매번 수동으로 설정하지 않아도 <strong>모든 이벤트에 자동으로 포함</strong>되는 기본 속성들입니다.<br />
          디바이스 정보, 환경 설정, 세션 정보 등이 SDK를 통해 자동으로 수집됩니다.
        </p>

        {/* 공통 속성 카테고리별 분류 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            {
              category: '디바이스 & 환경 정보',
              color: '#f59e0b',
              icon: '📱',
              description: 'SDK가 자동으로 수집하는 디바이스와 환경 관련 정보',
              properties: [
                { name: 'platform', desc: 'iOS, Android, Web' },
                { name: 'app_version', desc: '앱 버전 (1.2.3)' },
                { name: 'os_version', desc: '운영체제 버전' },
                { name: 'device_model', desc: '기기 모델명' },
                { name: 'screen_resolution', desc: '화면 해상도' },
                { name: 'network_type', desc: 'WiFi, 4G, 5G' }
              ]
            },
            {
              category: '세션 & 시간 정보',
              color: '#8b5cf6',
              icon: '⏱️',
              description: '사용자 세션과 시간 관련 자동 수집 정보',
              properties: [
                { name: 'session_id', desc: '고유 세션 식별자' },
                { name: 'session_duration', desc: '세션 지속 시간' },
                { name: 'timestamp', desc: '이벤트 발생 시각' },
                { name: 'timezone', desc: '사용자 시간대' },
                { name: 'local_time', desc: '현지 시간' }
              ]
            },
            {
              category: '지역 & 언어 정보',
              color: '#06b6d4',
              icon: '🌍',
              description: '사용자의 지역과 언어 설정 관련 정보',
              properties: [
                { name: 'country', desc: '국가 코드 (KR, US)' },
                { name: 'language', desc: '설정 언어 (ko, en)' },
                { name: 'city', desc: '도시 정보' },
                { name: 'ip_address', desc: 'IP 주소 (암호화)' }
              ]
            },
            {
              category: '시스템 & SDK 정보',
              color: '#10b981',
              icon: '⚙️',
              description: 'Thinking Engine SDK와 시스템 관련 정보',
              properties: [
                { name: 'lib_version', desc: 'SDK 버전' },
                { name: 'lib_name', desc: 'SDK 이름' },
                { name: 'data_source', desc: '데이터 소스' },
                { name: 'install_id', desc: '설치 고유 ID' }
              ]
            }
          ].map((commonGroup, index) => (
            <div key={index} style={{
              background: theme.cardBg === '#ffffff' ? `rgba(${commonGroup.color === '#f59e0b' ? '245, 158, 11' : commonGroup.color === '#8b5cf6' ? '139, 92, 246' : commonGroup.color === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, 0.05)` : `rgba(${commonGroup.color === '#f59e0b' ? '245, 158, 11' : commonGroup.color === '#8b5cf6' ? '139, 92, 246' : commonGroup.color === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, 0.1)`,
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${commonGroup.color}30`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: commonGroup.color,
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: commonGroup.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {commonGroup.icon}
                </div>
                <h5 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: commonGroup.color,
                  margin: 0
                }}>
                  {commonGroup.category}
                </h5>
              </div>
              
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {commonGroup.description}
              </p>
              
              <div style={{
                display: 'grid',
                gap: '6px'
              }}>
                {commonGroup.properties.map((prop, propIdx) => (
                  <div key={propIdx} style={{
                    background: theme.cardBg,
                    borderRadius: '6px',
                    padding: '8px',
                    border: `1px solid ${theme.cardBorder}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: theme.text,
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {prop.name}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: theme.textSecondary
                    }}>
                      {prop.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 실제 공통 이벤트 속성 테이블 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(245, 158, 11, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          marginBottom: '24px'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ⭐ 실제 공통 이벤트 속성 테이블
          </h4>
          
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              background: theme.cardBg,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 이름</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 별칭</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 유형</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: theme.text, fontWeight: '700' }}>속성 설명</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'platform', alias: '플랫폼', type: 'string', desc: '디바이스 플랫폼 (iOS, Android, Web, Unity)' },
                  { name: 'app_version', alias: '앱 버전', type: 'string', desc: '현재 설치된 앱의 버전 번호' },
                  { name: 'os_version', alias: 'OS 버전', type: 'string', desc: '운영체제 버전 정보' },
                  { name: 'device_model', alias: '기기 모델', type: 'string', desc: '사용자 디바이스의 모델명' },
                  { name: 'screen_resolution', alias: '화면 해상도', type: 'string', desc: '디바이스 화면 해상도 (1920x1080)' },
                  { name: 'network_type', alias: '네트워크 타입', type: 'string', desc: '네트워크 연결 방식 (WiFi, 4G, 5G)' },
                  { name: 'session_id', alias: '세션 ID', type: 'string', desc: '사용자 세션의 고유 식별자' },
                  { name: 'session_duration', alias: '세션 시간', type: 'number', desc: '현재 세션 지속 시간 (초)' },
                  { name: 'timestamp', alias: '발생 시각', type: 'datetime', desc: '이벤트가 실제 발생한 시각 (UTC)' },
                  { name: 'timezone', alias: '시간대', type: 'string', desc: '사용자의 현재 시간대' },
                  { name: 'country', alias: '국가', type: 'string', desc: 'IP 기반 국가 코드 (KR, US, JP)' },
                  { name: 'language', alias: '언어', type: 'string', desc: '디바이스 설정 언어 (ko, en, ja)' },
                  { name: 'city', alias: '도시', type: 'string', desc: 'IP 기반 추정 도시 정보' },
                  { name: 'ip_address', alias: 'IP 주소', type: 'string', desc: '사용자 IP 주소 (개인정보 암호화)' },
                  { name: 'lib_version', alias: 'SDK 버전', type: 'string', desc: 'Thinking Engine SDK 버전' },
                  { name: 'lib_name', alias: 'SDK 이름', type: 'string', desc: 'SDK 라이브러리 이름' },
                  { name: 'data_source', alias: '데이터 소스', type: 'string', desc: '데이터 전송 소스 구분' },
                  { name: 'install_id', alias: '설치 ID', type: 'string', desc: '앱 설치별 고유 식별자' }
                ].map((commonProp, index) => (
                  <tr key={index} style={{
                    borderBottom: `1px solid ${theme.cardBorder}`,
                    background: index % 2 === 0 ? 'rgba(245, 158, 11, 0.02)' : 'transparent'
                  }}>
                    <td style={{
                      padding: '8px',
                      color: theme.text,
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {commonProp.name}
                    </td>
                    <td style={{
                      padding: '8px',
                      color: theme.text,
                      fontWeight: '600'
                    }}>
                      {commonProp.alias}
                    </td>
                    <td style={{
                      padding: '8px',
                      color: commonProp.type === 'string' ? '#3b82f6' : 
                             commonProp.type === 'number' ? '#10b981' : 
                             commonProp.type === 'datetime' ? '#f59e0b' : theme.textSecondary,
                      fontFamily: 'monospace',
                      fontWeight: '600'
                    }}>
                      {commonProp.type}
                    </td>
                    <td style={{
                      padding: '8px',
                      color: theme.textSecondary,
                      lineHeight: '1.3'
                    }}>
                      {commonProp.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 제한 사항 및 모범 사례 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: theme.cardBg === '#ffffff' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <h5 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ef4444',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={20} />
              📊 시스템 제한 사항
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[
                '이벤트 종류: 최대 1,000개',
                '이벤트 속성: 최대 1,500개',
                '유저 속성: 무제한',
                '공통 이벤트 속성: SDK 기본 제공'
              ].map((limit, idx) => (
                <div key={idx} style={{
                  fontSize: '13px',
                  color: theme.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ef4444'
                  }} />
                  <strong style={{ color: theme.text }}>{limit.split(':')[0]}:</strong>
                  {limit.split(':')[1]}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: theme.cardBg === '#ffffff' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h5 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={20} />
              💡 모범 사례
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[
                '비즈니스 목표 기반 이벤트 설계',
                '일관된 네이밍 컨벤션 사용',
                '속성 유형을 명확히 정의',
                '미래 확장성을 고려한 설계'
              ].map((practice, idx) => (
                <div key={idx} style={{
                  fontSize: '13px',
                  color: theme.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }} />
                  {practice}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        
      <div style={{
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <button
          onClick={() => handleStepComplete('tracking-policy')}
          disabled={stepCompletion['tracking-policy']}
          style={{
            background: stepCompletion['tracking-policy'] ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
            border: stepCompletion['tracking-policy'] ? '1px solid #10b981' : 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: stepCompletion['tracking-policy'] ? '#10b981' : 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: stepCompletion['tracking-policy'] ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: stepCompletion['tracking-policy'] ? 'none' : '0 4px 15px rgba(6, 182, 212, 0.4)'
          }}
        >
          {stepCompletion['tracking-policy'] ? (
            <>
              <CheckCircle size={20} />
              트래킹 정책 설계 완료
            </>
          ) : (
            <>
              ✅ 트래킹 정책 완벽 마스터하기
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 4: Data Simulation (데이터 수집 시뮬레이션)
  const renderStep4DataSimulation = () => (
    <div>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: theme.text, 
        marginBottom: '16px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎮 실전! 데이터 수집 시뮬레이션 체험
      </h2>

      <p style={{
        fontSize: '18px',
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: '32px',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto 32px'
      }}>
        이론을 넘어 <strong style={{ color: theme.text }}>실제 게임을 플레이</strong>하며<br />
        <strong style={{ color: theme.text }}>데이터가 어떻게 수집되는지</strong> 실시간으로 경험해보세요!
      </p>

      {/* SDK 데이터 수집 원리 상세 설명 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          "SDK가 어떻게 사용자 행동을 자동으로 추적할까?"
        </h3>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.8',
          marginBottom: '24px',
          maxWidth: '700px',
          margin: '0 auto 24px'
        }}>
          Thinking Engine SDK는 앱에 통합되어 <strong>사용자의 모든 행동을 실시간으로 감지</strong>하고<br />
          <strong>자동으로 서버에 전송</strong>하는 똑똑한 데이터 수집 엔진입니다
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { 
              icon: '⚡', 
              title: '실시간 감지', 
              desc: '사용자 행동 즉시\n이벤트로 변환',
              color: '#8b5cf6'
            },
            { 
              icon: '🤖', 
              title: '자동 수집', 
              desc: '개발자 개입 없이\n백그라운드 동작',
              color: '#7c3aed'
            },
            { 
              icon: '📡', 
              title: '안전한 전송', 
              desc: 'HTTPS 암호화로\n데이터 보안 보장',
              color: '#6d28d9'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '20px',
              background: theme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${feature.color}30`,
              minWidth: '160px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{feature.icon}</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: feature.color,
                margin: '0 0 8px 0'
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                margin: 0,
                lineHeight: '1.4',
                whiteSpace: 'pre-line'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 상세한 데이터 수집 플로우 */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Activity size={28} style={{ color: '#3b82f6' }} />
          데이터 수집 플로우 - 사용자 행동부터 분석까지
        </h3>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          아래 5단계 플로우를 통해 사용자의 한 번의 클릭이 어떻게 비즈니스 인사이트로 변환되는지 알아보세요.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            { 
              step: '1단계',
              title: '사용자 행동 발생', 
              icon: '👤',
              color: '#8b5cf6', 
              detail: 'User Action',
              description: '사용자가 앱에서 클릭, 구매, 레벨업 등의 행동을 수행합니다.',
              examples: ['버튼 클릭', '아이템 구매', '레벨업 달성', '화면 전환']
            },
            { 
              step: '2단계',
              title: '이벤트 자동 감지', 
              icon: '⚡',
              color: '#3b82f6', 
              detail: 'Event Detection',
              description: 'SDK가 사용자 행동을 실시간으로 감지하고 이벤트 객체로 변환합니다.',
              examples: ['행동 감지', '속성 수집', '타임스탬프 생성', 'JSON 변환']
            },
            { 
              step: '3단계',
              title: 'SDK 데이터 전송', 
              icon: '📡',
              color: '#10b981', 
              detail: 'Data Transmission',
              description: '수집된 데이터를 HTTPS로 암호화하여 Thinking Engine 서버로 전송합니다.',
              examples: ['데이터 암호화', 'HTTP 전송', '네트워크 최적화', '오류 재전송']
            },
            { 
              step: '4단계',
              title: 'TE 서버 수신 및 처리', 
              icon: '🔄',
              color: '#f59e0b', 
              detail: 'Server Processing',
              description: 'Thinking Engine이 데이터를 받아 검증, 변환, 저장 과정을 거쳐 처리합니다.',
              examples: ['데이터 검증', '스키마 매핑', '데이터베이스 저장', '인덱싱 처리']
            },
            { 
              step: '5단계',
              title: '분석 준비 완료', 
              icon: '✅',
              color: '#ef4444', 
              detail: 'Ready for Analysis',
              description: '저장된 데이터가 실시간 분석, 대시보드, 리포트 생성에 사용됩니다.',
              examples: ['실시간 대시보드', '퍼널 분석', '리텐션 분석', '사용자 세그멘테이션']
            }
          ].map((flowStep, index) => (
            <div key={index} style={{
              background: theme.cardBg === '#ffffff' ? `rgba(${flowStep.color === '#8b5cf6' ? '139, 92, 246' : flowStep.color === '#3b82f6' ? '59, 130, 246' : flowStep.color === '#10b981' ? '16, 185, 129' : flowStep.color === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.05)` : `rgba(${flowStep.color === '#8b5cf6' ? '139, 92, 246' : flowStep.color === '#3b82f6' ? '59, 130, 246' : flowStep.color === '#10b981' ? '16, 185, 129' : flowStep.color === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${flowStep.color}30`,
              position: 'relative',
              textAlign: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: flowStep.color,
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{
                fontSize: '12px',
                color: flowStep.color,
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {flowStep.step}
              </div>
              
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{flowStep.icon}</div>
              
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: flowStep.color,
                margin: '0 0 8px 0'
              }}>
                {flowStep.title}
              </h4>
              
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {flowStep.description}
              </p>
              
              <div>
                <div style={{
                  fontSize: '11px',
                  color: theme.text,
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  💡 주요 과정:
                </div>
                {flowStep.examples.map((example, idx) => (
                  <div key={idx} style={{
                    fontSize: '10px',
                    color: theme.textSecondary,
                    marginBottom: '2px',
                    textAlign: 'left'
                  }}>
                    • {example}
                  </div>
                ))}
              </div>
              
              {index < 4 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-15px',
                  transform: 'translateY(-50%)',
                  fontSize: '24px',
                  color: flowStep.color,
                  fontWeight: 'bold',
                  zIndex: 1
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SDK 코드 예시 */}
        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            💻 실제 SDK 구현 코드 예시
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                language: 'JavaScript (Web)',
                code: `// SDK 초기화
ThinkingEngine.init({
  appId: "your_app_id",
  serverUrl: "https://ta.example.com"
});

// 이벤트 자동 전송
ThinkingEngine.track("purchase_item", {
  item_id: "sword_001",
  amount: 3000,
  currency: "KRW",
  payment_method: "card"
});

// 사용자 속성 업데이트
ThinkingEngine.userSet({
  current_level: 25,
  total_revenue: 15000
});`
              },
              {
                language: 'Unity C# (게임)',
                code: `// SDK 초기화
ThinkingEngine.Initialize("your_app_id", 
  "https://ta.example.com");

// 게임 이벤트 전송
var properties = new Dictionary<string, object>();
properties["enemy_type"] = "dragon";
properties["battle_duration"] = 120;
properties["exp_gained"] = 500;

ThinkingEngine.Track("battle_complete", 
  properties);

// 플레이어 레벨업
ThinkingEngine.UserSet("current_level", 26);`
              }
            ].map((codeExample, index) => (
              <div key={index} style={{
                background: '#1a1a1a',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#00ff88',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  🔧 {codeExample.language}
                </div>
                <pre style={{
                  fontSize: '10px',
                  color: '#00ff88',
                  margin: 0,
                  lineHeight: '1.4',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {codeExample.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 실제 체험 섹션 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          🎮 지금 바로 체험해보세요!
        </h3>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px',
          maxWidth: '600px',
          margin: '0 auto 24px'
        }}>
          왼쪽의 <strong style={{ color: theme.text }}>드래곤 퀘스트 게임</strong>을 플레이하면<br />
          오른쪽에서 <strong style={{ color: theme.text }}>실시간 JSON 데이터</strong>가 생성되는 모습을 확인할 수 있습니다
        </p>
      </div>

      {/* 게임과 JSON 로그 좌우 배치 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* 왼쪽: 실제 플레이 가능한 게임 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🎮 드래곤 퀘스트 - 실제 게임
          </h3>

          <DragonQuestGame 
            onAction={generateEvent} 
            isSimulating={isSimulating}
            currentAction={currentAction}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            currentUser={currentUser}
          />
        </div>

        {/* 오른쪽: JSON 로그 실시간 표시 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BarChart size={20} style={{ color: '#f59e0b' }} />
            실시간 JSON 로그
          </h3>
          
          <div ref={logContainerRef} style={{
            background: '#1a1a1a',
            borderRadius: '8px',
            padding: '16px',
            height: '400px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1px solid #333'
          }}>
            {eventLogs.length === 0 ? (
              <div style={{
                color: '#666',
                textAlign: 'center',
                padding: '40px',
                fontSize: '14px'
              }}>
                게임을 플레이하면 실시간으로<br/>JSON 이벤트 로그가 표시됩니다
              </div>
            ) : (
              eventLogs.slice(-10).map((log, index) => (
                <div key={index} style={{
                  marginBottom: '12px',
                  padding: '8px',
                  background: index === eventLogs.slice(-10).length - 1 ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  borderRadius: '4px',
                  border: index === eventLogs.slice(-10).length - 1 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                  animation: index === eventLogs.slice(-10).length - 1 ? 'fadeIn 0.5s ease' : 'none'
                }}>
                  <div style={{
                    color: '#00ff88',
                    fontSize: '10px',
                    marginBottom: '4px'
                  }}>
                    [{new Date(log.timestamp).toLocaleTimeString()}] {log.event_name}
                  </div>
                  <pre style={{
                    color: '#00ff88',
                    margin: 0,
                    fontSize: '10px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {JSON.stringify(log.json, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 수집된 데이터 테이블 표시 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* 이벤트 데이터 테이블 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Database size={20} style={{ color: '#06b6d4' }} />
            실시간 이벤트 테이블
          </h3>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ background: 'rgba(6, 182, 212, 0.1)', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '8px 4px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>시간</th>
                  <th style={{ padding: '8px 4px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>이벤트</th>
                  <th style={{ padding: '8px 4px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>유저ID</th>
                  <th style={{ padding: '8px 4px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>속성</th>
                </tr>
              </thead>
              <tbody>
                {eventLogs.slice(-5).map((log, index) => (
                  <tr key={index} style={{ 
                    background: index === eventLogs.slice(-5).length - 1 ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}>
                    <td style={{ padding: '6px 4px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '6px 4px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text, fontWeight: '500' }}>
                      {log.event_name}
                    </td>
                    <td style={{ padding: '6px 4px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>
                      {log.user_id}
                    </td>
                    <td style={{ padding: '6px 4px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>
                      {Object.keys(log.json.properties).filter(key => !key.startsWith('#')).length}개
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 유저 데이터 테이블 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Settings size={20} style={{ color: '#8b5cf6' }} />
            실시간 유저 테이블
          </h3>
          
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <th style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>속성</th>
                <th style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, textAlign: 'left', color: theme.text, fontWeight: '600' }}>값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>User ID</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>{currentUser.user_id}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>현재 레벨</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>{playerStats.level}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>경험치</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>{playerStats.experience}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>골드</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>{playerStats.gold}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>이벤트 수</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>{eventLogs.length}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>세션 시간</td>
                <td style={{ padding: '8px', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.text }}>
                  {Math.floor((Date.now() - new Date(currentUser.active_time).getTime()) / 1000)}초
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 학습 요약 및 다음 단계 안내 */}
      <div style={{
        background: theme.cardBg === '#ffffff' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '16px'
        }}>
          🎆 체험을 통해 배운 내용
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            {
              icon: '⚡',
              title: 'SDK 동작 원리',
              desc: '사용자 행동이 어떻게 자동으로 데이터로 변환되는지 체험',
              color: '#8b5cf6'
            },
            {
              icon: '📊',
              title: '실시간 데이터 생성',
              desc: '게임 플레이를 통해 JSON 이벤트 데이터 생성 과정 학습',
              color: '#7c3aed'
            },
            {
              icon: '📡',
              title: '데이터 수집 플로우',
              desc: '5단계 데이터 수집 과정과 SDK 구현 코드 예시 학습',
              color: '#6d28d9'
            }
          ].map((learning, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '20px',
              background: theme.cardBg,
              borderRadius: '12px',
              border: `1px solid ${learning.color}30`
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{learning.icon}</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: learning.color,
                margin: '0 0 8px 0'
              }}>
                {learning.title}
              </h4>
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                margin: 0,
                lineHeight: '1.4'
              }}>
                {learning.desc}
              </p>
            </div>
          ))}
        </div>
        
        <p style={{
          fontSize: '14px',
          color: theme.textSecondary,
          marginBottom: '24px'
        }}>
          이제 마지막 단계에서 <strong style={{ color: theme.text }}>수집된 데이터로 어떤 분석을 할 수 있는지</strong> 알아보세요!
        </p>
      </div>
        
      <div style={{
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <button
          onClick={() => handleStepComplete('data-simulation')}
          disabled={stepCompletion['data-simulation']}
          style={{
            background: stepCompletion['data-simulation'] ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            border: stepCompletion['data-simulation'] ? '1px solid #10b981' : 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: stepCompletion['data-simulation'] ? '#10b981' : 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: stepCompletion['data-simulation'] ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: stepCompletion['data-simulation'] ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}
        >
          {stepCompletion['data-simulation'] ? (
            <>
              <CheckCircle size={20} />
              데이터 수집 체험 완료
            </>
          ) : (
            <>
              ✅ 데이터 수집 마스터하기
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 5: Data Utilization (데이터 활용)
  const renderStep5DataUtilization = () => (
    <div>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: '700', 
        color: theme.text, 
        marginBottom: '24px',
        textAlign: 'center' 
      }}>
        📈 데이터 활용
      </h2>
      
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <BarChart size={20} style={{ color: '#10b981' }} />
          주요 분석 모델
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            { 
              title: '이벤트 분석', 
              desc: '특정 이벤트의 발생 횟수, 유니크 유저 수, 평균값 등을 분석합니다.',
              icon: '📊',
              color: '#3b82f6',
              details: ['총횟수, 유니크 유저수', '수치형: 총합, 평균값, 중위수', '문자열: 중복 제거 값']
            },
            { 
              title: '리텐션 분석', 
              desc: '사용자가 서비스에 재방문하는 비율을 분석합니다.',
              icon: '🔄',
              color: '#10b981',
              details: ['N일 리텐션 추세', '일일 리텐션 분석', '코호트별 리텐션']
            },
            { 
              title: '퍼널 분석', 
              desc: '사용자의 단계별 전환율을 분석합니다.',
              icon: '🎯',
              color: '#f59e0b',
              details: ['단계별 전환율', '이탈 지점 분석', '최대 30개 단계']
            },
            { 
              title: '분포 분석', 
              desc: '특정 속성의 분포를 시각화하여 분석합니다.',
              icon: '📈',
              color: '#8b5cf6',
              details: ['속성값 분포', '히스토그램', '백분위수 분석']
            }
          ].map((analysis, index) => (
            <div key={index} style={{
              background: theme.cardBg === '#ffffff' ? `rgba(${analysis.color === '#3b82f6' ? '59, 130, 246' : analysis.color === '#10b981' ? '16, 185, 129' : analysis.color === '#f59e0b' ? '245, 158, 11' : '139, 92, 246'}, 0.05)` : `rgba(${analysis.color === '#3b82f6' ? '59, 130, 246' : analysis.color === '#10b981' ? '16, 185, 129' : analysis.color === '#f59e0b' ? '245, 158, 11' : '139, 92, 246'}, 0.1)`,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${analysis.color}30`
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                {analysis.icon}
              </div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: theme.text, 
                margin: '0 0 8px 0',
                textAlign: 'center'
              }}>
                {analysis.title}
              </h4>
              <p style={{ 
                fontSize: '13px', 
                color: theme.textSecondary, 
                lineHeight: '1.5', 
                margin: '0 0 12px 0',
                textAlign: 'center'
              }}>
                {analysis.desc}
              </p>
              <ul style={{
                fontSize: '11px',
                color: theme.textSecondary,
                lineHeight: '1.4',
                margin: 0,
                paddingLeft: '16px'
              }}>
                {analysis.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          background: theme.cardBg === '#ffffff' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '20px'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: theme.text, 
            margin: '0 0 12px 0' 
          }}>
            🎯 실제 활용 사례
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px' 
          }}>
            {[
              '궁수의 전설: 리텐션 33% 향상',
              '다그닥 기사단: 매출 2배 달성',
              'DAU/MAU 분석으로 활성 유저 파악',
              'LTV 분석으로 고가치 유저 식별',
              '부정행위 유저 탐지 및 차단',
              '개인화된 콘텐츠 추천 시스템'
            ].map((usecase, index) => (
              <div key={index} style={{
                fontSize: '13px',
                color: theme.text,
                padding: '8px 12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {usecase}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <button
            onClick={() => handleStepComplete('data-utilization')}
            disabled={stepCompletion['data-utilization']}
            style={{
              background: stepCompletion['data-utilization'] ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
              border: stepCompletion['data-utilization'] ? '1px solid #10b981' : 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              color: stepCompletion['data-utilization'] ? '#10b981' : 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: stepCompletion['data-utilization'] ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            {stepCompletion['data-utilization'] ? (
              <>
                <CheckCircle size={16} />
                완료됨
              </>
            ) : (
              <>
                ✅ 학습 완료
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1Overview();
      case 2:
        return renderStep2DataStructure();
      case 3:
        return renderStep3TrackingPolicy();
      case 4:
        return renderStep4DataSimulation();
      case 5:
        return renderStep5DataUtilization();
      default:
        return renderStep1Overview();
    }
  };

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
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: theme.text,
              margin: '0 0 16px 0'
            }}>
              📊 데이터 수집 시뮬레이터
            </h2>
            
            <p style={{ 
              fontSize: '18px', 
              color: theme.textSecondary,
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 24px'
            }}>
              Thinking Engine의 핵심 기능을 단계별로 체험해보세요.<br />
              실제 데이터 수집부터 분석까지 전 과정을 학습합니다.
            </p>

            {/* 퀵 스타트 통계 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '24px'
            }}>
              {[
                { label: '완료된 미션', value: `${completedCount}/5`, color: '#10b981' },
                { label: '현재 단계', value: `${currentStep}`, color: '#8b5cf6' },
                { label: '진행률', value: `${Math.round(progressPercentage)}%`, color: '#f59e0b' }
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
          >
            ← 이전
          </button>

          {/* 진행률 표시 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {steps.map((step) => (
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

          {currentStep === 5 ? (
            <button
              onClick={() => window.location.hash = ''}
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
            >
              🏠 홈으로
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
            >
              다음 →
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};