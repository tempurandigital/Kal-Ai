
import React from 'react';

const WalkingHomeAnimation: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-sky-100 dark:bg-slate-800">
        <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice">
            <style>
            {`
                @keyframes parallax-scroll-slow {
                    from { transform: translateX(0%); }
                    to { transform: translateX(-25%); }
                }
                @keyframes parallax-scroll-fast {
                    from { transform: translateX(0%); }
                    to { transform: translateX(-50%); }
                }
                
                .bg-layer-slow {
                    animation: parallax-scroll-slow 20s linear infinite;
                }
                .bg-layer-fast {
                    animation: parallax-scroll-fast 10s linear infinite;
                }
            `}
            </style>

            {/* Background Sky */}
            <rect width="100%" height="100%" className="fill-current text-sky-100 dark:text-slate-800" />
            
            {/* Sun */}
            <circle cx="250" cy="40" r="15" className="fill-current text-yellow-300" />
            
            {/* Slow Layer: Clouds, Distant Trees (2 copies for looping) */}
            <g className="bg-layer-slow fill-current text-slate-300 dark:text-slate-600">
                <g>
                    <path d="M50 80 Q 70 60 100 80 T 150 80" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="200" cy="115" r="15" />
                    <circle cx="210" cy="110" r="20" />
                    <circle cx="225" cy="115" r="15" />
                </g>
                <g transform="translate(400, 0)">
                    <path d="M50 80 Q 70 60 100 80 T 150 80" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="200" cy="115" r="15" />
                    <circle cx="210" cy="110" r="20" />
                    <circle cx="225" cy="115" r="15" />
                </g>
            </g>
            
            {/* Fast Layer: Ground, Trees (2 copies for looping) */}
            <g className="bg-layer-fast">
                <g>
                    <rect y="130" width="400" height="20" className="fill-current text-emerald-400 dark:text-emerald-800"/>
                    <path d="M 80 130 L 85 110 L 90 130 Z M 150 130 L 155 100 L 160 130 Z M 250 130 L 255 115 L 260 130 Z" className="fill-current text-emerald-500 dark:text-emerald-700"/>
                </g>
                 <g transform="translate(400, 0)">
                    <rect y="130" width="400" height="20" className="fill-current text-emerald-400 dark:text-emerald-800"/>
                    <path d="M 80 130 L 85 110 L 90 130 Z M 150 130 L 155 100 L 160 130 Z M 250 130 L 255 115 L 260 130 Z" className="fill-current text-emerald-500 dark:text-emerald-700"/>
                </g>
            </g>
        </svg>
    </div>
);

export default WalkingHomeAnimation;
