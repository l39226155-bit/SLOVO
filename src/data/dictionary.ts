import type { Example, Gender, Level, Vocab, WordType } from '@/data/types';
import { vocabulary } from '@/data/vocabulary';
import { normalizeDe, normalizeRu, similarity, stripStress } from '@/services/normalize';

export interface DictForm {
  label: string;
  value: string;
}

export interface DictionaryEntry {
  id: string;
  ru: string;
  de: string;
  transcription: string;
  type: WordType;
  level: Level;
  gender?: Gender;
  grammar?: string;
  example: Example;
  forms: DictForm[];
  tags?: string[];
  source: 'course' | 'extra';
}

/**
 * Grammar hints from the course are turned into structured forms, so a
 * dictionary entry can show "Plural: дома́" instead of a raw hint string.
 */
function formsFromGrammar(grammar?: string): DictForm[] {
  if (!grammar) return [];
  return grammar
    .split(/;|·/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (/^pl\./i.test(part)) {
        return { label: 'Plural', value: part.replace(/^pl\.\s*/i, '').trim() };
      }
      if (part.includes('→')) {
        return { label: 'Formen', value: part.split('→').slice(1).join('→').trim() };
      }
      if (part.includes('/')) {
        return { label: 'Formen', value: part };
      }
      return { label: 'Form', value: part };
    })
    .filter((form) => form.value.length > 0);
}

