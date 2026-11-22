import { lessons as courseLessons } from '@/data/course';
import { grammarBySlug } from '@/data/grammar';
import type { Level } from '@/data/types';
import { dayKey } from '@/services/format';
import { isMastered } from '@/services/srs';
import type { Activity, LessonRecord, Profile, SrsCard } from '@/store/types';
import { overallAccuracy } from '@/store/selectors';

const ORDER: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

export interface AdaptiveInput {
  profile: Profile | null;
  lessons: Record<string, LessonRecord>;
  cards: Record<string, SrsCard>;
  activities: Activity[];
}

export interface LevelEstimate {
  level: Level;
  declared: Level | null;
  confidence: number;
  reasons: string[];
}

function step(level: Level, offset: number): Level {
  const index = Math.max(0, Math.min(ORDER.length - 1, ORDER.indexOf(level) + offset));
  return ORDER[index];
}

/**
 * Estimates the working level from tested performance, not from the goal.
 * It only moves the onboarding level when there is enough evidence, and it
 * always explains itself so the learner can trust the number.
 */
export function estimateLevel({ profile, lessons, cards, activities }: AdaptiveInput): LevelEstimate {
  const declared = profile?.level ?? null;
  let level: Level = declared ?? 'A0';
  const reasons: string[] = [];

  const completed = Object.values(lessons)
    .map((record) => ({ record, lesson: courseLessons.find((item) => item.id === record.lessonId) }))
    .filter((entry): entry is { record: LessonRecord; lesson: (typeof courseLessons)[number] } => Boolean(entry.lesson));

  const scored = activities.filter((activity) => activity.total > 0);
  const answered = scored.reduce((sum, activity) => sum + activity.total, 0);
  const accuracy = overallAccuracy(activities);
  const mastered = Object.values(cards).filter(isMastered).length;

  const a0 = completed.filter((entry) => entry.lesson.chapterId.startsWith('c_a0'));
  const a1 = completed.filter((entry) => entry.lesson.chapterId.startsWith('c_a1'));
  const avg = (entries: typeof completed) =>
    entries.length === 0 ? 0 : entries.reduce((sum, entry) => sum + entry.record.bestScore, 0) / entries.length / 100;

  if (a0.length >= 2 && avg(a0) >= 0.8 && level === 'A0') {
    level = 'A1';
    reasons.push(`A0-Lektionen im Schnitt ${Math.round(avg(a0) * 100)} % – A1 passt besser.`);
  }
  if (a1.length >= 2 && avg(a1) >= 0.8) {
    level = step(level, 1);
    reasons.push(`A1-Lektionen im Schnitt ${Math.round(avg(a1) * 100)} % – nächstes Niveau empfohlen.`);
  }
  if (answered >= 10 && accuracy < 0.5) {
    const lower = step(level, -1);
    if (lower !== level) {
      level = lower;
      reasons.push(`Trefferquote ${Math.round(accuracy * 100)} % bei ${answered} Antworten – eine Stufe ruhiger.`);
    }
  }
  if (mastered >= 60) {
    const higher = step(level, 1);
    if (higher !== level) {
      level = higher;
      reasons.push(`${mastered} Wörter gefestigt – nächstes Niveau freigeschaltet.`);
    }
  }

  if (reasons.length === 0) {
    reasons.push(
      declared
        ? `Startniveau ${declared} aus dem Einstufungstest, noch zu wenig Daten für eine Anpassung.`
        : 'Noch kein Niveau bestimmt.',
    );
  }

  const confidence = Math.min(1, (answered / 80) * 0.7 + (completed.length / 12) * 0.3);
  return { level, declared, confidence, reasons };
}

export type Difficulty = 'easy' | 'normal' | 'hard';

/** Adjusts exercise difficulty from the last 20 answers. */
export function currentDifficulty(activities: Activity[]): { difficulty: Difficulty; accuracy: number; sample: number } {
  const recent = activities.filter((activity) => activity.total > 0).slice(0, 20);
  const total = recent.reduce((sum, activity) => sum + activity.total, 0);
  const correct = recent.reduce((sum, activity) => sum + activity.correct, 0);
  const accuracy = total === 0 ? 0 : correct / total;
  if (total < 8) return { difficulty: 'normal', accuracy, sample: total };
  if (accuracy >= 0.85) return { difficulty: 'hard', accuracy, sample: total };
  if (accuracy < 0.55) return { difficulty: 'easy', accuracy, sample: total };
  return { difficulty: 'normal', accuracy, sample: total };
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  href: string;
  minutes: number;
  kind: 'review' | 'lesson' | 'grammar' | 'everyday' | 'sentence' | 'listening' | 'story' | 'writing';
}

export interface Gap {
  slug: string;
  title: string;
  accuracy: number;
  total: number;
}

