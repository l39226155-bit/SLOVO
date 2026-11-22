import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Divider, ProgressBar, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { lookupWord } from '@/data/dictionary';
import { storyById } from '@/data/stories';
import { playSequence, stopAudio, useAudioStore } from '@/services/audio';
import { normalizeRu } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';

interface SelectedWord {
  ru: string;
  de: string;
  transcription?: string;
}

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const status = useAudioStore((state) => state.status);
  const activeKey = useAudioStore((state) => state.activeKey);
  const story = id ? storyById[id] : undefined;

  const [showDe, setShowDe] = useState<Record<number, boolean>>({});
  const [showAllDe, setShowAllDe] = useState(false);
  const [selected, setSelected] = useState<SelectedWord | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  const sequenceKey = `story-${story?.id}`;
  const playingAll = status === 'playing' && Boolean(activeKey?.startsWith(`${sequenceKey}-`));

  const correct = useMemo(() => {
    if (!story) return 0;
    return story.questions.reduce((sum, question, index) => (answers[index] === question.answer ? sum + 1 : sum), 0);
  }, [story, answers]);

  if (!story) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
        <Text variant="headline">Geschichte nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const resolve = (raw: string): SelectedWord | null => {
    const word = normalizeRu(raw);
    if (!word) return null;
    const glossary = story.glossary[word];
    const entry = lookupWord(word);
    if (!entry && !glossary) return null;
    return {
      ru: entry?.ru ?? word,
      de: glossary ?? entry?.de ?? '',
      transcription: entry?.transcription,
    };
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={story.title}
        subtitle={`${story.subtitle} · ${story.level}`}
        onBack={() => {
          void stopAudio(false);
          router.back();
        }}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            label={playingAll ? 'Stopp' : 'Ganze Geschichte anhören'}
            variant={playingAll ? 'secondary' : 'primary'}
            onPress={() => {
              if (playingAll) {
                void stopAudio();
                return;
              }
              playSequence(story.sentences.map((sentence, index) => ({ key: `${sequenceKey}-${index}`, text: sentence.ru, rate: 0.8 })));
            }}
            style={{ flex: 1 }}
          />
          <Button label="Übersetzung" variant="ghost" onPress={() => setShowAllDe((value) => !value)} style={{ width: 120 }} />
        </View>

        {selected ? (
          <View style={{ gap: spacing.sm, padding: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Text variant="headline">{selected.ru}</Text>
                <Text variant="caption" tone="secondary">
                  {selected.de}
                  {selected.transcription ? ` · ${selected.transcription}` : ''}
                </Text>
              </View>
              <AudioButton text={selected.ru} audioKey={`story-word-${selected.ru}`} size="md" accessibilityLabel="Wort anhören" />
              <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                <Ionicons name="close" size={16} color={colors.textTertiary} />
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
              <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
                Wort aus dem Text – antippen für Bedeutung und Aussprache.
              </Text>
              <Pressable onPress={() => router.push(`/personal?add=${encodeURIComponent(selected.ru)}`)} hitSlop={6}>
                <Text variant="caption" tone="accent">
                  Als Vokabel speichern
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={{ gap: spacing.lg }}>
          {story.sentences.map((sentence, index) => {
            const isActive = activeKey === `${sequenceKey}-${index}`;
            const words = sentence.ru.split(/\s+/);
            return (
              <View key={`${index}-${sentence.ru}`} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {words.map((raw, wordIndex) => (
                      <Pressable key={`${raw}-${wordIndex}`} onPress={() => setSelected(resolve(raw))} hitSlop={4}>
                        <Text variant="body" weight={isActive ? '600' : '400'} tone={isActive ? 'accent' : 'default'} style={{ marginRight: 4 }}>
                          {raw}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <AudioButton
                    text={sentence.ru}
                    audioKey={`${sequenceKey}-${index}`}
                    size="sm"
                    rate={0.8}
                    accessibilityLabel="Satz anhören"
                  />
                </View>
                {showAllDe || showDe[index] ? (
                  <Text variant="caption" tone="secondary">
                    {sentence.de}
                  </Text>
                ) : (
                  <Pressable onPress={() => setShowDe((prev) => ({ ...prev, [index]: true }))} hitSlop={6}>
                    <Text variant="caption" tone="tertiary">
                      Übersetzung anzeigen
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>

        <Divider />

        <View>
          <SectionLabel>Verständnisfragen</SectionLabel>
          {story.questions.map((question, questionIndex) => (
            <View key={question.question} style={{ marginBottom: spacing.lg }}>
              <Text variant="body" weight="500" style={{ marginBottom: spacing.sm }}>
                {questionIndex + 1}. {question.question}
              </Text>
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[questionIndex] === optionIndex;
                const isCorrect = submitted && optionIndex === question.answer;
                const isWrong = submitted && isSelected && optionIndex !== question.answer;
                return (
                  <Pressable
                    key={option}
                    disabled={submitted}
                    onPress={() => setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))}
                    style={{ paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                  >
                    <Text variant="caption" style={{ flex: 1 }} tone={isCorrect ? 'success' : isWrong ? 'danger' : 'default'}>
                      {option}
                    </Text>
                    {isCorrect ? <Ionicons name="checkmark" size={14} color={colors.success} /> : null}
                    {isWrong ? <Ionicons name="close" size={14} color={colors.danger} /> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {submitted || finished ? (
            <View style={{ gap: spacing.sm }}>
              <Text variant="headline">
                {correct} von {story.questions.length} richtig
              </Text>
              <ProgressBar value={story.questions.length === 0 ? 0 : correct / story.questions.length} color={colors.success} />
              <Button
                label="Noch einmal"
                variant="secondary"
                onPress={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setFinished(false);
                }}
                style={{ alignSelf: 'flex-start', marginTop: spacing.sm }}
              />
            </View>
          ) : (
            <Button
              label="Antworten prüfen"
              disabled={Object.keys(answers).length < story.questions.length}
              onPress={() => {
                setSubmitted(true);
                setFinished(true);
                recordActivity({
                  kind: 'story',
                  label: `Geschichte: ${story.title}`,
                  minutes: story.minutes,
                  xp: correct * 2,
                  correct,
                  total: story.questions.length,
                  refId: story.id,
                });
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
