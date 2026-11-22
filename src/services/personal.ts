import { dictionaryEntries } from '@/data/dictionary';
import type { PersonalWord } from '@/store/types';

export interface PersonalReview {
  correct: number;
  total: number;
  lastAt: string;
}

export type PersonalDifficulty = 'neu' | 'leicht' | 'mittel' | 'schwer';

/** Difficulty only ever comes from real answers, never from word length. */
export function personalDifficulty(review?: PersonalReview): PersonalDifficulty {
  if (!review || review.total === 0) return 'neu';
  const ratio = review.correct / review.total;
  if (review.total >= 3 && ratio >= 0.85) return 'leicht';
  if (ratio >= 0.6) return 'mittel';
  return 'schwer';
}

export const DIFFICULTY_LABEL: Record<PersonalDifficulty, string> = {
  neu: 'Noch nicht geübt',
  leicht: 'Sicher',
  mittel: 'Im Aufbau',
  schwer: 'Schwierig',
};

export function sortByDifficulty(words: PersonalWord[], reviews: Record<string, PersonalReview>): PersonalWord[] {
  const weight: Record<PersonalDifficulty, number> = { schwer: 0, mittel: 1, neu: 2, leicht: 3 };
  return [...words].sort((a, b) => {
    const diff = weight[personalDifficulty(reviews[a.id])] - weight[personalDifficulty(reviews[b.id])];
    if (diff !== 0) return diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function weakPersonalWords(
  words: PersonalWord[],
  reviews: Record<string, PersonalReview>,
): PersonalWord[] {
  return words.filter((word) => personalDifficulty(reviews[word.id]) === 'schwer');
}

/** Builds RU→DE quiz options: one correct meaning and three real distractors. */
export function buildPersonalQuiz(
  words: PersonalWord[],
  reviews: Record<string, PersonalReview>,
): { word: PersonalWord; options: string[]; answer: number }[] {
  const pool = sortByDifficulty(words, reviews);
  const meanings = [...words.map((word) => word.de), ...dictionaryEntries.slice(0, 60).map((entry) => entry.de)];

  return pool.map((word) => {
    const distractors: string[] = [];
    const candidates = meanings.filter((meaning) => meaning !== word.de);
    while (distractors.length < 3 && candidates.length > 0) {
      const index = Math.floor(Math.random() * candidates.length);
      const [picked] = candidates.splice(index, 1);
      if (!distractors.includes(picked)) distractors.push(picked);
    }
    const options = [word.de, ...distractors].sort(() => Math.random() - 0.5);
    return { word, options, answer: options.indexOf(word.de) };
  });
}
