import { chapters, lessons } from '@/data/course';
import { vocabById } from '@/data/vocabulary';
import { dayKey, weekdayShort } from '@/services/format';
import { isDue, isMastered, strength } from '@/services/srs';
import type { Activity, ActivityKind, SrsCard } from '@/store/types';
import type { AppState } from '@/store/useAppStore';

export function activityDays(activities: Activity[]): Set<string> {
  return new Set(activities.filter((activity) => activity.minutes > 0 || activity.total > 0).map((activity) => dayKey(activity.at)));
}

/** Consecutive days with learning activity, counting today (or yesterday if today is still empty). */
export function currentStreak(activities: Activity[], now = new Date()): number {
  const days = activityDays(activities);
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function minutesOn(activities: Activity[], date: Date): number {
  const key = dayKey(date);
  return activities
    .filter((activity) => dayKey(activity.at) === key)
    .reduce((sum, activity) => sum + activity.minutes, 0);
}

export function todayMinutes(state: Pick<AppState, 'activities'>): number {
  return minutesOn(state.activities, new Date());
}

export function todayXp(state: Pick<AppState, 'activities'>): number {
  const key = dayKey(new Date());
  return state.activities.filter((activity) => dayKey(activity.at) === key).reduce((sum, activity) => sum + activity.xp, 0);
}

export function todayGoal(state: Pick<AppState, 'activities' | 'profile'>): { minutes: number; goal: number; ratio: number } {
  const minutes = todayMinutes(state);
  const goal = state.profile?.dailyMinutes ?? 10;
  return { minutes, goal, ratio: goal === 0 ? 0 : Math.min(1, minutes / goal) };
}

export interface DayPoint {
  key: string;
  label: string;
  minutes: number;
  xp: number;
}

export function weekSeries(activities: Activity[], now = new Date()): DayPoint[] {
  const points: DayPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    const dayActivities = activities.filter((activity) => dayKey(activity.at) === key);
    points.push({
      key,
      label: weekdayShort(date),
      minutes: dayActivities.reduce((sum, activity) => sum + activity.minutes, 0),
      xp: dayActivities.reduce((sum, activity) => sum + activity.xp, 0),
    });
  }
  return points;
}

export function weekMinutes(activities: Activity[]): number {
  return weekSeries(activities).reduce((sum, point) => sum + point.minutes, 0);
}

export function totalMinutes(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + activity.minutes, 0);
}

export function totalXp(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + activity.xp, 0);
}

export function learnedWordCount(state: Pick<AppState, 'cards'>): number {
  return Object.keys(state.cards).length;
}

export function masteredWordCount(state: Pick<AppState, 'cards'>): number {
  return Object.values(state.cards).filter(isMastered).length;
}

