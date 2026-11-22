import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider, Screen, SectionLabel, Segmented, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { alphabet } from '@/data/alphabet';
import { useAppStore } from '@/store/useAppStore';

type Filter = 'alle' | 'vokal' | 'konsonant';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'vokal', label: 'Vokale' },
  { value: 'konsonant', label: 'Konsonanten' },
];

export default function AlphabetScreen() {
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const [filter, setFilter] = useState<Filter>('alle');
  const [quiz, setQuiz] = useState<{ letter: string; options: string[]; answer: number } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [picked, setPicked] = useState<number | null>(null);

  const letters = useMemo(() => {
    if (filter === 'vokal') return alphabet.filter((entry) => entry.type === 'vowel');
    if (filter === 'konsonant') return alphabet.filter((entry) => entry.type === 'consonant');
    return alphabet;
  }, [filter]);

  const startQuiz = () => {
    const pick = alphabet[Math.floor(Math.random() * alphabet.length)];
    const wrong = alphabet
      .filter((entry) => entry.lower !== pick.lower)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [pick.sound, ...wrong.map((entry) => entry.sound)].sort(() => Math.random() - 0.5);
    setQuiz({ letter: pick.upper + pick.lower, options, answer: options.indexOf(pick.sound) });
    setPicked(null);
  };

  const answerQuiz = (optionIndex: number) => {
    if (!quiz || picked !== null) return;
    const correct = optionIndex === quiz.answer;
    setPicked(optionIndex);
    setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    recordActivity({
      kind: 'alphabet',
      label: 'Alphabet-Quiz',
      xp: correct ? 2 : 0,
      correct: correct ? 1 : 0,
      total: 1,
      minutes: 0,
    });
  };

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="title">Alphabet</Text>
        <Text variant="caption" tone="tertiary">
          33 Buchstaben, {alphabet.filter((entry) => entry.falseFriend).length} davon klingen anders als sie aussehen.
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <SectionLabel
          action={quiz ? 'Nächster' : undefined}
          onPressAction={quiz ? () => startQuiz() : undefined}
        >
          {quiz ? `Quiz · ${score.correct}/${score.total} richtig` : 'Quiz'}
        </SectionLabel>

        {quiz ? (
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Text style={{ fontSize: 40, fontWeight: '600', color: colors.text }}>{quiz.letter}</Text>
              <AudioButton text={quiz.letter[0]} audioKey={`alphabet-quiz-${quiz.letter}`} size="sm" accessibilityLabel="Buchstabe anhören" />
            </View>
            {quiz.options.map((option, optionIndex) => {
              const answered = picked !== null;
              const isCorrect = optionIndex === quiz.answer;
              const isPicked = picked === optionIndex;
              return (
                <View key={option}>
                  {optionIndex > 0 ? <Divider /> : null}
                  <Pressable
                    onPress={() => answerQuiz(optionIndex)}
                    disabled={answered}
                    style={({ pressed }) => ({
                      paddingVertical: spacing.md,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text
                      variant="caption"
                      style={{ flex: 1 }}
                      tone={answered ? (isCorrect ? 'success' : isPicked ? 'danger' : 'tertiary') : 'secondary'}
                    >
                      {option}
                    </Text>
                    {answered && isCorrect ? <Ionicons name="checkmark" size={15} color={colors.success} /> : null}
                    {answered && isPicked && !isCorrect ? <Ionicons name="close" size={15} color={colors.danger} /> : null}
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : (
          <Pressable
            onPress={startQuiz}
            style={({ pressed }) => ({
              paddingVertical: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text variant="body" tone="secondary">
              Laut eines Buchstabens erkennen
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} />
          </Pressable>
        )}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Segmented options={FILTERS} value={filter} onChange={setFilter} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
          {letters.map((letter) => (
            <Pressable
              key={letter.lower}
              onPress={() => router.push(`/alphabet/${letter.lower}`)}
              accessibilityLabel={`Buchstabe ${letter.upper}`}
              style={({ pressed }) => ({
                width: '15.2%',
                aspectRatio: 0.86,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: pressed ? colors.surfaceRaised : colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              })}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text }}>{letter.upper}</Text>
              <Text variant="caption" tone="tertiary">
                {letter.lower}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <SectionLabel>Falsche Freunde</SectionLabel>
        <Text variant="body" tone="secondary">
          {alphabet
            .filter((entry) => entry.falseFriend)
            .map((entry) => `${entry.upper} wie ${entry.transcription}`)
            .join(' · ')}
        </Text>
        <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
          Diese Buchstaben sehen lateinisch aus, klingen aber anders – die häufigste Fehlerquelle beim Lesen.
        </Text>
      </View>
    </Screen>
  );
}
