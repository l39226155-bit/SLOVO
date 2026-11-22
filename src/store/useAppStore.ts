import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { newCard, schedule } from '@/services/srs';
import type {
  Activity,
  ActivityKind,
  Collection,
  Grade,
  LessonRecord,
  PersonalReview,
  PersonalWord,
  Profile,
  Reminders,
  Settings,
  SrsCard,
} from '@/store/types';

const STORAGE_KEY = 'slovo.state.v1';

export const defaultSettings: Settings = {
  sound: true,
  haptics: true,
  speechRate: 0.85,
  showTranscription: true,
  reminders: {
    enabled: false,
    hour: 18,
    minute: 0,
    days: [1, 2, 3, 4, 5],
    goal: 'minutes',
    type: 'reminder',
  },
};

interface CompleteLessonInput {
  lessonId: string;
  vocabIds: string[];
  correct: number;
  total: number;
  minutes: number;
  xp: number;
  label: string;
}

export interface AppState {
  hydrated: boolean;
  onboardingDone: boolean;
  profile: Profile | null;
  lessons: Record<string, LessonRecord>;
  cards: Record<string, SrsCard>;
  savedWords: string[];
  personalWords: PersonalWord[];
  personalReviews: Record<string, PersonalReview>;
  collections: Collection[];
  challengeClaims: Record<string, string>;
  activities: Activity[];
  settings: Settings;

  setHydrated: (value: boolean) => void;
  completeOnboarding: (profile: Profile) => void;
  completeLesson: (input: CompleteLessonInput) => void;
  recordActivity: (input: {
    kind: ActivityKind;
    label: string;
    minutes?: number;
    xp?: number;
    correct?: number;
    total?: number;
    refId?: string;
  }) => void;
  gradeCard: (vocabId: string, grade: Grade) => void;
  ensureCards: (vocabIds: string[]) => void;
  toggleSavedWord: (vocabId: string) => void;

  addPersonalWord: (input: {
    ru: string;
    de: string;
    transcription?: string;
    category?: string;
    collectionId?: string;
    level?: PersonalWord['level'];
    source?: PersonalWord['source'];
    exampleRu?: string;
    exampleDe?: string;
    favorite?: boolean;
  }) => string;
  updatePersonalWord: (id: string, patch: Partial<Omit<PersonalWord, 'id' | 'createdAt'>>) => void;
  removePersonalWord: (id: string) => void;
  togglePersonalFavorite: (id: string) => void;
  addCollection: (name: string) => string;
  removeCollection: (id: string) => void;
  importPersonalWords: (words: PersonalWord[]) => number;
  gradePersonalWord: (id: string, correct: boolean) => void;
  claimChallenge: (input: { key: string; xp: number; label: string }) => boolean;

  updateProfile: (patch: Partial<Profile>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateReminders: (patch: Partial<Reminders>) => void;
  resetProgress: () => void;
}

const emptyProgress = {
  lessons: {} as Record<string, LessonRecord>,
  cards: {} as Record<string, SrsCard>,
  savedWords: [] as string[],
  personalWords: [] as PersonalWord[],
  personalReviews: {} as Record<string, PersonalReview>,
  collections: [] as Collection[],
  challengeClaims: {} as Record<string, string>,
  activities: [] as Activity[],
};

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingDone: false,
      profile: null,
      ...emptyProgress,
      settings: defaultSettings,

      setHydrated: (value) => set({ hydrated: value }),

      completeOnboarding: (profile) =>
        set((state) => ({
          onboardingDone: true,
          profile,
          settings: { ...state.settings, speechRate: 0.85 },
        })),

      completeLesson: ({ lessonId, vocabIds, correct, total, minutes, xp, label }) => {
        const now = new Date();
        const existing = get().lessons[lessonId];
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;

        set((state) => {
          const cards = { ...state.cards };
          vocabIds.forEach((vocabId) => {
            if (!cards[vocabId]) cards[vocabId] = newCard(vocabId, now);
          });

          const record: LessonRecord = {
            lessonId,
            completedAt: now.toISOString(),
            bestScore: Math.max(existing?.bestScore ?? 0, score),
            attempts: (existing?.attempts ?? 0) + 1,
            xp: (existing?.xp ?? 0) + xp,
          };

          const activity: Activity = {
            id: uid('act'),
            at: now.toISOString(),
            kind: 'lesson',
            label,
            minutes,
            xp,
            correct,
            total,
            refId: lessonId,
          };

          return {
            lessons: { ...state.lessons, [lessonId]: record },
            cards,
            activities: [activity, ...state.activities].slice(0, 500),
          };
        });
      },

      recordActivity: ({ kind, label, minutes = 0, xp = 0, correct = 0, total = 0, refId }) => {
        const now = new Date();
        const activity: Activity = {
          id: uid('act'),
          at: now.toISOString(),
          kind,
          label,
          minutes,
          xp,
          correct,
          total,
          refId,
        };
        set((state) => ({ activities: [activity, ...state.activities].slice(0, 500) }));
      },

