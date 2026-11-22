/**
 * Logic checks for the extended app: dictionary search, answer tolerance,
 * placement scoring, adaptive level, challenges and personal difficulty.
 * Run with: bun scripts/verify-features.ts
 */
import { searchDictionary } from '../src/data/dictionary';
import { sentenceItems } from '../src/data/sentences';
import { placementLevel, placementQuestions, placementTotal } from '../src/data/placement';
import { evaluateRussian, normalizeRu } from '../src/services/normalize';
import { personalDifficulty } from '../src/services/personal';
import { dailyChallenges } from '../src/services/challenges';
import { estimateLevel } from '../src/services/adaptive';
import { newCard, schedule } from '../src/services/srs';
import { chapters, lessons } from '../src/data/course';
import { vocabById } from '../src/data/vocabulary';
import { dictionaryById } from '../src/data/dictionary';
import { achievements, xpLevel } from '../src/store/selectors';
import type { Activity, LessonRecord, Profile, SrsCard } from '../src/store/types';

let failures = 0;

function check(name: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`ok   ${name}`);
  } else {
    failures += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

// ── Dictionary ─────────────────────────────────────────────────────────────
const apteka = searchDictionary('apteka', 10).map((hit) => hit.entry.ru);
check('fuzzy latin search finds апте́ка', apteka.some((ru) => ru.includes('апте')), apteka.join(', '));

const brot = searchDictionary('Brot', 10).map((hit) => hit.entry.ru);
check('german search finds хлеб', brot.includes('хлеб'), brot.join(', '));

const kniga = searchDictionary('книга', 10).map((hit) => hit.entry.ru);
check('search without stress marks finds кни́га', kniga.some((ru) => ru.replace(/\u0301/g, '').includes('книга')), kniga.join(', '));

const partial = searchDictionary('коф', 10).map((hit) => hit.entry.ru);
check('partial search finds words', partial.some((ru) => ru.includes('ко́фе')), partial.join(', '));

// ── Answer tolerance ───────────────────────────────────────────────────────
check('exact answer accepted', evaluateRussian('Я хочу кофе.', ['Я хочу́ ко́фе.']).verdict === 'correct');
check('one-char typo accepted', evaluateRussian('Я хочy кофе', ['Я хочу́ ко́фе.']).verdict === 'correct');
check(
  'alternative sentence accepted',
  evaluateRussian('Вчера я была дома', ['Вчера́ я был до́ма.', 'Вчера́ я была́ до́ма.']).verdict === 'correct',
);
check('wrong answer rejected', evaluateRussian('Я не понимаю', ['Я хочу́ ко́фе.']).verdict === 'wrong');
check(
  'partial answer reported as close',
  evaluateRussian('Я читаю книгу', ['Я чита́ю интере́сную кни́гу.']).verdict !== 'wrong',
);
check('punctuation and ё normalised', normalizeRu('Ещё, пожалуйста!') === 'еще пожалуйста');

// ── Placement ──────────────────────────────────────────────────────────────
const allCorrect: Record<string, number> = {};
placementQuestions.forEach((question) => {
  allCorrect[question.id] = question.answer;
});
check('all correct reaches A2', placementLevel(allCorrect).level === 'A2', placementLevel(allCorrect).level);
check('all correct scores full marks', placementLevel(allCorrect).score === placementTotal);
const allWrong: Record<string, number> = {};
placementQuestions.forEach((question) => {
  allWrong[question.id] = (question.answer + 1) % question.options.length;
});
check('all wrong stays A0', placementLevel(allWrong).level === 'A0', placementLevel(allWrong).level);
check('placement covers five sections', new Set(placementQuestions.map((q) => q.section)).size === 5);

// ── Sentences ──────────────────────────────────────────────────────────────
check('every sentence has a model and explanation', sentenceItems.every((item) => item.ru && item.explanation && item.mistake));
check(
  'sentence alternatives are accepted',
  sentenceItems.every((item) => evaluateRussian(item.ru, [item.ru, ...item.alternatives]).verdict === 'correct'),
);

// ── Personal difficulty ────────────────────────────────────────────────────
check('new word is unmarked', personalDifficulty(undefined) === 'neu');
check('weak ratio is difficult', personalDifficulty({ correct: 1, total: 5, lastAt: '' }) === 'schwer');
check('strong ratio is easy', personalDifficulty({ correct: 9, total: 10, lastAt: '' }) === 'leicht');

// ── Challenges ─────────────────────────────────────────────────────────────
const profile: Profile = {
  name: 'Test',
  nativeLanguage: 'Deutsch',
  goal: 'travel',
  dailyMinutes: 10,
  level: 'A1',
  placementScore: 12,
  createdAt: new Date().toISOString(),
};
const date = new Date(2026, 10, 22);
const empty = { activities: [] as Activity[], cards: {} as Record<string, SrsCard>, challengeClaims: {}, profile };
const first = dailyChallenges(empty, date);
const second = dailyChallenges(empty, date);
check('daily set has four tasks', first.length === 4, String(first.length));
check('daily set is deterministic', first.map((c) => c.id).join() === second.map((c) => c.id).join());
check('daily set changes with the date', first.map((c) => c.id).join() !== dailyChallenges(empty, new Date(2026, 10, 23)).map((c) => c.id).join());

const today = new Date().toISOString();
const withActivity = {
  ...empty,
  activities: [
    { id: 'a1', at: today, kind: 'everyday' as const, label: 'Alltag', minutes: 5, xp: 10, correct: 4, total: 4 },
    { id: 'a2', at: today, kind: 'listening' as const, label: 'Hören', minutes: 6, xp: 5, correct: 3, total: 3 },
  ],
  cards: { v_test: { ...newCard('v_test'), reps: 1, lastReviewedAt: today } },
};
const progressed = dailyChallenges(withActivity, new Date());
check(
  'progress comes from real activities',
  progressed.some((challenge) => challenge.value > 0),
  progressed.map((c) => `${c.id}:${c.value}`).join(' '),
);

// ── Adaptive level ─────────────────────────────────────────────────────────
const strongLessons: Record<string, LessonRecord> = {
  l_a0_1_1: { lessonId: 'l_a0_1_1', completedAt: today, bestScore: 95, attempts: 1, xp: 20 },
  l_a0_1_2: { lessonId: 'l_a0_1_2', completedAt: today, bestScore: 90, attempts: 1, xp: 20 },
};
const estimate = estimateLevel({ profile: { ...profile, level: 'A0' }, lessons: strongLessons, cards: {}, activities: [] });
check('two strong A0 lessons raise the level', estimate.level === 'A1', estimate.level);

const masteredCards: Record<string, SrsCard> = {};
for (let index = 0; index < 60; index += 1) {
  const id = `v_${index}`;
  masteredCards[id] = schedule(newCard(id), id, 'easy');
  masteredCards[id] = schedule(schedule(masteredCards[id], id, 'easy'), id, 'easy');
}
const boosted = estimateLevel({ profile: { ...profile, level: 'A0' }, lessons: {}, cards: masteredCards, activities: [] });
check('60 mastered cards raise the level', boosted.level === 'A1', boosted.level);

// ── Course A2–C1 ───────────────────────────────────────────────────────────
const levels = new Set(chapters.map((chapter) => chapter.level));
check('course covers A0–C1', ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'].every((level) => levels.has(level as never)), [...levels].join(','));
check('course has 20 lessons', lessons.length === 20, String(lessons.length));

const brokenVocab = lessons.flatMap((lesson) => lesson.vocabIds.filter((id) => !vocabById[id]));
check('every lesson word exists', brokenVocab.length === 0, brokenVocab.join(','));

const thinLessons = lessons.filter((lesson) => lesson.exercises.length < 4 || lesson.vocabIds.length < 4);
check('every lesson is complete', thinLessons.length === 0, thinLessons.map((lesson) => lesson.id).join(','));

const advanced = lessons.filter((lesson) => vocabById[lesson.vocabIds[0]]?.level !== 'A0' && vocabById[lesson.vocabIds[0]]?.level !== 'A1');
check('eight A2–C1 lessons exist', advanced.length === 8, String(advanced.length));
check('dictionary includes new course words', Boolean(dictionaryById['v_poezd']) && dictionaryById['v_poezd'].de === 'Zug');

// ── SRS 2.0 ────────────────────────────────────────────────────────────────
const forgotten = newCard('v_poezd');
let leech = forgotten;
for (let index = 0; index < 4; index += 1) leech = schedule(leech, 'v_poezd', 'again');
leech = schedule(leech, 'v_poezd', 'good');
check('forgotten words stay on a short interval', leech.intervalDays <= 14, String(leech.intervalDays));

let healthy = newCard('v_bilet');
const intervals: number[] = [];
for (let index = 0; index < 3; index += 1) {
  healthy = schedule(healthy, 'v_bilet', 'good');
  intervals.push(healthy.intervalDays);
}
check('stable words get growing intervals', intervals[0] < intervals[1] && intervals[1] <= intervals[2], intervals.join(','));

// ── XP and achievements ────────────────────────────────────────────────────
check('XP starts at level 1', xpLevel(0).level === 1);
check('250 XP reach level 2', xpLevel(250).level === 2, String(xpLevel(250).level));
const badges = achievements({ lessons: {}, cards: {}, activities: [], reviewLog: [] });
check('achievements start locked', badges.length === 6 && badges.every((badge) => !badge.earned));
const firstBadge = achievements({
  lessons: { l_a0_1_1: { lessonId: 'l_a0_1_1', completedAt: today, bestScore: 100, attempts: 1, xp: 15 } },
  cards: {},
  activities: [],
  reviewLog: [],
});
check('first lesson unlocks its badge', firstBadge.find((badge) => badge.id === 'first_lesson')?.earned === true);

console.log(`\n${failures === 0 ? 'All feature checks passed.' : `${failures} check(s) failed.`}`);
if (failures > 0) process.exit(1);
