
import React from 'react';
import type { StatusMessage } from '../types';

interface StatusDisplayProps {
    status: StatusMessage;
}

const typeClasses = {
    info: 'bg-blue-900/50 text-blue-300',
    success: 'bg-green-900/50 text-green-300',
    error: 'bg-red-900/50 text-red-300',
    loading: 'bg-yellow-900/50 text-yellow-300',
};

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
    if (!status) {
        return <div className="min-h-[56px]"></div>; // Placeholder to prevent layout shift
    }

    return (
        <div 
            id="status" 
            className={`status-section min-h-[56px] p-4 rounded-lg text-center font-semibold transition-all duration-300 ${typeClasses[status.type]} ${status ? 'opacity-100' : 'opacity-0'}`}
        >
            {status.text}
        </div>
    );
};
