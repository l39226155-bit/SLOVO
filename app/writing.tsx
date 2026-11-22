import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, Input, Segmented, Screen, ScreenHeader, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { dictionaryEntries, lookupWord } from '@/data/dictionary';
import { sentenceItems } from '@/data/sentences';
import { vocabulary } from '@/data/vocabulary';
import { closestWord, evaluateRussian, normalizeRu } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';

type Mode = 'abschreiben' | 'luecken' | 'saetze' | 'text';

const WORDS = vocabulary.slice(0, 80);

function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}

function maskWord(word: string): string {
  const letters = [...word];
  return letters
    .map((char, index) => {
      if (!/[а-яё]/i.test(char)) return char;
      return index % 2 === 0 ? '·' : char;
    })
    .join('');
}

export default function WritingTrainerScreen() {
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);

  const [mode, setMode] = useState<Mode>('abschreiben');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<null | { ok: boolean; hint?: string; model: string }>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const copyItems = useMemo(() => pickRandom(WORDS, 6), []);
  const gapItems = useMemo(() => pickRandom(WORDS, 6), []);
  const sentenceItemsPick = useMemo(() => pickRandom(sentenceItems, 5), []);
  const [freeText, setFreeText] = useState('');
  const [freeResult, setFreeResult] = useState<null | { total: number; unknown: { word: string; suggestion?: string }[] }>(null);

  const active = mode === 'abschreiben' ? copyItems : mode === 'luecken' ? gapItems : sentenceItemsPick;
  const total = active.length;

  const reset = (next: Mode) => {
    setMode(next);
    setIndex(0);
    setAnswer('');
    setChecked(null);
    setScore(0);
    setFinished(false);
    setFreeText('');
    setFreeResult(null);
  };

  const check = () => {
    if (mode === 'saetze') {
      const item = sentenceItemsPick[index];
      const outcome = evaluateRussian(answer, [item.ru, ...item.alternatives]);
      setChecked({
        ok: outcome.verdict === 'correct',
        hint:
          outcome.verdict === 'correct'
            ? undefined
            : `${outcome.verdict === 'close' ? 'Fast: ' : ''}${item.explanation}`,
        model: item.ru,
      });
      if (outcome.verdict === 'correct') setScore((value) => value + 1);
      return;
    }

    const target = mode === 'abschreiben' ? copyItems[index].ru : gapItems[index].ru;
    const ok = normalizeRu(answer) === normalizeRu(target);
    const suggestion = ok ? undefined : closestWord(answer, [target, ...WORDS.map((word) => word.ru)]);
    setChecked({
      ok,
      hint: ok
        ? undefined
        : suggestion && suggestion.score > 0.4
          ? `Ähnlich: ${suggestion.word} (${Math.round(suggestion.score * 100)} % Übereinstimmung)`
          : 'Vergleiche Buchstabe für Buchstabe. Kyrillisch hat eigene Zeichen für ш, щ, ж, ц, ч.',
      model: target,
    });
    if (ok) setScore((value) => value + 1);
  };

  const checkFreeText = () => {
    const words = normalizeRu(freeText).split(' ').filter(Boolean);
    const unknown = words
      .filter((word) => !lookupWord(word))
      .slice(0, 12)
      .map((word) => ({ word, suggestion: closestWord(word, dictionaryEntries.map((entry) => entry.ru))?.word }));
    setFreeResult({ total: words.length, unknown });
    recordActivity({
      kind: 'writing',
      label: 'Freies Schreiben geprüft',
      minutes: 3,
      xp: unknown.length === 0 ? 8 : 4,
      correct: Math.max(0, words.length - unknown.length),
      total: words.length,
    });
  };

  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Schreibtraining" onBack={() => router.back()} />
        <Screen contentStyle={{ paddingTop: 0 }}>
          <View style={{ gap: spacing.lg, paddingTop: spacing.xl }}>
            <Text variant="display">
              {score}/{total}
            </Text>
            <Text variant="body" tone="secondary">
              {score === total
                ? 'Alles korrekt geschrieben. Wechsle in den Lücken- oder Satzmodus, um die Form aktiv abzurufen.'
                : 'Schreibfehler sind normal. Die Musterlösungen stehen in der nächsten Runde wieder bereit.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Modus wählen" variant="secondary" onPress={() => reset(mode)} style={{ flex: 1 }} />
              <Button label="Noch einmal" onPress={() => reset(mode)} style={{ flex: 1 }} />
            </View>
          </View>
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Schreibtraining" subtitle="Kyrillisch aktiv üben" onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.lg }}>
          <Segmented
            options={[
              { value: 'abschreiben', label: 'Abschreiben' },
              { value: 'luecken', label: 'Lücken' },
              { value: 'saetze', label: 'Sätze' },
              { value: 'text', label: 'Text' },
            ]}
            value={mode}
            onChange={reset}
          />

          {mode === 'text' ? (
            <View style={{ gap: spacing.md }}>
              <Text variant="body" tone="secondary">
                Schreibe 3–4 Sätze auf Russisch. Die Prüfung vergleicht jedes Wort mit dem Wörterbuch und schlägt bei
                unbekannten Wörtern die nächste Form vor.
              </Text>
              <Input
                value={freeText}
                onChangeText={setFreeText}
                placeholder="Сего́дня я…"
                multiline
                style={{ minHeight: 120, height: undefined, paddingVertical: spacing.md, textAlignVertical: 'top' }}
              />
              <Button label="Text prüfen" onPress={checkFreeText} disabled={freeText.trim().length < 3} />
              {freeResult ? (
                <View style={{ gap: spacing.sm }}>
                  <Text variant="headline">
                    {freeResult.total - freeResult.unknown.length} von {freeResult.total} Wörtern erkannt
                  </Text>
                  {freeResult.unknown.length === 0 ? (
                    <Text variant="caption" tone="success">
                      Alle Wörter stehen im Wörterbuch. Prüfe trotzdem die Endungen – die App erkennt Wörter, keine Kasus.
                    </Text>
                  ) : (
                    <View>
                      <Text variant="caption" tone="secondary" style={{ marginBottom: spacing.sm }}>
                        Unbekannt oder falsch geschrieben:
                      </Text>
                      {freeResult.unknown.map((entry) => (
                        <View key={entry.word} style={{ flexDirection: 'row', paddingVertical: 4, gap: spacing.sm }}>
                          <Text variant="caption" tone="danger" style={{ width: 110 }}>
                            {entry.word}
                          </Text>
                          <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
                            {entry.suggestion ? `Meintest du ${entry.suggestion}?` : 'Kein ähnliches Wort gefunden.'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text variant="caption" tone="tertiary">
                    Die Prüfung ersetzt keine Lehrkraft: Sie findet Schreibfehler und unbekannte Wörter, keine
                    Kasusfehler.
                  </Text>
                </View>
              ) : null}
            </View>
          ) : checked ? (
            <View style={{ gap: spacing.md }}>
              <Text variant="headline" tone={checked.ok ? 'success' : 'danger'}>
                {checked.ok ? 'Richtig geschrieben' : 'Noch nicht korrekt'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text variant="body" weight="500" style={{ flex: 1 }}>
                  {checked.model}
                </Text>
                <AudioButton text={checked.model} audioKey={`writing-${mode}-${index}`} size="sm" rate={0.75} accessibilityLabel="Lösung anhören" />
              </View>
              {checked.hint ? (
                <Text variant="caption" tone="secondary">
                  {checked.hint}
                </Text>
              ) : null}
              <Button
                label={index + 1 === total ? 'Auswerten' : 'Weiter'}
                onPress={() => {
                  if (index + 1 === total) {
                    recordActivity({
                      kind: 'writing',
                      label: `Schreiben: ${mode}`,
                      minutes: 3,
                      xp: score * 2,
                      correct: score,
                      total,
                      refId: mode,
                    });
                    setFinished(true);
                    return;
                  }
                  setIndex(index + 1);
                  setAnswer('');
                  setChecked(null);
                }}
              />
            </View>
          ) : (
            <View style={{ gap: spacing.md }}>
              <Text variant="caption" tone="tertiary">
                {index + 1} von {total}
              </Text>
              {mode === 'saetze' ? (
                <>
                  <Text variant="title">{sentenceItemsPick[index].de}</Text>
                  <Text variant="caption" tone="tertiary">
                    Formuliere den Satz auf Russisch.
                  </Text>
                </>
              ) : mode === 'luecken' ? (
                <>
                  <Text variant="title">{maskWord(gapItems[index].ru)}</Text>
                  <Text variant="caption" tone="tertiary">
                    {gapItems[index].de} · Ergänze das vollständige Wort.
                  </Text>
                </>
              ) : (
                <>
                  <Text variant="title">{copyItems[index].ru}</Text>
                  <Text variant="caption" tone="tertiary">
                    {copyItems[index].de} · Schreibe das Wort mit Betonungszeichen ab.
                  </Text>
                </>
              )}

              <Input
                value={answer}
                onChangeText={setAnswer}
                placeholder="Hier schreiben"
                autoCapitalize="none"
                multiline
                style={{ minHeight: 52, height: undefined, paddingVertical: spacing.sm }}
              />
              <Button label="Prüfen" onPress={check} disabled={!answer.trim()} />
              <Text variant="caption" tone="tertiary">
                Groß- und Kleinschreibung sowie Satzzeichen werden ignoriert, Betonungszeichen sind optional.
              </Text>
            </View>
          )}

          {mode !== 'text' ? (
            <View>
              <Divider />
              <Pressable onPress={() => router.push('/personal')} style={{ paddingVertical: spacing.md }}>
                <Text variant="caption" tone="accent">
                  Eigene Wörter üben →
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}
