import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, ProgressBar, ScreenHeader, Segmented, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { scenarios } from '@/data/scenarios';
import { vocabulary } from '@/data/vocabulary';
import { listenRussian, pronunciationSupported, scoreFeedback, scorePronunciation } from '@/services/speech';
import { useAppStore } from '@/store/useAppStore';

interface Phrase {
  id: string;
  ru: string;
  de: string;
  source: string;
}

export default function SpeakingScreen() {
  const router = useRouter();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const [filter, setFilter] = useState<'basis' | 'reisen' | 'fortgeschritten'>('basis');
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<{ score: number; missed: string[]; heard: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phrases = useMemo<Phrase[]>(() => {
    if (filter === 'fortgeschritten') {
      return vocabulary
        .filter((entry) => entry.level === 'A2' || entry.level === 'B1' || entry.level === 'B2' || entry.level === 'C1')
        .slice(0, 16)
        .map((entry) => ({ id: `adv-${entry.id}`, ru: entry.example.ru, de: entry.example.de, source: `${entry.level} · ${entry.de}` }));
    }
    if (filter === 'reisen') {
      return scenarios.flatMap((scenario) =>
        scenario.keyPhrases.map((phrase, phraseIndex) => ({
          id: `${scenario.id}-${phraseIndex}`,
          ru: phrase.ru,
          de: phrase.de,
          source: scenario.title,
        })),
      );
    }
    return vocabulary
      .filter((entry) => entry.level === 'A0')
      .slice(0, 14)
      .map((entry) => ({ id: entry.id, ru: entry.example.ru, de: entry.example.de, source: 'Grundlagen' }));
  }, [filter]);

  const phrase = phrases[index];
  const supported = pronunciationSupported();

  const record = async () => {
    if (!phrase) return;
    setError(null);
    setRecording(true);
    try {
      const heard = await listenRussian(10000);
      const score = scorePronunciation(phrase.ru, heard);
      setResult({ score: score.score, missed: score.missed, heard });
      recordActivity({
        kind: 'speaking',
        label: `Aussprache: ${phrase.ru.slice(0, 24)}`,
        minutes: 1,
        xp: score.score >= 60 ? 4 : 1,
        correct: score.score >= 60 ? 1 : 0,
        total: 1,
        refId: phrase.id,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Aufnahme fehlgeschlagen');
    } finally {
      setRecording(false);
    }
  };

  if (!phrase) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="headline">Keine Sätze verfügbar</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Aussprache" subtitle={`${index + 1} von ${phrases.length}`} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.xl }}>
        <Segmented
          options={[
            { value: 'basis', label: 'Grundlagen' },
            { value: 'reisen', label: 'Reisen' },
            { value: 'fortgeschritten', label: 'A2–C1' },
          ]}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setIndex(0);
            setResult(null);
          }}
        />

        <View style={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
          <Text variant="caption" tone="tertiary">
            {phrase.source}
          </Text>
          <Text variant="title">{phrase.ru}</Text>
          <Text variant="body" tone="secondary">
            {phrase.de}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <AudioButton text={phrase.ru} audioKey={`speaking-slow-${phrase.id}`} size="lg" rate={0.7} accessibilityLabel="Langsam anhören" />
            <Text variant="micro" tone="tertiary">Langsam</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <AudioButton text={phrase.ru} audioKey={`speaking-normal-${phrase.id}`} size="lg" rate={1} accessibilityLabel="Normal anhören" />
            <Text variant="micro" tone="tertiary">Normal</Text>
          </View>
          <Pressable
            disabled={!supported || recording}
            onPress={record}
            accessibilityLabel="Aufnehmen"
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: recording ? colors.danger : colors.borderStrong,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : supported ? 1 : 0.35,
            })}
          >
            <Ionicons name={recording ? 'stop' : 'mic-outline'} size={22} color={recording ? colors.danger : colors.text} />
          </Pressable>
        </View>

        <Text variant="caption" tone="tertiary" center>
          {supported
            ? 'Mikrofon antippen und den Satz deutlich nachsprechen.'
            : 'Spracherkennung ist auf diesem Gerät nicht verfügbar. Nutze das Modell zum Nachsprechen.'}
        </Text>

        {result ? (
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" tone={result.score >= 60 ? 'success' : 'danger'}>
                {scoreFeedback(result.score).label}
              </Text>
              <Text variant="caption" tone="secondary">
                {result.score} %
              </Text>
            </View>
            <ProgressBar value={result.score / 100} color={result.score >= 60 ? colors.success : colors.danger} />
            <Text variant="caption" tone="secondary">
              {scoreFeedback(result.score).hint}
            </Text>
            {result.heard ? (
              <Text variant="caption" tone="tertiary">
                Erkannt: {result.heard}
              </Text>
            ) : null}
            {result.missed.length === 0 ? (
              <Text variant="caption" tone="success">
                Alle Wörter erkannt
              </Text>
            ) : null}
            {result.missed.length > 0 ? (
              <Text variant="caption" tone="tertiary">
                Unklar: {result.missed.join(' · ')}
              </Text>
            ) : null}
          </View>
        ) : null}

        {error ? (
          <Text variant="caption" tone="danger">
            {error}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, marginTop: spacing.md }}>
          <Pressable
            disabled={index === 0}
            onPress={() => {
              setIndex(Math.max(0, index - 1));
              setResult(null);
            }}
            style={{ opacity: index === 0 ? 0.35 : 1 }}
          >
            <Text variant="caption" tone="secondary">
              Zurück
            </Text>
          </Pressable>
          <Pressable
            disabled={index + 1 >= phrases.length}
            onPress={() => {
              setIndex(Math.min(phrases.length - 1, index + 1));
              setResult(null);
            }}
            style={{ opacity: index + 1 >= phrases.length ? 0.35 : 1 }}
          >
            <Text variant="caption" tone="secondary">
              Weiter
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text variant="caption" tone="tertiary">
            Bewertung: Die Spracherkennung liefert einen Text, der Wort für Wort mit dem Ziel verglichen wird. Die Zahl zeigt
            erkannte Wörter, nicht die Klangfarbe.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
