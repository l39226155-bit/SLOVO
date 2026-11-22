import type { Level } from '@/data/types';

export type PlacementSection = 'vocab' | 'grammar' | 'reading' | 'sentence' | 'listening';

export interface PlacementQuestion {
  id: string;
  section: PlacementSection;
  level: Level;
  prompt: string;
  options: string[];
  answer: number;
  /** Shown only for the listening section — spoken, not displayed. */
  audio?: string;
  explain?: string;
}

export const placementSections: { id: PlacementSection; label: string; hint: string }[] = [
  { id: 'vocab', label: 'Wortschatz', hint: 'Bedeutung erkennen' },
  { id: 'grammar', label: 'Grammatik', hint: 'Formen und Fälle' },
  { id: 'reading', label: 'Lesen', hint: 'Einen kurzen Text verstehen' },
  { id: 'sentence', label: 'Satzbau', hint: 'Die richtige Übersetzung' },
  { id: 'listening', label: 'Hören', hint: 'Gesprochenes verstehen' },
];

export const placementPassage = {
  title: 'Письмо́ от Мари́ны',
  ru:
    'Приве́т! Меня́ зову́т Мари́на. Я живу́ в Каза́ни и рабо́таю в библиоте́ке. У́тром я е́зжу на рабо́ту на авто́бусе, ве́чером гуля́ю с соба́кой. В выходны́е мы с друзья́ми игра́ем в во́лейбол. Ру́сский язы́к я учу́ два го́да, но ещё де́лаю оши́бки. Ле́том я хочу́ пое́хать в Герма́нию.',
  de:
    'Hallo! Ich heiße Marina. Ich wohne in Kasan und arbeite in einer Bibliothek. Morgens fahre ich mit dem Bus zur Arbeit, abends gehe ich mit dem Hund spazieren. Am Wochenende spiele ich mit Freunden Volleyball. Russisch lerne ich seit zwei Jahren, mache aber noch Fehler. Im Sommer möchte ich nach Deutschland fahren.',
};

