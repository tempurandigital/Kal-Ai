import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center relative">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Kal Ai
        </h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-colors"
            aria-label="Ganti tema"
          >
            {theme === Theme.Light ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;