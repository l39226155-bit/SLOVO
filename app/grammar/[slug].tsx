import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Divider, Input, ProgressBar, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, radii, spacing } from '@/theme/tokens';
import { grammarBySlug } from '@/data/grammar';
import type { Exercise } from '@/data/types';
import { isAnswerCorrect } from '@/services/format';
import { useAppStore } from '@/store/useAppStore';

export default function GrammarTopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const topic = slug ? grammarBySlug[slug] : undefined;

  if (!topic) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <Text variant="headline">Thema nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={topic.title} subtitle={`${topic.level} · ${topic.minutes} Min`} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.xl }}>
        <Text variant="body" tone="secondary">
          {topic.summary}
        </Text>

        {topic.sections.map((section, sectionIndex) => (
          <View key={section.heading} style={{ gap: spacing.md }}>
            <Text variant="headline">{section.heading}</Text>
            <Text variant="body" tone="secondary" style={{ lineHeight: 24 }}>
              {section.body}
            </Text>

            {section.table ? (
              <View style={{ borderRadius: radii.sm, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceRaised }}>
                  {section.table.head.map((cell) => (
                    <View key={cell} style={{ flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
                      <Text variant="caption" tone="tertiary">
                        {cell}
                      </Text>
                    </View>
                  ))}
                </View>
                {section.table.rows.map((row, rowIndex) => (
                  <View
                    key={`${rowIndex}-${row[0]}`}
                    style={{
                      flexDirection: 'row',
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <View key={`${cellIndex}-${cell}`} style={{ flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
                        <Text variant="caption" tone={cellIndex === 0 ? 'tertiary' : 'default'}>
                          {cell}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}

            {section.examples?.length ? (
              <View>
                {section.examples.map((example, exampleIndex) => (
                  <View key={example.ru}>
                    {exampleIndex > 0 ? <Divider /> : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text variant="body">{example.ru}</Text>
                        <Text variant="caption" tone="secondary">
                          {example.de}
                        </Text>
                      </View>
                      <AudioButton
                        text={example.ru}
                        audioKey={`grammar-${topic.slug}-${sectionIndex}-${exampleIndex}`}
                        size="sm"
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}

        <Divider />
        <GrammarExercises slug={topic.slug} title={topic.title} exercises={topic.exercises} />
      </ScrollView>
    </View>
  );
}

function GrammarExercises({ slug, title, exercises }: { slug: string; title: string; exercises: Exercise[] }) {
  const recordActivity = useAppStore((state) => state.recordActivity);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<null | { correct: boolean; expected: string }>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const exercise = exercises[index];
  const orderWords = useMemo(() => (exercise?.kind === 'order' ? exercise.words : []), [exercise]);

  if (!exercise) return null;

  const expected = (item: Exercise): string => {
    switch (item.kind) {
      case 'choice':
        return item.options[item.answer];
      case 'cloze':
      case 'translate':
      case 'type':
        return item.answers[0];
      case 'order':
        return item.answer;
      default:
        return '';
    }
  };

  const check = () => {
    let correct = false;
    if (exercise.kind === 'choice') correct = selected === exercise.answer;
    else if (exercise.kind === 'cloze' || exercise.kind === 'translate' || exercise.kind === 'type')
      correct = isAnswerCorrect(answer, exercise.answers);
    else if (exercise.kind === 'order') correct = isAnswerCorrect(picked.join(' '), [exercise.answer]);
    setFeedback({ correct, expected: expected(exercise) });
    setResults((prev) => [...prev, correct]);
  };

  const next = () => {
    setFeedback(null);
    setAnswer('');
    setSelected(null);
    setPicked([]);
    if (index + 1 >= exercises.length) {
      recordActivity({
        kind: 'grammar',
        label: `Grammatik: ${title}`,
        minutes: 2,
        xp: results.filter(Boolean).length * 2,
        correct: results.filter(Boolean).length,
        total: results.length,
        refId: slug,
      });
      setFinished(true);
    } else {
      setIndex((current) => current + 1);
    }
  };

  if (finished) {
    const correct = results.filter(Boolean).length;
    return (
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Übungen</SectionLabel>
        <Text variant="headline">
          {correct} von {results.length} richtig
        </Text>
        <ProgressBar value={results.length === 0 ? 0 : correct / results.length} color={colors.success} />
        <Button
          label="Noch einmal üben"
          variant="secondary"
          onPress={() => {
            setResults([]);
            setIndex(0);
            setFinished(false);
          }}
          style={{ alignSelf: 'flex-start', marginTop: spacing.sm }}
        />
      </View>
    );
  }

  const canCheck =
    exercise.kind === 'choice' ? selected !== null : exercise.kind === 'order' ? picked.length > 0 : answer.trim().length > 0;

  return (
    <View style={{ gap: spacing.md }}>
      <SectionLabel>{`Übung ${index + 1} von ${exercises.length}`}</SectionLabel>
      <ProgressBar value={index / exercises.length} height={2} />

      {exercise.kind === 'choice' ? (
        <View>
          <Text variant="body" style={{ marginBottom: spacing.sm }}>
            {exercise.prompt}
          </Text>
          {exercise.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const correct = Boolean(feedback) && optionIndex === exercise.answer;
            const wrong = Boolean(feedback) && isSelected && optionIndex !== exercise.answer;
            return (
              <View key={option}>
                {optionIndex > 0 ? <Divider /> : null}
                <Pressable
                  onPress={() => !feedback && setSelected(optionIndex)}
                  style={{ paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                >
                  <Text variant="caption" style={{ flex: 1 }} tone={correct ? 'success' : wrong ? 'danger' : 'default'}>
                    {option}
                  </Text>
                  {!feedback && isSelected ? <Ionicons name="ellipse" size={7} color={colors.accent} /> : null}
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}

      {exercise.kind === 'cloze' ? (
        <View style={{ gap: spacing.md }}>
          <Text variant="body">{exercise.sentence}</Text>
          <Input value={answer} onChangeText={setAnswer} editable={!feedback} placeholder="Fehlendes Wort" />
        </View>
      ) : null}

      {exercise.kind === 'order' ? (
        <View style={{ gap: spacing.md }}>
          <Text variant="body">{exercise.prompt}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {picked.map((word) => (
              <Pressable key={word} onPress={() => !feedback && setPicked(picked.filter((item) => item !== word))}>
                <View style={[styles.word, { borderColor: colors.accent }]}>
                  <Text variant="caption">{word}</Text>
                </View>
              </Pressable>
            ))}
            {orderWords
              .filter((word) => !picked.includes(word))
              .map((word) => (
                <Pressable key={word} onPress={() => !feedback && setPicked([...picked, word])}>
                  <View style={styles.word}>
                    <Text variant="caption">{word}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
      ) : null}

      {feedback ? (
        <Text variant="caption" tone={feedback.correct ? 'success' : 'danger'}>
          {feedback.correct ? 'Richtig' : `Lösung: ${feedback.expected}`}
        </Text>
      ) : null}

      <Button
        label={feedback ? (index + 1 >= exercises.length ? 'Abschließen' : 'Weiter') : 'Prüfen'}
        onPress={feedback ? next : check}
        disabled={!feedback && !canCheck}
      />
    </View>
  );
}

const styles = {
  word: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
