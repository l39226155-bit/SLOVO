import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, ListRow, Metric, ProgressBar, Screen, SectionLabel, Text } from '@/components/ui';
import { ScreenHeader } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { courseProgress } from '@/data/course';
import { formatMinutes } from '@/services/format';
import { useAppStore } from '@/store/useAppStore';
import {
  accuracyByKind,
  currentStreak,
  KIND_LABELS,
  learnedWordCount,
  masteredWordCount,
  overallAccuracy,
  todayMinutes,
  totalMinutes,
  totalXp,
  weakWords,
  weekMinutes,
  weekSeries,
} from '@/store/selectors';

export default function StatsScreen() {
  const router = useRouter();
  const activities = useAppStore((state) => state.activities);
  const lessons = useAppStore((state) => state.lessons);
  const cards = useAppStore((state) => state.cards);

  const week = useMemo(() => weekSeries(activities), [activities]);
  const max = Math.max(10, ...week.map((day) => day.minutes));
  const categories = accuracyByKind(activities);
  const weak = weakWords({ cards }, 5);
  const progress = courseProgress(lessons);

  const month = useMemo(() => {
    const buckets = [0, 0, 0, 0];
    activities.forEach((activity) => {
      const age = Math.floor((Date.now() - new Date(activity.at).getTime()) / 86400000);
      const bucket = Math.floor(age / 7);
      if (bucket >= 0 && bucket < 4) buckets[3 - bucket] += activity.minutes;
    });
    return buckets;
  }, [activities]);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Statistik" onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        {activities.length === 0 ? (
          <View style={{ gap: spacing.md, paddingTop: spacing.xl }}>
            <Text variant="headline">Noch keine Daten</Text>
            <Text variant="body" tone="secondary">
              Sobald du eine Lektion oder eine Wiederholung abschließt, erscheinen hier deine Zahlen.
            </Text>
            <Button label="Zum Kurs" variant="secondary" onPress={() => router.replace('/(tabs)/course')} />
          </View>
        ) : (
          <View style={{ gap: spacing.xl }}>
            <View style={{ flexDirection: 'row', gap: spacing.lg }}>
              <Metric value={formatMinutes(todayMinutes({ activities }))} label="heute" />
              <Metric value={formatMinutes(weekMinutes(activities))} label="diese Woche" />
              <Metric value={`${currentStreak(activities)}`} label="Tage Serie" />
            </View>

            <View>
              <SectionLabel>Letzte sieben Tage</SectionLabel>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 72 }}>
                {week.map((day, index) => (
                  <View key={day.key} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        width: 6,
                        height: Math.max(3, (day.minutes / max) * 54),
                        borderRadius: 3,
                        backgroundColor:
                          day.minutes > 0
                            ? index === week.length - 1
                              ? colors.accent
                              : 'rgba(139,123,255,0.4)'
                            : 'rgba(255,255,255,0.07)',
                      }}
                    />
                    <Text variant="caption" tone="tertiary" style={{ fontSize: 10 }}>
                      {day.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <SectionLabel>Letzte vier Wochen</SectionLabel>
              {month.map((minutes, index) => {
                const maxMonth = Math.max(1, ...month);
                return (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 6 }}>
                    <Text variant="caption" tone="tertiary" style={{ width: 64 }}>
                      {index === 3 ? 'diese' : `W-${3 - index}`}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <ProgressBar value={minutes / maxMonth} height={3} color={index === 3 ? colors.accent : 'rgba(139,123,255,0.5)'} />
                    </View>
                    <Text variant="caption" tone="tertiary" style={{ width: 52, textAlign: 'right' }}>
                      {Math.round(minutes)} Min
                    </Text>
                  </View>
                );
              })}
            </View>

            <View>
              <SectionLabel>Übersicht</SectionLabel>
              <ListRow title="Kursfortschritt" value={`${Math.round(progress.ratio * 100)} %`} />
              <Divider />
              <ListRow title="Lernzeit gesamt" value={formatMinutes(totalMinutes(activities))} />
              <Divider />
              <ListRow title="XP gesamt" value={String(totalXp(activities))} />
              <Divider />
              <ListRow title="Trefferquote" value={`${Math.round(overallAccuracy(activities) * 100)} %`} />
              <Divider />
              <ListRow title="Wörter im Training" value={String(learnedWordCount({ cards }))} />
              <Divider />
              <ListRow title="Gefestigt" value={String(masteredWordCount({ cards }))} />
            </View>

            {categories.length > 0 ? (
              <View>
                <SectionLabel>Nach Bereich</SectionLabel>
                {categories.map((entry) => (
                  <View key={entry.kind} style={{ gap: 6, paddingVertical: spacing.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text variant="caption" tone="secondary">
                        {KIND_LABELS[entry.kind]}
                      </Text>
                      <Text variant="caption" tone="tertiary">
                        {Math.round(entry.ratio * 100)} %
                      </Text>
                    </View>
                    <ProgressBar
                      value={entry.ratio}
                      height={3}
                      color={entry.ratio >= 0.8 ? colors.success : entry.ratio >= 0.5 ? colors.accent : colors.danger}
                    />
                  </View>
                ))}
              </View>
            ) : null}

            {weak.length > 0 ? (
              <View>
                <SectionLabel>Schwierige Wörter</SectionLabel>
                {weak.map(({ card, vocab }) => (
                  <View key={card.vocabId} style={{ paddingVertical: spacing.sm, gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text variant="body">{vocab?.ru}</Text>
                      <Text variant="caption" tone="tertiary">
                        {card.lapses} Fehler
                      </Text>
                    </View>
                    <Text variant="caption" tone="tertiary">
                      {vocab?.de}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        )}
      </Screen>
    </View>
  );
}
