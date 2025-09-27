import React from 'react';
import { HomeIcon, FlagIcon } from './Icons';

interface WalkingAnimationProps {
    walkDuration: number;
}

const WalkingAnimation: React.FC<WalkingAnimationProps> = ({ walkDuration }) => {
    // Menyesuaikan waktu animasi antara 4 detik (tercepat) dan 15 detik (terlambat)
    // Jalan 5 menit mendapat animasi ~4 detik, jalan 60 menit mendapat animasi ~10 detik.
    const animationTime = Math.max(4, Math.min(15, walkDuration / 4 + 3));

    return (
        <div className="w-full max-w-lg mx-auto aspect-[2/1] rounded-lg bg-sky-200 dark:bg-slate-800 p-2 sm:p-4 overflow-hidden relative border border-sky-300 dark:border-slate-700">
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
                <style>
                    {`
                        @keyframes walk-the-path {
                            from { offset-distance: 0%; }
                            to { offset-distance: 100%; }
                        }
                        @keyframes walker-bob {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-2px); }
                        }
                        #walker-group {
                            offset-path: path('M20,130 Q80,100 150,110 T280,80');
                            animation: walk-the-path ${animationTime}s 0.5s ease-in-out forwards;
                        }
                        #walker-pin {
                            animation: walker-bob 0.8s ease-in-out infinite;
                        }
                        @keyframes cloud-drift-1 {
                            from { transform: translateX(-20px); }
                            to { transform: translateX(20px); }
                        }
                         @keyframes cloud-drift-2 {
                            from { transform: translateX(15px); }
                            to { transform: translateX(-15px); }
                        }
                        #cloud1 { animation: cloud-drift-1 25s ease-in-out infinite alternate; }
                        #cloud2 { animation: cloud-drift-2 30s ease-in-out infinite alternate; }
                    `}
                </style>
                
                {/* Latar Belakang */}
                <rect width="300" height="150" fill="currentColor" className="text-sky-200 dark:text-slate-800" />
                {/* Perbukitan Jauh */}
                <path d="M-10,110 C40,90 80,90 120,110 S 180,130 220,110 S 280,90 310,110 L310,150 L-10,150 Z" fill="currentColor" className="text-green-300/70 dark:text-green-800/50" />
                {/* Perbukitan Dekat */}
                <path d="M0,120 C100,120 150,150 300,150 L300,150 L0,150 Z" fill="currentColor" className="text-green-300 dark:text-green-800/80" />
                <path d="M0,130 C80,130 180,145 300,145 L300,150 L0,150 Z" fill="currentColor" className="text-green-400 dark:text-green-700/90" />
                
                {/* Pepohonan */}
                <g fill="currentColor" className="text-green-500 dark:text-green-600">
                    <path d="M180 120 l 5 10 l -10 0 z" transform="translate(0, -15)" />
                    <rect x="183" y="115" width="4" height="8" />
                    
                    <path d="M50 130 l 7 14 l -14 0 z" transform="translate(0, -20) scale(0.8)" />
                    <rect x="55" y="120" width="4" height="10" transform="scale(0.8)" />
                    
                    <path d="M240 90 l 6 12 l -12 0 z" transform="translate(0, -10)" />
                    <rect x="244" y="90" width="3" height="7" />
                </g>

                {/* Awan */}
                <g id="cloud1" opacity="0.8" fill="white" className="dark:fill-slate-600/80">
                    <circle cx="60" cy="40" r="12" />
                    <circle cx="75" cy="40" r="15" />
                    <circle cx="90" cy="40" r="12" />
                </g>
                 <g id="cloud2" opacity="0.7" fill="white" className="dark:fill-slate-600/80">
                    <circle cx="200" cy="55" r="8" />
                    <circle cx="212" cy="55" r="10" />
                    <circle cx="225" cy="55" r="8" />
                </g>

                {/* Matahari */}
                <circle cx="260" cy="40" r="15" fill="#facc15" className="opacity-90" />

                {/* Jalur */}
                <path d="M20,130 Q80,100 150,110 T280,80" stroke="currentColor" strokeDasharray="3 2" strokeWidth="1.5" fill="none" className="text-amber-700/70 dark:text-amber-300/70" />

                {/* Titik Awal dan Akhir */}
                <foreignObject x="5" y="115" width="25" height="25">
                    <HomeIcon className="w-full h-full text-blue-600 dark:text-blue-400 drop-shadow-md" />
                </foreignObject>
                 <foreignObject x="270" y="62" width="25" height="25">
                    <FlagIcon className="w-full h-full text-red-600 dark:text-red-400 drop-shadow-md" />
                </foreignObject>

                {/* Grup Ikon Pejalan Kaki */}
                <g id="walker-group">
                  <g id="walker-pin">
                    {/* Badan pin utama */}
                    <path d="M0,0 C-3.31,0 -6,-2.69 -6,-6 C-6,-9.31 -3.31,-12 0,-12 C3.31,-12 6,-9.31 6,-6 C6,-2.69 3.31,0 0,0 Z" fill="currentColor" className="text-primary-600 dark:text-primary-400" />
                    {/* Lingkaran putih di dalam */}
                    <circle cx="0" cy="-6" r="2.5" fill="white" />
                  </g>
                </g>
            </svg>
        </div>
    );
};

export default WalkingAnimation;