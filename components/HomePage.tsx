
import React from 'react';
import { Page } from '../types';
import { AiBrainIcon } from './Icons';
import AdBanner from './AdBanner';
import ScanAnimation from './ScanAnimation';
import CalculatorAnimation from './CalculatorAnimation';
import WalkingHomeAnimation from './WalkingHomeAnimation';
import RecipeAnimation from './RecipeAnimation';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{
  animation: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}> = ({ animation, title, description, buttonText, onClick }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary-500 hover:shadow-2xl">
        <div className="h-32 bg-slate-100 dark:bg-slate-900/50">
            {animation}
        </div>
        <div className="p-6 flex flex-col text-center flex-grow">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">{description}</p>
            <button
            onClick={onClick}
            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors mt-auto"
            >
            {buttonText}
            </button>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      <div className="text-center p-8 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-3xl shadow-2xl text-white">
        <AiBrainIcon className="w-16 h-16 mx-auto mb-4 text-white/80" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Analisis Makanan Sehatmu</h2>
        <p className="text-base text-primary-200 max-w-2xl mx-auto">Pindai makanan, hitung kalori, dan capai tujuan kesehatanmu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard
          animation={<ScanAnimation />}
          title="Pindai Makanan Anda"
          description="Gunakan kamera atau unggah foto, dan biarkan AI kami menganalisis nutrisinya secara instan."
          buttonText="Pindai Sekarang"
          onClick={() => onNavigate(Page.Scan)}
        />
        <FeatureCard
          animation={<CalculatorAnimation />}
          title="Kalkulator Kalori"
          description="Hitung estimasi kebutuhan kalori harian Anda untuk mencapai target berat badan ideal."
          buttonText="Hitung Sekarang"
          onClick={() => onNavigate(Page.Calculator)}
        />
        <FeatureCard
          animation={<WalkingHomeAnimation />}
          title="Jalan Kaki"
          description="Ketahui berapa banyak kalori yang terbakar dari aktivitas jalan kakimu."
          buttonText="Hitung Sekarang"
          onClick={() => onNavigate(Page.WalkingCalculator)}
        />
        <FeatureCard
          animation={<RecipeAnimation />}
          title="Resep Makanan"
          description="Cari resep untuk masakan favoritmu? Biarkan AI kami memberikan resep lengkapnya untuk Anda."
          buttonText="Cari Resep"
          onClick={() => onNavigate(Page.Recipe)}
        />
      </div>
      <div className="pt-6">
        <AdBanner />
      </div>
    </div>
  );
};

export default HomePage;