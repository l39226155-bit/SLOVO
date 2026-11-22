import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { create } from 'zustand';
import { useAppStore } from '@/store/useAppStore';

/**
 * Central text-to-speech manager.
 *
 * - Exactly one utterance at a time; a new one stops the previous one.
 * - Each playback owns a token, callbacks from older utterances are ignored.
 * - iOS and web support real pause/resume. Android has no pause in expo-speech,
 *   so pausing stops the voice and resuming restarts the current text.
 * - The Russian voice is resolved once, preferring an "Enhanced" voice, so Russian
 *   is never read with a German voice.
 * - Synthesis happens on the device; there is no network audio to cache.
 */

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface AudioState {
  status: AudioStatus;
  activeKey: string | null;
  activeText: string | null;
  error: string | null;
  voiceLabel: string | null;
  /** null = not resolved yet. */
  voiceAvailable: boolean | null;
}

export const useAudioStore = create<AudioState>(() => ({
  status: 'idle',
  activeKey: null,
  activeText: null,
  error: null,
  voiceLabel: null,
  voiceAvailable: null,
}));

const MAX_LENGTH = 600;
let token = 0;
/** Lines of a listening sequence that still need to be spoken. */
let queue: AudioRequest[] = [];
type ResolvedVoice = { identifier?: string; label: string; available: boolean };
const voiceCache = new Map<string, ResolvedVoice>();

export interface AudioRequest {
  /** Stable id so each button knows whether it owns the current playback. */
  key: string;
  text: string;
  lang?: 'ru-RU' | 'de-DE';
  rate?: number;
}

function set(state: Partial<AudioState>) {
  useAudioStore.setState(state);
}

/** Text as it should be spoken: no stress marks, no German glosses. */
export function speechText(text: string, lang: 'ru-RU' | 'de-DE'): string {
  let value = text.replace(/\[[^\]]*\]/g, ' ').replace(/\([^)]*\)/g, ' ');

  if (lang === 'ru-RU') {
    value = value.replace(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß'’-]*/g, ' ');
  }

  return value
    .normalize('NFC')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[«»"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_LENGTH);
}

async function resolveVoice(lang: 'ru-RU' | 'de-DE'): Promise<ResolvedVoice> {
  const cached = voiceCache.get(lang);
  if (cached) return cached;

  const fallback: ResolvedVoice = { identifier: undefined, label: lang, available: false };
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const prefix = lang.slice(0, 2).toLowerCase();
    const matches = voices.filter((voice) => voice.language?.toLowerCase().startsWith(prefix));
    if (matches.length === 0) {
      // An empty list just means the platform has not loaded its voices yet, so
      // only an authoritative non-empty list can prove the voice is missing.
      if (voices.length > 0) {
        if (lang === 'ru-RU') set({ voiceLabel: null, voiceAvailable: false });
        // On the web the list changes after installing a voice; recheck there.
        if (Platform.OS !== 'web') voiceCache.set(lang, fallback);
      }
      return fallback;
    }

    const enhanced = matches.find((voice) => String(voice.quality) === 'Enhanced');
    const chosen = enhanced ?? matches[0];
    const resolved: ResolvedVoice = {
      identifier: chosen.identifier,
      label: `${chosen.name} · ${chosen.language}`,
      available: true,
    };
    voiceCache.set(lang, resolved);
    // Only the Russian voice is shown in the UI; German must never mask it.
    if (lang === 'ru-RU') set({ voiceLabel: resolved.label, voiceAvailable: true });
    return resolved;
  } catch {
    voiceCache.set(lang, fallback);
    return fallback;
  }
}

function humanizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (/voice|language|not (found|installed)/i.test(message)) {
    return 'Für Russisch ist keine Stimme installiert. Installiere eine unter Einstellungen → Bedienungshilfen → Gesprochene Inhalte.';
  }
  if (/audio|session|busy/i.test(message)) {
    return 'Audio konnte nicht gestartet werden. Prüfe die Lautstärke und versuche es erneut.';
  }
  return 'Die Aussprache konnte nicht abgespielt werden.';
}

