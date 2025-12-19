
export interface TranscriptItem {
  timestamp: string;
  text: string;
}

export interface TranscriptResult {
  withTimestamps: TranscriptItem[];
  fullText: string;
}

export enum AppTab {
  TRANSCRIPT = 'transcript',
  VOICE_CLONE = 'voice_clone',
  PRIVACY = 'privacy'
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
}

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Charon', name: 'Adam Pro', description: 'Deep, authoritative, and narrative', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Strong, classic male resonance', gender: 'Male' },
  { id: 'Joker', name: 'Joker', description: 'Gravelly, deep, cynical, and cinematic with a dark philosophical tone', gender: 'Male' },
  { id: 'Zephyr', name: 'Zephyr', description: 'Friendly, versatile, and clear', gender: 'Neutral' },
  { id: 'Kore', name: 'Kore', description: 'Calm, professional female', gender: 'Female' },
  { id: 'Puck', name: 'Puck', description: 'Energetic, youthful, and bright', gender: 'Male' },
];

export const JOKER_MODES = [
  { id: 'whisper', label: 'Whisper', icon: '🤫', description: 'Low, breathy, and menacingly quiet' },
  { id: 'laugh', label: 'Laugh', icon: '🤡', description: 'Unpredictable, hysterical, and manic' },
  { id: 'angry', label: 'Angry', icon: '🔥', description: 'Intense, explosive, and aggressive' },
  { id: 'panic', label: 'Panic', icon: '😱', description: 'Breathless, erratic, and terrified' },
  { id: 'calm', label: 'Calm', icon: '🕯️', description: 'Eerily steady, calculated, and smooth' },
  { id: 'betrayed', label: 'Betrayed', icon: '💔', description: 'Hurt, raspy, and emotionally broken' },
  { id: 'chaos', label: 'Chaos Mode', icon: '🌀', description: 'Maximum gravel, shifting pitch, and complete insanity' },
];
