import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider, ListRow, Screen, ScreenHeader, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { everydaySituations } from '@/data/everyday';

export default function EverydayListScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Alltag" subtitle={`${everydaySituations.length} Situationen`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View>
          {everydaySituations.map((situation, index) => (
            <View key={situation.id}>
              {index > 0 ? <Divider /> : null}
              <ListRow
                title={situation.title}
                subtitle={`${situation.de} · ${situation.level}`}
                value={`${situation.turns.length} Schritte`}
                onPress={() => router.push(`/everyday/${situation.id}`)}
              />
            </View>
          ))}
        </View>
        <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.lg }}>
          In jeder Situation schreibst du selbst Russisch. Mehrere Formulierungen gelten als richtig, danach zeigt die App
          Musterlösung und Hinweis. Lautsprecher liest die Partnerzeilen vor.
        </Text>
      </Screen>
    </View>
  );
}
