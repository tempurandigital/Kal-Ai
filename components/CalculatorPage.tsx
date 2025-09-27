
import React, { useState } from 'react';
import { CalorieCalculationResult } from '../types';
import NativeAd from './NativeAd';
import AdBanner from './AdBanner';

const CalculatorPage: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [dietGoal, setDietGoal] = useState<string>('maintain');
  const [result, setResult] = useState<CalorieCalculationResult | null>(null);
  const [nativeAdKey, setNativeAdKey] = useState<string>('');
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');

  const dietGoals = [
    { label: 'Peningkatan berat badan', value: 'gain', adjustment: 500 },
    { label: 'Peningkatan berat badan secara perlahan', value: 'slow_gain', adjustment: 250 },
    { label: 'Pertahankan berat badan saya', value: 'maintain', adjustment: 0 },
    { label: 'Pengurangan berat badan secara perlahan', value: 'slow_loss', adjustment: -250 },
    { label: 'Pengurangan berat badan', value: 'loss', adjustment: -500 },
  ];

  const activityLevels = [
    { label: 'Jarang Sekali', value: 1.2 },
    { label: 'Sedikit Aktif', value: 1.375 },
    { label: 'Aktif', value: 1.55 },
    { label: 'Sangat Aktif', value: 1.725 },
  ];

  const activityDescriptions: { [key: number]: string } = {
      1.2: 'Pekerjaan kantoran atau aktivitas yang minim gerakan. Anda tidak berolahraga sama sekali atau sangat jarang.',
      1.375: 'Anda berolahraga ringan 1-3 hari per minggu. Contohnya seperti jalan santai, yoga, atau bersepeda ringan.',
      1.55: 'Anda berolahraga dengan intensitas sedang 3-5 hari per minggu. Contohnya seperti lari pagi, berenang, atau menari.',
      1.725: 'Anda melakukan olahraga berat 6-7 hari per minggu atau memiliki pekerjaan yang sangat menuntut fisik (misalnya, atlet atau pekerja konstruksi).'
  };
  
  const getMotivationalMessage = (goal: string): string => {
    switch (goal) {
        case 'gain':
            return "Setiap kalori ekstra adalah langkah menuju kekuatan. Teruslah makan dengan cerdas!";
        case 'slow_gain':
            return "Membangun kekuatan butuh waktu dan konsistensi. Anda berada di jalur yang benar!";
        case 'maintain':
            return "Menjaga keseimbangan adalah kunci. Anda hebat dalam merawat tubuh Anda!";
        case 'slow_loss':
            return "Perubahan kecil membawa hasil besar. Teruslah bergerak maju selangkah demi selangkah!";
        case 'loss':
            return "Komitmen Anda luar biasa! Setiap pilihan sehat membawa Anda lebih dekat ke tujuan.";
        default:
            return "Teruslah berjuang untuk kesehatan Anda!";
    }
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    const weightNum = parseInt(weight, 10);
    const heightNum = parseInt(height, 10);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      alert("Harap masukkan angka yang valid untuk usia, berat, dan tinggi badan.");
      return;
    }

    let bmr: number;
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const tdee = bmr * activityLevel;
    
    let adjustment = 0;
    let goalLabel = '';
    const selectedGoal = dietGoals.find(g => g.value === dietGoal);
    if (selectedGoal) {
        adjustment = selectedGoal.adjustment;
        goalLabel = selectedGoal.label;
    }
    
    const goalCalories = tdee + adjustment;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      goalLabel: goalLabel,
    });
    setMotivationalMessage(getMotivationalMessage(dietGoal));
    setNativeAdKey(`calc-${new Date().getTime()}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Hitung Angka Kecukupan Gizi (AKG) Anda</h2>
        <p className="text-slate-600 dark:text-slate-400">Isi formulir untuk memperkirakan kebutuhan kalori harian Anda.</p>
      </div>

      <form onSubmit={calculateCalories} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
        <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Usia</label>
            <input type="number" id="age" value={age} onChange={e => setAge(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Tahun" required/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Berat badan (kg)</label>
                <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="kg" required/>
            </div>
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tinggi (cm)</label>
                <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="cm" required/>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jenis Kelamin</label>
            <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                    <input type="radio" value="female" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"/>
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Perempuan</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input type="radio" value="male" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"/>
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Laki-laki</span>
                </label>
            </div>
        </div>
        
        <div>
          <label htmlFor="dietGoal" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tujuan Diet</label>
          <select id="dietGoal" value={dietGoal} onChange={e => setDietGoal(e.target.value)} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            {dietGoals.map(goal => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tingkat Aktivitas*</label>
          <select id="activityLevel" value={activityLevel} onChange={e => setActivityLevel(Number(e.target.value))} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            {activityLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-colors">Hitung AKG saya</button>
      </form>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">* Level aktivitas apa yang seharusnya saya pilih?</h4>
        {activityLevels.map(level => (
            <div key={level.value}>
                <p><strong className="text-slate-700 dark:text-slate-300">{level.label}</strong> – {activityDescriptions[level.value]}</p>
            </div>
        ))}
      </div>

      <div className="pt-2">
        <AdBanner />
      </div>

      {result && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in space-y-6">
          <h3 className="text-2xl font-bold text-center mb-2">Hasil Perhitungan Anda</h3>
          
          <div className="text-center bg-primary-50 dark:bg-slate-700 p-6 rounded-lg">
              <p className="text-base text-slate-600 dark:text-slate-300">Kalori yang direkomendasikan untuk:</p>
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{result.goalLabel}</p>
              <p className="text-5xl font-bold text-slate-800 dark:text-slate-100 my-2">{result.goalCalories}</p>
              <p className="text-slate-500 dark:text-slate-400">kkal per hari</p>
          </div>

          <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-lg text-sm space-y-2">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Rincian Perhitungan</h4>
            <p className="text-blue-700 dark:text-blue-300">
                <strong className="block">BMR (Basal Metabolic Rate): {result.bmr} kkal</strong>
                Ini adalah jumlah kalori yang dibakar tubuh Anda saat istirahat total hanya untuk menjalankan fungsi vital seperti bernapas.
            </p>
            <p className="text-blue-700 dark:text-blue-300">
                <strong className="block">TDEE (Total Daily Energy Expenditure): {result.tdee} kkal</strong>
                Ini adalah total kalori yang Anda bakar dalam sehari, yang dihitung dengan mengalikan BMR Anda dengan tingkat aktivitas harian.
            </p>
            <p className="text-blue-700 dark:text-blue-300 italic mt-2">
                Kebutuhan kalori untuk tujuan '{result.goalLabel}' Anda dihitung dengan menyesuaikan angka TDEE ini.
            </p>
          </div>

          <div className="text-center bg-teal-50 dark:bg-slate-700/70 p-4 rounded-lg">
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 italic">
                  "{motivationalMessage}"
              </p>
          </div>
          
          <div className="mt-4">
            <NativeAd adKey={nativeAdKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;