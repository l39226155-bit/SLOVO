import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Input, ProgressBar, ScreenHeader, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { everydayById } from '@/data/everyday';
import { evaluateRussian } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';

type Check = { verdict: 'correct' | 'close' | 'wrong'; model: string; tip?: string; missing: string[] } | null;

export default function EverydayDialogueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const situation = id ? everydayById[id] : undefined;

  const [turnIndex, setTurnIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [check, setCheck] = useState<Check>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const turn = situation?.turns[turnIndex];
  const total = situation?.turns.length ?? 0;

  if (!situation || !turn) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
        <Text variant="headline">Situation nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const evaluate = () => {
    const result = evaluateRussian(answer, turn.answers);
    setCheck({ verdict: result.verdict, model: turn.model, tip: turn.tip, missing: result.missing });
    if (result.verdict === 'correct') setCorrect((value) => value + 1);
  };

  const advance = () => {
    if (turnIndex + 1 >= total) {
      const xp = correct * 4;
      recordActivity({
        kind: 'everyday',
        label: `Alltag: ${situation.title}`,
        minutes: situation.minutes,
        xp,
        correct,
        total,
        refId: situation.id,
      });
      setFinished(true);
      return;
    }
    setTurnIndex(turnIndex + 1);
    setAnswer('');
    setCheck(null);
  };

  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title={situation.title} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
          <Text variant="display">
            {correct}/{total}
          </Text>
          <ProgressBar value={correct / total} color={correct === total ? colors.success : colors.accent} />
          <Text variant="body" tone="secondary">
            {correct === total
              ? 'Alle Antworten saßen. Diese Situation kannst du im Alltag verwenden.'
              : 'Fast. Lies die Musterlösungen noch einmal – die Formulierungen sind bewusst alltagstauglich.'}
          </Text>
          <View style={{ gap: spacing.md }}>
            {situation.turns.map((item, index) => (
              <View key={item.model} style={{ gap: 2 }}>
                <Text variant="caption" tone="tertiary">
                  {index + 1}. {item.task}
                </Text>
                <Text variant="body" weight="500">
                  {item.model}
                </Text>
                <Text variant="caption" tone="secondary">
                  {item.modelDe}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Andere Situation" variant="secondary" onPress={() => router.replace('/everyday')} style={{ flex: 1 }} />
            <Button
              label="Noch einmal"
              onPress={() => {
                setTurnIndex(0);
                setAnswer('');
                setCheck(null);
                setCorrect(0);
                setFinished(false);
              }}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={situation.title}
        subtitle={`${situation.place} · Schritt ${turnIndex + 1} von ${total}`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }} keyboardShouldPersistTaps="handled">
        <ProgressBar value={(turnIndex + (check ? 1 : 0)) / total} height={2} />

        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="caption" tone="tertiary">
              Gegenüber
            </Text>
            <Text variant="headline">{turn.partner.ru}</Text>
            <Text variant="caption" tone="secondary">
              {turn.partner.de}
            </Text>
          </View>
          <AudioButton text={turn.partner.ru} audioKey={`everyday-${situation.id}-p${turnIndex}`} size="md" rate={0.8} accessibilityLabel="Partnerzeile anhören" />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text variant="caption" tone="accent">
            Du
          </Text>
          <Text variant="body">{turn.task}</Text>
          <Input
            value={answer}
            onChangeText={(value) => {
              setAnswer(value);
              if (check) setCheck(null);
            }}
            placeholder="Auf Russisch antworten"
            editable={!check}
            multiline
            style={{ minHeight: 52, height: undefined, paddingVertical: spacing.sm }}
          />
          {!check ? (
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Prüfen" onPress={evaluate} disabled={!answer.trim()} style={{ flex: 1 }} />
              <Button
                label="Lösung"
                variant="ghost"
                onPress={() => setCheck({ verdict: 'wrong', model: turn.model, tip: turn.tip, missing: [] })}
                style={{ width: 96 }}
              />
            </View>
          ) : null}
        </View>

        {check ? (
          <View style={{ gap: spacing.sm }}>
            <Text variant="headline" tone={check.verdict === 'correct' ? 'success' : check.verdict === 'close' ? 'warning' : 'danger'}>
              {check.verdict === 'correct' ? 'Richtig' : check.verdict === 'close' ? 'Fast richtig' : 'Noch nicht'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text variant="body" weight="500" style={{ flex: 1 }}>
                {check.model}
              </Text>
              <AudioButton text={check.model} audioKey={`everyday-${situation.id}-m${turnIndex}`} size="sm" rate={0.75} accessibilityLabel="Musterlösung anhören" />
            </View>
            <Text variant="caption" tone="secondary">
              {turn.modelDe}
            </Text>
            {check.verdict === 'close' && check.missing.length > 0 ? (
              <Text variant="caption" tone="warning">
                Es fehlt noch: {check.missing.join(', ')}
              </Text>
            ) : null}
            {check.tip ? (
              <Text variant="caption" tone="tertiary">
                {check.tip}
              </Text>
            ) : null}
            <Button label={turnIndex + 1 >= total ? 'Abschließen' : 'Weiter'} onPress={advance} />
          </View>
        ) : null}

        <View>
          <Text variant="micro" tone="tertiary" style={{ marginBottom: spacing.sm }}>
            HILFREICHE WENDUNGEN
          </Text>
          {situation.phrases.map((phrase) => (
            <View key={phrase.ru} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 }}>
              <Text variant="caption" style={{ flex: 1 }}>
                {phrase.ru} — {phrase.de}
              </Text>
              <AudioButton text={phrase.ru} audioKey={`everyday-${situation.id}-${phrase.ru}`} size="sm" rate={0.75} accessibilityLabel="Wendung anhören" />
            </View>
          ))}
        </View>

        <Text variant="caption" tone="tertiary">
          Der vollständige Dialog umfasst {total} Schritte. Für den Abschluss zählt jede richtige Antwort, „fast richtig“
          wird als Hinweis gewertet.
        </Text>
      </ScrollView>
    </View>
  );
}
