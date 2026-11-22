import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, ProgressBar, ScreenHeader, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import {
  placementLevel,
  placementPassage,
  placementQuestions,
  placementSections,
  placementTotal,
} from '@/data/placement';
import { useAppStore } from '@/store/useAppStore';

export default function PlacementScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const recordActivity = useAppStore((state) => state.recordActivity);

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const question = placementQuestions[index];
  const section = placementSections.find((entry) => entry.id === question?.section);
  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => placementLevel(answers), [answers]);

  const finish = (finalAnswers: Record<string, number>) => {
    const outcome = placementLevel(finalAnswers);
    setFinished(true);
    recordActivity({
      kind: 'placement',
      label: `Einstufungstest: ${outcome.level}`,
      minutes: 8,
      xp: 10,
      correct: outcome.score,
      total: placementTotal,
      refId: outcome.level,
    });
  };

  if (!started) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Einstufungstest" onBack={() => router.back()} />
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
          <Text variant="title">Wo stehst du gerade?</Text>
          <Text variant="body" tone="secondary">
            {placementTotal} Aufgaben aus fünf Bereichen. Es gibt kein Zeitlimit – antworte ehrlich, nicht perfekt. Das
            Ergebnis bestimmt dein Arbeitsniveau und den Einstieg im Kurs.
          </Text>
          <View>
            {placementSections.map((entry) => (
              <View key={entry.id} style={{ paddingVertical: spacing.sm, flexDirection: 'row', gap: spacing.md }}>
                <Text variant="caption" tone="tertiary" style={{ width: 96 }}>
                  {entry.label}
                </Text>
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  {entry.hint}
                </Text>
              </View>
            ))}
          </View>
          {profile?.level ? (
            <Text variant="caption" tone="tertiary">
              Aktuell hinterlegt: {profile.level}. Der Test überschreibt das Niveau nur bei einem klaren Ergebnis.
            </Text>
          ) : null}
          <Button
            label="Test starten"
            onPress={() => {
              setStarted(true);
              setIndex(0);
              setAnswers({});
              setFinished(false);
            }}
          />
        </ScrollView>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Ergebnis" onBack={() => router.back()} />
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
          <View style={{ gap: spacing.xs }}>
            <Text variant="micro" tone="tertiary">
              EMPFOHLENES NIVEAU
            </Text>
            <Text variant="display">{result.level}</Text>
            <Text variant="caption" tone="secondary">
              {result.score} von {placementTotal} Aufgaben richtig
            </Text>
          </View>

          <View>
            {result.perLevel.map((entry) => (
              <View key={entry.level} style={{ paddingVertical: spacing.sm, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="caption" tone="secondary">
                    {entry.level}
                  </Text>
                  <Text variant="caption" tone="tertiary">
                    {entry.correct}/{entry.total}
                  </Text>
                </View>
                <ProgressBar value={entry.total === 0 ? 0 : entry.correct / entry.total} height={3} />
              </View>
            ))}
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text variant="headline">Empfehlung</Text>
            <Text variant="body" tone="secondary">
              {result.recommendation}
            </Text>
            <Text variant="caption" tone="tertiary">
              Der Test prüft Verständnis, keine Aussprache. Nach den ersten Lektionen passt das Lernsystem das Niveau
              automatisch an.
            </Text>
          </View>

          <Button
            label={`Niveau ${result.level} übernehmen`}
            onPress={() => {
              updateProfile({ level: result.level, placementScore: result.score });
              router.replace('/learn/plan');
            }}
          />
          <Button label="Zum Dashboard" variant="secondary" onPress={() => router.replace('/home')} />
        </ScrollView>
      </View>
    );
  }

  const selected = answers[question.id];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={section?.label ?? 'Einstufung'}
        subtitle={`${index + 1} von ${placementTotal}`}
        onBack={() => router.back()}
      />
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.sm }}>
        <ProgressBar value={(answeredCount + (selected === undefined ? 0 : 1)) / placementTotal} height={2} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        {question.section === 'reading' ? (
          <View style={{ gap: spacing.sm }}>
            <Text variant="caption" tone="tertiary">
              {placementPassage.title}
            </Text>
            <Text variant="body" style={{ lineHeight: 24 }}>
              {placementPassage.ru}
            </Text>
          </View>
        ) : null}

        {question.audio ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <AudioButton text={question.audio} audioKey={`placement-${question.id}`} size="lg" rate={0.8} accessibilityLabel="Aufgabe anhören" />
            <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
              Höre die Aufgabe. Der Text wird nicht angezeigt.
            </Text>
          </View>
        ) : null}

        <Text variant="headline">{question.prompt}</Text>

        <View>
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            return (
              <Pressable
                key={option}
                onPress={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                style={{
                  paddingVertical: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text variant="body" style={{ flex: 1 }} tone={isSelected ? 'accent' : 'default'}>
                  {option}
                </Text>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={16}
                  color={isSelected ? colors.accent : colors.textTertiary}
                />
              </Pressable>
            );
          })}
        </View>

        <Button
          label={index + 1 === placementTotal ? 'Auswerten' : 'Weiter'}
          disabled={selected === undefined}
          onPress={() => {
            if (index + 1 === placementTotal) {
              finish(answers);
              return;
            }
            setIndex(index + 1);
          }}
        />
        <Text variant="caption" tone="tertiary">
          {question.explain ?? 'Eine Antwort pro Aufgabe. Zurück ist über die Kopfzeile möglich.'}
        </Text>
      </ScrollView>
    </View>
  );
}
