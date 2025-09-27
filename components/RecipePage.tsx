
import React, { useState } from 'react';
import { generateRecipe } from '../services/geminiService';
import { RecipeResult } from '../types';
import { SparklesIcon, BookOpenIcon } from './Icons';
import Spinner from './Spinner';
import NativeAd from './NativeAd';
import AdBanner from './AdBanner';

const RecipePage: React.FC = () => {
  const [dishName, setDishName] = useState<string>('');
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nativeAdKey, setNativeAdKey] = useState<string>('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      setError("Harap masukkan nama makanan yang ingin Anda cari resepnya.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const recipeResult = await generateRecipe(dishName);

    setIsLoading(false);
    if (recipeResult.error) {
      setError(recipeResult.description);
    } else {
      setResult(recipeResult);
      setNativeAdKey(`recipe-${new Date().getTime()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-primary-500" />
        <h2 className="text-3xl font-bold">Resep Makanan</h2>
      </div>

      <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
        <div>
          <label htmlFor="dishName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            makanan yang akan di masak
          </label>
          <input
            type="text"
            id="dishName"
            value={dishName}
            onChange={e => setDishName(e.target.value)}
            className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="contoh: ayam kecap, sate madura"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
          {isLoading ? 'Membuat Resep...' : 'Cari Resep'}
        </button>
      </form>
      
      <div className="pt-2">
        <AdBanner />
      </div>

      {error && !isLoading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Oops!</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in">
          <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{result.recipeName}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">{result.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Bahan-bahan</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {result.ingredients.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Cara Memasak</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                {result.instructions.map((step, index) => <li key={index}>{step}</li>)}
              </ol>
            </div>
          </div>
           <div className="mt-4">
            <NativeAd adKey={nativeAdKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;