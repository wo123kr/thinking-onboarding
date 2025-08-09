import React from 'react';
import { Zap, Database, BarChart, Users, Shield, Rocket, Star, Trophy } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const IntroPage: React.FC = () => {
  const { t } = useLanguage();
  const { colors } = useTheme();

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
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 30px rgba(139, 92, 246, 0.4)'
            }}>
              <Zap size={40} color="white" />
            </div>
            
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 16px 0',
              lineHeight: '1.2'
            }}>
              {t('intro.title')}
            </h1>
            
            <p style={{ 
              fontSize: '20px', 
              color: theme.textSecondary,
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 32px'
            }}>
              {t('intro.subtitle')}
            </p>

            {/* 주요 통계 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              marginTop: '32px'
            }}>
              {[
                { label: t('intro.stats.activeUsers'), value: '10,000+', color: '#10b981', icon: <Users size={20} /> },
                { label: t('intro.stats.processedEvents'), value: '1B+', color: '#8b5cf6', icon: <Database size={20} /> },
                { label: t('intro.stats.satisfaction'), value: '98%', color: '#f59e0b', icon: <Star size={20} /> }
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: stat.color
                  }}>
                    {stat.icon}
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: stat.color,
                      textShadow: `0 0 10px ${stat.color}40`
                    }}>
                      {stat.value}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: theme.textSecondary,
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 주요 기능 소개 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            {
              icon: <BarChart size={32} />,
              title: t('intro.features.realtime.title'),
              description: t('intro.features.realtime.description'),
              color: '#3b82f6',
              gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            },
            {
              icon: <Shield size={32} />,
              title: t('intro.features.security.title'),
              description: t('intro.features.security.description'),
              color: '#10b981',
              gradient: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
              icon: <Rocket size={32} />,
              title: t('intro.features.quickSetup.title'),
              description: t('intro.features.quickSetup.description'),
              color: '#f59e0b',
              gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: theme.cardBg,
              borderRadius: '20px',
              padding: '32px',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.3)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
            >
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '100px',
                height: '100px',
                background: `${feature.color}15`,
                borderRadius: '50%',
                filter: 'blur(30px)'
              }} />

              <div style={{
                width: '64px',
                height: '64px',
                background: feature.gradient,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: `0 8px 20px ${feature.color}40`,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ color: 'white' }}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: theme.text,
                margin: '0 0 12px 0',
                position: 'relative',
                zIndex: 1
              }}>
                {feature.title}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: theme.textSecondary,
                lineHeight: '1.6',
                margin: 0,
                position: 'relative',
                zIndex: 1
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA 섹션 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '24px',
          padding: '48px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)'
            }}>
              <Trophy size={32} color="white" />
            </div>

            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: theme.text,
              margin: '0 0 16px 0'
            }}>
              {t('intro.cta.title')}
            </h2>

            <p style={{
              fontSize: '18px',
              color: theme.textSecondary,
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto 32px'
            }}>
              {t('intro.cta.subtitle')}
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => window.location.href = './quickstart'}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                }}
              >
                <Rocket size={20} />
                {t('intro.cta.quickStart')}
              </button>

              <button
                onClick={() => window.open('https://docs.thinkingdata.kr/', '_blank')}
                style={{
                  background: 'transparent',
                  border: `2px solid ${theme.cardBorder}`,
                  borderRadius: '12px',
                  padding: '14px 32px',
                  color: theme.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.borderColor = theme.accent;
                  (e.currentTarget as HTMLElement).style.color = theme.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = theme.cardBorder;
                  (e.currentTarget as HTMLElement).style.color = theme.text;
                }}
              >
                <Database size={20} />
                {t('intro.cta.viewDocs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};