import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const { colors } = useTheme();

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div style={{
        display: 'flex',
        borderBottom: `2px solid ${colors.cardBorder}`,
        marginBottom: '24px',
        gap: '4px',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className="tab-button"
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              backgroundColor: 'transparent',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              color: activeTab === tab.id ? colors.accent : colors.text,
              borderBottom: activeTab === tab.id ? `2px solid ${colors.accent}` : '2px solid transparent',
              borderTop: 'none',
              borderLeft: 'none', 
              borderRight: 'none',
              opacity: tab.disabled ? 0.5 : 1,
              transition: 'color 0.2s ease, border-bottom 0.2s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '20px' }}>
        {activeTabContent}
      </div>
    </div>
  );
};