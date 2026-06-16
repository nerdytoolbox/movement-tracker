export interface Exercise {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  bodyAreas: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: ExerciseCategory;
  imageEmoji?: string;
}

export type ExerciseCategory = 
  | 'mobility'
  | 'balance'
  | 'strength'
  | 'handstand'
  | 'cartwheel'
  | 'crow_pose'
  | 'wrist_health'
  | 'flexibility';

export interface MovementSnack {
  id: string;
  name: string;
  durationSeconds: number;
  description: string;
  tags: string[];
  emoji: string;
}

export interface RoutineExercise {
  exerciseId: string;
  durationSeconds: number;
  reps?: number;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  durationMinutes: 5 | 10;
  description: string;
  exercises: RoutineExercise[];
  emoji: string;
  category: string;
}

export interface SkillMilestone {
  id: string;
  description: string;
  completed: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: ExerciseCategory;
  prerequisites: string[];
  milestones: SkillMilestone[];
  notes?: string;
}

export interface MovementLog {
  id: string;
  date: string;
  timestamp: number;
  snacksCompleted: string[];
  routinesCompleted: string[];
  note?: string;
}

export interface AppState {
  movementLogs: MovementLog[];
  favoriteSnacks: string[];
  completedSnacksToday: string[];
  completedRoutinesToday: string[];
  skillProgress: Record<string, SkillProgress>;
  reminders: ReminderConfig[];
  settings: AppSettings;
}

export interface SkillProgress {
  skillId: string;
  milestones: Record<string, boolean>;
  notes?: string;
  startedAt?: number;
}

export interface ReminderConfig {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
  message: string;
  days: number[];
}

export interface AppSettings {
  darkMode: 'auto' | 'light' | 'dark';
  notificationsEnabled: boolean;
}

export interface StreakInfo {
  current: number;
  longest: number;
  totalDays: number;
  lastMovementDate: string | null;
}