/** Grammar topics with the weakest measured accuracy. */
export function knowledgeGaps(activities: Activity[], limit = 3): Gap[] {
  const buckets = new Map<string, { correct: number; total: number }>();
  activities.forEach((activity) => {
    if (!activity.refId || activity.total === 0) return;
    if (!grammarBySlug[activity.refId]) return;
    const bucket = buckets.get(activity.refId) ?? { correct: 0, total: 0 };
    bucket.correct += activity.correct;
    bucket.total += activity.total;
    buckets.set(activity.refId, bucket);
  });

  return [...buckets.entries()]
    .map(([slug, bucket]) => ({
      slug,
      title: grammarBySlug[slug].title,
      accuracy: bucket.total === 0 ? 0 : bucket.correct / bucket.total,
      total: bucket.total,
    }))
    .filter((gap) => gap.total >= 2 && gap.accuracy < 0.75)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

function todayCount(activities: Activity[], kind: Activity['kind']): number {
  const today = dayKey(new Date());
  return activities.filter((activity) => activity.kind === kind && dayKey(activity.at) === today).length;
}

function weekMinutesFor(activities: Activity[], kind: Activity['kind']): number {
  const now = Date.now();
  return activities
    .filter((activity) => activity.kind === kind && now - new Date(activity.at).getTime() < 7 * 86400000)
    .reduce((sum, activity) => sum + activity.minutes, 0);
}

/**
 * Builds the day's recommendations from real state: due cards, weak answers,
 * unread content and old lessons that were not passed cleanly.
 */
export function recommendations(
  input: AdaptiveInput & { dueCount: number },
  options: { difficulty?: Difficulty } = {},
): Recommendation[] {
  const { lessons, cards, activities, dueCount } = input;
  const items: Recommendation[] = [];
  const weak = Object.values(cards).filter((card) => card.lapses >= 2 || (card.reps === 0 && card.lapses > 0));
  const gaps = knowledgeGaps(activities, 2);

  if (dueCount > 0) {
    items.push({
      id: 'due',
      title: `${dueCount} ${dueCount === 1 ? 'Wort' : 'Wörter'} wiederholen`,
      reason: 'Der Wiederholungsplan ist fällig – jetzt ist der beste Zeitpunkt.',
      href: '/review',
      minutes: Math.min(10, Math.max(3, Math.round(dueCount * 0.6))),
      kind: 'review',
    });
  }

  if (weak.length >= 2) {
    items.push({
      id: 'weak',
      title: 'Schwierige Wörter üben',
      reason: `${weak.length} Wörter wurden mehrfach falsch beantwortet.`,
      href: '/personal?filter=weak',
      minutes: 6,
      kind: 'review',
    });
  }

  const next = courseLessons.find((lesson) => !lessons[lesson.id]);
  if (next) {
    items.push({
      id: `lesson:${next.id}`,
      title: next.title,
      reason: 'Nächste Lektion im Kurs.',
      href: `/lesson/${next.id}`,
      minutes: next.minutes,
      kind: 'lesson',
    });
  }

  gaps.forEach((gap) => {
    items.push({
      id: `gap:${gap.slug}`,
      title: gap.title,
      reason: `Nur ${Math.round(gap.accuracy * 100)} % richtig in ${gap.total} Aufgaben – Lücke schließen.`,
      href: `/grammar/${gap.slug}`,
      minutes: 8,
      kind: 'grammar',
    });
  });

  const staleLesson = Object.values(lessons)
    .filter((record) => record.bestScore < 75)
    .sort((a, b) => a.bestScore - b.bestScore)[0];
  if (staleLesson) {
    const lesson = courseLessons.find((item) => item.id === staleLesson.lessonId);
    if (lesson) {
      items.push({
        id: `redo:${lesson.id}`,
        title: `${lesson.title} wiederholen`,
        reason: `Beste Runde ${staleLesson.bestScore} % – ältere Lektion festigen.`,
        href: `/lesson/${lesson.id}`,
        minutes: lesson.minutes,
        kind: 'lesson',
      });
    }
  }

  if (todayCount(activities, 'everyday') === 0) {
    items.push({
      id: 'everyday',
      title: 'Alltagssituation üben',
      reason: 'Ein Dialog am Tag hält die Sprechroutine.',
      href: '/everyday',
      minutes: 7,
      kind: 'everyday',
    });
  }

  if (weekMinutesFor(activities, 'listening') < 5) {
    items.push({
      id: 'listening',
      title: 'Hörverständnis',
      reason: 'Diese Woche unter 5 Minuten Hören.',
      href: '/listening',
      minutes: 6,
      kind: 'listening',
    });
  }

  if (todayCount(activities, 'sentence') === 0) {
    items.push({
      id: 'sentences',
      title: 'Satztrainer',
      reason: 'Übersetzen zeigt, ob Grammatik wirklich sitzt.',
      href: '/sentences',
      minutes: 6,
      kind: 'sentence',
    });
  }

  if (todayCount(activities, 'story') === 0) {
    items.push({
      id: 'story',
      title: 'Kurze Geschichte lesen',
      reason: 'Lesen mit Satzübersetzung – Wörter antippen genügt.',
      href: '/stories',
      minutes: 8,
      kind: 'story',
    });
  }

  if (todayCount(activities, 'writing') === 0) {
    items.push({
      id: 'writing',
      title: 'Schreibübung',
      reason: 'Aktives Schreiben festigt die kyrillische Form.',
      href: '/writing',
      minutes: 5,
      kind: 'writing',
    });
  }

  const base: Record<Recommendation['kind'], number> = {
    review: 0,
    lesson: 1,
    grammar: 2,
    sentence: 3,
    everyday: 4,
    listening: 5,
    story: 6,
    writing: 7,
  };

  // Measured accuracy changes what comes first, not just how the plan is labelled.
  const priority: Record<Recommendation['kind'], number> =
    options.difficulty === 'easy'
      ? { ...base, review: 0, grammar: 0, lesson: 1, sentence: 6, story: 7, writing: 8 }
      : options.difficulty === 'hard'
        ? { ...base, review: 2, sentence: 3, story: 3, writing: 4, grammar: 4, lesson: 1 }
        : base;

  return items.sort((a, b) => priority[a.kind] - priority[b.kind]).slice(0, 4);
}

export function dailyPlan(items: Recommendation[], minutes: number): { items: Recommendation[]; total: number; left: number } {
  const chosen: Recommendation[] = [];
  let total = 0;
  for (const item of items) {
    if (total + item.minutes > minutes && chosen.length > 0) continue;
    chosen.push(item);
    total += item.minutes;
    if (total >= minutes) break;
  }
  return { items: chosen, total, left: Math.max(0, minutes - total) };
}
