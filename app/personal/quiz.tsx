import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Divider, ProgressBar, Screen, ScreenHeader, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { buildPersonalQuiz } from '@/services/personal';
import { useAppStore } from '@/store/useAppStore';

export default function PersonalQuizScreen() {
  const router = useRouter();
  const words = useAppStore((state) => state.personalWords);
  const reviews = useAppStore((state) => state.personalReviews);
  const gradePersonalWord = useAppStore((state) => state.gradePersonalWord);
  const recordActivity = useAppStore((state) => state.recordActivity);

  const quiz = useMemo(() => buildPersonalQuiz(words, reviews).slice(0, 12), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  if (quiz.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Abfrage" onBack={() => router.back()} />
        <Screen contentStyle={{ paddingTop: 0 }}>
          <View style={{ gap: spacing.md, paddingTop: spacing.xl }}>
            <Text variant="headline">Keine Wörter zum Abfragen</Text>
            <Text variant="body" tone="secondary">
              Lege zuerst eigene Vokabeln an. Die Abfrage bewertet jede Antwort und merkt sich, welche Wörter schwierig
              bleiben.
            </Text>
            <Button label="Vokabeln anlegen" variant="secondary" onPress={() => router.replace('/personal')} />
          </View>
        </Screen>
      </View>
    );
  }

  const current = quiz[index];

  if (done) {
    const ratio = quiz.length === 0 ? 0 : correct / quiz.length;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Abfrage" onBack={() => router.back()} />
        <Screen contentStyle={{ paddingTop: 0 }}>
          <View style={{ gap: spacing.lg, paddingTop: spacing.xl }}>
            <Text variant="display">
              {correct}/{quiz.length}
            </Text>
            <ProgressBar value={ratio} color={ratio >= 0.7 ? colors.success : colors.danger} />
            <Text variant="body" tone="secondary">
              {ratio >= 0.8
                ? 'Sicher. Diese Wörter kannst du in die Wiederholung schieben.'
                : ratio >= 0.5
                  ? 'Solide Basis. Die markierten Wörter erscheinen jetzt unter „Schwierig“.'
                  : 'Noch unsicher. Nimm dir die schwierigen Wörter noch einmal vor.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Zur Übersicht" variant="secondary" onPress={() => router.replace('/personal')} style={{ flex: 1 }} />
              <Button
                label="Noch einmal"
                onPress={() => {
                  setIndex(0);
                  setSelected(null);
                  setCorrect(0);
                  setDone(false);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Screen>
      </View>
    );
  }

  const answered = selected !== null;
  const isRight = selected === current.answer;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Eigene Vokabeln" subtitle={`${index + 1} von ${quiz.length}`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.lg }}>
          <ProgressBar value={(index + 1) / quiz.length} height={2} />
          <View style={{ gap: spacing.xs, paddingVertical: spacing.md }}>
            <Text variant="caption" tone="tertiary">
              {current.word.category}
            </Text>
            <Text variant="display">{current.word.ru}</Text>
            {current.word.transcription ? (
              <Text variant="caption" tone="tertiary">
                {current.word.transcription}
              </Text>
            ) : null}
          </View>

          <View>
            {current.options.map((option, optionIndex) => {
              const chosen = selected === optionIndex;
              const right = answered && optionIndex === current.answer;
              return (
                <View key={option}>
                  {optionIndex > 0 ? <Divider /> : null}
                  <Pressable
                    disabled={answered}
                    onPress={() => {
                      setSelected(optionIndex);
                      const ok = optionIndex === current.answer;
                      if (ok) setCorrect((value) => value + 1);
                      gradePersonalWord(current.word.id, ok);
                    }}
                    style={{ paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                  >
                    <Text variant="body" style={{ flex: 1 }} tone={right ? 'success' : chosen ? 'danger' : 'default'}>
                      {option}
                    </Text>
                    {right ? <Ionicons name="checkmark" size={16} color={colors.success} /> : null}
                    {answered && chosen && !right ? <Ionicons name="close" size={16} color={colors.danger} /> : null}
                  </Pressable>
                </View>
              );
            })}
          </View>

          {answered ? (
            <View style={{ gap: spacing.md }}>
              <Text variant="caption" tone={isRight ? 'success' : 'danger'}>
                {isRight ? 'Richtig' : `Richtig ist: ${current.word.de}`}
              </Text>
              <Button
                label={index + 1 === quiz.length ? 'Auswerten' : 'Weiter'}
                onPress={() => {
                  if (index + 1 === quiz.length) {
                    setDone(true);
                    recordActivity({
                      kind: 'review',
                      label: 'Eigene Vokabeln abgefragt',
                      minutes: 3,
                      xp: correct * 2,
                      correct,
                      total: quiz.length,
                    });
                    return;
                  }
                  setIndex(index + 1);
                  setSelected(null);
                }}
              />
            </View>
          ) : null}
        </View>
      </Screen>
    </View>
  );
}
