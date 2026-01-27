export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 'low' | 'medium' | 'high';
export type EffortLevel = 'short' | 'medium' | 'deep';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  effort: EffortLevel;
  mindfulnessNote?: string;
}

export interface DayEntry {
  date: string; // ISO date string YYYY-MM-DD
  intention: string;
  mood: MoodLevel | null;
  energy: EnergyLevel | null;
  tasks: Task[];
  reflection?: {
    wentWell: string[];
    feltHeavy?: string;
    gratitude?: string;
    letGo: boolean;
  };
}

export interface AppSettings {
  remindersEnabled: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  darkMode: boolean;
}
