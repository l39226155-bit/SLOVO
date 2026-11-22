import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider, ListRow, Screen, ScreenHeader, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { stories } from '@/data/stories';

export default function StoriesListScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Geschichten" subtitle={`${stories.length} kurze Texte`} onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View>
          {stories.map((story, index) => (
            <View key={story.id}>
              {index > 0 ? <Divider /> : null}
              <ListRow
                title={story.title}
                subtitle={`${story.subtitle} · ${story.level}`}
                value={`${story.minutes} Min`}
                onPress={() => router.push(`/stories/${story.id}`)}
              />
            </View>
          ))}
        </View>
        <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.lg }}>
          Russischer Text, deutsche Übersetzung, satzweise Wiedergabe und Verständnisfragen. Tippe ein Wort an, um
          Bedeutung und Aussprache zu sehen.
        </Text>
      </Screen>
    </View>
  );
}
