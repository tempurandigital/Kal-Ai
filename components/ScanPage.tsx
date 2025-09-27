import React, { useState, useRef, useEffect } from 'react';
import { analyzeFoodImage, generateHealthSummary, generatePortionSuggestion } from '../services/geminiService';
import { FoodAnalysisResult } from '../types';
import { SparklesIcon, ArrowPathIcon, CameraIcon, LightBulbIcon, UploadIcon, ScaleIcon, XMarkIcon } from './Icons';
import Spinner from './Spinner';
import NativeAd from './NativeAd';
import AdBanner from './AdBanner';

const ScanPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string>('Analisis Gagal');
  const [nativeAdKey, setNativeAdKey] = useState<string>('');
  const [healthSummary, setHealthSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [portionSuggestion, setPortionSuggestion] = useState<string | null>(null);
  const [isPortionLoading, setIsPortionLoading] = useState<boolean>(false);
  const [isCameraLive, setIsCameraLive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup effect to stop camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReset();
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !imagePreview) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setHealthSummary(null);
    setPortionSuggestion(null);

    const base64Image = imagePreview.split(',')[1];
    const result = await analyzeFoodImage(base64Image, imageFile.type);
    
    setIsLoading(false);
    
    if (result.error) {
        setErrorTitle('Analisis Gagal');
        setError(result.description);
    } else {
        setAnalysisResult(result);
        setNativeAdKey(`scan-${new Date().getTime()}`);
        
        setIsSummaryLoading(true);
        setIsPortionLoading(true);

        generateHealthSummary(result).then(summary => {
          setHealthSummary(summary);
          setIsSummaryLoading(false);
        });
        
        generatePortionSuggestion(result).then(portion => {
          setPortionSuggestion(portion);
          setIsPortionLoading(false);
        });
    }
  };

  const triggerGallerySelect = () => {
    fileInputRef.current?.click();
  };
  
  const startCamera = async () => {
    handleReset();
    setIsCameraLive(true);
    stopCamera(); // Stop any existing stream
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setErrorTitle('Gagal Mengakses Kamera');
        if (err instanceof DOMException) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                 setError("Akses kamera ditolak. Untuk menggunakan fitur ini, Anda perlu memberikan izin kamera di pengaturan browser Anda.");
            } else if (err.name === "NotFoundError") {
                setError("Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera dan tidak sedang digunakan oleh aplikasi lain.");
            } else {
                 setError("Tidak dapat mengakses kamera karena kesalahan teknis. Coba lagi atau pastikan perangkat Anda mendukungnya.");
            }
        } else {
             setError("Terjadi kesalahan tak terduga saat mencoba mengakses kamera.");
        }
        setIsCameraLive(false);
    }
  };
  
  const handleCancelCamera = () => {
    stopCamera();
    setIsCameraLive(false);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            
            setImagePreview(dataUrl);
            
            try {
              const capturedFile = dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
              setImageFile(capturedFile);
            } catch (e) {
              console.error("Error creating file from data URL", e);
              setError("Gagal memproses gambar yang diambil.");
            }
        }
        
        stopCamera();
        setIsCameraLive(false);
    }
  };


  const handleReset = () => {
    stopCamera(); // Pastikan kamera mati jika direset
    setIsCameraLive(false);
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setHealthSummary(null);
    setIsSummaryLoading(false);
    setPortionSuggestion(null);
    setIsPortionLoading(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Pindai Makananmu</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Ambil foto atau pilih dari galeri untuk analisis nutrisi AI.</p>
      </div>

      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg min-h-[300px] flex items-center justify-center relative overflow-hidden ${isCameraLive ? 'p-0' : 'p-6'}`}>
        {isCameraLive ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                ></video>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <button
                        onClick={handleCapturePhoto}
                        aria-label="Ambil Gambar"
                        className="w-16 h-16 rounded-full bg-white p-1 border-4 border-white ring-2 ring-primary-500 hover:bg-slate-200 transition-colors shadow-lg"
                    >
                        <div className="w-full h-full rounded-full bg-primary-600 hover:bg-primary-700"></div>
                    </button>
                </div>
                <button 
                    onClick={handleCancelCamera}
                    aria-label="Batal"
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
        ) : !imagePreview ? (
            <div className="relative block w-full rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center h-64 flex flex-col justify-center items-center">
                <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Analisis Nutrisi Makanan
                </span>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sentuh ikon untuk memulai.</p>
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        onClick={startCamera}
                        aria-label="Ambil Foto"
                        className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-200 shadow-lg transform hover:scale-110"
                    >
                        <CameraIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={triggerGallerySelect}
                        aria-label="Pilih dari Galeri"
                        className="p-3 bg-slate-500 text-white rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-all duration-200 shadow-lg transform hover:scale-110"
                    >
                        <UploadIcon className="w-6 h-6" />
                    </button>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
            </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <img src={imagePreview} alt="Pratinjau Makanan" className="max-h-64 w-auto rounded-lg shadow-md" />
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button onClick={handleAnalyze} disabled={isLoading} className="flex-1 flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Analisis...' : 'Analisis Foto'}
                </button>
                <button onClick={handleReset} disabled={isLoading} className="flex-1 flex items-center justify-center bg-slate-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 disabled:bg-slate-400 transition-colors">
                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                    Ulangi
                </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>

      <AdBanner />

      {error && !isLoading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">{errorTitle}</p>
          <p>{error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in space-y-4">
          <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{analysisResult.dishName}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{analysisResult.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-primary-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kalori</p>
              <p className="text-2xl font-bold">{analysisResult.nutrition.calories.toFixed(0)}</p>
              <p className="text-xs text-slate-500">kcal</p>
            </div>
            <div className="bg-green-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Protein</p>
              <p className="text-2xl font-bold">{analysisResult.nutrition.protein.toFixed(1)}</p>
              <p className="text-xs text-slate-500">gram</p>
            </div>
            <div className="bg-yellow-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Karbohidrat</p>
              <p className="text-2xl font-bold">{analysisResult.nutrition.carbohydrates.toFixed(1)}</p>
              <p className="text-xs text-slate-500">gram</p>
            </div>
            <div className="bg-red-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lemak</p>
              <p className="text-2xl font-bold">{analysisResult.nutrition.fat.toFixed(1)}</p>
              <p className="text-xs text-slate-500">gram</p>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
            {isSummaryLoading ? (
              <div className="flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Spinner />
                <span className="ml-2">Membuat ringkasan kesehatan...</span>
              </div>
            ) : healthSummary && (
              <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-start space-x-3">
                <LightBulbIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Ringkasan Kesehatan AI</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{healthSummary}</p>
                </div>
              </div>
            )}
            {isPortionLoading ? (
              <div className="flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <Spinner />
                  <span className="ml-2">Membuat saran porsi...</span>
              </div>
            ) : portionSuggestion && (
                <div className="bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-start space-x-3">
                    <ScaleIcon className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">Saran Porsi AI</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">{portionSuggestion}</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
      {analysisResult && <NativeAd adKey={nativeAdKey} />}
    </div>
  );
};

export default ScanPage;