export const placementQuestions: PlacementQuestion[] = [
  // Wortschatz
  { id: 'pv1', section: 'vocab', level: 'A0', prompt: 'Was bedeutet „кни́га“?', options: ['Buch', 'Tisch', 'Fenster', 'Straße'], answer: 0 },
  { id: 'pv2', section: 'vocab', level: 'A0', prompt: 'Was bedeutet „вчера́“?', options: ['gestern', 'morgen', 'heute', 'immer'], answer: 0 },
  { id: 'pv3', section: 'vocab', level: 'A1', prompt: 'Was bedeutet „де́шевый“?', options: ['billig', 'teuer', 'schnell', 'lecker'], answer: 0 },
  { id: 'pv4', section: 'vocab', level: 'A1', prompt: 'Was bedeutet „за́втрак“?', options: ['Frühstück', 'Abendessen', 'Mittagspause', 'Rechnung'], answer: 0 },
  { id: 'pv5', section: 'vocab', level: 'A1', prompt: 'Was bedeutet „пое́здка“?', options: ['Reise', 'Zug', 'Fahrkarte', 'Bahnhof'], answer: 0 },

  // Grammatik
  { id: 'pg1', section: 'grammar', level: 'A0', prompt: '«Я ___ по-ру́сски.»', options: ['говорю́', 'говори́шь', 'говори́т', 'говори́м'], answer: 0, explain: '1. Person Singular von говори́ть.' },
  { id: 'pg2', section: 'grammar', level: 'A0', prompt: '«Э́то ___ кни́га.»', options: ['моя́', 'мой', 'моё', 'мои́'], answer: 0, explain: 'кни́га ist feminin.' },
  { id: 'pg3', section: 'grammar', level: 'A1', prompt: '«Я чита́ю ___ (кни́га).»', options: ['кни́гу', 'кни́га', 'кни́ге', 'кни́ги'], answer: 0, explain: 'Direktes Objekt: Akkusativ feminin.' },
  { id: 'pg4', section: 'grammar', level: 'A1', prompt: '«Он живёт ___ Москве́.»', options: ['в', 'на', 'из', 'к'], answer: 0, explain: 'Ort: в + Präpositional.' },
  { id: 'pg5', section: 'grammar', level: 'A1', prompt: '«Вчера́ она́ ___ до́ма.»', options: ['была́', 'был', 'бы́ло', 'бы́ли'], answer: 0, explain: 'она́ verlangt die feminine Form была́.' },

  // Lesen
  { id: 'pr1', section: 'reading', level: 'A1', prompt: 'Wo wohnt Marina?', options: ['In Kasan', 'In Moskau', 'In Berlin', 'In Petersburg'], answer: 0 },
  { id: 'pr2', section: 'reading', level: 'A1', prompt: 'Wie fährt sie zur Arbeit?', options: ['Mit dem Bus', 'Mit der U-Bahn', 'Zu Fuß', 'Mit dem Auto'], answer: 0 },
  { id: 'pr3', section: 'reading', level: 'A1', prompt: 'Was macht sie am Wochenende?', options: ['Volleyball spielen', 'Im Büro arbeiten', 'Mit dem Hund gehen', 'Deutsch lernen'], answer: 0 },
  { id: 'pr4', section: 'reading', level: 'A1', prompt: 'Wie lange lernt sie schon Russisch?', options: ['Zwei Jahre', 'Ein Jahr', 'Drei Monate', 'Seit der Schule'], answer: 0 },

  // Satzbau
  {
    id: 'ps1',
    section: 'sentence',
    level: 'A0',
    prompt: 'Welche Übersetzung ist richtig für „Ich möchte einen Kaffee“?',
    options: ['Я хочу́ ко́фе.', 'Я хочу́ ко́фе нет.', 'Я хочу́ть ко́фе.', 'Меня́ хочу́ ко́фе.'],
    answer: 0,
  },
  {
    id: 'ps2',
    section: 'sentence',
    level: 'A1',
    prompt: 'Welche Übersetzung ist richtig für „Gestern war ich im Kino“?',
    options: ['Вчера́ я был в кино́.', 'Вчера́ я есть в кино́.', 'Вчера́ я бу́ду в кино́.', 'Вчера́ меня́ в кино́.'],
    answer: 0,
    explain: 'Für die Vergangenheit steht был/была́.',
  },
  {
    id: 'ps3',
    section: 'sentence',
    level: 'A1',
    prompt: 'Welche Übersetzung ist richtig für „Ich habe kein Geld“?',
    options: ['У меня́ нет де́нег.', 'У меня́ не де́ньги.', 'Я нет де́ньги.', 'Мне нет де́ньги.'],
    answer: 0,
    explain: 'нет + Genitiv.',
  },

  // Hören
  { id: 'pl1', section: 'listening', level: 'A0', prompt: 'Was hörst du?', audio: 'До́брый день! Ско́лько сто́ит биле́т?', options: ['Nach dem Preis fragen', 'Nach dem Weg fragen', 'Bezahlen', 'Bestellen'], answer: 0 },
  { id: 'pl2', section: 'listening', level: 'A1', prompt: 'Was möchte die Person?', audio: 'Я хочу́ заброни́ровать но́мер на три но́чи.', options: ['Ein Zimmer für drei Nächte', 'Ein Zugticket', 'Einen Tisch im Restaurant', 'Ein Buch'], answer: 0 },
  { id: 'pl3', section: 'listening', level: 'A1', prompt: 'Wann fährt der Zug?', audio: 'По́езд отхо́дит в семь ве́чера.', options: ['Um sieben Uhr abends', 'Um sieben Uhr morgens', 'Um neun Uhr abends', 'Um zehn Uhr'], answer: 0 },
];

export const placementTotal = placementQuestions.length;

/**
 * Level from the placement test: a level counts as reached when at least 70 %
 * of its own questions are correct. The highest reached level wins.
 */
export function placementLevel(answers: Record<string, number>): {
  level: Level;
  score: number;
  perLevel: { level: Level; correct: number; total: number }[];
  recommendation: string;
} {
  const levels: Level[] = ['A0', 'A1', 'A2'];
  const perLevel = levels.map((level) => {
    const questions = placementQuestions.filter((question) => question.level === level);
    const correct = questions.filter((question) => answers[question.id] === question.answer).length;
    return { level, correct, total: questions.length };
  });

  const score = placementQuestions.filter((question) => answers[question.id] === question.answer).length;
  const reached: Level = perLevel.reduce<Level>(
    (current, entry) => (entry.total > 0 && entry.correct / entry.total >= 0.7 ? entry.level : current),
    'A0',
  );

  // Almost perfect answers show that A1 is mastered, not the ceiling.
  const level: Level = reached === 'A1' && score / placementTotal >= 0.9 ? 'A2' : reached;

  const recommendation =
    level === 'A0'
      ? 'Starte mit Kapitel 1 und dem Alphabet. Das ist keine Schwäche – Kyrillisch braucht zwei Wochen.'
      : level === 'A1'
        ? 'Starte mit dem A1-Kapitel „Мой день“. Die A0-Grundlagen kannst du überspringen, Wiederholungen bleiben verfügbar.'
        : 'Dein Test reicht über A1 hinaus. Der A1-Kurs ist eine kurze Auffrischung, danach folgen die vorbereiteten A2-Strukturen.';

  return { level, score, perLevel, recommendation };
}