export function dueCards(state: Pick<AppState, 'cards'>, now = new Date()): SrsCard[] {
  // Weak words first: a card forgotten often should not wait behind a card that
  // is only a few minutes overdue but already stable.
  return Object.values(state.cards)
    .filter((card) => isDue(card, now))
    .sort((a, b) => strength(a) - strength(b) || new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function weakWords(state: Pick<AppState, 'cards'>, limit = 5) {
  return Object.values(state.cards)
    .slice()
    .sort((a, b) => strength(a) - strength(b))
    .slice(0, limit)
    .map((card) => ({ card, vocab: vocabById[card.vocabId] }))
    .filter((entry) => Boolean(entry.vocab));
}

export function accuracyByKind(activities: Activity[]): { kind: ActivityKind; correct: number; total: number; ratio: number }[] {
  const kinds: ActivityKind[] = [
    'lesson',
    'review',
    'alphabet',
    'grammar',
    'listening',
    'speaking',
    'tutor',
    'everyday',
    'sentence',
    'writing',
    'story',
  ];
  return kinds
    .map((kind) => {
      const items = activities.filter((activity) => activity.kind === kind && activity.total > 0);
      const correct = items.reduce((sum, activity) => sum + activity.correct, 0);
      const total = items.reduce((sum, activity) => sum + activity.total, 0);
      return { kind, correct, total, ratio: total === 0 ? 0 : correct / total };
    })
    .filter((entry) => entry.total > 0);
}

export function overallAccuracy(activities: Activity[]): number {
  const items = activities.filter((activity) => activity.total > 0);
  const correct = items.reduce((sum, activity) => sum + activity.correct, 0);
  const total = items.reduce((sum, activity) => sum + activity.total, 0);
  return total === 0 ? 0 : correct / total;
}

export const KIND_LABELS: Record<ActivityKind, string> = {
  lesson: 'Lektionen',
  review: 'Vokabeltraining',
  alphabet: 'Alphabet',
  grammar: 'Grammatik',
  listening: 'Hören',
  speaking: 'Aussprache',
  tutor: 'KI-Tutor',
  everyday: 'Alltag',
  sentence: 'Satztrainer',
  writing: 'Schreiben',
  story: 'Geschichten',
  challenge: 'Challenges',
  placement: 'Einstufung',
};

export function streakLabel(streak: number): string {
  if (streak === 0) return 'Starte heute';
  if (streak === 1) return '1 Tag';
  return `${streak} Tage`;
}

/** Level curve: 250 XP per level, gently rising, shown on home and stats. */
export function xpLevel(totalXp: number): { level: number; into: number; span: number; ratio: number } {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  let span = 250;
  while (remaining >= span) {
    remaining -= span;
    level += 1;
    span = Math.round(span * 1.15);
  }
  return { level, into: remaining, span, ratio: span === 0 ? 0 : remaining / span };
}

/** Share of lessons completed per CEFR level, used for the progress breakdown. */
export function levelProgress(completed: Record<string, { bestScore: number }>) {
  const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;
  return levels.map((level) => {
    const levelLessons = lessons.filter((lesson) => chapters.find((chapter) => chapter.id === lesson.chapterId)?.level === level);
    const done = levelLessons.filter((lesson) => Boolean(completed[lesson.id])).length;
    return { level, done, total: levelLessons.length, ratio: levelLessons.length === 0 ? 0 : done / levelLessons.length };
  });
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  progress: number;
}

/** Every badge is derived from real stored progress — nothing is simulated. */
export function achievements(state: Pick<AppState, 'lessons' | 'cards' | 'activities' | 'reviewLog'>): Achievement[] {
  const completed = Object.keys(state.lessons).length;
  const words = Object.keys(state.cards).length;
  const accuracy = overallAccuracy(state.activities);
  const answered = state.activities.reduce((sum, activity) => sum + activity.total, 0);
  const streak = currentStreak(state.activities);
  const perfect = Object.values(state.lessons).some((lesson) => lesson.bestScore >= 100);
  const reviewed = state.reviewLog.length;

  return [
    {
      id: 'first_lesson',
      title: 'Erste Lektion',
      description: 'Eine Lektion abgeschlossen',
      earned: completed >= 1,
      progress: Math.min(1, completed),
    },
    {
      id: 'streak_7',
      title: 'Sieben Tage',
      description: 'Sieben Tage in Folge gelernt',
      earned: streak >= 7,
      progress: Math.min(1, streak / 7),
    },
    {
      id: 'words_50',
      title: '50 Wörter',
      description: '50 Wörter im Training',
      earned: words >= 50,
      progress: Math.min(1, words / 50),
    },
    {
      id: 'accuracy_90',
      title: 'Sicher',
      description: '90 % Trefferquote ab 50 Antworten',
      earned: answered >= 50 && accuracy >= 0.9,
      progress: Math.min(1, (answered >= 50 ? accuracy : answered / 50) * 1),
    },
    {
      id: 'reviews_500',
      title: '500 Wiederholungen',
      description: '500 Karten bewertet',
      earned: reviewed >= 500,
      progress: Math.min(1, reviewed / 500),
    },
    {
      id: 'perfect_lesson',
      title: 'Fehlerfrei',
      description: 'Eine Lektion mit 100 % abgeschlossen',
      earned: perfect,
      progress: perfect ? 1 : 0,
    },
  ];
}
