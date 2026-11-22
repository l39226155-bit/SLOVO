import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Divider, IconButton, Input, ProgressBar, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import type { Level } from '@/data/types';
import type { Goal } from '@/store/types';
import { useAppStore } from '@/store/useAppStore';

const GOALS: { value: Goal; label: string; hint: string }[] = [
  { value: 'travel', label: 'Reisen', hint: 'Im Urlaub sicher sprechen' },
  { value: 'work', label: 'Beruf', hint: 'Für Job und Kollegen' },
  { value: 'family', label: 'Familie und Freunde', hint: 'Mit Vertrauten reden' },
  { value: 'culture', label: 'Kultur', hint: 'Literatur, Musik, Filme' },
  { value: 'exam', label: 'Prüfung', hint: 'TRKI oder Zertifikat' },
];

const MINUTES = [5, 10, 15, 20, 30];

const PLACEMENT = [
  { question: '„Как вас зову́т?“ bedeutet …', options: ['Wie heißen Sie?', 'Woher kommen Sie?', 'Wie geht es Ihnen?'], answer: 0 },
  { question: 'Welche Form ist richtig? „Я ___ по-ру́сски.“', options: ['говорю́', 'говори́шь', 'говори́т'], answer: 0 },
  { question: 'Was ist der Akkusativ von „кни́га“?', options: ['кни́гу', 'кни́ге', 'кни́ги'], answer: 0 },
];

