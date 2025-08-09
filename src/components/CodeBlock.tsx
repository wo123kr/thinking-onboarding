import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showCopy?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  showCopy = true
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const { theme, colors } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 테마별 코드 스타일 선택
  const codeStyle = theme === 'dark' ? vscDarkPlus : vs;
  
  // 테마별 배경색 설정
  const codeBackground = theme === 'dark' ? '#1e1e1e' : '#f8f8f8';
  const headerBackground = theme === 'dark' 
    ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`
    : `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`;

  return (
    <div style={{
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: colors.cardBg,
      boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: headerBackground,
        color: 'white',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '12px', 
            textTransform: 'uppercase' as const, 
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            {language}
          </span>
          {title && <span style={{ opacity: 0.9 }}>| {title}</span>}
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t('codeblock.copied') : t('codeblock.copy')}
          </button>
        )}
      </div>

      {/* Code Content */}
      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        customStyle={{
          margin: 0,
          fontSize: '14px',
          fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          borderRadius: '0 0 16px 16px',
          backgroundColor: codeBackground,
          padding: '20px',
          lineHeight: '1.6'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};