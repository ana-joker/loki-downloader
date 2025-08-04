import { GoogleGenAI, Type } from "@google/genai";
import type { VideoInfo, VideoInfoError, VideoInfoSuccess } from '../types';

// Use Vite's way of accessing environment variables
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    // This check is for development; in a deployed app, the build would fail or the variable would be set.
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env file and add it.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        success: { type: Type.BOOLEAN },
        title: { type: Type.STRING, nullable: true },
        is_playlist: { type: Type.BOOLEAN, nullable: true },
        formats: {
            type: Type.ARRAY,
            nullable: true,
            items: {
                type: Type.OBJECT,
                properties: {
                    format_id: { type: Type.STRING },
                    height: { type: Type.INTEGER },
                    ext: { type: Type.STRING },
                    label: { type: Type.STRING }
                },
                required: ["format_id", "height", "ext", "label"]
            }
        },
        error: { type: Type.STRING, nullable: true }
    },
    required: ["success"]
};

export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
    const systemInstruction = `You are a video information extraction service. Your task is to process a given URL and return structured JSON data about the video or playlist.
- If the URL is for a single video, provide its title and available formats. 'is_playlist' should be false.
- If the URL is for a playlist, provide the playlist's title and available formats from the first video in the list. 'is_playlist' should be true.
- Provide a variety of video formats (e.g., 2160p, 1440p, 1080p, 720p, 480p, 360p) with common extensions like 'mp4' or 'webm'.
- The 'label' should be in the format '{height}p - {ext}'.
- If the URL is invalid or information cannot be extracted, return a JSON object with 'success: false' and a concise error message in the 'error' field.
- Always respond with valid JSON that conforms to the provided schema.
`;
    const prompt = `Extract information for the following URL: ${url}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (parsedData.success === true) {
            const result: VideoInfoSuccess = {
                success: true,
                title: parsedData.title ?? "Untitled",
                is_playlist: parsedData.is_playlist ?? false,
                formats: parsedData.formats ?? [],
            };
            result.formats.sort((a, b) => b.height - a.height);
            return result;
        } else {
            const result: VideoInfoError = {
                success: false,
                error: parsedData.error ?? "An unknown error occurred while extracting video info.",
            };
            return result;
        }

    } catch (e) {
        console.error("Gemini API call failed:", e);
        const errorMessage = e instanceof Error ? e.message : "Failed to parse API response";
        return {
            success: false,
            error: `Could not process the URL. ${errorMessage}`
        };
    }
};
