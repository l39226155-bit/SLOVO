import type { Level } from '@/data/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TutorRequest {
  level: Level;
  scenarioId?: string;
  scenarioTitle?: string;
  goal?: string;
  messages: ChatMessage[];
}

const rawBase = (process.env.EXPO_PUBLIC_TUTOR_API_URL ?? '').trim().replace(/\/+$/, '');

export const tutorConfigured = rawBase.length > 0;
export const tutorBaseUrl = rawBase;

export class TutorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TutorError';
  }
}

/**
 * Calls the tutor proxy (see `server/tutor-proxy.ts`).
 * The proxy holds the provider API key — never ship a key in the app bundle.
 */
export async function requestTutorReply(request: TutorRequest, timeoutMs = 30000): Promise<string> {
  if (!tutorConfigured) {
    throw new TutorError('Der KI-Tutor ist noch nicht konfiguriert (EXPO_PUBLIC_TUTOR_API_URL fehlt).');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${tutorBaseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new TutorError(`Der Tutor antwortet nicht (${response.status}). ${detail.slice(0, 160)}`);
    }

    const data: unknown = await response.json();
    const reply = extractReply(data);
    if (!reply) throw new TutorError('Die Antwort des Tutors war leer.');
    return reply;
  } catch (error) {
    if (error instanceof TutorError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TutorError('Zeitüberschreitung – der Tutor braucht zu lange.');
    }
    throw new TutorError('Keine Verbindung zum Tutor-Server. Läuft `bun run tutor`?');
  } finally {
    clearTimeout(timer);
  }
}

function extractReply(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (typeof record.reply === 'string') return record.reply;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.content === 'string') return record.content;
  if (Array.isArray(record.choices)) {
    const first = record.choices[0] as Record<string, unknown> | undefined;
    const message = first?.message as Record<string, unknown> | undefined;
    if (message && typeof message.content === 'string') return message.content;
    if (first && typeof first.text === 'string') return first.text;
  }
  return null;
}
