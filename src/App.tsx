import React from 'react';
import { HomePage } from './pages/HomePage';
import { QuickStartPage } from './pages/QuickStartPage';
import { IntroPage } from './pages/IntroPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const currentPath = window.location.pathname;
  
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="App">
          {currentPath === '/quickstart' ? <QuickStartPage /> : 
           currentPath === '/intro' ? <IntroPage /> : <HomePage />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;