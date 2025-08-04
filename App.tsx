
import React, { useState, useCallback } from 'react';
import type { VideoInfo, StatusMessage } from './types';
import { UrlInputForm } from './components/UrlInputForm';
import { VideoInfoDisplay } from './components/VideoInfoDisplay';
import { StatusDisplay } from './components/StatusDisplay';
import { getVideoInfo } from './services/geminiService';
import { LokiLogoIcon } from './components/icons';

const App: React.FC = () => {
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [status, setStatus] = useState<StatusMessage>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [currentUrl, setCurrentUrl] = useState<string>('');

    const handleGetInfo = useCallback(async (url: string) => {
        if (!url) {
            setStatus({ text: '❌ يرجى إدخال رابط صالح.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setVideoInfo(null);
        setCurrentUrl(url);
        setStatus({ text: '⏳ جاري استخلاص المعلومات، يرجى الانتظار...', type: 'loading' });

        try {
            const info = await getVideoInfo(url);
            if (info.success) {
                // In this block, `info` is correctly inferred as `VideoInfoSuccess`.
                setVideoInfo(info);
                setStatus({ text: '✅ تم الحصول على المعلومات بنجاح.', type: 'success' });
            } else {
                // By checking for the success case first, we ensure TypeScript correctly
                // narrows the type of `info` to `VideoInfoError` in this block.
                setStatus({ text: `❌ حدث خطأ: ${info.error}`, type: 'error' });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setStatus({ text: `❌ فشل الاتصال بالخادم. ${errorMessage}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleDownload = useCallback(async (formatId: string) => {
        if (!currentUrl || !formatId) {
            setStatus({ text: '❌ خطأ داخلي: معلومات التحميل غير كاملة.', type: 'error' });
            return;
        }

        setIsDownloading(true);
        setStatus({ text: '🚀 بدأ التحميل في الخلفية. يمكنك متابعة العمل.', type: 'loading' });

        // Simulate a "fire and forget" download call
        // In a real app, this would call a backend endpoint.
        // We simulate a successful start.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus({ text: '✅ تم إرسال طلب التحميل بنجاح. تحقق من مجلد التحميلات.', type: 'success' });
        
        // After a delay, re-enable the download button
        setTimeout(() => {
            setIsDownloading(false);
        }, 3000);

    }, [currentUrl]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <div className="inline-block bg-gray-800 p-4 rounded-full shadow-lg border border-gray-700 mb-4">
                        <LokiLogoIcon className="h-16 w-16 text-green-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-green-400">LOKI Downloader</h1>
                    <p className="text-gray-400 mt-2">أداة التحميل المطلقة، بتصميم المايسترو أحمد العناني</p>
                </header>

                <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
                    <UrlInputForm onGetInfo={handleGetInfo} isLoading={isLoading} />
                    
                    <StatusDisplay status={status} />
                    
                    {videoInfo?.success && (
                        <VideoInfoDisplay 
                            info={videoInfo} 
                            onDownload={handleDownload}
                            isDownloading={isDownloading} 
                        />
                    )}
                </main>

                 <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>Powered by React, Tailwind CSS, and Gemini API</p>
                    <p>&copy; {new Date().getFullYear()} LOKI Downloader Concept. For demonstration purposes only.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;