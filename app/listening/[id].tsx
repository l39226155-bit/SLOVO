import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Divider, ProgressBar, ScreenHeader, SectionLabel, Segmented, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { listeningById } from '@/data/listening';
import { pauseAudio, playSequence, resumeAudio, stopAudio, useAudioStore } from '@/services/audio';
import { useAppStore } from '@/store/useAppStore';

const SPEEDS = [
  { value: '0.65', label: '0,7×' },
  { value: '0.8', label: '0,85×' },
  { value: '1', label: '1×' },
];

export default function ListeningDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const status = useAudioStore((state) => state.status);
  const activeKey = useAudioStore((state) => state.activeKey);
  const item = id ? listeningById[id] : undefined;

  const [speed, setSpeed] = useState('0.8');
  const [showRu, setShowRu] = useState(true);
  const [showDe, setShowDe] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <Text variant="headline">Übung nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  const rate = Number(speed);
  const sequencePrefix = `listen-${item.id}-`;
  const sequenceActive = Boolean(activeKey?.startsWith(sequencePrefix));
  const playing = sequenceActive && status === 'playing';
  const paused = sequenceActive && status === 'paused';

  const startSequence = () => {
    if (playing) {
      void pauseAudio();
      return;
    }
    if (paused) {
      void resumeAudio();
      return;
    }
    playSequence(item.lines.map((line, index) => ({ key: `${sequencePrefix}${index}`, text: line.ru, rate })));
  };

  const correct = item.questions.reduce((sum, question, index) => (answers[index] === question.answer ? sum + 1 : sum), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={item.title}
        subtitle={`${item.kind === 'dialogue' ? 'Dialog' : 'Geschichte'} · ${item.level}`}
        onBack={() => {
          void stopAudio(false);
          router.back();
        }}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.xl }}>
        <Text variant="body" tone="secondary">
          {item.summary}
        </Text>

        <View style={{ gap: spacing.md }}>
          <Segmented options={SPEEDS} value={speed} onChange={setSpeed} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              label={playing ? 'Pause' : paused ? 'Fortsetzen' : 'Alle Zeilen anhören'}
              variant={playing || paused ? 'secondary' : 'primary'}
              onPress={startSequence}
              style={{ flex: 1 }}
            />
            <Button
              label="Stopp"
              variant="ghost"
              onPress={() => void stopAudio()}
              style={{ width: 88 }}
              disabled={!sequenceActive}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <Pressable onPress={() => setShowRu((value) => !value)} hitSlop={8}>
              <Text variant="caption" tone={showRu ? 'default' : 'tertiary'}>
                Russisch {showRu ? 'aus' : 'ein'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setShowDe((value) => !value)} hitSlop={8}>
              <Text variant="caption" tone={showDe ? 'default' : 'tertiary'}>
                Übersetzung {showDe ? 'aus' : 'ein'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View>
          {item.lines.map((line, index) => {
            const isActive = activeKey === `${sequencePrefix}${index}`;
            return (
              <View key={`${index}-${line.ru}`}>
                {index > 0 ? <Divider /> : null}
                <View style={{ paddingVertical: spacing.md, gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text variant="caption" tone={isActive ? 'accent' : 'tertiary'} style={{ flex: 1 }}>
                      {line.speaker ?? `Zeile ${index + 1}`}
                    </Text>
                    <AudioButton
                      text={line.ru}
                      audioKey={`${sequencePrefix}${index}`}
                      rate={rate}
                      size="sm"
                      accessibilityLabel="Zeile anhören"
                    />
                  </View>
                  {showRu ? (
                    <Text variant="body" weight={isActive ? '600' : '400'}>
                      {line.ru}
                    </Text>
                  ) : (
                    <Text variant="caption" tone="tertiary">
                      Untertitel ausgeblendet
                    </Text>
                  )}
                  {showDe ? (
                    <Text variant="caption" tone="secondary">
                      {line.de}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View>
          <SectionLabel>Verständnisfragen</SectionLabel>
          {item.questions.map((question, questionIndex) => (
            <View key={question.question} style={{ marginBottom: spacing.lg }}>
              <Text variant="body" weight="500" style={{ marginBottom: spacing.sm }}>
                {questionIndex + 1}. {question.question}
              </Text>
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[questionIndex] === optionIndex;
                const isCorrect = submitted && optionIndex === question.answer;
                const isWrong = submitted && isSelected && optionIndex !== question.answer;
                return (
                  <View key={option}>
                    {optionIndex > 0 ? <Divider /> : null}
                    <Pressable
                      disabled={submitted}
                      onPress={() => setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))}
                      style={{ paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                    >
                      <Text variant="caption" style={{ flex: 1 }} tone={isCorrect ? 'success' : isWrong ? 'danger' : 'default'}>
                        {option}
                      </Text>
                      {!submitted && isSelected ? <Ionicons name="ellipse" size={7} color={colors.accent} /> : null}
                      {isCorrect ? <Ionicons name="checkmark" size={15} color={colors.success} /> : null}
                      {isWrong ? <Ionicons name="close" size={15} color={colors.danger} /> : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}

          {submitted ? (
            <View style={{ gap: spacing.sm }}>
              <Text variant="headline">
                {correct} von {item.questions.length} richtig
              </Text>
              <ProgressBar value={correct / item.questions.length} color={colors.success} />
              <Button
                label="Noch einmal"
                variant="secondary"
                onPress={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                style={{ alignSelf: 'flex-start', marginTop: spacing.sm }}
              />
            </View>
          ) : (
            <Button
              label="Antworten prüfen"
              onPress={() => {
                setSubmitted(true);
                recordActivity({
                  kind: 'listening',
                  label: `Hören: ${item.title}`,
                  minutes: item.minutes,
                  xp: correct * 3,
                  correct,
                  total: item.questions.length,
                  refId: item.id,
                });
              }}
              disabled={Object.keys(answers).length < item.questions.length}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
