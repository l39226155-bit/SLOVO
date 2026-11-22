import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Share, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Input,
  Screen,
  ScreenHeader,
  SectionLabel,
  Segmented,
  Text,
} from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { DIFFICULTY_LABEL, personalDifficulty, sortByDifficulty, weakPersonalWords } from '@/services/personal';
import { normalizeDe, normalizeRu } from '@/services/normalize';
import { useAppStore } from '@/store/useAppStore';
import type { PersonalWord } from '@/store/types';

type Filter = 'all' | 'favorites' | 'weak';

export default function PersonalVocabularyScreen() {
  const router = useRouter();
  const { add } = useLocalSearchParams<{ add?: string }>();
  const words = useAppStore((state) => state.personalWords);
  const reviews = useAppStore((state) => state.personalReviews);
  const collections = useAppStore((state) => state.collections);
  const addPersonalWord = useAppStore((state) => state.addPersonalWord);
  const updatePersonalWord = useAppStore((state) => state.updatePersonalWord);
  const removePersonalWord = useAppStore((state) => state.removePersonalWord);
  const togglePersonalFavorite = useAppStore((state) => state.togglePersonalFavorite);
  const addCollection = useAppStore((state) => state.addCollection);
  const removeCollection = useAppStore((state) => state.removeCollection);
  const importPersonalWords = useAppStore((state) => state.importPersonalWords);
  const profile = useAppStore((state) => state.profile);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<'difficulty' | 'newest'>('difficulty');
  const [collectionFilter, setCollectionFilter] = useState<string | 'all'>('all');

  const [editorOpen, setEditorOpen] = useState(Boolean(add));
  const [editing, setEditing] = useState<PersonalWord | null>(null);
  const [ru, setRu] = useState(typeof add === 'string' ? add : '');
  const [de, setDe] = useState('');
  const [transcription, setTranscription] = useState('');
  const [category, setCategory] = useState('Eigene Wörter');
  const [collectionId, setCollectionId] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<PersonalWord | null>(null);

  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(words.map((word) => word.category));
    return ['Alle', ...[...set].sort()];
  }, [words]);
  const [categoryFilter, setCategoryFilter] = useState('Alle');

  const visible = useMemo(() => {
    let list = words;
    if (filter === 'favorites') list = list.filter((word) => word.favorite);
    if (filter === 'weak') list = weakPersonalWords(list, reviews);
    if (collectionFilter !== 'all') list = list.filter((word) => word.collectionId === collectionFilter);
    if (categoryFilter !== 'Alle') list = list.filter((word) => word.category === categoryFilter);
    const search = query.trim();
    if (search) {
      const ruQuery = normalizeRu(search);
      const deQuery = normalizeDe(search);
      list = list.filter(
        (word) =>
          normalizeRu(word.ru).includes(ruQuery) ||
          normalizeDe(word.de).includes(deQuery) ||
          normalizeDe(word.category).includes(deQuery),
      );
    }
    return sort === 'difficulty' ? sortByDifficulty(list, reviews) : [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [words, filter, collectionFilter, categoryFilter, query, sort, reviews]);

  const openNew = () => {
    setEditing(null);
    setRu('');
    setDe('');
    setTranscription('');
    setCategory('Eigene Wörter');
    setCollectionId(undefined);
    setEditorOpen(true);
  };

  const openEdit = (word: PersonalWord) => {
    setEditing(word);
    setRu(word.ru);
    setDe(word.de);
    setTranscription(word.transcription ?? '');
    setCategory(word.category);
    setCollectionId(word.collectionId);
    setEditorOpen(true);
  };

  const save = () => {
    if (!ru.trim() || !de.trim()) return;
    if (editing) {
      updatePersonalWord(editing.id, {
        ru: ru.trim(),
        de: de.trim(),
        transcription: transcription.trim() || undefined,
        category: category.trim() || 'Eigene Wörter',
        collectionId,
      });
    } else {
      addPersonalWord({
        ru,
        de,
        transcription,
        category,
        collectionId,
        level: profile?.level,
        source: typeof add === 'string' ? 'tutor' : 'manual',
      });
    }
    setEditorOpen(false);
  };

  const exportWords = async () => {
    const payload = JSON.stringify(
      {
        app: 'slovo',
        version: 1,
        exportedAt: new Date().toISOString(),
        collections,
        words: words.map(({ id, ru: wordRu, de: wordDe, transcription: wordTranscription, category: wordCategory, level, favorite, createdAt }) => ({
          id,
          ru: wordRu,
          de: wordDe,
          transcription: wordTranscription,
          category: wordCategory,
          level,
          favorite,
          createdAt,
        })),
      },
      null,
      2,
    );

    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([payload], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'slovo-vokabeln.json';
        anchor.click();
        URL.revokeObjectURL(url);
        setNotice(`${words.length} Wörter als JSON exportiert.`);
        return;
      }
      await Share.share({ message: payload });
    } catch {
      setNotice('Export nicht möglich.');
    }
  };

  const runImport = () => {
    try {
      const parsed = JSON.parse(importText);
      const incoming = Array.isArray(parsed) ? parsed : parsed?.words;
      if (!Array.isArray(incoming)) throw new Error('Kein Wörterfeld');
      const mapped: PersonalWord[] = incoming
        .filter((item) => item && typeof item.ru === 'string' && typeof item.de === 'string')
        .map((item, index) => ({
          id: typeof item.id === 'string' ? `${item.id}_imp${index}` : `imp_${Date.now()}_${index}`,
          ru: item.ru,
          de: item.de,
          transcription: typeof item.transcription === 'string' ? item.transcription : undefined,
          category: typeof item.category === 'string' ? item.category : 'Import',
          level: item.level,
          favorite: Boolean(item.favorite),
          source: 'manual',
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        }));
      const added = importPersonalWords(mapped);
      setNotice(`${added} Wörter importiert, ${mapped.length - added} bereits vorhanden.`);
      setImportOpen(false);
      setImportText('');
    } catch {
      setNotice('JSON konnte nicht gelesen werden. Erwartet wird die exportierte Datei.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Eigene Vokabeln"
        subtitle={`${words.length} Wörter · ${collections.length} Sammlungen`}
        onBack={() => router.back()}
        right={<IconButton icon="add" onPress={openNew} accessibilityLabel="Vokabel hinzufügen" />}
      />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Abfragen" onPress={() => router.push('/personal/quiz')} style={{ flex: 1 }} />
            <Button label="Import" variant="secondary" onPress={() => setImportOpen(true)} style={{ flex: 1 }} />
            <Button label="Export" variant="secondary" onPress={() => void exportWords()} style={{ flex: 1 }} />
          </View>

          {notice ? (
            <Text variant="caption" tone="secondary" onPress={() => setNotice(null)}>
              {notice}
            </Text>
          ) : null}

          <Input value={query} onChangeText={setQuery} placeholder="Suche in Russisch oder Deutsch" />

          <Segmented
            options={[
              { value: 'all', label: 'Alle' },
              { value: 'favorites', label: 'Favoriten' },
              { value: 'weak', label: 'Schwierig' },
            ]}
            value={filter}
            onChange={setFilter}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="caption" tone="tertiary">
              {visible.length} angezeigt
            </Text>
            <Pressable onPress={() => setSort(sort === 'difficulty' ? 'newest' : 'difficulty')} hitSlop={8}>
              <Text variant="caption" tone="accent">
                {sort === 'difficulty' ? 'nach Schwierigkeit' : 'nach Datum'}
              </Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            <Chip label="Alle Kategorien" active={categoryFilter === 'Alle'} onPress={() => setCategoryFilter('Alle')} />
            {categories
              .filter((entry) => entry !== 'Alle')
              .map((entry) => (
                <Chip key={entry} label={entry} active={categoryFilter === entry} onPress={() => setCategoryFilter(entry)} />
              ))}
          </ScrollView>

          <View>
            <SectionLabel
              action="Neue Sammlung"
              onPressAction={() => {
                setCollectionName('');
                setCollectionOpen(true);
              }}
            >
              Sammlungen
            </SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
              <Chip label="Ohne Sammlung" active={collectionFilter === 'all'} onPress={() => setCollectionFilter('all')} />
              {collections.map((collection) => (
                <Chip
                  key={collection.id}
                  label={`${collection.name} · ${words.filter((word) => word.collectionId === collection.id).length}`}
                  active={collectionFilter === collection.id}
                  onPress={() => setCollectionFilter(collection.id)}
                />
              ))}
            </ScrollView>
          </View>

          {visible.length === 0 ? (
            <View style={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
              <Text variant="headline">{words.length === 0 ? 'Noch keine eigenen Vokabeln' : 'Nichts gefunden'}</Text>
              <Text variant="body" tone="secondary">
                {words.length === 0
                  ? 'Füge Wörter aus dem Unterricht, aus dem Tutor oder aus dem Alltag hinzu. Sie erscheinen sofort in der Abfrage.'
                  : 'Passe Suche, Kategorie oder Sammlung an.'}
              </Text>
              <Button label="Erste Vokabel hinzufügen" variant="secondary" onPress={openNew} style={{ alignSelf: 'flex-start' }} />
            </View>
          ) : (
            <View>
              {visible.map((word, index) => {
                const difficulty = personalDifficulty(reviews[word.id]);
                const review = reviews[word.id];
                return (
                  <View key={word.id}>
                    {index > 0 ? <Divider /> : null}
                    <Pressable onPress={() => openEdit(word)} style={{ paddingVertical: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text variant="body" weight="500">
                            {word.ru}
                          </Text>
                          <Text variant="caption" tone="secondary">
                            {word.de}
                          </Text>
                          <Text variant="micro" tone="tertiary">
                            {[word.category, DIFFICULTY_LABEL[difficulty], collectionLabel(collections, word.collectionId)]
                              .filter(Boolean)
                              .join(' · ')}
                          </Text>
                        </View>
                        <Text variant="caption" tone={difficulty === 'schwer' ? 'danger' : 'tertiary'}>
                          {review ? `${review.correct}/${review.total}` : '–'}
                        </Text>
                        <Pressable onPress={() => togglePersonalFavorite(word.id)} hitSlop={10} accessibilityLabel="Favorit">
                          <Ionicons
                            name={word.favorite ? 'star' : 'star-outline'}
                            size={17}
                            color={word.favorite ? colors.warning : colors.textTertiary}
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          <Text variant="caption" tone="tertiary">
            Eigene Vokabeln bleiben lokal. Der Export erzeugt eine JSON-Datei, die sich auf einem anderen Gerät wieder
            importieren lässt.
          </Text>
        </View>
      </Screen>

      <Modal visible={editorOpen} transparent animationType="fade" onRequestClose={() => setEditorOpen(false)}>
        <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.xl }}>
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.borderStrong,
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            <Text variant="headline">{editing ? 'Vokabel bearbeiten' : 'Neue Vokabel'}</Text>
            <Input label="Russisch" value={ru} onChangeText={setRu} placeholder="наприме́р" />
            <Input label="Deutsch" value={de} onChangeText={setDe} placeholder="zum Beispiel" />
            <Input label="Transkription (optional)" value={transcription} onChangeText={setTranscription} placeholder="naprimér" />
            <Input label="Kategorie" value={category} onChangeText={setCategory} placeholder="Eigene Wörter" />
            {collections.length > 0 ? (
              <View style={{ gap: spacing.sm }}>
                <Text variant="caption" tone="secondary">
                  Sammlung
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                  <Chip label="Keine" active={!collectionId} onPress={() => setCollectionId(undefined)} />
                  {collections.map((collection) => (
                    <Chip
                      key={collection.id}
                      label={collection.name}
                      active={collectionId === collection.id}
                      onPress={() => setCollectionId(collection.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Abbrechen" variant="secondary" onPress={() => setEditorOpen(false)} style={{ flex: 1 }} />
              <Button label="Speichern" onPress={save} disabled={!ru.trim() || !de.trim()} style={{ flex: 1 }} />
            </View>
            {editing ? (
              <Button
                label="Vokabel löschen"
                variant="danger"
                onPress={() => {
                  setConfirmDelete(editing);
                }}
              />
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal visible={collectionOpen} transparent animationType="fade" onRequestClose={() => setCollectionOpen(false)}>
        <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.xl }}>
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.borderStrong,
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            <Text variant="headline">Neue Sammlung</Text>
            <Input value={collectionName} onChangeText={setCollectionName} placeholder="z. B. Reise nach Moskau" autoFocus />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Abbrechen" variant="secondary" onPress={() => setCollectionOpen(false)} style={{ flex: 1 }} />
              <Button
                label="Anlegen"
                disabled={!collectionName.trim()}
                onPress={() => {
                  addCollection(collectionName);
                  setCollectionOpen(false);
                }}
                style={{ flex: 1 }}
              />
            </View>
            {collections.length > 0 ? (
              <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
                {collections.map((collection) => (
                  <View key={collection.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text variant="caption" style={{ flex: 1 }}>
                      {collection.name}
                    </Text>
                    <Pressable onPress={() => removeCollection(collection.id)} hitSlop={8}>
                      <Text variant="caption" tone="danger">
                        Entfernen
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal visible={importOpen} transparent animationType="fade" onRequestClose={() => setImportOpen(false)}>
        <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.xl }}>
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.borderStrong,
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            <Text variant="headline">Vokabeln importieren</Text>
            <Text variant="caption" tone="secondary">
              JSON aus dem Export hier einfügen. Vorhandene Wörter werden übersprungen.
            </Text>
            <TextInput
              value={importText}
              onChangeText={setImportText}
              multiline
              placeholder='{ "words": [ { "ru": "…", "de": "…" } ] }'
              placeholderTextColor={colors.textTertiary}
              style={{
                minHeight: 120,
                maxHeight: 200,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.borderStrong,
                padding: spacing.md,
                color: colors.text,
                textAlignVertical: 'top',
              }}
            />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Abbrechen" variant="secondary" onPress={() => setImportOpen(false)} style={{ flex: 1 }} />
              <Button label="Importieren" onPress={runImport} disabled={!importText.trim()} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      <Dialog
        visible={Boolean(confirmDelete)}
        title="Vokabel löschen?"
        message="Die Vokabel und ihr Übungsstand werden entfernt."
        confirmLabel="Löschen"
        destructive
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) removePersonalWord(confirmDelete.id);
          setConfirmDelete(null);
          setEditorOpen(false);
        }}
      />
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.border,
      }}
    >
      <Text variant="caption" tone={active ? 'default' : 'tertiary'}>
        {label}
      </Text>
    </Pressable>
  );
}

function collectionLabel(collections: { id: string; name: string }[], id?: string): string | undefined {
  if (!id) return undefined;
  return collections.find((collection) => collection.id === id)?.name;
}
