import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, Input, ProgressBar, Screen, ScreenHeader, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { sentenceCategories, sentencesByCategory, type SentenceCategory } from '@/data/sentences';
import { evaluateRussian } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';

export default function SentenceTrainerScreen() {
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);

  const [category, setCategory] = useState<SentenceCategory>('einfach');
  const items = useMemo(() => sentencesByCategory(category), [category]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<ReturnType<typeof evaluateRussian> | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items[index];

  const changeCategory = (next: SentenceCategory) => {
    setCategory(next);
    setIndex(0);
    setAnswer('');
    setResult(null);
    setCorrect(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Satztrainer" onBack={() => router.back()} />
        <Screen contentStyle={{ paddingTop: 0 }}>
          <View style={{ gap: spacing.lg, paddingTop: spacing.xl }}>
            <Text variant="display">
              {correct}/{items.length}
            </Text>
            <ProgressBar value={items.length === 0 ? 0 : correct / items.length} color={correct === items.length ? colors.success : colors.accent} />
            <Text variant="body" tone="secondary">
              {correct === items.length
                ? 'Alle Sätze saßen. Wechsle die Kategorie für neue Strukturen.'
                : 'Alternativen gelten als richtig, solange die Grammatik stimmt. Lies die Erklärungen zu den verfehlten Sätzen.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Andere Kategorie" variant="secondary" onPress={() => changeCategory('fragen')} style={{ flex: 1 }} />
              <Button label="Noch einmal" onPress={() => changeCategory(category)} style={{ flex: 1 }} />
            </View>
          </View>
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Satztrainer" subtitle={`${index + 1} von ${items.length}`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.lg }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            {sentenceCategories.map((entry) => {
              const active = entry.id === category;
              return (
                <Pressable
                  key={entry.id}
                  onPress={() => changeCategory(entry.id)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.border,
                  }}
                >
                  <Text variant="caption" tone={active ? 'default' : 'tertiary'}>
                    {entry.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ gap: 4 }}>
            <Text variant="micro" tone="tertiary">
              {sentenceCategories.find((entry) => entry.id === category)?.hint} · {item.level}
            </Text>
            <Text variant="title">{item.de}</Text>
            <Text variant="caption" tone="tertiary">
              Übersetze ins Russische.
            </Text>
          </View>

          <Input
            value={answer}
            onChangeText={(value) => {
              setAnswer(value);
              if (result) setResult(null);
            }}
            placeholder="По-ру́сски…"
            editable={!result}
            multiline
            style={{ minHeight: 52, height: undefined, paddingVertical: spacing.sm }}
          />

          {!result ? (
            <Button label="Übersetzung prüfen" onPress={() => {
              const outcome = evaluateRussian(answer, [item.ru, ...item.alternatives]);
              setResult(outcome);
              if (outcome.verdict === 'correct') setCorrect((value) => value + 1);
            }} disabled={!answer.trim()} />
          ) : (
            <View style={{ gap: spacing.md }}>
              <Text variant="headline" tone={result.verdict === 'correct' ? 'success' : result.verdict === 'close' ? 'warning' : 'danger'}>
                {result.verdict === 'correct' ? 'Richtig' : result.verdict === 'close' ? 'Fast – es fehlt etwas' : 'Noch nicht richtig'}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text variant="body" weight="500" style={{ flex: 1 }}>
                  {item.ru}
                </Text>
                <AudioButton text={item.ru} audioKey={`sentence-${item.id}`} size="sm" rate={0.75} accessibilityLabel="Musterlösung anhören" />
              </View>

              {result.missing.length > 0 ? (
                <Text variant="caption" tone="warning">
                  Fehlende Bausteine: {result.missing.join(', ')}
                </Text>
              ) : null}

              <View>
                <Text variant="micro" tone="tertiary">
                  ERKLÄRUNG
                </Text>
                <Text variant="caption" tone="secondary">
                  {item.explanation}
                </Text>
              </View>

              <View>
                <Text variant="micro" tone="tertiary">
                  TYPISCHER FEHLER
                </Text>
                <Text variant="caption" tone="danger">
                  {item.mistake}
                </Text>
              </View>

              <Divider />
              <Button
                label={index + 1 === items.length ? 'Auswerten' : 'Nächster Satz'}
                onPress={() => {
                  if (index + 1 === items.length) {
                    setFinished(true);
                    recordActivity({
                      kind: 'sentence',
                      label: `Satztrainer: ${category}`,
                      minutes: Math.max(2, Math.round(items.length * 0.8)),
                      xp: correct * 3,
                      correct,
                      total: items.length,
                      refId: category,
                    });
                    return;
                  }
                  setIndex(index + 1);
                  setAnswer('');
                  setResult(null);
                }}
              />
            </View>
          )}

          <Text variant="caption" tone="tertiary">
            Akzeptiert werden die Musterlösung und {Math.max(0, item.alternatives.length)} weitere korrekte Formulierung
            {item.alternatives.length === 1 ? '' : 'en'}. Kleine Tippfehler zählen nicht als Fehler.
          </Text>
        </View>
      </Screen>
    </View>
  );
}
