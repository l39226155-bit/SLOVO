import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Divider, Input, ProgressBar, Screen, Segmented, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { vocabulary } from '@/data/vocabulary';
import type { Vocab } from '@/data/types';
import { relativeDue } from '@/services/format';
import { isDue, isMastered, strength } from '@/services/srs';
import { useAppStore } from '@/store/useAppStore';
import { dueCards, learnedWordCount, masteredWordCount } from '@/store/selectors';

type Filter = 'alle' | 'faellig' | 'gespeichert';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'faellig', label: 'Fällig' },
  { value: 'gespeichert', label: 'Merkliste' },
];

const TYPE_LABEL: Record<Vocab['type'], string> = {
  noun: 'Substantiv',
  verb: 'Verb',
  adjective: 'Adjektiv',
  adverb: 'Adverb',
  phrase: 'Wendung',
  pronoun: 'Pronomen',
  numeral: 'Zahlwort',
  preposition: 'Präposition',
  conjunction: 'Konjunktion',
};

export default function VocabScreen() {
  const router = useRouter();
  const cards = useAppStore((state) => state.cards);
  const savedWords = useAppStore((state) => state.savedWords);
  const settings = useAppStore((state) => state.settings);
  const toggleSavedWord = useAppStore((state) => state.toggleSavedWord);
  const ensureCards = useAppStore((state) => state.ensureCards);

  const [filter, setFilter] = useState<Filter>('alle');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  // 144 rows at once are slow on small phones; render in pages of 40.
  const [limit, setLimit] = useState(40);

  const due = useMemo(() => dueCards({ cards }), [cards]);
  const learned = learnedWordCount({ cards });
  const mastered = masteredWordCount({ cards });

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return vocabulary
      .filter((entry) => {
        const card = cards[entry.id];
        if (filter === 'faellig') return Boolean(card) && isDue(card);
        if (filter === 'gespeichert') return savedWords.includes(entry.id);
        return true;
      })
      .filter(
        (entry) =>
          !needle ||
          entry.ru.toLowerCase().includes(needle) ||
          entry.de.toLowerCase().includes(needle) ||
          entry.transcription.toLowerCase().includes(needle),
      )
      .sort((a, b) => {
        const cardA = cards[a.id];
        const cardB = cards[b.id];
        if (cardA && cardB) return strength(cardA) - strength(cardB);
        if (cardA) return -1;
        if (cardB) return 1;
        return a.ru.localeCompare(b.ru, 'ru');
      });
  }, [query, filter, cards, savedWords]);

  return (
    <Screen>
      <View style={{ gap: spacing.lg }}>
        <View>
          <Text variant="title">Wörter</Text>
          <Text variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
            {learned} im Training · {mastered} gefestigt · {vocabulary.length} verfügbar
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <ProgressBar value={vocabulary.length === 0 ? 0 : mastered / vocabulary.length} color={colors.success} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="caption" tone="secondary">
              {due.length > 0 ? `${due.length} Karten fällig` : 'Keine Karten fällig'}
            </Text>
            <Button
              label={due.length > 0 ? 'Wiederholen' : 'Üben'}
              variant="secondary"
              onPress={() => router.push('/review')}
              style={{ height: 40, paddingHorizontal: spacing.md }}
            />
          </View>
        </View>

        <Input
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setLimit(40);
          }}
          placeholder="Suche"
        />
        <Segmented
          options={FILTERS}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setLimit(40);
          }}
        />
      </View>

      <View style={{ marginTop: spacing.md }}>
        {entries.length === 0 ? (
          <View style={{ paddingVertical: spacing.xl, gap: spacing.sm }}>
            <Text variant="headline">Keine Einträge</Text>
            <Text variant="body" tone="secondary">
              Passe Suche oder Filter an.
            </Text>
          </View>
        ) : (
          entries.slice(0, limit).map((entry, index) => {
            const card = cards[entry.id];
            const saved = savedWords.includes(entry.id);
            const isOpen = openId === entry.id;

            return (
              <View key={entry.id}>
                {index > 0 ? <Divider /> : null}
                <View style={{ paddingVertical: spacing.md, gap: spacing.sm }}>
                  <Pressable onPress={() => setOpenId(isOpen ? null : entry.id)} style={{ flexDirection: 'row', gap: spacing.md }}>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text variant="headline">{entry.ru}</Text>
                      {settings.showTranscription ? (
                        <Text variant="caption" tone="tertiary">
                          {entry.transcription}
                        </Text>
                      ) : null}
                      <Text variant="body" tone="secondary">
                        {entry.de}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <AudioButton text={entry.ru} audioKey={`vocab-${entry.id}`} size="sm" />
                      <Pressable
                        onPress={() => toggleSavedWord(entry.id)}
                        hitSlop={8}
                        accessibilityLabel={saved ? 'Aus Merkliste entfernen' : 'Zur Merkliste'}
                        accessibilityRole="button"
                      >
                        <Ionicons
                          name={saved ? 'bookmark' : 'bookmark-outline'}
                          size={16}
                          color={saved ? colors.accent : colors.textTertiary}
                        />
                      </Pressable>
                    </View>
                  </Pressable>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <ProgressBar
                        value={card ? strength(card) : 0}
                        height={2}
                        color={card && isMastered(card) ? colors.success : colors.accent}
                      />
                    </View>
                    <Text variant="caption" tone="tertiary" style={{ fontSize: 11 }}>
                      {card ? (isDue(card) ? 'fällig' : relativeDue(card.dueAt)) : 'neu'}
                    </Text>
                  </View>

                  {isOpen ? (
                    <View style={{ gap: spacing.sm, paddingTop: spacing.sm }}>
                      <Divider />
                      <Text variant="caption" tone="tertiary">
                        {TYPE_LABEL[entry.type]} · {entry.level}
                        {entry.gender ? ` · ${entry.gender === 'm' ? 'maskulin' : entry.gender === 'f' ? 'feminin' : 'neutrum'}` : ''}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text variant="body">{entry.example.ru}</Text>
                          <Text variant="caption" tone="secondary">
                            {entry.example.de}
                          </Text>
                        </View>
                        <AudioButton text={entry.example.ru} audioKey={`vocab-example-${entry.id}`} size="sm" />
                      </View>
                      {entry.grammar ? (
                        <Text variant="caption" tone="secondary">
                          {entry.grammar}
                        </Text>
                      ) : null}
                      {card ? (
                        <Text variant="caption" tone="tertiary">
                          Wiederholungen {card.reps} · Intervall {card.intervalDays} Tage
                        </Text>
                      ) : (
                        <Pressable onPress={() => ensureCards([entry.id])}>
                          <Text variant="caption" tone="accent">
                            Ins Training aufnehmen
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
        {entries.length > limit ? (
          <View style={{ paddingTop: spacing.md }}>
            <Button
              label={`Weitere ${Math.min(40, entries.length - limit)} anzeigen`}
              variant="secondary"
              onPress={() => setLimit(limit + 40)}
            />
            <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
              {limit} von {entries.length} Einträgen geladen
            </Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
