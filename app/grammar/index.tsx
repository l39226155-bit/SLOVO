import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider, ListRow, Screen, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { caseTopics, grammarTopics } from '@/data/grammar';

export default function GrammarListScreen() {
  const router = useRouter();
  const cases = grammarTopics.filter((topic) => caseTopics.includes(topic.slug));
  const basics = grammarTopics.filter((topic) => !caseTopics.includes(topic.slug));

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Grammatik" subtitle={`${grammarTopics.length} Themen`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.xl }}>
          <View>
            <SectionLabel>Die sechs Fälle</SectionLabel>
            {cases.map((topic, index) => (
              <View key={topic.slug}>
                {index > 0 ? <Divider /> : null}
                <ListRow
                  title={topic.title}
                  subtitle={topic.summary}
                  value={`${topic.minutes} Min`}
                  onPress={() => router.push(`/grammar/${topic.slug}`)}
                />
              </View>
            ))}
          </View>

          <View>
            <SectionLabel>Grundlagen</SectionLabel>
            {basics.map((topic, index) => (
              <View key={topic.slug}>
                {index > 0 ? <Divider /> : null}
                <ListRow
                  title={topic.title}
                  subtitle={topic.summary}
                  value={`${topic.minutes} Min`}
                  onPress={() => router.push(`/grammar/${topic.slug}`)}
                />
              </View>
            ))}
          </View>

          <Text variant="caption" tone="tertiary">
            Jedes Thema enthält Erklärungen, Tabellen, Beispielsätze mit Audio und Übungen.
          </Text>
        </View>
      </Screen>
    </View>
  );
}
