import { Platform } from 'react-native';
import { normalizeAnswer } from '@/services/format';

/**
 * Pronunciation practice.
 * On web the browser's SpeechRecognition API is used (Chrome/Edge, ru-RU).
 * On native devices a recognized transcript is not available without an
 * additional speech-to-text service, so the UI explains the limitation.
 */

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function pronunciationSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function recordingSupported(): boolean {
  return Platform.OS === 'web' && typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
}

/** Starts listening and resolves with the recognised Russian transcript. */
export function listenRussian(timeoutMs = 9000): Promise<string> {
  return new Promise((resolve, reject) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      reject(new Error('Spracherkennung ist auf diesem Gerät nicht verfügbar.'));
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      finish(() => reject(new Error('Es wurde nichts erkannt. Versuche es noch einmal.')));
    }, timeoutMs);

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      finish(() => resolve(transcript));
    };
    recognition.onerror = (event) => {
      finish(() => reject(new Error(mapRecognitionError(event.error))));
    };
    recognition.onend = () => {
      finish(() => reject(new Error('Aufnahme beendet, ohne dass etwas erkannt wurde.')));
    };

    try {
      recognition.start();
    } catch {
      finish(() => reject(new Error('Mikrofon konnte nicht gestartet werden.')));
    }
  });
}

function mapRecognitionError(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Kein Mikrofonzugriff. Erlaube das Mikrofon im Browser.';
    case 'no-speech':
      return 'Nichts gehört. Sprich etwas lauter und näher am Mikrofon.';
    case 'network':
      return 'Die Spracherkennung braucht eine Internetverbindung.';
    case 'audio-capture':
      return 'Kein Mikrofon gefunden.';
    default:
      return 'Spracherkennung fehlgeschlagen. Versuche es erneut.';
  }
}

export interface PronunciationScore {
  score: number;
  matched: string[];
  missed: string[];
  extra: string[];
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

function closeEnough(a: string, b: string): boolean {
  if (a === b) return true;
  const distance = levenshtein(a, b);
  const tolerance = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
  return distance <= tolerance;
}

/** Word-level comparison of the target sentence and the recognised transcript. */
export function scorePronunciation(target: string, heard: string): PronunciationScore {
  const targetWords = normalizeAnswer(target).split(' ').filter(Boolean);
  const heardWords = normalizeAnswer(heard).split(' ').filter(Boolean);

  const matched: string[] = [];
  const missed: string[] = [];
  const remaining = [...heardWords];

  targetWords.forEach((word) => {
    const index = remaining.findIndex((candidate) => closeEnough(word, candidate));
    if (index >= 0) {
      matched.push(word);
      remaining.splice(index, 1);
    } else {
      missed.push(word);
    }
  });

  const extra = remaining;
  const score = targetWords.length === 0 ? 0 : Math.round((matched.length / Math.max(targetWords.length, heardWords.length)) * 100);

  return { score, matched, missed, extra };
}

export function scoreFeedback(score: number): { label: string; hint: string } {
  if (score >= 90) return { label: 'Ausgezeichnet', hint: 'Betonung und Laute sitzen.' };
  if (score >= 75) return { label: 'Gut', hint: 'Noch einmal langsam sprechen, dann klappt es perfekt.' };
  if (score >= 50) return { label: 'Fast', hint: 'Achte auf die markierten Wörter.' };
  return { label: 'Nochmal', hint: 'Höre dir das Modell an und sprich in kurzen Abschnitten nach.' };
}
