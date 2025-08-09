import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeColors {
  // 메인 배경색
  background: string;
  backgroundSecondary: string;
  
  // 카드 및 컴포넌트
  cardBg: string;
  cardBorder: string;
  
  // 텍스트
  text: string;
  textSecondary: string;
  
  // 액센트 컬러
  accent: string;
  accentSecondary: string;
  
  // 상태 색상
  success: string;
  warning: string;
  error: string;
  premium: string;
  
  // 헤더
  headerBg: string;
  headerText: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // LocalStorage에서 저장된 테마 설정 불러오기
  const getStoredTheme = (): Theme => {
    try {
      const stored = localStorage.getItem('thinking-guide-theme');
      if (stored && ['dark', 'light'].includes(stored)) {
        return stored as Theme;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return 'dark'; // 기본값
  };

  const [theme, setTheme] = useState<Theme>(getStoredTheme());

  // 테마 변경시 LocalStorage에 저장
  const handleSetTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('thinking-guide-theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
      setTheme(newTheme); // 저장 실패해도 상태는 변경
    }
  };

  const toggleTheme = () => {
    handleSetTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const darkTheme: ThemeColors = {
    background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f0f23 50%, #000000 100%)',
    backgroundSecondary: 'linear-gradient(135deg, #1e1b4b, #0f0f23)',
    cardBg: 'linear-gradient(145deg, rgba(30, 30, 60, 0.9), rgba(15, 15, 35, 0.9))',
    cardBorder: 'rgba(139, 92, 246, 0.3)',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#8b5cf6',
    accentSecondary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    premium: 'linear-gradient(135deg, #f59e0b, #f97316)',
    headerBg: 'rgba(15, 15, 35, 0.8)',
    headerText: '#ffffff'
  };

  const lightTheme: ThemeColors = {
    background: 'radial-gradient(ellipse at top, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    backgroundSecondary: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    cardBg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
    cardBorder: 'rgba(139, 92, 246, 0.2)',
    text: '#1e293b',
    textSecondary: '#64748b',
    accent: '#8b5cf6',
    accentSecondary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    premium: 'linear-gradient(135deg, #f59e0b, #f97316)',
    headerBg: 'rgba(255, 255, 255, 0.9)',
    headerText: '#1e293b'
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};