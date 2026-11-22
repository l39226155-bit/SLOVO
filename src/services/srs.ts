import type { Grade, SrsCard } from '@/store/types';

/**
 * Spaced repetition (SM-2 variant).
 * Grades map to SM-2 quality values; ease stays in [1.3, 2.8].
 */

const QUALITY: Record<Grade, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

const DAY_MS = 24 * 60 * 60 * 1000;
/** First "again" comes back after 10 minutes, not a full day. */
const RELEARN_MS = 10 * 60 * 1000;
/** A word forgotten four times stops growing: it must be recalled again soon. */
const LEECH_LAPSES = 4;
const LEECH_MAX_INTERVAL = 14;
const MAX_INTERVAL = 365;

export function newCard(vocabId: string, now = new Date()): SrsCard {
  return {
    vocabId,
    ease: 2.5,
    intervalDays: 0,
    dueAt: now.toISOString(),
    reps: 0,
    lapses: 0,
    lastGrade: 'good',
    lastReviewedAt: now.toISOString(),
  };
}

export function schedule(card: SrsCard | undefined, vocabId: string, grade: Grade, now = new Date()): SrsCard {
  const base = card ?? newCard(vocabId, now);
  const q = QUALITY[grade];

  let ease = base.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease = Math.min(2.8, Math.max(1.3, Number(ease.toFixed(2))));

  if (grade === 'again') {
    const lapses = base.lapses + 1;
    // Words forgotten repeatedly come back faster and stay short-interval.
    const relearn = lapses >= LEECH_LAPSES ? 5 * 60 * 1000 : RELEARN_MS;
    return {
      ...base,
      ease: Math.max(1.3, ease - 0.08),
      reps: 0,
      lapses,
      intervalDays: 0,
      dueAt: new Date(now.getTime() + relearn).toISOString(),
      lastGrade: grade,
      lastReviewedAt: now.toISOString(),
    };
  }

  const reps = base.reps + 1;
  let intervalDays: number;
  if (reps === 1) {
    intervalDays = grade === 'easy' ? 3 : grade === 'hard' ? 1 : 1;
  } else if (reps === 2) {
    intervalDays = grade === 'easy' ? 6 : grade === 'hard' ? 2 : 3;
  } else {
    const multiplier = grade === 'hard' ? 1.15 : grade === 'easy' ? ease * 1.3 : ease;
    intervalDays = Math.max(1, Math.round(Math.max(base.intervalDays, 1) * multiplier));
  }

  if (base.lapses >= LEECH_LAPSES) intervalDays = Math.min(intervalDays, LEECH_MAX_INTERVAL);
  intervalDays = Math.min(MAX_INTERVAL, intervalDays);

  return {
    ...base,
    ease,
    reps,
    intervalDays,
    dueAt: new Date(now.getTime() + intervalDays * DAY_MS).toISOString(),
    lastGrade: grade,
    lastReviewedAt: now.toISOString(),
  };
}

export function isDue(card: SrsCard, now = new Date()): boolean {
  return new Date(card.dueAt).getTime() <= now.getTime();
}

/** Retention estimate used for "Beherrschte Wörter". */
export function isMastered(card: SrsCard): boolean {
  return card.reps >= 3 && card.intervalDays >= 6 && card.lapses <= 2;
}

export function strength(card: SrsCard): number {
  if (card.reps === 0) return 0.15;
  const intervalScore = Math.min(1, card.intervalDays / 21);
  const easeScore = (card.ease - 1.3) / 1.5;
  const lapsePenalty = Math.min(0.4, card.lapses * 0.12);
  return Math.max(0.05, Math.min(1, intervalScore * 0.7 + easeScore * 0.3 - lapsePenalty));
}

export const GRADE_LABELS: { grade: Grade; label: string; hint: string }[] = [
  { grade: 'again', label: 'Nochmal', hint: 'in 10 Min.' },
  { grade: 'hard', label: 'Schwer', hint: 'kurz' },
  { grade: 'good', label: 'Gut', hint: 'normal' },
  { grade: 'easy', label: 'Leicht', hint: 'lang' },
];
