
import React, { useState } from 'react';
import { SearchIcon, LoadingSpinnerIcon } from './icons';

interface UrlInputFormProps {
    onGetInfo: (url: string) => void;
    isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onGetInfo, isLoading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGetInfo(url);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    🎥
                </span>
                <input
                    type="text"
                    id="urlInput"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="أدخل رابط الفيديو أو قائمة التشغيل هنا..."
                    className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    disabled={isLoading}
                    dir="rtl"
                />
            </div>
            <button
                type="submit"
                id="getInfoBtn"
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinnerIcon className="h-5 w-5 animate-spin" />
                        <span>جاري...</span>
                    </>
                ) : (
                    <>
                        <SearchIcon className="h-5 w-5" />
                        <span>الحصول على المعلومات</span>
                    </>
                )}
            </button>
        </form>
    );
};
