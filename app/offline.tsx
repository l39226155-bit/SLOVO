import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Share, View } from 'react-native';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { Button, Divider, ListRow, Screen, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { lessons } from '@/data/course';
import { grammarTopics } from '@/data/grammar';
import { stories } from '@/data/stories';
import { vocabulary } from '@/data/vocabulary';
import { alphabet } from '@/data/alphabet';
import { everydaySituations } from '@/data/everyday';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/services/format';

export default function OfflineScreen() {
  const router = useRouter();
  const activities = useAppStore((state) => state.activities);
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.personalWords);
  const lessonsDone = useAppStore((state) => state.lessons);

  const [online, setOnline] = useState<boolean | null>(null);
  const [bytes, setBytes] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = async () => {
    if (Platform.OS === 'web') {
      setOnline(typeof navigator === 'undefined' ? null : navigator.onLine);
    } else {
      try {
        const state = await Network.getNetworkStateAsync();
        setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      } catch {
        setOnline(null);
      }
    }

    try {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const size = entries.reduce((sum, [key, value]) => sum + key.length + (value?.length ?? 0), 0);
      setBytes(size);
    } catch {
      setBytes(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const exportProgress = async () => {
    const payload = JSON.stringify(
      {
        app: 'slovo',
        exportedAt: new Date().toISOString(),
        profile,
        lessons: lessonsDone,
        activities,
        words,
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
        anchor.download = 'slovo-fortschritt.json';
        anchor.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({ message: payload });
      }
      setNotice('Fortschritt exportiert.');
    } catch {
      setNotice('Export nicht möglich.');
    }
  };

  const content = [
    { label: 'Vokabeln', value: vocabulary.length },
    { label: 'Lektionen', value: lessons.length },
    { label: 'Grammatikthemen', value: grammarTopics.length },
    { label: 'Geschichten', value: stories.length },
    { label: 'Alltagssituationen', value: everydaySituations.length },
    { label: 'Alphabet', value: alphabet.length },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Offline" subtitle="Inhalte, Speicher, Export" onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.xl }}>
          <View style={{ gap: spacing.sm }}>
            <Text variant="headline">
              {online === null ? 'Verbindung unbekannt' : online ? 'Online' : 'Offline'}
            </Text>
            <Text variant="body" tone="secondary">
              {online
                ? 'Alle Bereiche funktionieren auch ohne Verbindung. Der KI-Tutor braucht als einziger Bereich Netz.'
                : 'Du bist offline. Kurs, Vokabeln, Grammatik, Geschichten, Dialoge und Schreibtraining laufen vollständig weiter.'}
            </Text>
            <Button label="Status aktualisieren" variant="secondary" onPress={() => void refresh()} style={{ alignSelf: 'flex-start' }} />
          </View>

          <View>
            <SectionLabel>Im App-Paket enthalten</SectionLabel>
            {content.map((entry, index) => (
              <View key={entry.label}>
                {index > 0 ? <Divider /> : null}
                <ListRow title={entry.label} value={String(entry.value)} />
              </View>
            ))}
            <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
              Diese Inhalte sind kein Download, sondern Teil der Installation. Deshalb ist kein „Paket laden“ nötig –
              und es kann keines fehlen.
            </Text>
          </View>

          <View>
            <SectionLabel>Audio</SectionLabel>
            <Text variant="caption" tone="secondary">
              Die Aussprache wird auf dem Gerät erzeugt (ru-RU), nicht gestreamt. Ohne Netz bleibt sie verfügbar, solange
              die russische Systemstimme installiert ist. Fehlt sie, meldet die App das beim Abspielen.
            </Text>
          </View>

          <View>
            <SectionLabel>Lokaler Speicher</SectionLabel>
            <ListRow title="Belegter Speicher" value={bytes === null ? 'unbekannt' : `${Math.max(1, Math.round(bytes / 1024))} KB`} />
            <Divider />
            <ListRow
              title="Letzte Aktivität"
              value={activities[0] ? formatDateTime(activities[0].at) : 'noch keine'}
            />
            <Divider />
            <ListRow title="Eigene Vokabeln" value={String(words.length)} />
            <Divider />
            <ListRow title="Abgeschlossene Lektionen" value={String(Object.keys(lessonsDone).length)} />
          </View>

          <View style={{ gap: spacing.sm }}>
            <SectionLabel>Fortschritt sichern</SectionLabel>
            <Button label="Fortschritt exportieren" variant="secondary" onPress={() => void exportProgress()} />
            {notice ? (
              <Text variant="caption" tone="secondary">
                {notice}
              </Text>
            ) : null}
            <Text variant="caption" tone="tertiary">
              Der Export enthält Profil, Lektionsstände, Aktivitäten und eigene Vokabeln als JSON. Eine automatische
              Cloud-Synchronisierung ist nicht eingerichtet – dafür fehlt ein Server. Lokal gespeichert ist alles
              dauerhaft.
            </Text>
          </View>

          <Text variant="caption" tone="tertiary">
            Speicherort der Daten: AsyncStorage (Web: localStorage). Beim Löschen der App-Daten werden sie entfernt –
            sichere vorher den Export.
          </Text>
        </View>
      </Screen>
    </View>
  );
}
