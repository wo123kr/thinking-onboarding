import React, { useState, useEffect } from 'react';
import { Cloud, Server, Building, Zap, Star, Trophy } from 'lucide-react';
import { Checkbox } from '../../components/Checkbox';
import { InfoBox } from '../../components/InfoBox';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Step1Props {
  onComplete: () => void;
  onVersionSelect: (version: 'saas' | 'private') => void;
  selectedVersion: 'saas' | 'private' | null;
}

export const Step1ProjectCreation: React.FC<Step1Props> = ({
  onComplete,
  onVersionSelect,
  selectedVersion
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (understood && selectedVersion) {
      onComplete();
    }
  }, [understood, selectedVersion, onComplete]);

  // 테마 색상 가져오기
  const theme = colors;

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
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '16px',
          border: `1px solid ${theme.cardBorder}`,
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
            <Zap size={28} color="white" />
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
              {t('step1.mission')} 🚀
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
                {t('step1.reward')}
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
              ▷ 1/4 단계
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
          {t('step1.warning')}
        </p>
      </div>

      {/* 게이밍 스타일 Version Selection */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <Trophy size={24} style={{ color: '#f59e0b' }} />
          <h4 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: theme.text,
            margin: 0
          }}>
            {t('step1.versionChallenge')}
          </h4>
        </div>
        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          marginBottom: '24px',
          paddingLeft: '36px'
        }}>
          {t('step1.chooseVersion')}
        </p>
        
        {/* 게이밍 스타일 Version Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div
            onClick={() => onVersionSelect('saas')}
            style={{
              padding: '24px',
              border: selectedVersion === 'saas' 
                ? '2px solid #8b5cf6' 
                : `1px solid ${theme.cardBorder}`,
              borderRadius: '20px',
              cursor: 'pointer',
              background: selectedVersion === 'saas' 
                ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
                : theme.cardBg,
              backdropFilter: 'blur(20px)',
              color: selectedVersion === 'saas' ? 'white' : theme.text,
              boxShadow: selectedVersion === 'saas' 
                ? '0 8px 30px rgba(139, 92, 246, 0.4)' 
                : '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              transform: selectedVersion === 'saas' ? 'translateY(-8px) scale(1.02)' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (selectedVersion !== 'saas') {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedVersion !== 'saas') {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }
            }}
          >
            {selectedVersion === 'saas' && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={12} />
                {t('step1.selected')}
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: selectedVersion === 'saas' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <Cloud size={32} color="white" />
              </div>
              <div>
                <h5 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: selectedVersion === 'saas' ? 'white' : theme.text
                }}>
                  ☁️ {t('step1.saasTitle')}
                </h5>
                <p style={{
                  fontSize: '14px',
                  color: selectedVersion === 'saas' ? 'rgba(255,255,255,0.8)' : theme.textSecondary,
                  margin: 0
                }}>
{t('step1.saasSubtitle')}
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[t('step1.saasFeature1'), t('step1.saasFeature2'), t('step1.saasFeature3')].map((feature, index) => (
                <span key={index} style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  background: selectedVersion === 'saas' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  color: selectedVersion === 'saas' ? 'white' : theme.textSecondary
                }}>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div
            onClick={() => onVersionSelect('private')}
            style={{
              padding: '24px',
              border: selectedVersion === 'private' 
                ? '2px solid #10b981' 
                : `1px solid ${theme.cardBorder}`,
              borderRadius: '20px',
              cursor: 'pointer',
              background: selectedVersion === 'private' 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : theme.cardBg,
              backdropFilter: 'blur(20px)',
              color: selectedVersion === 'private' ? 'white' : theme.text,
              boxShadow: selectedVersion === 'private' 
                ? '0 8px 30px rgba(16, 185, 129, 0.4)' 
                : '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              transform: selectedVersion === 'private' ? 'translateY(-8px) scale(1.02)' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (selectedVersion !== 'private') {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedVersion !== 'private') {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }
            }}
          >
            {selectedVersion === 'private' && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={12} />
                {t('step1.selected')}
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: selectedVersion === 'private' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <Server size={32} color="white" />
              </div>
              <div>
                <h5 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: selectedVersion === 'private' ? 'white' : theme.text
                }}>
                  🏰 {t('step1.privateTitle')}
                </h5>
                <p style={{
                  fontSize: '14px',
                  color: selectedVersion === 'private' ? 'rgba(255,255,255,0.8)' : theme.textSecondary,
                  margin: 0
                }}>
{t('step1.privateSubtitle')}
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[t('step1.privateFeature1'), t('step1.privateFeature2'), t('step1.privateFeature3')].map((feature, index) => (
                <span key={index} style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  background: selectedVersion === 'private' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  color: selectedVersion === 'private' ? 'white' : theme.textSecondary
                }}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Selection */}
        {selectedVersion && (
          <div style={{
            padding: '24px',
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '150px',
              height: '150px',
              background: selectedVersion === 'saas' 
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
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
                width: '40px',
                height: '40px',
                background: selectedVersion === 'saas' 
                  ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
                {selectedVersion === 'saas' ? (
                  <Cloud size={20} color="white" />
                ) : (
                  <Server size={20} color="white" />
                )}
              </div>
              <h5 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                color: theme.text
              }}>
{selectedVersion === 'saas' ? `☁️ ${t('step1.saasTitle')} ${t('step1.detailedInfo')}` : `🏰 ${t('step1.privateTitle')} ${t('step1.detailedInfo')}`}
              </h5>
            </div>

            <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#10b981',
                  padding: '4px 8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px'
                }}>
                  {t('step1.advantagesLabel')}
                </span>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '14px',
                color: theme.textSecondary,
                lineHeight: '1.6'
              }}>
                {selectedVersion === 'saas' ? (
                  <>
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasAdvantage1') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasAdvantage2') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasAdvantage3') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasAdvantage4') }} />
                  </>
                ) : (
                  <>
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateAdvantage1') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateAdvantage2') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateAdvantage3') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateAdvantage4') }} />
                  </>
                )}
              </ul>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  padding: '4px 8px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px'
                }}>
                  {t('step1.considerationsLabel')}
                </span>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '14px',
                color: theme.textSecondary,
                lineHeight: '1.6'
              }}>
                {selectedVersion === 'saas' ? (
                  <>
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasConsideration1') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasConsideration2') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.saasConsideration3') }} />
                  </>
                ) : (
                  <>
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateConsideration1') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateConsideration2') }} />
                    <li style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: t('step1.privateConsideration3') }} />
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 게이밍 스타일 Project Creation Process */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '28px',
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(50px)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
            }}>
              <Building size={24} color="white" />
            </div>
            <div>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {t('step1.questGuide')}
              </h4>
              <p style={{
                fontSize: '14px',
                color: theme.textSecondary,
                margin: '4px 0 0 0'
              }}>
                {t('step1.questGuideDesc')}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              { num: 1, title: t('step1.step1Title'), desc: t('step1.step1Desc'), color: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' },
              { num: 2, title: t('step1.step2Title'), desc: t('step1.step2Desc'), color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
              { num: 3, title: t('step1.step3Title'), desc: t('step1.step3Desc'), color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
              { num: 4, title: t('step1.step4Title'), desc: t('step1.step4Desc'), color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
              { num: 5, title: t('step1.step5Title'), desc: t('step1.step5Desc'), color: 'linear-gradient(135deg, #10b981, #059669)' }
            ].map((step, index) => (
              <div key={step.num} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(8px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.05)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: step.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}>
                  {step.num}
                </div>
                <div>
                  <h5 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 4px 0',
                    color: theme.text
                  }}>
                    {step.title}
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: theme.textSecondary,
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Completion Checkbox */}
      <div style={{ 
        padding: '24px', 
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
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
                    ? t('step1.checkboxCompleted')
                    : t('step1.checkboxReady')
                  }
                </span>
              }
            />
            {understood && !selectedVersion && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#f59e0b',
                  fontWeight: '600'
                }}>
{t('step1.selectVersionWarning')}
                </div>
              </div>
            )}
            {understood && selectedVersion && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  <Trophy size={16} />
                  {t('step1.rewardEarned')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};