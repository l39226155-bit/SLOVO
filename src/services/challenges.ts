import type { Level } from '@/data/types';
import { dayKey } from '@/services/format';
import type { Activity, SrsCard } from '@/store/types';
import type { AppState } from '@/store/useAppStore';

/**
 * Daily challenges are derived from the calendar date, so everybody sees a new
 * set each day and the same set when reopening the app. Progress is always read
 * from real activities and cards — nothing is simulated.
 */

export type ChallengeUnit = 'Wörter' | 'Sätze' | 'Minuten' | 'Aufgaben' | 'Dialoge' | 'Geschichten';

interface ChallengeTemplate {
  id: string;
  title: string;
  hint: string;
  unit: ChallengeUnit;
  xp: number;
  targetFor: (level: Level) => number;
  measure: (state: Pick<AppState, 'activities' | 'cards'>) => number;
}

const target = (base: Record<Level, number>) => (level: Level) => base[level];

const templates: ChallengeTemplate[] = [
  {
    id: 'words',
    title: 'Wörter wiederholen',
    hint: 'Karten aus dem Wiederholungsplan, die heute fällig waren.',
    unit: 'Wörter',
    xp: 12,
    targetFor: target({ A0: 5, A1: 8, A2: 10, B1: 12, B2: 15, C1: 15 }),
    measure: ({ cards }) => {
      const today = dayKey(new Date());
      return Object.values(cards).filter((card: SrsCard) => card.reps > 0 && dayKey(card.lastReviewedAt) === today).length;
    },
  },
  {
    id: 'translations',
    title: 'Sätze übersetzen',
    hint: 'Richtige Antworten aus Lektionen und Wiederholungen.',
    unit: 'Sätze',
    xp: 15,
    targetFor: target({ A0: 3, A1: 5, A2: 5, B1: 6, B2: 8, C1: 8 }),
    measure: ({ activities }) =>
      activities
        .filter((activity) => (activity.kind === 'lesson' || activity.kind === 'sentence') && dayKey(activity.at) === dayKey(new Date()))
        .reduce((sum, activity) => sum + activity.correct, 0),
  },
  {
    id: 'listening',
    title: 'Hörverständnis',
    hint: 'Minuten Hörtext heute.',
    unit: 'Minuten',
    xp: 10,
    targetFor: () => 5,
    measure: ({ activities }) =>
      Math.round(
        activities
          .filter((activity: Activity) => activity.kind === 'listening' && dayKey(activity.at) === dayKey(new Date()))
          .reduce((sum, activity) => sum + activity.minutes, 0),
      ),
  },
  {
    id: 'grammar',
    title: 'Grammatikaufgaben',
    hint: 'Richtige Antworten im Grammatiktraining.',
    unit: 'Aufgaben',
    xp: 12,
    targetFor: target({ A0: 3, A1: 3, A2: 4, B1: 4, B2: 5, C1: 5 }),
    measure: ({ activities }) =>
      activities
        .filter((activity) => activity.kind === 'grammar' && dayKey(activity.at) === dayKey(new Date()))
        .reduce((sum, activity) => sum + activity.correct, 0),
  },
  {
    id: 'dialogue',
    title: 'Alltagsdialog',
    hint: 'Eine Situation vollständig durchspielen.',
    unit: 'Dialoge',
    xp: 15,
    targetFor: () => 1,
    measure: ({ activities }) =>
      activities.filter((activity) => activity.kind === 'everyday' && dayKey(activity.at) === dayKey(new Date())).length,
  },
  {
    id: 'writing',
    title: 'Schreiben',
    hint: 'Eine Schreibübung abschließen.',
    unit: 'Aufgaben',
    xp: 10,
    targetFor: () => 1,
    measure: ({ activities }) =>
      activities.filter((activity) => activity.kind === 'writing' && dayKey(activity.at) === dayKey(new Date())).length,
  },
  {
    id: 'story',
    title: 'Geschichte lesen',
    hint: 'Eine Geschichte mit Fragen abschließen.',
    unit: 'Geschichten',
    xp: 12,
    targetFor: () => 1,
    measure: ({ activities }) =>
      activities.filter((activity) => activity.kind === 'story' && dayKey(activity.at) === dayKey(new Date())).length,
  },
  {
    id: 'review',
    title: 'Kurze Wiederholung',
    hint: 'Mindestens fünf Karten heute bewerten.',
    unit: 'Wörter',
    xp: 8,
    targetFor: () => 5,
    measure: ({ cards }) => {
      const today = dayKey(new Date());
      return Object.values(cards).filter((card: SrsCard) => dayKey(card.lastReviewedAt) === today).length;
    },
  },
];

export interface DailyChallenge {
  id: string;
  title: string;
  hint: string;
  unit: ChallengeUnit;
  xp: number;
  target: number;
  value: number;
  done: boolean;
  claimed: boolean;
  key: string;
}

function hash(value: string): number {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) % 100000;
  }
  return result;
}

export function dailyChallenges(
  state: Pick<AppState, 'activities' | 'cards' | 'challengeClaims' | 'profile'>,
  date = new Date(),
): DailyChallenge[] {
  const key = dayKey(date);
  const level = state.profile?.level ?? 'A0';
  const start = hash(key) % templates.length;
  const picked = [0, 1, 2, 3].map((offset) => templates[(start + offset * 2) % templates.length]);

  const unique = picked.filter((template, index) => picked.indexOf(template) === index).slice(0, 4);

  return unique.map((template) => {
    const value = Math.min(template.targetFor(level), template.measure(state));
    const targetValue = template.targetFor(level);
    const claimKey = `${key}:${template.id}`;
    return {
      id: template.id,
      title: template.title,
      hint: template.hint,
      unit: template.unit,
      xp: template.xp,
      target: targetValue,
      value,
      done: value >= targetValue,
      claimed: Boolean(state.challengeClaims[claimKey]),
      key: claimKey,
    };
  });
}

export function challengeSummary(challenges: DailyChallenge[]): { done: number; total: number; xp: number } {
  return {
    done: challenges.filter((challenge) => challenge.done).length,
    total: challenges.length,
    xp: challenges.reduce((sum, challenge) => sum + challenge.xp, 0),
  };
}
