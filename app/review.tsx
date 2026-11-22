import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton, Input, ProgressBar, Segmented, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { distractorTranslations, vocabulary, vocabById } from '@/data/vocabulary';
import type { Grade } from '@/store/types';
import { GRADE_LABELS } from '@/services/srs';
import { isAnswerCorrect } from '@/services/format';
import { stopAudio } from '@/services/audio';
import { useAppStore } from '@/store/useAppStore';
import { dueCards } from '@/store/selectors';

type Mode = 'ru-de' | 'de-ru' | 'choice' | 'audio';

const MODES: { value: Mode; label: string }[] = [
  { value: 'ru-de', label: 'RU → DE' },
  { value: 'de-ru', label: 'DE → RU' },
  { value: 'choice', label: 'Auswahl' },
  { value: 'audio', label: 'Hören' },
];

const SESSION_SIZE = 20;

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cards = useAppStore((state) => state.cards);
  const gradeCard = useAppStore((state) => state.gradeCard);
  const ensureCards = useAppStore((state) => state.ensureCards);
  const recordActivity = useAppStore((state) => state.recordActivity);

  const [queue] = useState<string[]>(() => {
    const due = dueCards({ cards }).map((card) => card.vocabId);
    return (due.length > 0 ? due : Object.keys(cards)).slice(0, SESSION_SIZE);
  });

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('ru-de');
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<null | { correct: boolean }>(null);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const [done, setDone] = useState(queue.length === 0);
  const startedAt = useRef(Date.now());
  const savedRef = useRef(false);

  const vocab = queue[index] ? vocabById[queue[index]] : undefined;

  const options = useMemo(() => {
    if (!vocab) return [];
    return [vocab.de, ...distractorTranslations(vocab.id, 3)].sort(() => Math.random() - 0.5);
  }, [vocab?.id]);

  useEffect(() => () => void stopAudio(), []);

  if (!vocab) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.xl, justifyContent: 'center', gap: spacing.md }}>
        <Text variant="headline">Noch keine Wörter im Training</Text>
        <Text variant="body" tone="secondary">
          Schließe eine Lektion ab oder nimm Wörter aus der Liste ins Training auf.
        </Text>
        <Button
          label="Erste 20 Wörter freischalten"
          onPress={() => {
            ensureCards(vocabulary.slice(0, 20).map((entry) => entry.id));
            router.replace('/review');
          }}
        />
        <Button label="Zurück" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const finishSession = (all: { correct: boolean }[]) => {
    if (!savedRef.current) {
      savedRef.current = true;
      recordActivity({
        kind: 'review',
        label: `Vokabeltraining · ${all.length} Karten`,
        minutes: Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)),
        xp: all.length * 2,
        correct: all.filter((entry) => entry.correct).length,
        total: all.length,
        refId: 'srs',
      });
    }
    setDone(true);
  };

  const check = () => {
    const correct =
      mode === 'choice' ? options[selected ?? -1] === vocab.de : isAnswerCorrect(answer, [mode === 'de-ru' ? vocab.ru : vocab.de]);
    setChecked({ correct });
  };

  const applyGrade = (grade: Grade) => {
    const correct = checked?.correct ?? false;
    gradeCard(vocab.id, grade);
    const nextResults = [...results, { correct }];
    setResults(nextResults);
    setChecked(null);
    setAnswer('');
    setSelected(null);
    if (index + 1 >= queue.length) finishSession(nextResults);
    else setIndex((current) => current + 1);
  };

  if (done) {
    const total = results.length;
    const correct = results.filter((entry) => entry.correct).length;
    const ratio = total === 0 ? 0 : Math.round((correct / total) * 100);
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: spacing.xl, gap: spacing.lg }}>
        <Text variant="display">{ratio} %</Text>
        <Text variant="headline">Session abgeschlossen</Text>
        <Text variant="body" tone="secondary">
          {correct} von {total} richtig · {total * 2} XP
        </Text>
        <Button label="Fertig" onPress={() => router.replace('/(tabs)/vocab')} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: insets.top + spacing.xs, paddingBottom: spacing.sm }}>
        <IconButton icon="close" size={36} onPress={() => router.back()} accessibilityLabel="Schließen" />
        <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
          <ProgressBar value={(index + (checked ? 1 : 0)) / queue.length} height={3} />
        </View>
        <Text variant="caption" tone="tertiary">
          {index + 1}/{queue.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140, gap: spacing.xl }} keyboardShouldPersistTaps="handled">
        <Segmented
          options={MODES}
          value={mode}
          onChange={(next) => {
            setMode(next);
            setChecked(null);
            setAnswer('');
            setSelected(null);
          }}
        />

        <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl }}>
          {mode === 'de-ru' ? (
            <Text variant="title" center>
              {vocab.de}
            </Text>
          ) : mode === 'audio' ? (
            <>
              <AudioButton text={vocab.ru} audioKey={`review-audio-${vocab.id}`} size="lg" accessibilityLabel="Wort anhören" />
              <Text variant="caption" tone="tertiary">
                Was hörst du?
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 32, fontWeight: '600', color: colors.text, textAlign: 'center', letterSpacing: -0.5 }}>
                {vocab.ru}
              </Text>
              <AudioButton text={vocab.ru} audioKey={`review-${vocab.id}`} size="md" accessibilityLabel="Wort anhören" />
            </>
          )}
        </View>

        {mode === 'choice' ? (
          <View>
            {options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrect = option === vocab.de;
              const state = checked ? (isCorrect ? 'correct' : isSelected ? 'wrong' : 'idle') : isSelected ? 'selected' : 'idle';
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    if (checked) return;
                    setSelected(optionIndex);
                    setChecked({ correct: isCorrect });
                  }}
                  style={({ pressed }) => [
                    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg, minHeight: 54, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text
                    variant="body"
                    style={{ flex: 1 }}
                    tone={state === 'correct' ? 'success' : state === 'wrong' ? 'danger' : 'default'}
                  >
                    {option}
                  </Text>
                  {state === 'selected' ? <Ionicons name="ellipse" size={8} color={colors.accent} /> : null}
                  {state === 'correct' ? <Ionicons name="checkmark" size={17} color={colors.success} /> : null}
                  {state === 'wrong' ? <Ionicons name="close" size={17} color={colors.danger} /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Input
            value={answer}
            onChangeText={setAnswer}
            editable={!checked}
            placeholder={mode === 'de-ru' ? 'Auf Russisch' : 'Auf Deutsch'}
            onSubmitEditing={() => !checked && answer.trim() && check()}
          />
        )}

        {checked ? (
          <View style={{ gap: spacing.xs }}>
            <Text variant="caption" tone={checked.correct ? 'success' : 'danger'}>
              {checked.correct ? 'Richtig' : 'Nicht richtig'}
            </Text>
            <Text variant="body">
              {vocab.ru} · {vocab.de}
            </Text>
            <Text variant="caption" tone="secondary">
              {vocab.example.ru} — {vocab.example.de}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        {checked ? (
          <View style={{ gap: spacing.sm }}>
            <Text variant="micro" tone="tertiary">
              Wie gut war es?
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {GRADE_LABELS.map((item) => (
                <Pressable
                  key={item.grade}
                  onPress={() => applyGrade(item.grade)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: spacing.md,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text variant="caption" weight="600" tone={item.grade === 'again' ? 'danger' : item.grade === 'easy' ? 'success' : 'default'}>
                    {item.label}
                  </Text>
                  <Text variant="caption" tone="tertiary" style={{ fontSize: 10 }}>
                    {item.hint}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Button
            label="Prüfen"
            onPress={check}
            disabled={mode === 'choice' ? selected === null : answer.trim().length === 0}
          />
        )}
      </View>
    </View>
  );
}
