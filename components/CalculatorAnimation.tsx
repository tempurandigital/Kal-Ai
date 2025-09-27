
import React from 'react';

const CalculatorAnimation: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center overflow-hidden font-mono text-3xl font-bold text-slate-700 dark:text-slate-300">
         <style>
        {`
            @keyframes count-up {
                0% { content: '142'; opacity: 0; transform: translateY(10px); }
                20% { content: '142'; opacity: 1; transform: translateY(0); }
                25% { content: '589'; opacity: 0; transform: translateY(10px); }
                45% { content: '589'; opacity: 1; transform: translateY(0); }
                50% { content: '1120'; opacity: 0; transform: translateY(10px); }
                70% { content: '1120'; opacity: 1; transform: translateY(0); }
                75% { content: '2045'; opacity: 0; transform: translateY(10px); }
                95% { content: '2045'; opacity: 1; transform: translateY(0); }
                100% { content: '2045'; opacity: 0; }
            }
            .counter::after {
                content: '142';
                animation: count-up 5s ease-in-out infinite;
            }
        `}
        </style>
        <div className="counter"></div>
        <span className="ml-2 text-lg text-slate-500">kcal</span>
    </div>
);

export default CalculatorAnimation;
