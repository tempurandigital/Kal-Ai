import React from 'react';
import { AppleIcon, BananaIcon, BreadIcon, CameraIcon } from './Icons';

const ScanAnimation: React.FC = () => (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <style>
        {`
            @keyframes orbit {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes pulse-scan {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
            .orbit-container {
                position: absolute;
                width: 130px;
                height: 130px;
                animation: orbit 10s linear infinite;
            }
            .food-icon-wrapper {
                position: absolute;
                width: 32px;
                height: 32px;
                animation: orbit 10s linear infinite reverse;
            }
            .scanner-icon {
                animation: pulse-scan 2.5s ease-in-out infinite;
            }
        `}
        </style>
        
        <CameraIcon className="scanner-icon w-12 h-12 text-primary-500 dark:text-primary-400" />
        
        <div className="orbit-container">
            <div className="food-icon-wrapper text-red-400" style={{ top: '0px', left: '50%', marginLeft: '-16px' }}>
                <AppleIcon />
            </div>
            <div className="food-icon-wrapper text-yellow-400" style={{ bottom: '20px', left: '10px' }}>
                <BananaIcon />
            </div>
            <div className="food-icon-wrapper text-amber-500" style={{ bottom: '20px', right: '10px' }}>
                <BreadIcon />
            </div>
        </div>
    </div>
);

export default ScanAnimation;