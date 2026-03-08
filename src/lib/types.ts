export interface Subject {
  id: string;
  name: string;
  color: string;
  totalStudyTime: number; // seconds
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId?: string;
  mode: TimerMode;
  duration: number; // seconds
  date: string;
  xpEarned: number;
}

export type TimerMode = 'pomodoro' | 'deepFocus' | 'custom' | 'examSprint' | 'flow';

export interface TimerPreset {
  mode: TimerMode;
  label: string;
  description: string;
  focusMinutes: number;
  breakMinutes: number;
  icon: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId?: string;
  date: string;
  createdAt: string;
}

export interface ConfusionItem {
  id: string;
  topic: string;
  subjectId?: string;
  resolved: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalStudyTime: number;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  dailyGoalMinutes: number;
  todayStudyTime: number;
  todayDate: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { mode: 'pomodoro', label: 'Pomodoro', description: '50 min focus / 10 min break', focusMinutes: 50, breakMinutes: 10, icon: '🍅' },
  { mode: 'deepFocus', label: 'Deep Focus', description: '90 min uninterrupted', focusMinutes: 90, breakMinutes: 15, icon: '🧠' },
  { mode: 'examSprint', label: 'Exam Sprint', description: '25 min intense / 5 min break', focusMinutes: 25, breakMinutes: 5, icon: '⚡' },
  { mode: 'flow', label: 'Flow Mode', description: 'Continuous focus, no breaks', focusMinutes: 0, breakMinutes: 0, icon: '🌊' },
  { mode: 'custom', label: 'Custom', description: 'Set your own times', focusMinutes: 45, breakMinutes: 10, icon: '⚙️' },
];

export const SUBJECT_COLORS = [
  'hsl(170 80% 45%)',
  'hsl(200 80% 55%)',
  'hsl(260 70% 60%)',
  'hsl(330 70% 55%)',
  'hsl(38 90% 55%)',
  'hsl(15 85% 55%)',
  'hsl(150 60% 45%)',
  'hsl(45 90% 50%)',
];

export const XP_PER_MINUTE = 2;
export const XP_PER_LEVEL = 500;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function getLevelTitle(level: number): string {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Focused Learner';
  if (level <= 10) return 'Knowledge Seeker';
  if (level <= 20) return 'Study Master';
  if (level <= 35) return 'Academic Warrior';
  return 'Study Legend';
}
