
import React from 'react';
import { Page } from '../types';
import { HomeIcon, CameraIcon, CalculatorIcon, BookOpenIcon, WalkingIcon } from './Icons';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-primary-600 dark:text-primary-400';
  const inactiveClasses = 'text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { page: Page.Home, label: 'Home', icon: <HomeIcon /> },
    { page: Page.Scan, label: 'Pindai', icon: <CameraIcon /> },
    { page: Page.Calculator, label: 'Kalkulator', icon: <CalculatorIcon /> },
    { page: Page.WalkingCalculator, label: 'Jalan Kaki', icon: <WalkingIcon /> },
    { page: Page.Recipe, label: 'Resep', icon: <BookOpenIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 z-20">
      <div className="flex justify-around items-center max-w-lg mx-auto h-[56px]">
        {navItems.map(item => (
          <NavItem
            key={item.page}
            label={item.label}
            icon={item.icon}
            isActive={currentPage === item.page}
            onClick={() => onNavigate(item.page)}
          />
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;