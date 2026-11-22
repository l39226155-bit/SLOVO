import type { Level } from '@/data/types';

export type Goal = 'travel' | 'work' | 'family' | 'culture' | 'exam';
export type Grade = 'again' | 'hard' | 'good' | 'easy';
export type ActivityKind =
  | 'lesson'
  | 'review'
  | 'alphabet'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'tutor'
  | 'everyday'
  | 'sentence'
  | 'writing'
  | 'story'
  | 'challenge'
  | 'placement';

export interface Profile {
  name: string;
  nativeLanguage: string;
  goal: Goal;
  dailyMinutes: number;
  /** Self-declared or placement-test level at onboarding. */
  level: Level;
  placementScore: number;
  createdAt: string;
}

export interface LessonRecord {
  lessonId: string;
  completedAt: string;
  bestScore: number;
  attempts: number;
  xp: number;
}

export interface SrsCard {
  vocabId: string;
  ease: number;
  intervalDays: number;
  dueAt: string;
  reps: number;
  lapses: number;
  lastGrade: Grade;
  lastReviewedAt: string;
}

export interface Activity {
  id: string;
  at: string;
  kind: ActivityKind;
  label: string;
  minutes: number;
  xp: number;
  correct: number;
  total: number;
  /** e.g. grammar slug or lesson id, used for the weakness analysis. */
  refId?: string;
}

export type PersonalSource = 'manual' | 'tutor' | 'lesson';

/** A word the learner added themselves — separate from the curated course. */
export interface PersonalWord {
  id: string;
  ru: string;
  de: string;
  transcription?: string;
  category: string;
  collectionId?: string;
  level?: Level;
  favorite: boolean;
  source: PersonalSource;
  exampleRu?: string;
  exampleDe?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export interface PersonalReview {
  correct: number;
  total: number;
  lastAt: string;
}

export type ReminderGoal = 'words' | 'minutes' | 'lesson';
export type ReminderType = 'reminder' | 'summary';

export interface Reminders {
  enabled: boolean;
  hour: number;
  minute: number;
  /** 1 = Monday … 7 = Sunday, matching the course week labels. */
  days: number[];
  goal: ReminderGoal;
  type: ReminderType;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  /** 0.6 – 1.2 */
  speechRate: number;
  showTranscription: boolean;
  reminders: Reminders;
}