      gradeCard: (vocabId, grade) =>
        set((state) => ({
          cards: {
            ...state.cards,
            [vocabId]: schedule(state.cards[vocabId], vocabId, grade),
          },
        })),

      ensureCards: (vocabIds) =>
        set((state) => {
          const missing = vocabIds.filter((id) => !state.cards[id]);
          if (missing.length === 0) return state;
          const cards = { ...state.cards };
          missing.forEach((id) => {
            cards[id] = newCard(id);
          });
          return { cards };
        }),

      toggleSavedWord: (vocabId) =>
        set((state) => ({
          savedWords: state.savedWords.includes(vocabId)
            ? state.savedWords.filter((id) => id !== vocabId)
            : [vocabId, ...state.savedWords],
        })),

      addPersonalWord: (input) => {
        const id = uid('pw');
        const word: PersonalWord = {
          id,
          ru: input.ru.trim(),
          de: input.de.trim(),
          transcription: input.transcription?.trim() || undefined,
          category: input.category?.trim() || 'Eigene Wörter',
          collectionId: input.collectionId,
          level: input.level,
          favorite: input.favorite ?? false,
          source: input.source ?? 'manual',
          exampleRu: input.exampleRu?.trim() || undefined,
          exampleDe: input.exampleDe?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ personalWords: [word, ...state.personalWords] }));
        return id;
      },

      updatePersonalWord: (id, patch) =>
        set((state) => ({
          personalWords: state.personalWords.map((word) => (word.id === id ? { ...word, ...patch } : word)),
        })),

      removePersonalWord: (id) =>
        set((state) => ({
          personalWords: state.personalWords.filter((word) => word.id !== id),
          personalReviews: Object.fromEntries(Object.entries(state.personalReviews).filter(([key]) => key !== id)),
        })),

      togglePersonalFavorite: (id) =>
        set((state) => ({
          personalWords: state.personalWords.map((word) =>
            word.id === id ? { ...word, favorite: !word.favorite } : word,
          ),
        })),

      addCollection: (name) => {
        const collection: Collection = {
          id: uid('col'),
          name: name.trim(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ collections: [...state.collections, collection] }));
        return collection.id;
      },

      removeCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
          personalWords: state.personalWords.map((word) =>
            word.collectionId === id ? { ...word, collectionId: undefined } : word,
          ),
        })),

      importPersonalWords: (words) => {
        const existing = get().personalWords;
        const known = new Set(existing.map((word) => `${word.ru.toLowerCase()}|${word.de.toLowerCase()}`));
        const fresh = words.filter((word) => {
          const key = `${word.ru.toLowerCase()}|${word.de.toLowerCase()}`;
          if (!word.ru || !word.de || known.has(key)) return false;
          known.add(key);
          return true;
        });
        if (fresh.length > 0) {
          set((state) => ({ personalWords: [...fresh, ...state.personalWords] }));
        }
        return fresh.length;
      },

      gradePersonalWord: (id, correct) =>
        set((state) => {
          const previous = state.personalReviews[id];
          return {
            personalReviews: {
              ...state.personalReviews,
              [id]: {
                correct: (previous?.correct ?? 0) + (correct ? 1 : 0),
                total: (previous?.total ?? 0) + 1,
                lastAt: new Date().toISOString(),
              },
            },
          };
        }),

      claimChallenge: ({ key, xp, label }) => {
        if (get().challengeClaims[key]) return false;
        const now = new Date();
        const activity: Activity = {
          id: uid('act'),
          at: now.toISOString(),
          kind: 'challenge',
          label,
          minutes: 0,
          xp,
          correct: 1,
          total: 1,
        };
        set((state) => ({
          challengeClaims: { ...state.challengeClaims, [key]: now.toISOString() },
          activities: [activity, ...state.activities].slice(0, 500),
        }));
        return true;
      },

      updateProfile: (patch) =>
        set((state) => ({ profile: state.profile ? { ...state.profile, ...patch } : state.profile })),

      updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

      updateReminders: (patch) =>
        set((state) => ({ settings: { ...state.settings, reminders: { ...state.settings.reminders, ...patch } } })),

      resetProgress: () =>
        set({ ...emptyProgress, onboardingDone: false, profile: null, settings: defaultSettings }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingDone: state.onboardingDone,
        profile: state.profile,
        lessons: state.lessons,
        cards: state.cards,
        savedWords: state.savedWords,
        personalWords: state.personalWords,
        personalReviews: state.personalReviews,
        collections: state.collections,
        challengeClaims: state.challengeClaims,
        activities: state.activities,
        settings: state.settings,
      }),
      /**
       * Persisted state from an older version may miss newer keys (for example the
       * reminder settings). Merge instead of replacing, so an update never crashes.
       */
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          settings: {
            ...defaultSettings,
            ...(saved.settings ?? {}),
            reminders: { ...defaultSettings.reminders, ...(saved.settings?.reminders ?? {}) },
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Set after hydration so the router knows whether to show onboarding. */
export function markHydrated() {
  useAppStore.getState().setHydrated(true);
}
