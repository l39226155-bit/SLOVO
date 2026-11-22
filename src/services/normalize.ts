/**
 * Comparison helpers shared by the sentence, writing and everyday trainers.
 * Russian answers are compared without stress marks, punctuation, case or ё/е.
 */

export function stripStress(input: string): string {
  // Only the acute accent is a stress mark. A blanket range would also strip the
  // breve from й and turn пожалуйста into пожалуста.
  return input
    .normalize('NFD')
    .replace(/[\u0300\u0301]/g, '')
    .normalize('NFC');
}

export function normalizeRu(input: string): string {
  return stripStress(input)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,!?;:«»"'’()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GERMAN_FOLD: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };

export function normalizeDe(input: string): string {
  return input
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => GERMAN_FOLD[char] ?? char)
    .replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, '')
    .replace(/[.,!?;:«»"'’()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

export function similarity(a: string, b: string): number {
  const left = normalizeRu(a);
  const right = normalizeRu(b);
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return Math.max(0, 1 - distance / Math.max(left.length, right.length));
}

export function tokens(input: string): string[] {
  return normalizeRu(input).split(' ').filter(Boolean);
}

/** Word overlap, tolerant to endings (первые ~4 characters). */
export function tokenCoverage(input: string, target: string): number {
  const targetWords = tokens(target);
  if (targetWords.length === 0) return 0;
  const inputWords = tokens(input);
  let hits = 0;
  targetWords.forEach((word) => {
    const stem = word.slice(0, Math.max(3, word.length - 2));
    if (inputWords.some((candidate) => candidate.startsWith(stem))) hits += 1;
  });
  return hits / targetWords.length;
}

export type AnswerVerdict = 'correct' | 'close' | 'wrong';

export interface AnswerResult {
  verdict: AnswerVerdict;
  /** Normalised answer that matched, if any. */
  matched?: string;
  coverage: number;
  missing: string[];
}

/**
 * Compares a free Russian answer with accepted variants.
 * A typo-level difference (one or two characters) still counts as correct,
 * a partial translation with most words present counts as "close".
 */
export function evaluateRussian(input: string, accepted: string[]): AnswerResult {
  const value = normalizeRu(input);
  if (!value) return { verdict: 'wrong', coverage: 0, missing: [] };

  for (const candidate of accepted) {
    const target = normalizeRu(candidate);
    if (!target) continue;
    if (value === target) return { verdict: 'correct', matched: candidate, coverage: 1, missing: [] };
    if (target.length >= 6 && levenshtein(value, target) <= (target.length >= 12 ? 2 : 1)) {
      return { verdict: 'correct', matched: candidate, coverage: 1, missing: [] };
    }
  }

  let best = { candidate: accepted[0] ?? '', coverage: 0 };
  for (const candidate of accepted) {
    const coverage = tokenCoverage(value, candidate);
    if (coverage > best.coverage) best = { candidate, coverage };
  }

  const targetWords = tokens(best.candidate);
  const missing = targetWords.filter((word) => {
    const stem = word.slice(0, Math.max(3, word.length - 2));
    return !tokens(value).some((candidate) => candidate.startsWith(stem));
  });

  if (best.coverage >= 0.6) {
    return { verdict: 'close', matched: best.candidate, coverage: best.coverage, missing };
  }
  return { verdict: 'wrong', matched: best.candidate, coverage: best.coverage, missing };
}

/** Suggests the closest word from a list — used by the writing trainer. */
export function closestWord(input: string, pool: string[]): { word: string; score: number } | null {
  const value = normalizeRu(input);
  if (!value) return null;
  let best: { word: string; score: number } | null = null;
  pool.forEach((word) => {
    const score = similarity(value, word);
    if (!best || score > best.score) best = { word, score };
  });
  return best;
}
