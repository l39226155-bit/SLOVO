import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider, ListRow, Screen, ScreenHeader, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { listeningItems } from '@/data/listening';

export default function ListeningListScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Hören" subtitle={`${listeningItems.length} Übungen`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View>
          {listeningItems.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? <Divider /> : null}
              <ListRow
                title={item.title}
                subtitle={`${item.kind === 'dialogue' ? 'Dialog' : 'Geschichte'} · ${item.summary}`}
                value={`${item.minutes} Min`}
                onPress={() => router.push(`/listening/${item.id}`)}
              />
            </View>
          ))}
        </View>
        <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.lg }}>
          Jede Zeile ist einzeln hörbar, Untertitel und Übersetzung lassen sich ausblenden, das Tempo ist einstellbar.
        </Text>
      </Screen>
    </View>
  );
}
