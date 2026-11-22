/** Content model — shared by seed data, the course engine and the UI. */

export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'pronoun'
  | 'numeral'
  | 'preposition'
  | 'conjunction';

export type Gender = 'm' | 'f' | 'n';

export interface Example {
  ru: string;
  de: string;
  note?: string;
}

export interface Vocab {
  id: string;
  ru: string;
  de: string;
  /** Latin transcription with stress mark, e.g. "kníga" */
  transcription: string;
  type: WordType;
  level: Level;
  gender?: Gender;
  /** Grammar hints: plural, aspect partner, case government, conjugation … */
  grammar?: string;
  example: Example;
  tags?: string[];
}

export type Exercise =
  | {
      kind: 'choice';
      id: string;
      prompt: string;
      /** Russian stimulus shown large above the prompt (optional). */
      stimulus?: string;
      options: string[];
      answer: number;
      explain?: string;
    }
  | {
      kind: 'translate';
      id: string;
      direction: 'ru-de' | 'de-ru';
      prompt: string;
      /** All accepted answers (normalized comparison). */
      answers: string[];
      hint?: string;
      explain?: string;
    }
  | {
      kind: 'type';
      id: string;
      prompt: string;
      hint?: string;
      answers: string[];
      explain?: string;
    }
  | {
      kind: 'cloze';
      id: string;
      /** Sentence with ___ marking the gap. */
      sentence: string;
      translation?: string;
      answers: string[];
      options?: string[];
      explain?: string;
    }
  | {
      kind: 'match';
      id: string;
      prompt: string;
      pairs: { left: string; right: string }[];
      explain?: string;
    }
  | {
      kind: 'order';
      id: string;
      prompt: string;
      /** Shuffled at runtime; answer is the correct full sentence. */
      words: string[];
      answer: string;
      translation?: string;
      explain?: string;
    }
  | {
      kind: 'listen';
      id: string;
      /** Text spoken via TTS; hidden behind the audio button. */
      audio: string;
      question: string;
      options: string[];
      answer: number;
      explain?: string;
    }
  | {
      kind: 'speak';
      id: string;
      target: string;
      translation: string;
    };

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  subtitle: string;
  minutes: number;
  xp: number;
  vocabIds: string[];
  grammarSlugs?: string[];
  exercises: Exercise[];
}

export interface Chapter {
  id: string;
  level: Level;
  title: string;
  subtitle: string;
  /** Short label for the map node. */
  glyph: string;
}

export interface GrammarSection {
  heading: string;
  body: string;
  table?: { head: string[]; rows: string[][] };
  examples?: Example[];
}

export interface GrammarTopic {
  slug: string;
  level: Level;
  title: string;
  summary: string;
  minutes: number;
  sections: GrammarSection[];
  exercises: Exercise[];
}

export interface ListeningLine {
  speaker?: string;
  ru: string;
  de: string;
}

export interface ListeningItem {
  id: string;
  level: Level;
  kind: 'dialogue' | 'story';
  title: string;
  summary: string;
  minutes: number;
  lines: ListeningLine[];
  questions: { question: string; options: string[]; answer: number }[];
}

export interface Scenario {
  id: string;
  title: string;
  glyph: string;
  level: Level;
  goal: string;
  /** Opening line the tutor says first. */
  opening: { ru: string; de: string };
  keyPhrases: { ru: string; de: string }[];
}

export interface AlphabetLetter {
  /** Uppercase glyph. */
  upper: string;
  lower: string;
  /** Letter name in German, e.g. "a". */
  name: string;
  transcription: string;
  /** How it sounds in a word — German approximation. */
  sound: string;
  example: { ru: string; de: string };
  /** true for letters that look like Latin but sound different. */
  falseFriend?: boolean;
  type: 'vowel' | 'consonant' | 'sign';
}
