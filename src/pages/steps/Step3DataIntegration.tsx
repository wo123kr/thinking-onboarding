import React, { useState, useEffect } from 'react';
import { Database, Smartphone, Gamepad2, Wrench, Globe, Star, Trophy } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Checkbox } from '../../components/Checkbox';
import { InfoBox } from '../../components/InfoBox';
import { Tabs } from '../../components/Tabs';
import { Input } from '../../components/Input';
import { CodeBlock } from '../../components/CodeBlock';
import { CodeTabs } from '../../components/CodeTabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Step3Props {
  onComplete: () => void;
  appData: {
    appId: string;
    dataUrl: string;
    selectedVersion: 'saas' | 'private' | null;
  };
  onAppDataChange: (data: any) => void;
}

export const Step3DataIntegration: React.FC<Step3Props> = ({
  onComplete,
  appData,
  onAppDataChange
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [understood, setUnderstood] = useState(false);
  const [hasRequiredData, setHasRequiredData] = useState(false);

  // 테마 색상 가져오기
  const theme = colors;

  useEffect(() => {
    const hasData = appData.appId.trim() !== '' && appData.dataUrl.trim() !== '';
    setHasRequiredData(hasData);
    
    if (understood && hasData) {
      onComplete();
    }
  }, [understood, appData, onComplete]);

  const platformTabs = [
    {
      id: 'javascript',
      label: 'JavaScript',
      icon: <Globe size={16} />,
      content: getJavaScriptCode(appData, t)
    },
    {
      id: 'ios',
      label: 'iOS',
      icon: <Smartphone size={16} />,
      content: getIOSCode(appData, t)
    },
    {
      id: 'android',
      label: 'Android',
      icon: <Smartphone size={16} />,
      content: getAndroidCode(appData, t)
    },
    {
      id: 'unity',
      label: 'Unity',
      icon: <Gamepad2 size={16} />,
      content: getUnityCode(appData, t)
    },
    {
      id: 'unreal',
      label: 'Unreal',
      icon: <Gamepad2 size={16} />,
      content: getUnrealCode(appData, t)
    },
    {
      id: 'api',
      label: 'RESTful API',
      icon: <Wrench size={16} />,
      content: getAPICode(appData, t)
    }
  ];

  const tabs = platformTabs.map(platform => ({
    id: platform.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {platform.icon}
        {platform.label}
      </div>
    ),
    content: platform.content
  }));

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
          background: 'rgba(6, 182, 212, 0.1)',
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
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)',
            position: 'relative',
            zIndex: 1
          }}>
            <Database size={28} color="white" />
          </div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginBottom: '8px'
            }}>
              {t('step3.mission')} 🔗
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
                {t('step3.rewardXP')}
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
              color: '#06b6d4',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ▷ 3/4 단계
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
          <span dangerouslySetInnerHTML={{ __html: t('step3.goal') }} />
        </p>
      </div>

      {/* 게이밍 스타일 App Configuration */}
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
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
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
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
            }}>
              <Wrench size={24} color="white" />
            </div>
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('step3.configInputTitle')}
            </h4>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <Input
              label="App ID"
              value={appData.appId}
              onChange={(value) => onAppDataChange({ ...appData, appId: value })}
              placeholder="your-app-id"
              required
            />
            <Input
              label="Data URL"
              value={appData.dataUrl}
              onChange={(value) => onAppDataChange({ ...appData, dataUrl: value })}
              placeholder="https://your-server-url/sync_js"
              required
              type="url"
            />
          </div>
          
          <div style={{
            padding: '20px',
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.accent,
                padding: '6px 10px',
                background: 'rgba(6, 182, 212, 0.2)',
                borderRadius: '8px'
              }}>
                {t('step3.configInfoTitle')}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              color: theme.textSecondary, 
              fontSize: '14px', 
              lineHeight: '1.6' 
            }}>
              {t('step3.configInfoText')}
            </p>
          </div>
        </div>
      </div>

      {/* 게이밍 스타일 Platform SDK Guides */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
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
            <Globe size={24} color="white" />
          </div>
          <h4 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('step3.platformGuideTitle')}
          </h4>
        </div>
        
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)'
        }}>
          <Tabs tabs={tabs} defaultTab="javascript" />
        </div>
      </div>

      {/* 게이밍 스타일 Additional Resources */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
            fontSize: '20px'
          }}>
            📚
          </div>
          <h4 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('step3.additionalResourcesTitle')}
          </h4>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* 게이밍 스타일 핵심 문서 */}
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 상단 그라디언트 바 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              borderRadius: '20px 20px 0 0'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.25)',
                flexShrink: 0
              }}>
                📖
              </div>
              <div>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  margin: 0,
                  color: theme.text,
                  letterSpacing: '-0.025em'
                }}>
                  {t('step3.coreDocsTitle')}
                </h5>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.textSecondary, 
                  margin: 0,
                  marginTop: '4px',
                  fontWeight: '500'
                }}>
                  {t('step3.coreDocsSubtitle')}
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a 
                  href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=installation_menu-YfSvwiWwYiX1DtkCMoTcnbOsnsb&anchorId=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = 'rgba(59, 130, 246, 0.05)';
                    element.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = '#ffffff';
                    element.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📋</span>
                  {t('step3.fullSdkGuide')}
                </a>
                <a 
                  href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=client_sdk_faq&anchorId=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = 'rgba(59, 130, 246, 0.05)';
                    element.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = '#ffffff';
                    element.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>❓</span>
                  {t('step3.clientSdkFaq')}
                </a>
              </div>
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(251, 191, 36, 0.2)'
              }}>
                <span style={{ 
                  color: theme.text, 
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {t('step3.advancedSettingsTip')}
                </span>
              </div>
            </div>
          </div>

          {/* 게이밍 스타일 데이터 정책 */}
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 상단 그라디언트 바 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ec4899, #be185d)',
              borderRadius: '20px 20px 0 0'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 6px 20px rgba(236, 72, 153, 0.25)',
                flexShrink: 0
              }}>
                🎯
              </div>
              <div>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  margin: 0,
                  color: theme.text,
                  letterSpacing: '-0.025em'
                }}>
                  {t('step3.dataPolicyTitle')}
                </h5>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.textSecondary, 
                  margin: 0,
                  marginTop: '4px',
                  fontWeight: '500'
                }}>
                  {t('step3.dataPolicySubtitle')}
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(236, 72, 153, 0.2)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a 
                  href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=set_properties&anchorId=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = 'rgba(236, 72, 153, 0.05)';
                    element.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = '#ffffff';
                    element.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📊</span>
                  {t('step3.eventTrackingPolicy')}
                </a>
                <a 
                  href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=data_format&anchorId=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = 'rgba(236, 72, 153, 0.05)';
                    element.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = '#ffffff';
                    element.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📝</span>
                  {t('step3.dataFormatRules')}
                  <span style={{ 
                    color: '#dc2626', 
                    fontWeight: '700', 
                    fontSize: '11px',
                    background: '#fef2f2',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #fecaca'
                  }}>
                    {t('step3.requiredReading')}
                  </span>
                </a>
                <a 
                  href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=preset_properties&anchorId=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = 'rgba(236, 72, 153, 0.05)';
                    element.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget as HTMLElement;
                    element.style.background = '#ffffff';
                    element.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>⚙️</span>
                  {t('step3.presetProperties')}
                </a>
              </div>
            </div>
          </div>

          {/* 게이밍 스타일 유저 관리 */}
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 상단 그라디언트 바 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #047857)',
              borderRadius: '20px 20px 0 0'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
                flexShrink: 0
              }}>
                👥
              </div>
              <div>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  margin: 0,
                  color: theme.text,
                  letterSpacing: '-0.025em'
                }}>
                  {t('step3.userManagementTitle')}
                </h5>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.textSecondary, 
                  margin: 0,
                  marginTop: '4px',
                  fontWeight: '500'
                }}>
                  {t('step3.userManagementSubtitle')}
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <a 
                href="https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=user_identify&anchorId=" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#374151', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px'
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  const element = e.currentTarget as HTMLElement;
                  element.style.background = 'rgba(16, 185, 129, 0.05)';
                  element.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  const element = e.currentTarget as HTMLElement;
                  element.style.background = '#ffffff';
                  element.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '16px' }}>🔐</span>
                {t('step3.userIdentifyRules')}
              </a>
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span style={{ 
                  color: theme.text, 
                  fontSize: '13px',
                  fontWeight: '600',
                  lineHeight: '1.5'
                }}>
                  {t('step3.loginLogoutHandling')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 게이밍 스타일 도움말 박스 */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '16px',
          padding: '28px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              flexShrink: 0
            }}>
              💡
            </div>
            <div style={{ flex: 1 }}>
              <h6 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: theme.text,
                margin: '0 0 16px 0'
              }}>
                {t('step3.developmentTip')}
              </h6>
              <div style={{ fontSize: '14px', lineHeight: '1.6', position: 'relative', zIndex: 1 }}>
                <div style={{
                  padding: '20px',
                  background: `${colors.warning}15`,
                  borderRadius: '16px',
                  marginBottom: '16px',
                  border: `1px solid ${colors.warning}30`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: theme.text }}>
                    <span style={{ color: '#f59e0b', marginRight: '8px' }}>📋</span>
                    {t('step3.stepByStepApproach')}
                  </p>
                  <p style={{ margin: 0, color: theme.textSecondary, fontWeight: '500' }}>
                    {t('step3.implementBasicFirst')}
                  </p>
                </div>
                <div style={{
                  padding: '20px',
                  background: `${colors.warning}15`,
                  borderRadius: '16px',
                  border: `1px solid ${colors.warning}30`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: theme.text }}>
                    <span style={{ color: '#f59e0b', marginRight: '8px' }}>🔬</span>
                    {t('step3.testEnvironmentTitle').replace('🔬 ', '')}
                  </p>
                  <p style={{ margin: 0, color: theme.textSecondary, fontWeight: '500' }}>
                    {t('step3.testEnvironmentText')}
                  </p>
                </div>
              </div>
            </div>
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
            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))',
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
              : 'linear-gradient(135deg, #06b6d4, #0891b2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: understood 
              ? '0 8px 20px rgba(16, 185, 129, 0.4)'
              : '0 8px 20px rgba(6, 182, 212, 0.4)',
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
                    ? t('step3.completionMessage')
                    : t('step3.readyMessage')
                  }
                </span>
              }
              disabled={!hasRequiredData}
            />
            {understood && (
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
                  {t('step3.rewardEarned')}
                </div>
              </div>
            )}
            {!hasRequiredData && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#ef4444',
                  fontWeight: '600'
                }}>
                  {t('step3.requireDataWarning')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform-specific code generators
function getJavaScriptCode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const jsServerUrl = dataUrl ? (dataUrl.endsWith('/sync_js') ? dataUrl : `${dataUrl}/sync_js`) : 'https://YOUR_SERVER_URL/sync_js';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          1. {t('step3.sdkInstallation')}
        </h5>
        <CodeBlock
          language="bash"
          title={t('step3.npmInstallation')}
          code="npm install thinkingdata-browser --save"
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          2. {t('step3.sdkInitialization')}
        </h5>
        <CodeBlock
          language="javascript"
          title={t('step3.autoIntegrationMethod')}
          code={`import thinkingdata from "thinkingdata-browser";

// ${t('step3.sdkConfigObjectComment')}
var config = {
  appId: "${appId || 'YOUR_APP_ID'}",
  serverUrl: "${jsServerUrl}",
  batch: false, // ${t('step3.batchComment')}
  autoTrack: {
    pageShow: true, // ${t('step3.pageShowComment')}
    pageHide: true, // ${t('step3.pageHideComment')}
  }
};

// ${t('step3.sdkInitComment')}
thinkingdata.init(config);`}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          3. {t('step3.accountIdSetting')}
        </h5>
        <CodeBlock
          language="javascript"
          title={t('step3.loginUserSetting')}
          code={`// ${t('step3.userLoginComment')}
ta.login("user_account_id");`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          4. {t('step3.commonEventProperties')}
        </h5>
        <CodeBlock
          language="javascript"
          title={t('step3.commonPropertiesSetting')}
          code={`// ${t('step3.commonPropsComment')}
var superProperties = {};
superProperties["channel"] = "web"; // String
superProperties["user_type"] = "premium"; // String
ta.setSuperProperties(superProperties);`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          5. {t('step3.eventTransmissionUserProperties')}
        </h5>
        <CodeBlock
          language="javascript"
          title={t('step3.customEventProperties')}
          code={`// ${t('step3.eventSendComment')}
ta.track("product_buy", { 
  product_name: "${t('step3.sampleProductName')}",
  price: 29900 
});

// ${t('step3.userPropsComment')}
ta.userSet({ username: "${t('step3.sampleUsername')}" });`}
        />
      </div>
      
      <InfoBox type="success" title={t('step3.installationComplete')}>
        <p style={{ margin: 0 }}>
          {t('step3.basicImplementationNote')} 
          {t('step3.additionalStepsNote')}
        </p>
      </InfoBox>

    </div>
  );
}

function getIOSCode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const iosServerUrl = dataUrl || 'https://YOUR_SERVER_URL';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          1. {t('step3.sdkInstallation')}
        </h5>
        <CodeBlock
          language="ruby"
          title="Podfile"
          code={`platform :ios, '9.0'

target 'YourProjectTarget' do
  pod 'ThinkingSDK', '3.0.6'
end`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          2. {t('step3.sdkInitialization')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'objective-c',
              label: 'Objective-C',
              language: 'objectivec',
              code: `#import <ThinkingSDK/ThinkingSDK.h>

// ${t('step3.mainThreadComment')}
NSString *appid = @"${appId || 'YOUR_APP_ID'}";
NSString *url = @"${iosServerUrl}";

// ${t('step3.recommendedMethodComment')}
TDConfig *config = [[TDConfig alloc] init];
config.appid = appid;
config.serverUrl = url;
[TDAnalytics startAnalyticsWithConfig:config];`
            },
            {
              id: 'swift',
              label: 'Swift',
              language: 'swift',
              code: `import ThinkingSDK

// ${t('step3.mainThreadComment')}
let appid = "${appId || 'YOUR_APP_ID'}"
let url = "${iosServerUrl}"

// ${t('step3.recommendedMethodComment')}
let config = TDConfig(appId: appid, serverUrl: url)
TDAnalytics.start(with: config)`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          3. {t('step3.accountIdSetting')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'objective-c',
              label: 'Objective-C',
              language: 'objectivec',
              code: `// ${t('step3.userLoginIdComment')}, ${t('step3.accountIdCorrespondsComment')}
[TDAnalytics login:@"TD"];`
            },
            {
              id: 'swift',
              label: 'Swift',
              language: 'swift',
              code: `// ${t('step3.userLoginIdComment')}, ${t('step3.accountIdCorrespondsComment')}
TDAnalytics.login("TD")`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          4. {t('step3.commonEventProperties')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'objective-c',
              label: 'Objective-C',
              language: 'objectivec',
              code: `NSDictionary *superProperties = @{
    @"channel": @"ta",
    @"age": @1,
    @"isSuccess": @YES,
    @"birthday": [NSDate date],
    @"object": @{ @"key":@"value" },
    @"object_arr": @[ @{ @"key":@"value" } ],
    @"arr": @[@"value"],
};
[TDAnalytics setSuperProperties:superProperties];`
            },
            {
              id: 'swift',
              label: 'Swift',
              language: 'swift',
              code: `var superProperties: [AnyHashable : Any] = [:]
superProperties["channel"] = "te"
superProperties["age"] = 1
superProperties["isSuccess"] = true
superProperties["birthday"] = Date()
superProperties["object"] = [ "key": "value" ]
superProperties["object_arr"] = [["key": "value"]]
superProperties["arr"] = ["value"]

// ${t('step3.commonPropsComment')}
TDAnalytics.setSuperProperties(superProperties)`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          5. {t('step3.eventTransmissionUserProperties')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'objective-c',
              label: 'Objective-C',
              language: 'objectivec',
              code: `// ${t('step3.eventSendComment')}
NSDictionary *eventProperties = @{@"product_name": @"book"};
[TDAnalytics track:@"product_buy" properties:eventProperties];

// ${t('step3.userPropsComment')}
[TDAnalytics userSet:@{@"username": @"ThinkingData"}];`
            },
            {
              id: 'swift',
              label: 'Swift',
              language: 'swift',
              code: `// ${t('step3.eventSendComment')}
let properties = ["product_name": "book"] as [String: Any]
TDAnalytics.track("product_buy", properties: properties)

// ${t('step3.userPropsComment')}
TDAnalytics.userSet(["username": "ThinkingData"])`
            }
          ]}
        />
      </div>
      
      <InfoBox type="success" title={t('step3.installationComplete')}>
        <p style={{ margin: 0 }}>
          {t('step3.appLifecycleNote')} 
          {t('step3.additionalStepsNote')}
        </p>
      </InfoBox>

    </div>
  );
}

function getAndroidCode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const androidServerUrl = dataUrl || 'https://YOUR_SERVER_URL';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          1. {t('step3.sdkInstallation')}
        </h5>
        <CodeBlock
          language="gradle"
          title="app/build.gradle"
          code={`dependencies {
    implementation 'cn.thinkingdata.android:ThinkingAnalyticsSDK:3.0.0-beta.1'
}`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          2. {t('step3.sdkInitialization')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'java',
              label: 'Java',
              language: 'java',
              code: `// ${t('step3.mainThreadInitComment')}
// ${t('step3.recommendedMethodComment')}
TDConfig config = TDConfig.getInstance(this, "${appId || 'YOUR_APP_ID'}", "${androidServerUrl}");
TDAnalytics.init(config);`
            },
            {
              id: 'kotlin',
              label: 'Kotlin',
              language: 'kotlin',
              code: `// ${t('step3.mainThreadInitComment')}
// ${t('step3.recommendedMethodComment')}
val config = TDConfig.getInstance(this, "${appId || 'YOUR_APP_ID'}", "${androidServerUrl}")
TDAnalytics.init(config)`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          3. {t('step3.accountIdSetting')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'java',
              label: 'Java',
              language: 'java',
              code: `// ${t('step3.userLoginIdComment')}
// ${t('step3.accountIdMappingComment')}
TDAnalytics.login("TA");`
            },
            {
              id: 'kotlin',
              label: 'Kotlin',
              language: 'kotlin',
              code: `// ${t('step3.userLoginIdComment')}
// ${t('step3.accountIdMappingComment')}
TDAnalytics.login("TA")`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          4. {t('step3.commonEventProperties')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'java',
              label: 'Java',
              language: 'java',
              code: `try {
    JSONObject superProperties = new JSONObject();
    superProperties.put("channel", "ta"); // string
    superProperties.put("age", 1); // number
    superProperties.put("isSuccess", true); // boolean
    superProperties.put("birthday", new Date()); // date
    
    JSONObject object = new JSONObject();
    object.put("key", "value");
    superProperties.put("object", object); // object
    
    // ${t('step3.commonPropsComment')}
    TDAnalytics.setSuperProperties(superProperties);
} catch (JSONException e) {
    e.printStackTrace();
}`
            },
            {
              id: 'kotlin',
              label: 'Kotlin',
              language: 'kotlin',
              code: `val superProperties = JSONObject().apply {
    put("channel", "ta") // string
    put("age", 1) // number
    put("isSuccess", true) // boolean
    put("birthday", Date()) // date
    put("object", JSONObject().apply { // object
        put("key", "value")
    })
}

// ${t('step3.commonPropsComment')}
TDAnalytics.setSuperProperties(superProperties)`
            }
          ]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          5. {t('step3.eventTransmissionUserProperties')}
        </h5>
        <CodeTabs
          tabs={[
            {
              id: 'java',
              label: 'Java',
              language: 'java',
              code: `try {
    // ${t('step3.eventSendComment')}
    JSONObject properties = new JSONObject();
    properties.put("product_name", "${t('step3.sampleProductName')}");
    TDAnalytics.track("product_buy", properties);
    
    // ${t('step3.userPropsComment')}
    JSONObject userProperties = new JSONObject();
    userProperties.put("username", "TA");
    TDAnalytics.userSet(userProperties);
} catch (JSONException e) {
    e.printStackTrace();
}`
            },
            {
              id: 'kotlin',
              label: 'Kotlin',
              language: 'kotlin',
              code: `// ${t('step3.eventSendComment')}
val properties = JSONObject()
properties.put("product_name", "${t('step3.sampleProductName')}")
TDAnalytics.track("product_buy", properties)

// ${t('step3.userPropsComment')}
val userProperties = JSONObject()
userProperties.put("username", "TA")
TDAnalytics.userSet(userProperties)`
            }
          ]}
        />
      </div>

      <InfoBox type="success" title={t('step3.installationComplete')}>
        <p style={{ margin: 0 }}>
          {t('step3.appLifecycleNote')} 
          {t('step3.additionalStepsNote')}
        </p>
      </InfoBox>
    </div>
  );
}

function getUnityCode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const unityServerUrl = dataUrl || 'https://YOUR_SERVER_URL';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          1. {t('step3.sdkInstallation')}
        </h5>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '12px' }}>
          {t('step3.unityPackageManagerDesc')}
        </p>
        <CodeBlock
          language="bash"
          title="Package Manager URL"
          code={`https://github.com/ThinkingDataAnalytics/unity-sdk.git`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          2. {t('step3.sdkInitialization')}{t('step3.autoEventTrackingTitle')}
        </h5>
        <CodeBlock
          language="csharp"
          title="GameManager.cs"
          code={`using ThinkingAnalytics;

public class GameManager : MonoBehaviour 
{
    void Start() 
    {
        TDConfig config = new TDConfig();
        config.appId = "${appId || 'YOUR_APP_ID'}";
        config.serverUrl = "${unityServerUrl}";
        // ${t('step3.autoEventTrackComment')}
        config.autoTrack = TDAutoTrack.START | TDAutoTrack.END | TDAutoTrack.SCENE;
        
        ThinkingAnalyticsAPI.StartThinkingAnalytics(config);
    }
}`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          3. {t('step3.accountIdSetting')}
        </h5>
        <CodeBlock
          language="csharp"
          title={t('step3.loginUserSetting')}
          code={`// ${t('step3.userLoginComment')}
ThinkingAnalyticsAPI.Login("user_account_id");`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          4. {t('step3.commonEventProperties')}
        </h5>
        <CodeBlock
          language="csharp"
          title={t('step3.commonPropertiesSetting')}
          code={`// ${t('step3.commonPropsComment')}
Dictionary<string, object> superProperties = new Dictionary<string, object>()
{
    {"channel", "Unity"},
    {"user_type", "premium"}
};
ThinkingAnalyticsAPI.SetSuperProperties(superProperties);`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          5. {t('step3.eventTransmissionUserProperties')}
        </h5>
        <CodeBlock
          language="csharp"
          title={t('step3.customEventProperties')}
          code={`// ${t('step3.eventSendComment')}
Dictionary<string, object> eventProperties = new Dictionary<string, object>()
{
    {"product_name", "${t('step3.sampleProductName')}"},
    {"price", 29900}
};
ThinkingAnalyticsAPI.Track("product_buy", eventProperties);

// ${t('step3.userPropsComment')}
Dictionary<string, object> userProperties = new Dictionary<string, object>()
{
    {"username", "${t('step3.sampleUsername')}"},
    {"age", 25}
};
ThinkingAnalyticsAPI.UserSet(userProperties);`}
        />
      </div>

      <InfoBox type="success" title={t('step3.installationComplete')}>
        <p style={{ margin: 0 }}>
          {t('step3.gameEventsNote')} 
          {t('step3.additionalStepsNote')}
        </p>
      </InfoBox>
    </div>
  );
}

function getUnrealCode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const unrealServerUrl = dataUrl || 'https://YOUR_SERVER_URL';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          1. {t('step3.sdkInstallation')}
        </h5>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '12px' }}>
          {t('step3.unrealPluginDesc')}
        </p>
        <CodeBlock
          language="json"
          title="YourProject.uproject"
          code={`{
  "Plugins": [
    {
      "Name": "ThinkingAnalytics",
      "Enabled": true
    }
  ]
}`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>{t('step3.required')}</Badge>
          2. {t('step3.sdkInitialization')}{t('step3.autoEventTrackingTitle')}
        </h5>
        <CodeBlock
          language="cpp"
          title="GameMode.cpp"
          code={`#include "ThinkingAnalytics.h"

void AMyGameMode::BeginPlay()
{
    Super::BeginPlay();
    
    FTDConfig Config;
    Config.AppId = TEXT("${appId || 'YOUR_APP_ID'}");
    Config.ServerUrl = TEXT("${unrealServerUrl}");
    // 자동 이벤트 추적 활성화
    Config.AutoTrackType = ETDAutoTrack::GameStart | ETDAutoTrack::GameEnd | ETDAutoTrack::LevelChanged;
    
    UThinkingAnalytics::StartWithConfig(Config);
}`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          3. {t('step3.accountIdSetting')}
        </h5>
        <CodeBlock
          language="cpp"
          title={t('step3.loginUserSetting')}
          code={`// ${t('step3.userLoginComment')}
UThinkingAnalytics::Login(TEXT("user_account_id"));`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          4. {t('step3.commonEventProperties')}
        </h5>
        <CodeBlock
          language="cpp"
          title={t('step3.commonPropertiesSetting')}
          code={`// ${t('step3.commonPropsComment')}
TMap<FString, FString> SuperProperties;
SuperProperties.Add(TEXT("channel"), TEXT("Unreal"));
SuperProperties.Add(TEXT("user_type"), TEXT("premium"));
UThinkingAnalytics::SetSuperProperties(SuperProperties);`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>{t('step3.optional')}</Badge>
          5. {t('step3.eventTransmissionUserProperties')}
        </h5>
        <CodeBlock
          language="cpp"
          title={t('step3.customEventProperties')}
          code={`// ${t('step3.eventSendComment')}
TMap<FString, FString> EventProperties;
EventProperties.Add(TEXT("product_name"), TEXT("${t('step3.sampleProductName')}"));
EventProperties.Add(TEXT("price"), TEXT("29900"));
UThinkingAnalytics::Track(TEXT("product_buy"), EventProperties);

// ${t('step3.userPropsComment')}
TMap<FString, FString> UserProperties;
UserProperties.Add(TEXT("username"), TEXT("${t('step3.sampleUsername')}"));
UserProperties.Add(TEXT("age"), TEXT("25"));
UThinkingAnalytics::UserSet(UserProperties);`}
        />
      </div>

      <InfoBox type="success" title={t('step3.installationComplete')}>
        <p style={{ margin: 0 }}>
          {t('step3.gameLifecycleNote')} 
          {t('step3.additionalStepsNote')}
        </p>
      </InfoBox>
    </div>
  );
}

function getAPICode(appData: any, t: (key: string) => string) {
  const { appId, dataUrl } = appData;
  const syncDataUrl = dataUrl ? `${dataUrl}/sync_data` : 'https://YOUR_SERVER_URL/sync_data';
  const syncJsonUrl = dataUrl ? `${dataUrl}/sync_json` : 'https://YOUR_SERVER_URL/sync_json';
  
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>필수</Badge>
          1. {t('step3.dataReceiveApi')}
        </h5>
        <CodeBlock
          language="bash"
          title={t('step3.curlExample')}
          code={`curl "${syncDataUrl}" \\
  --data "appid=${appId || 'YOUR_APP_ID'}&data=%7B%22%23account_id%22%3A%22testing%22%2C%22%23time%22%3A%222019-01-01%2010%3A00%3A00.000%22%2C%22%23type%22%3A%22track%22%2C%22%23event_name%22%3A%22testing%22%2C%22properties%22%3A%7B%22test%22%3A%22test%22%7D%7D"`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="primary" size="sm" style={{ marginRight: '12px' }}>필수</Badge>
          2. {t('step3.dataCollectApi')}
        </h5>
        <CodeBlock
          language="http"
          title={t('step3.jsonApiMethod')}
          code={`POST ${syncJsonUrl}
Content-Type: application/json

{
  "appid": "${appId || 'YOUR_APP_ID'}",
  "debug": 0,
  "data": {
    "#type": "track",
    "#event_name": "product_buy",
    "#time": "2019-11-15 11:35:53.648",
    "properties": { 
      "product_name": "${t('step3.sampleProductName')}",
      "price": 29900 
    },
    "#distinct_id": "user123"
  }
}`}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          <Badge variant="warning" size="sm" style={{ marginRight: '12px' }}>선택</Badge>
          3. {t('step3.multipleDataTransmission')}
        </h5>
        <CodeBlock
          language="json"
          title={t('step3.arrayMultipleEvents')}
          code={`[
  {
    "appid": "${appId || 'YOUR_APP_ID'}",
    "data": {
      "#type": "track",
      "#event_name": "page_view",
      "#time": "2019-11-15 11:35:53.648",
      "properties": { "page": "/home" },
      "#distinct_id": "user123"
    }
  },
  {
    "appid": "${appId || 'YOUR_APP_ID'}",
    "data": {
      "#type": "track", 
      "#event_name": "button_click",
      "#time": "2019-11-15 11:36:00.000",
      "properties": { "button_name": "${t('step3.sampleButtonName')}" },
      "#distinct_id": "user123"
    }
  }
]`}
        />
      </div>

      <InfoBox type="info" title={t('step3.apiUsageGuide')}>
        <p style={{ margin: 0 }}>
          • <strong>sync_data</strong>: {t('step3.formDataNote')}<br/>
          • <strong>sync_json</strong>: {t('step3.rawJsonNote')}<br/>
          • {t('step3.utf8EncodingNote')}
        </p>
      </InfoBox>
    </div>
  );
}