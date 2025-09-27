import React, { useState, useRef, useEffect } from 'react';
import AdBanner from './AdBanner';
import NativeAd from './NativeAd';
import { WalkingIcon } from './Icons';
import WalkingAnimation from './WalkingAnimation';

const WalkingCalculatorPage: React.FC = () => {
    const [weight, setWeight] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [nativeAdKey, setNativeAdKey] = useState<string>('');
    const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);

    // Fix: The type of the interval ID from `setInterval` can conflict between Node.js (`NodeJS.Timeout`) and browser (`number`) environments.
    // Explicitly using `window.setInterval` and `window.clearInterval` ensures the browser's implementation is used, which correctly returns and expects a `number`.
    useEffect(() => {
      let interval: number | undefined;
      if (isStopwatchRunning) {
        interval = window.setInterval(() => {
          setStopwatchSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);
      }
      return () => window.clearInterval(interval);
    }, [isStopwatchRunning]);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleStartStopwatch = () => setIsStopwatchRunning(true);

    const handleStopStopwatch = () => {
        setIsStopwatchRunning(false);
        const totalMinutes = Math.floor(stopwatchSeconds / 60);
        if (totalMinutes > 0) {
            setDuration(String(totalMinutes));
        }
    };

    const handleResetStopwatch = () => {
        setIsStopwatchRunning(false);
        setStopwatchSeconds(0);
        setDuration('');
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        setCaloriesBurned(null);
        setDistance(null);
    };

    const calculateCalories = (e: React.FormEvent) => {
        e.preventDefault();
        const weightNum = parseFloat(weight);
        const durationNum = parseFloat(duration);

        if (isNaN(weightNum) || isNaN(durationNum) || weightNum <= 0 || durationNum <= 0) {
            alert("Harap masukkan angka yang valid untuk berat badan dan durasi.");
            return;
        }

        const MET = 3.5;
        const calories = Math.round(((MET * weightNum * 3.5) / 200) * durationNum);
        
        const averageSpeedKmh = 5;
        const durationInHours = durationNum / 60;
        const distanceKm = averageSpeedKmh * durationInHours;

        setCaloriesBurned(calories);
        setDistance(distanceKm);
        setNativeAdKey(`walk-calc-${new Date().getTime()}`);
    };
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                <WalkingIcon className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                <h2 className="text-3xl font-bold">Kalori Jalan Kaki</h2>
                <p className="text-slate-600 dark:text-slate-400">Hitung berapa kalori yang Anda bakar saat berjalan kaki.</p>
            </div>

            <form onSubmit={calculateCalories} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Gunakan Stopwatch</h4>
                    <div className="text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                        {formatTime(stopwatchSeconds)}
                    </div>
                    <div className="flex justify-center gap-4">
                        {!isStopwatchRunning ? (
                            <button type="button" onClick={handleStartStopwatch} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                                Mulai
                            </button>
                        ) : (
                            <button type="button" onClick={handleStopStopwatch} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                                Berhenti & Isi Durasi
                            </button>
                        )}
                        <button type="button" onClick={handleResetStopwatch} disabled={stopwatchSeconds === 0 && !isStopwatchRunning} className="px-6 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            Reset
                        </button>
                    </div>
                </div>
                
                <hr className="border-slate-200 dark:border-slate-700 my-4"/>

                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Berat Badan Anda (kg)</label>
                    <input 
                        type="number" 
                        id="weight" 
                        value={weight} 
                        onChange={handleInputChange(setWeight)} 
                        className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                        placeholder="Contoh: 65" 
                        required
                    />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi Jalan Kaki (menit)</label>
                    <input 
                        type="number" 
                        id="duration" 
                        value={duration} 
                        onChange={handleInputChange(setDuration)} 
                        className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                        placeholder="Contoh: 30" 
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-colors"
                >
                    Hitung Kalori Terbakar
                </button>
            </form>

            <AdBanner />

            {caloriesBurned !== null && distance !== null && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in space-y-6 text-center">
                    <h3 className="text-xl font-semibold">Hasil Perhitungan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-primary-50 dark:bg-slate-700 p-4 rounded-lg">
                            <p className="text-base text-slate-600 dark:text-slate-300">Kalori Terbakar</p>
                            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 my-2">{caloriesBurned}</p>
                            <p className="text-slate-500 dark:text-slate-400">kkal</p>
                        </div>
                        <div className="bg-green-50 dark:bg-slate-700 p-4 rounded-lg">
                            <p className="text-base text-slate-600 dark:text-slate-300">Estimasi Jarak</p>
                            <p className="text-4xl font-bold text-green-600 dark:text-green-400 my-2">{distance.toFixed(2)}</p>
                            <p className="text-slate-500 dark:text-slate-400">km</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-left">
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">Visualisasi Perjalanan Anda</p>
                        <WalkingAnimation walkDuration={Number(duration) || 30} />
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
                        Kerja bagus! Setiap langkah berarti untuk kesehatanmu. Terus bergerak!
                    </p>
                    <NativeAd adKey={nativeAdKey} />
                </div>
            )}
        </div>
    );
};

export default WalkingCalculatorPage;