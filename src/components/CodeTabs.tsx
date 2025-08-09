import React, { useState, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
import { useTheme } from '../contexts/ThemeContext';

interface CodeTabItem {
  id: string;
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTabItem[];
  title?: string;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, title }) => {
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id || '');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const { colors } = useTheme();

  // Update activeTab if tabs change and current activeTab doesn't exist
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      const currentTabExists = tabs.find(tab => tab.id === activeTab);
      if (!currentTabExists) {
        setActiveTab(tabs[0].id);
      }
    }
  }, [tabs, activeTab]);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div style={{ marginBottom: '24px' }} className="animate-fade-in">
      {title && (
        <h6 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px', 
          color: colors.text,
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h6>
      )}
      
      <div style={{
        display: 'flex',
        borderBottom: `2px solid ${colors.cardBorder}`,
        marginBottom: '20px',
        background: colors.cardBg,
        borderRadius: '16px 16px 0 0',
        backdropFilter: 'blur(20px)',
        padding: '8px 8px 0 8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: activeTab === tab.id 
                ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`
                : hoveredTab === tab.id 
                  ? `${colors.accent}20` 
                  : 'transparent',
              color: activeTab === tab.id ? 'white' : colors.text,
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? `0 4px 15px ${colors.accent}40` : 'none',
              transform: activeTab === tab.id ? 'translateY(-2px)' : 'none',
              marginRight: '4px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTabData || tabs[0]) && (
        <CodeBlock
          language={(activeTabData || tabs[0]).language}
          code={(activeTabData || tabs[0]).code}
        />
      )}
    </div>
  );
};