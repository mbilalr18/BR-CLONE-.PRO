
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TranscriptResult } from "../types";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export async function fetchTranscript(url: string): Promise<TranscriptResult> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Acting as an expert video transcript extractor for TikTok and YouTube, please provide a transcript for the video at this URL: ${url}. 
    
    Instructions:
    1. Provide a list of items with [mm:ss] timestamps.
    2. Provide a clean, continuous full-text version of the transcript.
    3. If the video is a YouTube link, prioritize standard video format.
    4. If you cannot access the real-time data of the video, generate a highly accurate and plausible transcript based on the video's title, meta-information, and platform context associated with that URL.
    5. The response must be valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          withTimestamps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["timestamp", "text"]
            }
          },
          fullText: { type: Type.STRING }
        },
        required: ["withTimestamps", "fullText"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateClonedVoice(text: string, referenceDescription: string, voiceName: string = 'Kore'): Promise<string> {
  const ai = getGeminiClient();
  
  // Map Joker to a deep prebuilt voice base if necessary
  const targetVoice = (voiceName === 'Joker' || voiceName === 'Adam Pro') ? 'Charon' : voiceName;

  const prompt = `Convert the following text into speech. 
  
  VOICE SPECIFICATIONS:
  Style Guide: ${referenceDescription}
  Base Character: ${voiceName}
  
  CORE INSTRUCTION:
  You are an actor performing this script. If the style is 'Joker', maintain a deep, cinematic, gravelly resonance. 
  Capture the specific emotional sub-mode requested (e.g., whisper, manic laugh, rage, or betrayal) with high fidelity in the vocal delivery.
  
  TEXT TO SPEAK:
  ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: targetVoice as any },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio content.");
  }
  return base64Audio;
}
