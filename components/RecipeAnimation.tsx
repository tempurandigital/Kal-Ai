
import React from 'react';

const RecipeAnimation: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <style>
        {`
            @keyframes open-cover {
                0% { transform: rotateY(0deg); }
                50%, 100% { transform: rotateY(-160deg); }
            }
            @keyframes flip-page-1 {
                0%, 10% { transform: rotateY(0deg); }
                60%, 100% { transform: rotateY(-180deg); }
            }
            @keyframes flip-page-2 {
                0%, 25% { transform: rotateY(0deg); }
                75%, 100% { transform: rotateY(-180deg); }
            }
            .book-group {
                transform: translateX(15px) perspective(1000px);
            }
            .book-cover {
                transform-origin: left center;
                animation: open-cover 6s ease-in-out infinite;
            }
            .book-page-1 {
                transform-origin: left center;
                animation: flip-page-1 6s ease-in-out infinite;
            }
            .book-page-2 {
                transform-origin: left center;
                animation: flip-page-2 6s ease-in-out infinite;
            }
        `}
        </style>
        <svg width="100" height="100" viewBox="0 0 120 120">
            <g className="book-group" transform="rotate(-15 60 60) scale(1.1)">
                {/* Back Cover */}
                <rect x="30" y="20" width="60" height="80" rx="3" className="fill-current text-primary-600 dark:text-primary-800" />
                <rect x="28" y="20" width="5" height="80" rx="2" className="fill-current text-primary-700 dark:text-primary-900"/>

                {/* Page 3 (static) */}
                <rect x="35" y="24" width="52" height="72" className="fill-current text-slate-50 dark:text-slate-300"/>
                
                {/* Page 2 (flipping) */}
                <g className="book-page-2">
                    <rect x="35" y="24" width="52" height="72" className="fill-current text-slate-50 dark:text-slate-300"/>
                     <rect x="45" y="35" width="35" height="5" rx="2" className="fill-current text-slate-300 dark:text-slate-500" />
                     <rect x="45" y="45" width="25" height="5" rx="2" className="fill-current text-slate-300 dark:text-slate-500" />
                </g>

                {/* Page 1 (flipping) */}
                <g className="book-page-1">
                    <rect x="35" y="24" width="52" height="72" className="fill-current text-slate-50 dark:text-slate-300"/>
                    <circle cx="60" cy="55" r="12" className="fill-current text-yellow-300 dark:text-yellow-500"/>
                    <circle cx="60" cy="55" r="5" className="fill-current text-yellow-100 dark:text-yellow-300"/>
                </g>

                {/* Front Cover */}
                <g className="book-cover">
                    <rect x="35" y="20" width="60" height="80" rx="3" className="fill-current text-primary-500 dark:text-primary-700"/>
                    <circle cx="65" cy="60" r="15" className="fill-current text-primary-400 dark:text-primary-600"/>
                    <path d="M62 55 L62 65 M68 55 L68 65" strokeWidth="2" stroke="white" strokeLinecap="round" />
                </g>
            </g>
        </svg>
    </div>
);

export default RecipeAnimation;
