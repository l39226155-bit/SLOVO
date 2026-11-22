import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Divider,
  IconButton,
  Input,
  Screen,
  ScreenHeader,
  SectionLabel,
  Text,
} from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, spacing } from '@/theme/tokens';
import { dictionaryEntries, GENDER_LABELS, searchDictionary, WORD_TYPE_LABELS, type DictionaryEntry } from '@/data/dictionary';
import { normalizeDe, normalizeRu } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';

export default function DictionaryScreen() {
  const router = useRouter();
  const personalWords = useAppStore((state) => state.personalWords);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DictionaryEntry | null>(null);

  const personalHits = useMemo(() => {
    if (query.trim().length < 2) return [];
    const ruQuery = normalizeRu(query);
    const deQuery = normalizeDe(query);
    return personalWords.filter(
      (word) => normalizeRu(word.ru).includes(ruQuery) || normalizeDe(word.de).includes(deQuery),
    );
  }, [personalWords, query]);

  const hits = useMemo(
    () => (query.trim().length >= 2 ? searchDictionary(query, 40) : dictionaryEntries.slice(0, 20).map((entry) => ({ entry, score: 1, via: 'ru' as const }))),
    [query],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Wörterbuch"
        subtitle={`${dictionaryEntries.length} Einträge`}
        onBack={() => router.back()}
        right={
          selected ? (
            <IconButton icon="close" onPress={() => setSelected(null)} accessibilityLabel="Detail schließen" />
          ) : undefined
        }
      />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.lg }}>
          <Input
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setSelected(null);
            }}
            placeholder="Russisch oder Deutsch suchen"
            autoCorrect={false}
          />
          <Text variant="caption" tone="tertiary">
            Teilbegriffe und Tippfehler werden gefunden – „apteka“ findet апте́ка, „Brot“ findet хлеб. Stresszeichen sind
            optional.
          </Text>

          {selected ? (
            <EntryDetail entry={selected} />
          ) : (
            <>
              {personalHits.length > 0 ? (
                <View>
                  <SectionLabel>Eigene Vokabeln</SectionLabel>
                  {personalHits.map((word, index) => (
                    <View key={word.id}>
                      {index > 0 ? <Divider /> : null}
                      <View style={{ paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <View style={{ flex: 1 }}>
                          <Text variant="body">{word.ru}</Text>
                          <Text variant="caption" tone="secondary">
                            {word.de}
                          </Text>
                        </View>
                        <AudioButton text={word.ru} audioKey={`dict-personal-${word.id}`} size="sm" accessibilityLabel="Aussprache anhören" />
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}

              <View>
                <SectionLabel>{query.trim().length >= 2 ? `${hits.length} Treffer` : 'Häufige Wörter'}</SectionLabel>
                {hits.length === 0 ? (
                  <View style={{ gap: 4, paddingVertical: spacing.md }}>
                    <Text variant="body">Kein Eintrag gefunden.</Text>
                    <Text variant="caption" tone="tertiary">
                      Prüfe die Schreibweise oder suche kürzer – etwa „коф“ statt „ко́фе“.
                    </Text>
                  </View>
                ) : (
                  hits.map((hit, index) => (
                    <View key={hit.entry.id}>
                      {index > 0 ? <Divider /> : null}
                      <Pressable onPress={() => setSelected(hit.entry)} style={{ paddingVertical: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                          <View style={{ flex: 1, gap: 2 }}>
                            <Text variant="body" weight="500">
                              {hit.entry.ru}
                            </Text>
                            <Text variant="caption" tone="secondary">
                              {hit.entry.de}
                            </Text>
                            <Text variant="micro" tone="tertiary">
                              {[hit.entry.transcription, WORD_TYPE_LABELS[hit.entry.type], hit.entry.level]
                                .filter(Boolean)
                                .join(' · ')}
                            </Text>
                          </View>
                          <AudioButton
                            text={hit.entry.ru}
                            audioKey={`dict-${hit.entry.id}`}
                            size="sm"
                            accessibilityLabel={`Aussprache anhören: ${hit.entry.ru}`}
                          />
                          <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
                        </View>
                      </Pressable>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </Screen>
    </View>
  );
}

function EntryDetail({ entry }: { entry: DictionaryEntry }) {
  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text variant="display" style={{ flex: 1 }}>
            {entry.ru}
          </Text>
          <AudioButton text={entry.ru} audioKey={`dict-detail-${entry.id}`} size="lg" accessibilityLabel="Wort anhören" />
        </View>
        <Text variant="headline" tone="secondary">
          {entry.de}
        </Text>
        <Text variant="caption" tone="tertiary">
          {[entry.transcription, WORD_TYPE_LABELS[entry.type], entry.level, entry.gender ? GENDER_LABELS[entry.gender] : undefined]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>

      <View>
        <SectionLabel>Betonung</SectionLabel>
        <Text variant="body" tone="secondary">
          {entry.ru.includes('\u0301')
            ? 'Die Betonung ist im Russischen markiert; die Silbe mit Akzent wird am stärksten gesprochen.'
            : 'Bei diesem Eintrag ist keine Betonung hinterlegt.'}
        </Text>
      </View>

      {entry.forms.length > 0 ? (
        <View>
          <SectionLabel>Wortformen</SectionLabel>
          {entry.forms.map((form, index) => (
            <View key={`${form.label}-${form.value}`}>
              {index > 0 ? <Divider /> : null}
              <View style={{ flexDirection: 'row', paddingVertical: spacing.sm, gap: spacing.md }}>
                <Text variant="caption" tone="tertiary" style={{ width: 110 }}>
                  {form.label}
                </Text>
                <Text variant="body" style={{ flex: 1 }}>
                  {form.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View>
        <SectionLabel>Beispiel</SectionLabel>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text variant="body" style={{ flex: 1 }}>
              {entry.example.ru}
            </Text>
            <AudioButton text={entry.example.ru} audioKey={`dict-example-${entry.id}`} size="sm" rate={0.8} accessibilityLabel="Beispiel anhören" />
          </View>
          <Text variant="caption" tone="secondary">
            {entry.example.de}
          </Text>
          {entry.example.note ? (
            <Text variant="caption" tone="tertiary">
              {entry.example.note}
            </Text>
          ) : null}
        </View>
      </View>

      {entry.grammar ? (
        <View>
          <SectionLabel>Grammatik</SectionLabel>
          <Text variant="caption" tone="secondary">
            {entry.grammar}
          </Text>
        </View>
      ) : null}

      {entry.tags && entry.tags.length > 0 ? (
        <Text variant="caption" tone="tertiary">
          Themen: {entry.tags.join(', ')}
        </Text>
      ) : null}
    </View>
  );
}
