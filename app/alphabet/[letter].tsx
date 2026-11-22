import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Divider, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, radii, spacing } from '@/theme/tokens';
import { alphabet, alphabetByLetter } from '@/data/alphabet';
import { vocabulary } from '@/data/vocabulary';
import { useAppStore } from '@/store/useAppStore';

export default function LetterScreen() {
  const { letter: letterParam } = useLocalSearchParams<{ letter: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recordActivity = useAppStore((state) => state.recordActivity);
  const letter = alphabetByLetter(String(letterParam ?? '').toLowerCase());
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [traced, setTraced] = useState(false);

  const words = useMemo(() => {
    if (!letter) return [];
    return vocabulary.filter((entry) => entry.ru.toLowerCase().includes(letter.lower)).slice(0, 5);
  }, [letter]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => setPoints([{ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }]),
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          setPoints((prev) => (prev.length > 500 ? prev : [...prev, { x: locationX, y: locationY }]));
        },
        onPanResponderRelease: () => {
          if (points.length > 12 && !traced) {
            setTraced(true);
            recordActivity({ kind: 'alphabet', label: 'Schreibübung', xp: 3, correct: 1, total: 1, minutes: 1 });
          }
        },
      }),
    [points.length, traced, recordActivity],
  );

  if (!letter) {
    return (
      <View style={styles.center}>
        <Text variant="headline">Buchstabe nicht gefunden</Text>
        <Button label="Zurück" variant="secondary" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  const position = alphabet.findIndex((entry) => entry.lower === letter.lower) + 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader onBack={() => router.back()} title={`${letter.upper} ${letter.lower}`} subtitle={`${position} von ${alphabet.length}`} />

      <View style={{ flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.md }}>
            <Text style={{ fontSize: 64, fontWeight: '600', color: colors.text, letterSpacing: -2 }}>{letter.upper}</Text>
            <Text style={{ fontSize: 64, fontWeight: '300', color: colors.textSecondary, letterSpacing: -2 }}>{letter.lower}</Text>
          </View>
          <AudioButton text={letter.lower} audioKey={`letter-${letter.lower}`} size="lg" accessibilityLabel="Buchstabe anhören" />
        </View>

        <Text variant="body" tone="secondary" style={{ marginTop: spacing.md }}>
          {letter.sound}
        </Text>
        <Text variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
          Name „{letter.name}“ · {letter.type === 'vowel' ? 'Vokal' : letter.type === 'sign' ? 'Zeichen' : 'Konsonant'}
        </Text>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionLabel>Beispiel</SectionLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text variant="headline">{letter.example.ru}</Text>
              <Text variant="caption" tone="secondary">
                {letter.example.de}
              </Text>
            </View>
            <AudioButton text={letter.example.ru} audioKey={`letter-example-${letter.lower}`} size="md" />
          </View>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionLabel action={traced ? 'geübt' : undefined}>Schreibübung</SectionLabel>
          <View style={styles.pad} {...panResponder.panHandlers}>
            <Text style={styles.padGhost}>{letter.upper}</Text>
            {points.map((point, index) => (
              <View
                key={`${index}-${Math.round(point.x)}-${Math.round(point.y)}`}
                style={{ position: 'absolute', left: point.x - 2, top: point.y - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent }}
              />
            ))}
            {points.length === 0 ? (
              <Text variant="caption" tone="tertiary">
                Mit dem Finger nachfahren
              </Text>
            ) : null}
          </View>
          <Pressable onPress={() => setPoints([])} style={{ paddingVertical: spacing.sm }}>
            <Text variant="caption" tone="tertiary">
              Löschen
            </Text>
          </Pressable>
        </View>

        {words.length > 0 ? (
          <View style={{ marginTop: spacing.lg }}>
            <SectionLabel>{`Wörter mit ${letter.upper}`}</SectionLabel>
            {words.map((entry, index) => (
              <View key={entry.id}>
                {index > 0 ? <Divider /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="body">{entry.ru}</Text>
                    <Text variant="caption" tone="tertiary">
                      {entry.de}
                    </Text>
                  </View>
                  <AudioButton text={entry.ru} audioKey={`letter-word-${entry.id}`} size="sm" />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: insets.bottom + spacing.xxxl }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  pad: {
    height: 200,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  padGhost: {
    position: 'absolute',
    fontSize: 140,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.045)',
  },
});