const extraWords: Omit<DictionaryEntry, 'source'>[] = [
  {
    id: 'd_bilet',
    ru: 'биле́т',
    de: 'Fahrkarte, Ticket',
    transcription: 'bilét',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. биле́ты; Akk. Sg. биле́т',
    example: { ru: 'Оди́н биле́т до Москвы́, пожа́луйста.', de: 'Eine Fahrkarte nach Moskau, bitte.' },
    forms: [
      { label: 'Plural', value: 'биле́ты' },
      { label: 'Genitiv', value: 'биле́та' },
    ],
  },
  {
    id: 'd_poezd',
    ru: 'по́езд',
    de: 'Zug',
    transcription: 'pójest',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. поезда́; Präp. в по́езде',
    example: { ru: 'По́езд отхо́дит в семь.', de: 'Der Zug fährt um sieben ab.' },
    forms: [
      { label: 'Plural', value: 'поезда́' },
      { label: 'Präpositional', value: 'в по́езде' },
    ],
  },
  {
    id: 'd_vokzal',
    ru: 'вокза́л',
    de: 'Bahnhof',
    transcription: 'vakzál',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. вокза́лы; к вокза́лу',
    example: { ru: 'Оте́ль недалеко́ от вокза́ла.', de: 'Das Hotel ist nicht weit vom Bahnhof.' },
    forms: [
      { label: 'Plural', value: 'вокза́лы' },
      { label: 'Dativ', value: 'к вокза́лу' },
      { label: 'Genitiv', value: 'от вокза́ла' },
    ],
  },
  {
    id: 'd_rabota',
    ru: 'рабо́та',
    de: 'Arbeit',
    transcription: 'rabóta',
    type: 'noun',
    level: 'A1',
    gender: 'f',
    grammar: 'Pl. рабо́ты; на рабо́те',
    example: { ru: 'Я иду́ на рабо́ту.', de: 'Ich gehe zur Arbeit.' },
    forms: [
      { label: 'Plural', value: 'рабо́ты' },
      { label: 'Akkusativ', value: 'на рабо́ту' },
      { label: 'Präpositional', value: 'на рабо́те' },
    ],
  },
  {
    id: 'd_hleb',
    ru: 'хлеб',
    de: 'Brot',
    transcription: 'chleb',
    type: 'noun',
    level: 'A0',
    gender: 'm',
    grammar: 'Pl. хле́бы; kein Plural im Alltag',
    example: { ru: 'Да́йте, пожа́луйста, хлеб.', de: 'Geben Sie mir bitte das Brot.' },
    forms: [
      { label: 'Genitiv', value: 'хле́ба' },
      { label: 'Plural', value: 'хле́бы' },
    ],
  },
  {
    id: 'd_park',
    ru: 'парк',
    de: 'Park',
    transcription: 'park',
    type: 'noun',
    level: 'A0',
    gender: 'm',
    grammar: 'Pl. па́рки; в па́рке',
    example: { ru: 'В суббо́ту мы гуля́ем в па́рке.', de: 'Am Samstag spazieren wir im Park.' },
    forms: [
      { label: 'Plural', value: 'па́рки' },
      { label: 'Präpositional', value: 'в па́рке' },
    ],
  },
  {
    id: 'd_urok',
    ru: 'уро́к',
    de: 'Unterrichtsstunde',
    transcription: 'urók',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. уро́ки; на уро́ке',
    example: { ru: 'У нас три уро́ка в день.', de: 'Wir haben drei Unterrichtsstunden am Tag.' },
    forms: [
      { label: 'Plural', value: 'уро́ки' },
      { label: 'Präpositional', value: 'на уро́ке' },
    ],
  },
  {
    id: 'd_ekzamen',
    ru: 'экза́мен',
    de: 'Prüfung',
    transcription: 'ekzámen',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. экза́мены; сдать экза́мен',
    example: { ru: 'Когда́ у тебя́ экза́мен?', de: 'Wann hast du die Prüfung?' },
    forms: [
      { label: 'Plural', value: 'экза́мены' },
      { label: 'Kollokation', value: 'сдать экза́мен (Prüfung bestehen)' },
    ],
  },
  {
    id: 'd_vopros',
    ru: 'вопро́с',
    de: 'Frage',
    transcription: 'vaprós',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. вопро́сы; зада́ть вопро́с',
    example: { ru: 'Мо́жно вопро́с?', de: 'Darf ich eine Frage stellen?' },
    forms: [
      { label: 'Plural', value: 'вопро́сы' },
      { label: 'Kollokation', value: 'зада́ть вопро́с' },
    ],
  },
  {
    id: 'd_otvet',
    ru: 'отве́т',
    de: 'Antwort',
    transcription: 'atvét',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. отве́ты',
    example: { ru: 'Спаси́бо за отве́т.', de: 'Danke für die Antwort.' },
    forms: [
      { label: 'Plural', value: 'отве́ты' },
      { label: 'Genitiv', value: 'отве́та' },
    ],
  },
  {
    id: 'd_oshibka',
    ru: 'оши́бка',
    de: 'Fehler',
    transcription: 'ašíbka',
    type: 'noun',
    level: 'A1',
    gender: 'f',
    grammar: 'Pl. оши́бки; де́лать оши́бки',
    example: { ru: 'Я ещё де́лаю оши́бки.', de: 'Ich mache noch Fehler.' },
    forms: [
      { label: 'Plural', value: 'оши́бки' },
      { label: 'Kollokation', value: 'де́лать оши́бки' },
    ],
  },
  {
    id: 'd_pravilo',
    ru: 'пра́вило',
    de: 'Regel',
    transcription: 'právila',
    type: 'noun',
    level: 'A1',
    gender: 'n',
    grammar: 'Pl. пра́вила',
    example: { ru: 'Э́то про́стое пра́вило.', de: 'Das ist eine einfache Regel.' },
    forms: [{ label: 'Plural', value: 'пра́вила' }],
  },
  {
    id: 'd_slovo',
    ru: 'сло́во',
    de: 'Wort',
    transcription: 'slóva',
    type: 'noun',
    level: 'A0',
    gender: 'n',
    grammar: 'Pl. слова́',
    example: { ru: 'Я не зна́ю э́то сло́во.', de: 'Ich kenne dieses Wort nicht.' },
    forms: [
      { label: 'Plural', value: 'слова́' },
      { label: 'Genitiv Pl.', value: 'слов' },
    ],
  },
  {
    id: 'd_perevod',
    ru: 'перево́д',
    de: 'Übersetzung',
    transcription: 'perevód',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. перево́ды',
    example: { ru: 'Э́тот перево́д пра́вильный.', de: 'Diese Übersetzung ist richtig.' },
    forms: [{ label: 'Plural', value: 'перево́ды' }],
  },
  {
    id: 'd_rasskaz',
    ru: 'расска́з',
    de: 'Erzählung, Geschichte',
    transcription: 'rasskás',
    type: 'noun',
    level: 'A1',
    gender: 'm',
    grammar: 'Pl. расска́зы',
    example: { ru: 'Он чита́ет коро́ткий расска́з.', de: 'Er liest eine kurze Erzählung.' },
    forms: [{ label: 'Plural', value: 'расска́зы' }],
  },
];