const TOTAL = 7;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('Deutsch');
  const [goal, setGoal] = useState<Goal>('travel');
  const [minutes, setMinutes] = useState(10);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [step, fade]);

  const placementScore = PLACEMENT.reduce((score, item, index) => (answers[index] === item.answer ? score + 1 : score), 0);
  const level: Level = placementScore >= 2 ? 'A1' : 'A0';

  const next = () => {
    if (step === TOTAL - 1) {
      completeOnboarding({
        name: name.trim() || 'Lernende:r',
        nativeLanguage: language,
        goal,
        dailyMinutes: minutes,
        level,
        placementScore,
        createdAt: new Date().toISOString(),
      });
      router.replace('/(tabs)/home');
      return;
    }
    setStep((current) => Math.min(TOTAL - 1, current + 1));
  };

  const body = (() => {
    switch (step) {
      case 0:
        return (
          <View style={{ gap: spacing.lg, paddingTop: spacing.xxl }}>
            <Text style={{ fontSize: 15, letterSpacing: 4, color: colors.textTertiary }}>СЛОВО</Text>
            <Text variant="display">SLOVO</Text>
            <Text variant="title" tone="secondary">
              Russisch lernen,{'\n'}das bleibt.
            </Text>
            <Text variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
              Ein vollständiger Kurs ab null, ein Vokabeltrainer mit Wiederholungsplan, Alphabet, Grammatik,
              Hörverständnis und Aussprache – in einer ruhigen Oberfläche.
            </Text>
          </View>
        );

      case 1:
        return (
          <Step title="Deine Muttersprache" subtitle="Erklärungen richten sich danach.">
            {['Deutsch', 'English', 'Andere'].map((item) => (
              <Option key={item} label={item} selected={language === item} onPress={() => setLanguage(item)} />
            ))}
          </Step>
        );

      case 2:
        return (
          <Step title="Warum lernst du Russisch?" subtitle="Das bestimmt deine Empfehlungen.">
            {GOALS.map((item) => (
              <Option
                key={item.value}
                label={item.label}
                hint={item.hint}
                selected={goal === item.value}
                onPress={() => setGoal(item.value)}
              />
            ))}
          </Step>
        );

      case 3:
        return (
          <Step title="Wo stehst du?" subtitle="Drei Fragen – oder du startest bei null.">
            {PLACEMENT.map((item, index) => (
              <View key={item.question} style={{ marginBottom: spacing.lg }}>
                <Text variant="body" weight="500" style={{ marginBottom: spacing.sm }}>
                  {index + 1}. {item.question}
                </Text>
                {item.options.map((option, optionIndex) => {
                  const selected = answers[index] === optionIndex;
                  const answered = answers[index] !== undefined;
                  const correct = optionIndex === item.answer;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                      style={{ paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                    >
                      <Text
                        variant="caption"
                        style={{ flex: 1 }}
                        tone={answered && selected ? (correct ? 'success' : 'danger') : selected ? 'default' : 'secondary'}
                      >
                        {option}
                      </Text>
                      {answered && selected ? (
                        <Ionicons name={correct ? 'checkmark' : 'close'} size={14} color={correct ? colors.success : colors.danger} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
              <Pressable
                onPress={() => {
                  setAnswers({});
                  setStep(4);
                }}
              >
                <Text variant="caption" tone="tertiary">
                  Ich fange bei null an
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('/placement')}>
                <Text variant="caption" tone="accent">
                  Ausführlicher Test
                </Text>
              </Pressable>
            </View>
          </Step>
        );

      case 4:
        return (
          <Step title="Dein Tagesziel" subtitle="Lieber kurz und täglich.">
            {MINUTES.map((item) => (
              <Option
                key={item}
                label={`${item} Minuten`}
                hint={item <= 5 ? 'Sanfter Einstieg' : item >= 20 ? 'Intensiv' : 'Empfohlen'}
                selected={minutes === item}
                onPress={() => setMinutes(item)}
              />
            ))}
          </Step>
        );

      case 5:
        return (
          <Step title="Wie dürfen wir dich nennen?" subtitle="Nur für die Begrüßung.">
            <Input value={name} onChangeText={setName} placeholder="Vorname" autoFocus returnKeyType="done" onSubmitEditing={() => name.trim() && next()} />
            <Text variant="caption" tone="tertiary">
              Dein Fortschritt bleibt auf diesem Gerät. Es ist kein Konto nötig.
            </Text>
          </Step>
        );

      default:
        return (
          <Step title="Bereit" subtitle="Dein Lernplan steht.">
            <View>
              <SummaryRow label="Name" value={name.trim() || 'Lernende:r'} />
              <Divider />
              <SummaryRow label="Muttersprache" value={language} />
              <Divider />
              <SummaryRow label="Ziel" value={GOALS.find((item) => item.value === goal)?.label ?? '–'} />
              <Divider />
              <SummaryRow label="Startniveau" value={level} />
              <Divider />
              <SummaryRow label="Tagesziel" value={`${minutes} Minuten`} />
            </View>
            <Text variant="caption" tone="tertiary">
              {level === 'A0'
                ? 'Du beginnst mit dem Alphabet und den ersten Wörtern.'
                : 'Du beginnst mit dem A1-Kurs – die Grundlagen kannst du überspringen.'}
            </Text>
          </Step>
        );
    }
  })();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
        }}
      >
        {step > 0 ? (
          <IconButton icon="chevron-back" size={36} onPress={() => setStep((current) => Math.max(0, current - 1))} accessibilityLabel="Zurück" />
        ) : (
          <View style={{ width: 36 }} />
        )}
        <View style={{ flex: 1 }}>
          <ProgressBar value={(step + 1) / TOTAL} height={2} />
        </View>
        <Text variant="caption" tone="tertiary">
          {step + 1}/{TOTAL}
        </Text>
      </View>

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg }}>
          {body}
        </ScrollView>
      </Animated.View>

      <View
        style={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Button
          label={step === 0 ? 'Loslegen' : step === TOTAL - 1 ? 'Zum Dashboard' : 'Weiter'}
          onPress={next}
          disabled={step === 5 && name.trim().length === 0}
        />
      </View>
    </View>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.lg, paddingTop: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text variant="title">{title}</Text>
        <Text variant="body" tone="secondary">
          {subtitle}
        </Text>
      </View>
      <View style={{ gap: spacing.sm }}>{children}</View>
    </View>
  );
}

function Option({
  label,
  hint,
  selected,
  onPress,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ flex: 1 }}>
        <Text variant="body">{label}</Text>
        {hint ? (
          <Text variant="caption" tone="tertiary">
            {hint}
          </Text>
        ) : null}
      </View>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={selected ? colors.accent : colors.textTertiary}
      />
    </Pressable>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md }}>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
      <Text variant="caption">{value}</Text>
    </View>
  );
}
