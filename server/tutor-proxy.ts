/**
 * SLOVO tutor proxy.
 *
 * Keeps the provider API key on the server. The app only knows the proxy URL.
 *
 *   OPENAI_API_KEY=sk-… bun run tutor
 *   (optional) OPENAI_BASE_URL=https://api.openai.com/v1  TUTOR_MODEL=gpt-4o-mini
 *
 * Then start the app with:
 *   EXPO_PUBLIC_TUTOR_API_URL=http://localhost:8787
 */

const PORT = Number(process.env.PORT ?? 8787);
const API_KEY = process.env.OPENAI_API_KEY ?? '';
const BASE_URL = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
const MODEL = process.env.TUTOR_MODEL ?? 'gpt-4o-mini';

type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

interface ChatBody {
  level?: Level;
  scenarioId?: string;
  scenarioTitle?: string;
  goal?: string;
  messages?: { role: 'user' | 'assistant'; content: string }[];
}

const LEVEL_GUIDE: Record<Level, string> = {
  A0: 'Absolute beginner. Use only the present tense, 1 short sentence per turn, 3–6 words, no cases beyond the accusative, no aspect pairs. Add a German translation in brackets after your Russian line.',
  A1: 'Beginner. Present and simple past, short sentences, common vocabulary only. Add a German hint in brackets when you introduce a new word.',
  A2: 'Elementary. Simple connected sentences, everyday topics, all six cases only with frequent prepositions.',
  B1: 'Intermediate. Normal conversational Russian, moderate speed, occasional new vocabulary with a short German gloss.',
  B2: 'Upper intermediate. Natural Russian, idiomatic phrases, discuss opinions and abstract topics.',
  C1: 'Advanced. Fully natural Russian, nuanced vocabulary, no simplification.',
};

function systemPrompt(body: ChatBody): string {
  const level = body.level ?? 'A0';
  const guide = LEVEL_GUIDE[level] ?? LEVEL_GUIDE.A0;
  return [
    'You are SLOVO, a patient Russian tutor for German-speaking learners.',
    `The learner is at level ${level}. ${guide}`,
    body.scenarioTitle
      ? `Roleplay setting: "${body.scenarioTitle}". Goal: ${body.goal ?? 'a natural everyday conversation'}. Stay in role but stay in the learner\'s level.`
      : 'Free conversation about everyday topics.',
    'Rules:',
    '- Always answer primarily in Russian at the learner\'s level, then add one short German correction note if the learner made a mistake (format: "Korrektur: …").',
    '- Never invent grammar rules. Keep answers under 60 words.',
    '- End with exactly one short question in Russian to keep the conversation going.',
    '- If the learner writes German, answer in Russian and gently offer the Russian phrase.',
  ].join('\n');
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    },
  });
}

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return json({ ok: true });

    if (url.pathname === '/health') {
      return json({ ok: true, configured: Boolean(API_KEY), model: MODEL, baseUrl: BASE_URL });
    }

    if (url.pathname !== '/chat' || request.method !== 'POST') {
      return json({ error: 'Not found' }, 404);
    }

    if (!API_KEY) {
      return json({ error: 'OPENAI_API_KEY ist nicht gesetzt. Starte den Proxy mit gesetztem Schlüssel.' }, 503);
    }

    let body: ChatBody;
    try {
      body = (await request.json()) as ChatBody;
    } catch {
      return json({ error: 'Ungültiges JSON' }, 400);
    }

    const history = (body.messages ?? [])
      .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
      .slice(-16)
      .map((message) => ({ role: message.role, content: String(message.content).slice(0, 1200) }));

    if (history.length === 0) return json({ error: 'Keine Nachrichten übergeben.' }, 400);

    try {
      const upstream = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.7,
          max_tokens: 220,
          messages: [{ role: 'system', content: systemPrompt(body) }, ...history],
        }),
      });

      if (!upstream.ok) {
        const detail = await upstream.text();
        console.error('upstream error', upstream.status, detail.slice(0, 400));
        return json({ error: `Anbieter-Fehler ${upstream.status}` }, 502);
      }

      const data = (await upstream.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) return json({ error: 'Leere Antwort vom Anbieter.' }, 502);

      return json({ reply });
    } catch (error) {
      console.error('tutor proxy error', error);
      return json({ error: 'Proxy konnte den Anbieter nicht erreichen.' }, 502);
    }
  },
});

console.log(`SLOVO tutor proxy läuft auf http://localhost:${server.port}`);
console.log(`Modell: ${MODEL} · Schlüssel: ${API_KEY ? 'gesetzt' : 'FEHLT'}`);