function fromVocab(entry: Vocab): DictionaryEntry {
  return {
    id: entry.id,
    ru: entry.ru,
    de: entry.de,
    transcription: entry.transcription,
    type: entry.type,
    level: entry.level,
    gender: entry.gender,
    grammar: entry.grammar,
    example: entry.example,
    forms: formsFromGrammar(entry.grammar),
    tags: entry.tags,
    source: 'course',
  };
}

export const dictionaryEntries: DictionaryEntry[] = [
  ...vocabulary.map(fromVocab),
  ...extraWords.map((entry) => ({ ...entry, source: 'extra' as const })),
];

export const dictionaryById: Record<string, DictionaryEntry> = Object.fromEntries(
  dictionaryEntries.map((entry) => [entry.id, entry]),
);

const index = dictionaryEntries.map((entry) => ({
  entry,
  ru: normalizeRu(entry.ru),
  de: normalizeDe(entry.de),
  tr: stripStress(entry.transcription).toLowerCase(),
}));

export interface DictionaryHit {
  entry: DictionaryEntry;
  score: number;
  via: 'ru' | 'de' | 'transcription';
}

export const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: 'Substantiv',
  verb: 'Verb',
  adjective: 'Adjektiv',
  adverb: 'Adverb',
  phrase: 'Wendung',
  pronoun: 'Pronomen',
  numeral: 'Zahlwort',
  preposition: 'Präposition',
  conjunction: 'Konjunktion',
};

export const GENDER_LABELS: Record<Gender, string> = {
  m: 'maskulin',
  f: 'feminin',
  n: 'neutrum',
};

/**
 * Ranked search: exact hits first, then prefixes, then infix matches, then
 * transcription and finally fuzzy matches for typos ("apteka" finds апте́ка).
 */
export function searchDictionary(rawQuery: string, limit = 40): DictionaryHit[] {
  const queryRu = normalizeRu(rawQuery);
  const queryDe = normalizeDe(rawQuery);
  if (queryRu.length < 2 && queryDe.length < 2) return [];

  const hits: DictionaryHit[] = [];

  index.forEach((item) => {
    let best = 0;
    let via: DictionaryHit['via'] = 'ru';

    if (queryRu) {
      if (item.ru === queryRu) best = Math.max(best, 120);
      else if (item.ru.startsWith(queryRu)) best = Math.max(best, 90);
      else if (item.ru.includes(queryRu)) best = Math.max(best, 70);
      else {
        const fuzzy = similarity(queryRu, item.ru);
        if (fuzzy >= 0.7) best = Math.max(best, Math.round(fuzzy * 55));
      }

      const ruWords = item.ru.split(' ');
      if (ruWords.slice(1).some((word) => word.startsWith(queryRu))) best = Math.max(best, 60);
    }

    if (queryDe.length >= 2) {
      if (item.de === queryDe) best = Math.max(best, 110);
      else if (item.de.startsWith(queryDe)) best = Math.max(best, 85);
      else if (item.de.split(/[,/;]/).some((part) => part.trim().startsWith(queryDe))) best = Math.max(best, 84);
      else if (item.de.includes(queryDe)) best = Math.max(best, 65);
      else {
        const fuzzy = similarity(queryDe, item.de);
        if (fuzzy >= 0.75) best = Math.max(best, Math.round(fuzzy * 50));
      }
      if (best > 0) via = 'de';
    }

    if (queryRu.length >= 3 && item.tr.startsWith(queryDe || queryRu)) {
      if (best < 75) {
        best = 75;
        via = 'transcription';
      }
    } else if (queryRu.length >= 4 && item.tr.includes(queryRu)) {
      best = Math.max(best, 45);
      via = 'transcription';
    }

    if (best > 0) hits.push({ entry: item.entry, score: best, via });
  });

  return hits.sort((a, b) => b.score - a.score || a.entry.ru.localeCompare(b.entry.ru)).slice(0, limit);
}

/** Resolves a single word from a story text (strips punctuation). */
export function lookupWord(raw: string): DictionaryEntry | undefined {
  const word = normalizeRu(raw);
  if (!word) return undefined;
  const exact = index.find((item) => item.ru === word || item.ru.split(' ')[0] === word);
  if (exact) return exact.entry;
  const stem = word.slice(0, Math.max(4, word.length - 2));
  return index.find((item) => item.ru.startsWith(stem) || item.ru.includes(word))?.entry;
}

export function wordsByLevel(level: Level): DictionaryEntry[] {
  return dictionaryEntries.filter((entry) => entry.level === level);
}
