
export interface VideoFormat {
    format_id: string;
    height: number;
    ext: string;
    label: string;
}

export type VideoInfoSuccess = {
    success: true;
    title: string;
    is_playlist: boolean;
    formats: VideoFormat[];
};

export type VideoInfoError = {
    success: false;
    error: string;
};

export type VideoInfo = VideoInfoSuccess | VideoInfoError;

export type StatusType = 'info' | 'success' | 'error' | 'loading';

export type StatusMessage = {
    text: string;
    type: StatusType;
} | null;
