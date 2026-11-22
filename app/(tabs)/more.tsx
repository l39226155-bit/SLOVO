import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider, ListRow, Screen, SectionLabel, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { tutorConfigured } from '@/services/tutor';
import { useAudioStore } from '@/services/audio';
import { useAppStore } from '@/store/useAppStore';

export default function MoreScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const personalWords = useAppStore((state) => state.personalWords);
  const voiceLabel = useAudioStore((state) => state.voiceLabel);
  const voiceAvailable = useAudioStore((state) => state.voiceAvailable);

  return (
    <Screen>
      <View style={{ gap: spacing.xl }}>
        <Text variant="title">Mehr</Text>

        <View>
          <ListRow
            title={profile?.name ?? 'Lernende:r'}
            subtitle={`Niveau ${profile?.level ?? 'A0'} · ${profile?.dailyMinutes ?? 10} Minuten pro Tag`}
          />
          <Divider />
          <ListRow title="Einstellungen" subtitle="Profil, Audio, Erinnerungen, Daten" onPress={() => router.push('/settings')} />
        </View>

        <View>
          <SectionLabel>Lernen</SectionLabel>
          <ListRow title="Lernplan" subtitle="Empfehlungen, Niveau, Wissenslücken" onPress={() => router.push('/learn/plan')} />
          <Divider />
          <ListRow title="Tages-Challenges" subtitle="Vier Aufgaben, die täglich wechseln" onPress={() => router.push('/challenges')} />
          <Divider />
          <ListRow title="Grammatik" subtitle="14 Themen, alle sechs Fälle" onPress={() => router.push('/grammar')} />
          <Divider />
          <ListRow title="Hören" subtitle="Dialoge und Geschichten mit Untertiteln" onPress={() => router.push('/listening')} />
          <Divider />
          <ListRow title="Geschichten" subtitle="Lesen, Wörter antippen, Fragen" onPress={() => router.push('/stories')} />
          <Divider />
          <ListRow title="Russischer Alltag" subtitle="10 Situationen mit eigenen Antworten" onPress={() => router.push('/everyday')} />
          <Divider />
          <ListRow title="Satztrainer" subtitle="Übersetzen mit Erklärung und typischen Fehlern" onPress={() => router.push('/sentences')} />
          <Divider />
          <ListRow title="Schreibtraining" subtitle="Abschreiben, Lücken, freie Sätze" onPress={() => router.push('/writing')} />
          <Divider />
          <ListRow title="Aussprache" subtitle="Nachsprechen und bewerten lassen" onPress={() => router.push('/speaking')} />
          <Divider />
          <ListRow
            title="KI-Tutor"
            subtitle={tutorConfigured ? 'Verbunden · 9 Gesprächsszenarien' : 'Nicht konfiguriert · Einrichtung nötig'}
            onPress={() => router.push('/tutor')}
          />
        </View>

        <View>
          <SectionLabel>Wörter</SectionLabel>
          <ListRow title="Wörterbuch" subtitle="Russisch und Deutsch, mit Wortformen" onPress={() => router.push('/dictionary')} />
          <Divider />
          <ListRow
            title="Eigene Vokabeln"
            subtitle={`${personalWords.length} gespeichert · Import und Export`}
            onPress={() => router.push('/personal')}
          />
          <Divider />
          <ListRow title="Schwierige Wörter" subtitle="Mehrfach falsch beantwortet" onPress={() => router.push('/personal?filter=weak')} />
        </View>

        <View>
          <SectionLabel>Fortschritt</SectionLabel>
          <ListRow title="Statistik" subtitle="Lernzeit, Trefferquote, Schwächen" onPress={() => router.push('/stats')} />
          <Divider />
          <ListRow title="Einstufungstest" subtitle="Wortschatz, Grammatik, Lesen, Hören" onPress={() => router.push('/placement')} />
        </View>

        <View>
          <SectionLabel>App</SectionLabel>
          <ListRow title="Offline und Daten" subtitle="Speicher, Export, Verbindung" onPress={() => router.push('/offline')} />
          <Divider />
          <ListRow
            title="Stimme"
            subtitle={
              voiceLabel ??
              (voiceAvailable === false ? 'Keine russische Stimme installiert' : 'Systemstimme für Russisch')
            }
            value={voiceAvailable ? 'ru-RU' : undefined}
          />
          <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
            Alle Hörbeispiele nutzen die russische Systemstimme. Fehlt sie, erscheint beim Abspielen ein Hinweis mit
            Anleitung zum Nachinstallieren.
          </Text>
        </View>

        <Text variant="caption" tone="tertiary">
          SLOVO 1.0 · Expo, React Native, TypeScript
        </Text>
      </View>
    </Screen>
  );
}
