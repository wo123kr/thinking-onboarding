import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme: currentTheme, colors } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Header currentTime={currentTime} />
      
      {/* 컨텐츠 영역 */}
      <main style={{
        minHeight: 'calc(100vh - 73px)', // 헤더 높이만큼 빼기
        overflow: 'auto'
      }}>
        {children}
      </main>

      {/* 테마별 글로벌 CSS */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.5) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: ${currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
          border-radius: 8px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 8px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          background-clip: content-box;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes neonPulse {
          0%, 100% { 
            text-shadow: 0 0 5px rgba(139, 92, 246, 0.5),
                         0 0 10px rgba(139, 92, 246, 0.5),
                         0 0 15px rgba(139, 92, 246, 0.5);
          }
          50% { 
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.8),
                         0 0 20px rgba(139, 92, 246, 0.8),
                         0 0 30px rgba(139, 92, 246, 0.8);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 애니메이션 클래스들 */
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }

        .slide-up {
          animation: slideInUp 0.6s ease-out;
        }

        /* 호버 효과 개선 */
        .game-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .game-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        /* 그라데이션 텍스트 효과 */
        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* 네온 효과 */
        .neon-glow {
          animation: neonPulse 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};