function speak(myToken: number, request: AudioRequest) {
  const lang = request.lang ?? 'ru-RU';
  const clean = speechText(request.text, lang);

  if (!clean) {
    set({
      status: 'error',
      error: 'Für diesen Eintrag gibt es keinen russischen Text zum Vorlesen.',
      activeKey: request.key,
      activeText: null,
    });
    return;
  }

  const configured = useAppStore.getState().settings.speechRate;
  const rate = Math.min(1.2, Math.max(0.5, request.rate ?? configured));

  void (async () => {
    try {
      const voice = await resolveVoice(lang);
      if (myToken !== token) return;

      if (!voice.available && Platform.OS === 'web') {
        set({
          status: 'error',
          error: 'Für Russisch ist in diesem Browser keine Stimme verfügbar. Installiere eine russische Stimme im Betriebssystem.',
        });
        return;
      }

      Speech.speak(clean, {
        language: lang,
        rate,
        pitch: 1,
        voice: voice.identifier,
        useApplicationAudioSession: false,
        onStart: () => {
          if (myToken === token) set({ status: 'playing' });
        },
        onDone: () => {
          if (myToken !== token) return;
          const next = queue.shift();
          if (next) {
            set({ status: 'playing', activeKey: next.key, activeText: next.text });
            speak(myToken, next);
            return;
          }
          set({ status: 'idle', activeKey: null, activeText: null });
        },
        onStopped: () => {
          if (myToken !== token) return;
          // Pausing on Android stops the utterance; keep the paused state visible.
          if (useAudioStore.getState().status === 'paused') return;
          set({ status: 'idle', activeKey: null, activeText: null });
        },
        onError: (error: Error) => {
          if (myToken !== token) return;
          set({ status: 'error', error: humanizeError(error) });
        },
      });

      // Native voices sometimes skip onStart; on web onStart is reliable, so a
      // stuck loading state there means nothing is actually being spoken.
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          if (myToken === token && useAudioStore.getState().status === 'loading') set({ status: 'playing' });
        }, 500);
      } else {
        setTimeout(() => {
          if (myToken !== token) return;
          if (useAudioStore.getState().status !== 'loading') return;
          set({ status: 'error', error: 'Die Wiedergabe wurde vom Browser blockiert. Tippe erneut auf den Lautsprecher.' });
        }, 1800);
      }
    } catch (error) {
      if (myToken !== token) return;
      set({ status: 'error', error: humanizeError(error) });
    }
  })();
}

function startPlayback(request: AudioRequest, keepQueue: boolean) {
  const myToken = ++token;
  if (!keepQueue) queue = [];
  set({ status: 'loading', activeKey: request.key, activeText: request.text, error: null });

  void (async () => {
    try {
      await Speech.stop();
    } catch {
      /* nothing was playing */
    }
    if (myToken !== token) return;
    speak(myToken, request);
  })();
}

export function playAudio(request: AudioRequest) {
  startPlayback(request, false);
}

/** Stops playback. Keeps an existing error message unless `clearError` is set. */
export async function stopAudio(clearError = true) {
  token += 1;
  queue = [];
  try {
    await Speech.stop();
  } catch {
    /* nothing playing */
  }
  set({
    status: 'idle',
    activeKey: null,
    activeText: null,
    ...(clearError ? { error: null } : {}),
  });
}

export async function pauseAudio() {
  if (useAudioStore.getState().status !== 'playing') return;

  if (Platform.OS === 'android') {
    set({ status: 'paused' });
    try {
      await Speech.stop();
    } catch {
      /* ignore */
    }
    return;
  }

  try {
    await Speech.pause();
    set({ status: 'paused' });
  } catch (error) {
    set({ status: 'error', error: humanizeError(error) });
  }
}

export async function resumeAudio() {
  const { status, activeKey, activeText } = useAudioStore.getState();
  if (status !== 'paused' || !activeKey || !activeText) return;

  if (Platform.OS === 'android') {
    playAudio({ key: activeKey, text: activeText });
    return;
  }

  try {
    await Speech.resume();
    set({ status: 'playing' });
  } catch (error) {
    set({ status: 'error', error: humanizeError(error) });
  }
}

/** Single entry point for every audio button. */
export function toggleAudio(request: AudioRequest) {
  const { status, activeKey } = useAudioStore.getState();

  if (activeKey === request.key) {
    if (status === 'playing') {
      void pauseAudio();
      return;
    }
    if (status === 'paused') {
      void resumeAudio();
      return;
    }
    if (status === 'loading') return;
  }

  playAudio(request);
}

export function replayAudio(request: AudioRequest) {
  playAudio(request);
}

/** Plays several lines back to back; used by the listening player. */
export function playSequence(requests: AudioRequest[]) {
  if (requests.length === 0) return;
  const [first, ...rest] = requests;
  queue = rest;
  startPlayback(first, true);
}

export function clearAudioError() {
  if (useAudioStore.getState().status === 'error') {
    set({ status: 'idle', error: null, activeKey: null, activeText: null });
  }
}

/** Warms the voice lookup so the first tap starts without a delay. */
export function prepareVoices() {
  void resolveVoice('ru-RU');
  void resolveVoice('de-DE');

  // Browsers load their voice list asynchronously; re-resolve when it arrives so
  // the UI never claims a Russian voice is missing after it became available.
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const refresh = () => {
      voiceCache.delete('ru-RU');
      void resolveVoice('ru-RU');
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
  }
}
