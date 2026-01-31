
export enum MoodType {
  HAPPY = 'happy',
  SAD = 'sad',
  ANXIOUS = 'anxious',
  STRESSED = 'stressed',
  CALM = 'calm'
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  note: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: number;
}

export interface GratitudeEntry {
  id: string;
  userId: string;
  items: string[];
  createdAt: number;
}

export interface GroundingSession {
  id: string;
  userId: string;
  completedAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type TabType = 'dashboard' | 'chat' | 'mood-check' | 'exercises' | 'history' | 'settings';
