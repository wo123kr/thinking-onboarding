import React, { useState } from 'react';
import { Gamepad2, ExternalLink, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentTime?: Date;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTime = new Date() 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme: currentTheme, colors, toggleTheme } = useTheme();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // 테마별 색상
  const theme = colors;

  const navigateToHome = () => {
    window.location.hash = '';
  };

  const navigateToCompanyHomepage = () => {
    window.open('https://www.thinkingdata.kr/', '_blank');
  };

  const languages = [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: theme.headerBg,
      backdropFilter: 'blur(20px)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.cardBorder}`,
      boxShadow: currentTheme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* 왼쪽: 로고와 제목 (홈으로 이동 가능) */}
      <div 
        onClick={navigateToHome}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: theme.accent,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
        }}>
          <Gamepad2 size={24} style={{ color: 'white' }} />
        </div>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: '1.2'
          }}>
            Thinking Engine
          </h1>
          <p style={{
            fontSize: '12px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: '500'
          }}>
{t('header.guideCenter')} • {currentTime.toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* 오른쪽: 네비게이션과 액션 버튼들 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* 홈페이지 버튼 */}
        <div 
          onClick={navigateToCompanyHomepage}
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '12px',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.2)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <ExternalLink size={16} style={{ color: theme.text }} />
          <span style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>{t('header.homepage')}</span>
        </div>

        {/* 가이드 버튼 */}
        <div 
          onClick={() => window.open('https://docs-v2.thinkingdata.kr/?version=latest&lan=ko-KR&code=user_guide_menu&anchorId=', '_blank')}
          style={{
            background: theme.premium,
            borderRadius: '12px',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}
        >
          <ExternalLink size={16} style={{ color: 'white' }} />
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{t('header.guideCenter')}</span>
        </div>

        {/* 테마 토글 버튼 */}
        <div 
          onClick={toggleTheme}
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '12px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            width: '36px',
            height: '36px'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.2)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
          title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {currentTheme === 'dark' ? 
            <Sun size={18} style={{ color: theme.text }} /> : 
            <Moon size={18} style={{ color: theme.text }} />
          }
        </div>

        {/* 언어 선택 드롭다운 */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
            }}
          >
            <Globe size={16} style={{ color: theme.text }} />
            <span style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>
              {currentLanguage.flag}
            </span>
            <ChevronDown 
              size={14} 
              style={{ 
                color: theme.text, 
                transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </div>

          {/* 언어 드롭다운 메뉴 */}
          {isLanguageDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: theme.headerBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              zIndex: 1000,
              minWidth: '120px'
            }}>
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageDropdownOpen(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: language === lang.code ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (language !== lang.code) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== lang.code) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                  <span style={{ 
                    color: theme.text, 
                    fontSize: '13px', 
                    fontWeight: language === lang.code ? '600' : '400'
                  }}>
                    {lang.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};