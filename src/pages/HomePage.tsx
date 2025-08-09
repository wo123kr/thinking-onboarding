import React, { useState, useEffect } from 'react';
import { Play, Search, Menu, Sun, Moon, Settings, Bell, User, Star, Trophy, Gamepad2, Zap, Shield } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigateToQuickStart = () => {
    window.location.href = '/quickstart';
  };

  const navigateToIntro = () => {
    window.location.href = '/intro';
  };

  const showDevelopingMessage = () => {
    alert(t('alert.developing'));
  };

  // 반응형 설정
  const isMobile = screenSize.width < 768;

  // 테마 색상 가져오기
  const currentTheme = colors;
  const isDesktop = screenSize.width >= 1200;

  // 게이밍 스타일 가이드 카드들
  const guideCards = [
    {
      id: 1,
      title: t('guide.quickStart.title'),
      subtitle: t('guide.quickStart.subtitle'),
      icon: Zap,
      gradient: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
      category: t('category.start'),
      level: t('level.beginner'),
      onClick: navigateToQuickStart,
      status: "featured" // 인기
    },
    {
      id: 2,
      title: t('guide.introduction.title'),
      subtitle: t('guide.introduction.subtitle'),
      icon: Shield,
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      category: t('category.basic'),
      level: t('level.beginner'),
      onClick: navigateToIntro,
      status: "available" // 사용 가능
    },
    {
      id: 3,
      title: t('guide.userGuide.title'),
      subtitle: t('guide.userGuide.subtitle'),
      icon: User,
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      category: t('category.usage'),
      level: t('level.intermediate'),
      onClick: showDevelopingMessage,
      status: "developing" // 개발중
    },
    {
      id: 4,
      title: t('guide.devDocs.title'),
      subtitle: t('guide.devDocs.subtitle'),
      icon: Settings,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      category: t('category.development'),
      level: t('level.advanced'),
      onClick: showDevelopingMessage,
      status: "developing" // 개발중
    },
    {
      id: 5,
      title: t('guide.faq.title'),
      subtitle: t('guide.faq.subtitle'),
      icon: Star,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      category: t('category.help'),
      level: t('level.all'),
      onClick: showDevelopingMessage,
      status: "developing" // 개발중
    },
    {
      id: 6,
      title: t('guide.support.title'),
      subtitle: t('guide.support.subtitle'),
      icon: Trophy,
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
      category: t('category.support'),
      level: t('level.premium'),
      onClick: showDevelopingMessage,
      status: "developing" // 개발중
    }
  ];

  return (
    <Layout>
      {/* 메인 컨텐츠 */}
      <div style={{
        padding: isMobile ? '16px' : '32px',
        maxWidth: screenSize.width >= 1400 ? '1400px' : '1200px',
        margin: '0 auto'
      }}>
        
        {/* 히어로 섹션 */}
        <div style={{
          background: currentTheme.cardBg,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: isMobile ? '32px' : '48px',
          marginBottom: '32px',
          border: `1px solid ${currentTheme.cardBorder}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
              }}>
                🚀
              </div>
              <div>
                <h2 style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  {t('home.title')}
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: currentTheme.textSecondary,
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {t('home.subtitle')}
                </p>
              </div>
            </div>
            
            {/* 퀵 스타트 버튼 */}
            <div 
              onClick={navigateToQuickStart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(139, 92, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
              }}
            >
              <Play size={20} />
              {t('home.quickStart')}
            </div>
          </div>
        </div>

        {/* 카테고리 섹션 */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: currentTheme.text,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Gamepad2 size={28} style={{ color: currentTheme.accent }} />
            {t('home.guideCollection')}
          </h3>
          <p style={{
            fontSize: '16px',
            color: currentTheme.textSecondary,
            margin: 0,
            marginBottom: '24px'
          }}>
            {t('home.guideDescription')}
          </p>
        </div>

        {/* 게이밍 스타일 가이드 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? '1fr' 
            : screenSize.width >= 1400 
              ? 'repeat(3, 1fr)' 
              : screenSize.width >= 900 
                ? 'repeat(2, 1fr)' 
                : '1fr',
          gap: '24px'
        }}>
          {guideCards.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <div
                key={guide.id}
                onClick={guide.onClick}
                style={{
                  background: currentTheme.cardBg,
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.cardBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.transform = 'translateY(-8px)';
                  element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  element.style.borderColor = guide.gradient.includes('#8b5cf6') ? '#8b5cf6' : '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.transform = 'translateY(0)';
                  element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                  element.style.borderColor = currentTheme.cardBorder;
                }}
              >
                {/* 상태 배지 */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: guide.status === 'featured' ? currentTheme.premium : 
                           guide.status === 'available' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(107, 114, 128, 0.8)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {guide.status === 'featured' ? (
                    <>
                      <Star size={12} />
                      {t('home.featured')}
                    </>
                  ) : guide.status === 'available' ? (
                    <>
                      {t('home.available')}
                    </>
                  ) : (
                    <>
                      {t('home.developing')}
                    </>
                  )}
                </div>

                {/* 그라데이션 상단 라인 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: guide.gradient
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: guide.gradient,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                  }}>
                    <IconComponent size={28} style={{ color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: currentTheme.textSecondary,
                        background: 'rgba(139, 92, 246, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {guide.category}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: guide.level === '프리미엄' ? '#f59e0b' : currentTheme.textSecondary
                      }}>
                        {guide.level}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: currentTheme.text,
                      margin: '0 0 8px 0',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {guide.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.textSecondary,
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {guide.subtitle}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* 하단 여백 */}
        <div style={{ height: '40px' }} />
      </div>
    </Layout>
  );
};