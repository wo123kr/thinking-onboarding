import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { QuickStartPage } from './pages/QuickStartPage';
import { IntroPage } from './pages/IntroPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  // Use hash routing for GitHub Pages compatibility
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.slice(1); // Remove '#' from hash
    return hash || window.location.pathname;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPath(hash || window.location.pathname);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="App">
          {currentPath === '/quickstart' || currentPath === 'quickstart' ? <QuickStartPage /> : 
           currentPath === '/intro' || currentPath === 'intro' ? <IntroPage /> : <HomePage />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;