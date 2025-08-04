
import React, { useState, useMemo } from 'react';
import type { VideoInfoSuccess } from '../types';
import { DownloadIcon, LoadingSpinnerIcon, PlaylistIcon, VideoIcon } from './icons';

interface VideoInfoDisplayProps {
    info: VideoInfoSuccess;
    onDownload: (formatId: string) => void;
    isDownloading: boolean;
}

export const VideoInfoDisplay: React.FC<VideoInfoDisplayProps> = ({ info, onDownload, isDownloading }) => {
    const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);

    // Set the default selected format to the highest quality
    useMemo(() => {
        if (info.formats.length > 0) {
            // Assuming formats are pre-sorted, but let's sort just in case.
            const sortedFormats = [...info.formats].sort((a, b) => b.height - a.height);
            setSelectedFormatId(sortedFormats[0].format_id);
        }
    }, [info.formats]);

    const handleDownloadClick = () => {
        if (selectedFormatId) {
            onDownload(selectedFormatId);
        }
    };

    return (
        <div id="videoInfo" className="bg-gray-700/50 p-6 rounded-lg space-y-6 animate-fade-in">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-blue-400 mt-1">
                    {info.is_playlist ? <PlaylistIcon className="w-8 h-8"/> : <VideoIcon className="w-8 h-8"/>}
                </div>
                <div>
                    <h2 id="videoTitle" className="text-xl font-bold text-white break-words">
                        {info.title}
                    </h2>
                    {info.is_playlist && <span className="text-sm font-semibold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-md">قائمة تشغيل</span>}
                </div>
            </div>

            <div id="qualitySelection">
                <p className="font-semibold text-gray-300 mb-3 text-right">🔽 اختر الجودة المطلوبة:</p>
                <div id="qualityList" className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {info.formats.map((format) => (
                         <label key={format.format_id} className={`quality-option group flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${selectedFormatId === format.format_id ? 'border-green-500 bg-green-900/50' : 'border-transparent bg-gray-600/50 hover:bg-gray-600'}`}>
                            <input
                                type="radio"
                                name="quality"
                                value={format.format_id}
                                checked={selectedFormatId === format.format_id}
                                onChange={() => setSelectedFormatId(format.format_id)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 mr-4 flex-shrink-0 ${selectedFormatId === format.format_id ? 'border-green-400 bg-green-500' : 'border-gray-400 group-hover:border-green-400'}`}></div>
                            <span className={`font-medium ${selectedFormatId === format.format_id ? 'text-green-300' : 'text-gray-200'}`}>{format.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <button 
                id="downloadBtn" 
                onClick={handleDownloadClick}
                disabled={isDownloading || !selectedFormatId}
                className="w-full flex justify-center items-center gap-3 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isDownloading ? (
                    <>
                        <LoadingSpinnerIcon className="h-5 w-5 animate-spin" />
                        <span>جاري التحميل...</span>
                    </>
                ) : (
                    <>
                        <DownloadIcon className="h-5 w-5" />
                        <span>تحميل الآن</span>
                    </>
                )}
            </button>
        </div>
    );
};
