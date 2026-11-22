import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Divider, IconButton, Input, ProgressBar, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, radii, spacing } from '@/theme/tokens';
import { chapterById, lessonById, lessonStatus } from '@/data/course';
import type { Exercise } from '@/data/types';
import { isAnswerCorrect } from '@/services/format';
import { stopAudio } from '@/services/audio';
import { listenRussian, pronunciationSupported, scoreFeedback, scorePronunciation } from '@/services/speech';
import { useAppStore } from '@/store/useAppStore';

interface ExerciseResult {
  id: string;
  correct: boolean;
  skipped?: boolean;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lesson = id ? lessonById[id] : undefined;
  const lessonProgress = useAppStore((state) => state.lessons);
  const completeLesson = useAppStore((state) => state.completeLesson);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explain?: string } | null>(null);
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [wrongPairs, setWrongPairs] = useState(0);
  const [leftPick, setLeftPick] = useState<string | null>(null);
  const [rightPick, setRightPick] = useState<string | null>(null);
  const [orderPicked, setOrderPicked] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [spoken, setSpoken] = useState<{ score: number; missed: string[]; heard: string } | null>(null);
  const startedAt = useRef(Date.now());
  const savedRef = useRef(false);
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const exercises = lesson?.exercises ?? [];
  const exercise = exercises[index];
  const locked = useMemo(() => (lesson ? lessonStatus(lesson.id, lessonProgress) === 'locked' : false), [lesson, lessonProgress]);

  useEffect(() => {
    if (!feedback) return;
    feedbackAnim.setValue(0);
    Animated.timing(feedbackAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [feedback, feedbackAnim]);

  useEffect(() => () => void stopAudio(), []);

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text variant="headline">Lektion nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  if (locked) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={22} color={colors.textTertiary} />
        <Text variant="headline" style={{ marginTop: spacing.md }}>
          Noch gesperrt
        </Text>
        <Text variant="body" tone="secondary" center style={{ marginTop: spacing.xs, maxWidth: 300 }}>
          Schließe zuerst die vorherige Lektion ab.
        </Text>
        <Button label="Zum Kurs" onPress={() => router.replace('/(tabs)/course')} style={{ alignSelf: 'stretch', marginTop: spacing.xl }} />
      </View>
    );
  }

  const resetExercise = () => {
    setAnswer('');
    setSelected(null);
    setMatched({});
    setWrongPairs(0);
    setLeftPick(null);
    setRightPick(null);
    setOrderPicked([]);
    setSpoken(null);
  };

  const record = (isCorrect: boolean, explain?: string) => {
    if (!results.some((result) => result.id === exercise.id)) {
      setResults((prev) => [...prev, { id: exercise.id, correct: isCorrect }]);
    }
    setFeedback({ correct: isCorrect, explain });
  };

  const advance = () => {
    setFeedback(null);
    resetExercise();
    if (index + 1 >= exercises.length) finish();
    else setIndex((current) => current + 1);
  };

  const finish = () => {
    if (!savedRef.current) {
      savedRef.current = true;
      const answered = results.filter((result) => !result.skipped);
      const correct = answered.filter((result) => result.correct).length;
      completeLesson({
        lessonId: lesson.id,
        vocabIds: lesson.vocabIds,
        correct,
        total: Math.max(1, answered.length),
        minutes: Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)),
        xp: lesson.xp,
        label: `Lektion: ${lesson.title}`,
      });
    }
    setFinished(true);
  };

  const skip = () => {
    if (!results.some((result) => result.id === exercise.id)) {
      setResults((prev) => [...prev, { id: exercise.id, correct: false, skipped: true }]);
    }
    advance();
  };

  const canCheck = (() => {
    switch (exercise.kind) {
      case 'choice':
      case 'listen':
        return selected !== null;
      case 'translate':
      case 'type':
      case 'cloze':
        return answer.trim().length > 0;
      case 'order':
        return orderPicked.length > 0;
      case 'match':
        return exercise.pairs.every((pair) => matched[pair.left]);
      case 'speak':
        return spoken !== null;
      default:
        return false;
    }
  })();

  const check = () => {
    switch (exercise.kind) {
      case 'choice':
      case 'listen':
        if (selected === null) return;
        record(selected === exercise.answer, exercise.explain);
        return;
      case 'translate':
      case 'type':
      case 'cloze':
        record(isAnswerCorrect(answer, exercise.answers), exercise.explain);
        return;
      case 'order':
        record(isAnswerCorrect(orderPicked.join(' '), [exercise.answer]), exercise.explain);
        return;
      case 'match':
        record(wrongPairs === 0, wrongPairs === 0 ? 'Alle Paare auf Anhieb richtig.' : `${wrongPairs} Fehlversuche.`);
        return;
      case 'speak':
        record((spoken?.score ?? 0) >= 60);
        return;
      default:
        return;
    }
  };

  if (finished) {
    const answered = results.filter((result) => !result.skipped);
    const correct = answered.filter((result) => result.correct).length;
    const percent = answered.length === 0 ? 0 : Math.round((correct / answered.length) * 100);

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={[styles.result, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={{ gap: spacing.xs }}>
            <Text variant="display">{percent} %</Text>
            <Text variant="headline">{percent >= 85 ? 'Sicher gemacht' : percent >= 60 ? 'Gut gemacht' : 'Weiter üben'}</Text>
            <Text variant="caption" tone="secondary">
              {correct} von {answered.length} richtig · +{lesson.xp} XP
            </Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm }}>
              <Text variant="caption" tone="secondary">
                Neue Vokabeln
              </Text>
              <Text variant="caption">{lesson.vocabIds.length}</Text>
            </View>
            <Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm }}>
              <Text variant="caption" tone="secondary">
                Kapitel
              </Text>
              <Text variant="caption">{chapterById[lesson.chapterId]?.title}</Text>
            </View>
            <Divider />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Button label="Weiter" onPress={() => router.replace('/(tabs)/course')} />
            <Button
              label="Lektion wiederholen"
              variant="secondary"
              onPress={() => {
                savedRef.current = false;
                setResults([]);
                setIndex(0);
                setFinished(false);
                setFeedback(null);
                resetExercise();
                startedAt.current = Date.now();
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <IconButton icon="close" size={36} onPress={() => router.back()} accessibilityLabel="Lektion schließen" />
        <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
          <ProgressBar value={(index + (feedback ? 1 : 0)) / Math.max(1, exercises.length)} height={3} />
        </View>
        <Text variant="caption" tone="tertiary">
          {index + 1}/{exercises.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140, gap: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing.xs }}>
          <Text variant="micro" tone="tertiary">
            {lesson.title}
          </Text>
          <Text variant="title">{promptFor(exercise)}</Text>
        </View>

        <ExerciseBody
          exercise={exercise}
          answer={answer}
          setAnswer={setAnswer}
          selected={selected}
          setSelected={setSelected}
          matched={matched}
          setMatched={setMatched}
          wrongPairs={wrongPairs}
          setWrongPairs={setWrongPairs}
          leftPick={leftPick}
          setLeftPick={setLeftPick}
          rightPick={rightPick}
          setRightPick={setRightPick}
          orderPicked={orderPicked}
          setOrderPicked={setOrderPicked}
          recording={recording}
          setRecording={setRecording}
          spoken={spoken}
          setSpoken={setSpoken}
          disabled={Boolean(feedback)}
          audioKey={`${lesson.id}-${exercise.id}`}
        />
      </ScrollView>

      {feedback ? (
        <Animated.View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + spacing.lg,
              opacity: feedbackAnim,
              transform: [{ translateY: feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons
              name={feedback.correct ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={feedback.correct ? colors.success : colors.danger}
            />
            <Text variant="headline" tone={feedback.correct ? 'success' : 'danger'}>
              {feedback.correct ? 'Richtig' : 'Nicht richtig'}
            </Text>
          </View>
          {solutionText(exercise) ? (
            <Text variant="body" style={{ marginTop: spacing.xs }}>
              {solutionText(exercise)}
            </Text>
          ) : null}
          {feedback.explain ? (
            <Text variant="caption" tone="secondary" style={{ marginTop: spacing.xs }}>
              {feedback.explain}
            </Text>
          ) : null}
          <Button
            label={index + 1 >= exercises.length ? 'Abschließen' : 'Weiter'}
            onPress={advance}
            style={{ marginTop: spacing.md }}
          />
        </Animated.View>
      ) : (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Prüfen" onPress={check} disabled={!canCheck} />
          {exercise.kind === 'speak' && !pronunciationSupported() ? (
            <Pressable onPress={skip} style={{ paddingVertical: spacing.sm }}>
              <Text variant="caption" tone="tertiary" center>
                Ohne Mikrofon weiter
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

/* --------------------------------------------------------------- pieces */

function promptFor(exercise: Exercise): string {
  switch (exercise.kind) {
    case 'choice':
      return exercise.prompt;
    case 'listen':
      return exercise.question;
    case 'translate':
      return exercise.direction === 'ru-de' ? 'Übersetze ins Deutsche' : 'Übersetze ins Russische';
    case 'type':
      return exercise.prompt;
    case 'cloze':
      return 'Ergänze das fehlende Wort';
    case 'match':
      return exercise.prompt;
    case 'order':
      return 'Bringe die Wörter in die richtige Reihenfolge';
    case 'speak':
      return 'Sprich den Satz nach';
    default:
      return '';
  }
}

function solutionText(exercise: Exercise): string | null {
  switch (exercise.kind) {
    case 'choice':
    case 'listen':
      return exercise.options[exercise.answer];
    case 'translate':
    case 'type':
    case 'cloze':
      return exercise.answers[0];
    case 'order':
      return exercise.answer;
    case 'match':
      return exercise.pairs.map((pair) => `${pair.left} = ${pair.right}`).join(' · ');
    default:
      return null;
  }
}

function ExerciseBody({
  exercise,
  answer,
  setAnswer,
  selected,
  setSelected,
  matched,
  setMatched,
  wrongPairs,
  setWrongPairs,
  leftPick,
  setLeftPick,
  rightPick,
  setRightPick,
  orderPicked,
  setOrderPicked,
  recording,
  setRecording,
  spoken,
  setSpoken,
  disabled,
  audioKey,
}: {
  exercise: Exercise;
  answer: string;
  setAnswer: (value: string) => void;
  selected: number | null;
  setSelected: (value: number | null) => void;
  matched: Record<string, boolean>;
  setMatched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  wrongPairs: number;
  setWrongPairs: React.Dispatch<React.SetStateAction<number>>;
  leftPick: string | null;
  setLeftPick: (value: string | null) => void;
  rightPick: string | null;
  setRightPick: (value: string | null) => void;
  orderPicked: string[];
  setOrderPicked: (value: string[]) => void;
  recording: boolean;
  setRecording: (value: boolean) => void;
  spoken: { score: number; missed: string[]; heard: string } | null;
  setSpoken: (value: { score: number; missed: string[]; heard: string } | null) => void;
  disabled: boolean;
  audioKey: string;
}) {
  if (exercise.kind === 'choice' || exercise.kind === 'listen') {
    return (
      <View style={{ gap: spacing.lg }}>
        {exercise.kind === 'listen' ? (
          <View style={styles.stimulus}>
            <AudioButton text={exercise.audio} audioKey={audioKey} size="lg" accessibilityLabel="Satz anhören" />
            <Text variant="caption" tone="tertiary">
              Antippen zum Anhören
            </Text>
          </View>
        ) : exercise.stimulus ? (
          <View style={styles.stimulus}>
            <Text style={styles.stimulusText}>{exercise.stimulus}</Text>
            <AudioButton text={exercise.stimulus} audioKey={audioKey} size="lg" accessibilityLabel="Aussprache anhören" />
          </View>
        ) : null}

        <View>
          {exercise.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const correct = disabled && optionIndex === exercise.answer;
            const wrong = disabled && isSelected && optionIndex !== exercise.answer;
            return (
              <View key={option}>
                {optionIndex > 0 ? <Divider /> : null}
                <Pressable
                  disabled={disabled}
                  onPress={() => {
                    setSelected(optionIndex);
                    setAnswer(option);
                  }}
                  style={({ pressed }) => [styles.option, pressed && { opacity: 0.65 }]}
                >
                  <Text variant="body" style={{ flex: 1 }} tone={correct ? 'success' : wrong ? 'danger' : 'default'}>
                    {option}
                  </Text>
                  {correct ? <Ionicons name="checkmark" size={17} color={colors.success} /> : null}
                  {wrong ? <Ionicons name="close" size={17} color={colors.danger} /> : null}
                  {!disabled && isSelected ? <Ionicons name="ellipse" size={8} color={colors.accent} /> : null}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  if (exercise.kind === 'translate' || exercise.kind === 'type') {
    return (
      <View style={{ gap: spacing.lg }}>
        <View style={styles.stimulus}>
          <Text style={styles.stimulusText}>{exercise.prompt}</Text>
          {exercise.kind === 'translate' && exercise.direction === 'ru-de' ? (
            <AudioButton text={exercise.prompt} audioKey={audioKey} size="lg" accessibilityLabel="Satz anhören" />
          ) : null}
          {exercise.kind === 'type' && 'hint' in exercise && exercise.hint ? (
            <Text variant="caption" tone="tertiary" center>
              {exercise.hint}
            </Text>
          ) : null}
        </View>
        <Input
          value={answer}
          onChangeText={setAnswer}
          editable={!disabled}
          placeholder={exercise.kind === 'translate' && exercise.direction === 'ru-de' ? 'Deine Übersetzung' : 'Auf Russisch'}
        />
      </View>
    );
  }

  if (exercise.kind === 'cloze') {
    const [before, after] = exercise.sentence.split('___');
    return (
      <View style={{ gap: spacing.lg }}>
        <View style={styles.stimulus}>
          <Text center style={{ fontSize: 22, fontWeight: '600', color: colors.text, lineHeight: 32 }}>
            {before}
            <Text style={{ color: colors.accent }}> ___ </Text>
            {after}
          </Text>
          {exercise.translation ? (
            <Text variant="caption" tone="tertiary" center>
              {exercise.translation}
            </Text>
          ) : null}
        </View>
        <Input value={answer} onChangeText={setAnswer} editable={!disabled} placeholder="Fehlendes Wort" />
        {exercise.options ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {exercise.options.map((option) => (
              <Pressable key={option} onPress={() => setAnswer(option)} style={styles.suggestion}>
                <Text variant="caption">{option}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    );
  }

  if (exercise.kind === 'match') {
    const rights = [...exercise.pairs].sort((a, b) => a.right.localeCompare(b.right, 'de'));

    const settle = (left: string, right: string) => {
      const pair = exercise.pairs.find((item) => item.left === left);
      if (pair && pair.right === right) setMatched((prev) => ({ ...prev, [left]: true }));
      else setWrongPairs((value) => value + 1);
      setLeftPick(null);
      setRightPick(null);
    };

    return (
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          {exercise.pairs.map((pair, index) => {
            const isMatched = Boolean(matched[pair.left]);
            return (
              <View key={pair.left}>
                {index > 0 ? <Divider /> : null}
                <Pressable
                  disabled={isMatched}
                  onPress={() => {
                    setLeftPick(pair.left);
                    if (rightPick) settle(pair.left, rightPick);
                  }}
                  style={[styles.matchCell, leftPick === pair.left && { borderColor: colors.accent }]}
                >
                  <Text variant="caption" tone={isMatched ? 'success' : 'default'}>
                    {pair.left}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1 }}>
          {rights.map((pair, index) => {
            const used = Object.keys(matched).some(
              (left) => exercise.pairs.find((item) => item.left === left)?.right === pair.right,
            );
            return (
              <View key={pair.right}>
                {index > 0 ? <Divider /> : null}
                <Pressable
                  disabled={used}
                  onPress={() => {
                    setRightPick(pair.right);
                    if (leftPick) settle(leftPick, pair.right);
                  }}
                  style={[styles.matchCell, rightPick === pair.right && { borderColor: colors.accent }]}
                >
                  <Text variant="caption" tone={used ? 'success' : 'default'}>
                    {pair.right}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  if (exercise.kind === 'order') {
    const remaining = exercise.words.filter((word) => !orderPicked.includes(word));
    return (
      <View style={{ gap: spacing.lg }}>
        <View style={[styles.stimulus, { alignItems: 'flex-start', minHeight: 72 }]}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {orderPicked.length === 0 ? (
              <Text variant="caption" tone="tertiary">
                Wörter antippen
              </Text>
            ) : (
              orderPicked.map((word) => (
                <Pressable key={word} onPress={() => setOrderPicked(orderPicked.filter((item) => item !== word))}>
                  <View style={[styles.word, { borderColor: colors.accent }]}>
                    <Text variant="body">{word}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {remaining.map((word) => (
            <Pressable key={word} onPress={() => setOrderPicked([...orderPicked, word])}>
              <View style={styles.word}>
                <Text variant="body">{word}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        {exercise.translation ? (
          <Text variant="caption" tone="tertiary">
            {exercise.translation}
          </Text>
        ) : null}
      </View>
    );
  }

  if (exercise.kind === 'speak') {
    const supported = pronunciationSupported();
    return (
      <View style={{ gap: spacing.lg }}>
        <View style={styles.stimulus}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 34 }}>
            {exercise.target}
          </Text>
          <Text variant="caption" tone="tertiary" center>
            {exercise.translation}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xl }}>
          <AudioButton text={exercise.target} audioKey={audioKey} size="lg" rate={0.75} accessibilityLabel="Modell anhören" />
          <Pressable
            disabled={!supported || recording}
            onPress={async () => {
              setRecording(true);
              try {
                const heard = await listenRussian(10000);
                const score = scorePronunciation(exercise.target, heard);
                setSpoken({ score: score.score, missed: score.missed, heard });
              } catch (error) {
                setSpoken({ score: 0, missed: [error instanceof Error ? error.message : 'Aufnahme fehlgeschlagen'], heard: '' });
              } finally {
                setRecording(false);
              }
            }}
            style={({ pressed }) => [
              styles.micButton,
              recording && { borderColor: colors.danger },
              { opacity: pressed ? 0.7 : supported ? 1 : 0.35 },
            ]}
          >
            {recording ? (
              <Ionicons name="stop" size={22} color={colors.danger} />
            ) : (
              <Ionicons name="mic-outline" size={22} color={colors.text} />
            )}
          </Pressable>
        </View>

        {!supported ? (
          <Text variant="caption" tone="tertiary" center>
            Spracherkennung ist auf diesem Gerät nicht verfügbar. Höre das Modell und sprich laut nach.
          </Text>
        ) : null}

        {spoken ? (
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" tone={spoken.score >= 60 ? 'success' : 'danger'}>
                {scoreFeedback(spoken.score).label}
              </Text>
              <Text variant="caption" tone="secondary">
                {spoken.score} %
              </Text>
            </View>
            <ProgressBar value={spoken.score / 100} color={spoken.score >= 60 ? colors.success : colors.danger} />
            <Text variant="caption" tone="tertiary">
              {spoken.heard ? `Erkannt: ${spoken.heard}` : scoreFeedback(spoken.score).hint}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  result: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  stimulus: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  stimulusText: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  matchCell: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.sm,
    marginVertical: 2,
  },
  word: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
