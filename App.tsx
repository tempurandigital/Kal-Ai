
import React, { useState, useEffect } from 'react';
import { Page, Theme } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './components/HomePage';
import ScanPage from './components/ScanPage';
import CalculatorPage from './components/CalculatorPage';
import WalkingCalculatorPage from './components/WalkingCalculatorPage';
import RecipePage from './components/RecipePage';
import StaticAdBanner from './components/StaticAdBanner';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      return storedTheme || Theme.Light;
    }
    return Theme.Light;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.Dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Scan:
        return <ScanPage />;
      case Page.Calculator:
        return <CalculatorPage />;
      case Page.WalkingCalculator:
        return <WalkingCalculatorPage />;
      case Page.Recipe:
        return <RecipePage />;
      case Page.Home:
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-4 py-6 mb-36">
        {renderPage()}
      </main>
      <StaticAdBanner />
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;