import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, ListRow, Metric, ProgressBar, Screen, SectionLabel, Surface, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { chapterById, courseProgress, nextLesson } from '@/data/course';
import { challengeSummary, dailyChallenges } from '@/services/challenges';
import { dailyPlan, recommendations } from '@/services/adaptive';
import { getGrammar } from '@/data/grammar';
import { greeting } from '@/services/format';
import { useAppStore } from '@/store/useAppStore';
import {
  currentStreak,
  dueCards,
  learnedWordCount,
  todayGoal,
  totalXp,
  weekSeries,
} from '@/store/selectors';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const lessons = useAppStore((state) => state.lessons);
  const activities = useAppStore((state) => state.activities);
  const cards = useAppStore((state) => state.cards);

  const next = useMemo(() => nextLesson(lessons), [lessons]);
  const progress = useMemo(() => courseProgress(lessons), [lessons]);
  const goal = useMemo(() => todayGoal({ activities, profile }), [activities, profile]);
  const streak = useMemo(() => currentStreak(activities), [activities]);
  const due = useMemo(() => dueCards({ cards }), [cards]);
  const week = useMemo(() => weekSeries(activities), [activities]);
  const maxMinutes = Math.max(10, ...week.map((day) => day.minutes));
  const grammar = next?.grammarSlugs?.[0] ? getGrammar(next.grammarSlugs[0]) : undefined;
  const chapter = next ? chapterById[next.chapterId] : undefined;
  const claims = useAppStore((state) => state.challengeClaims);
  const challenges = useMemo(
    () => dailyChallenges({ activities, cards, challengeClaims: claims, profile }),
    [activities, cards, claims, profile],
  );
  const challengeStats = challengeSummary(challenges);
  const plan = useMemo(
    () =>
      dailyPlan(
        recommendations({ profile, lessons, cards, activities, dueCount: due.length }),
        profile?.dailyMinutes ?? 10,
      ),
    [profile, lessons, cards, activities, due.length],
  );

  return (
    <Screen>
      <View style={{ gap: spacing.xl }}>
        <View>
          <Text variant="caption" tone="tertiary">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <Text variant="title" style={{ marginTop: 2 }}>
            {greeting()}
            {profile?.name ? `, ${profile.name}` : ''}
          </Text>
        </View>

        {/* Continue ---------------------------------------------------------- */}
        {next ? (
          <Surface style={{ gap: spacing.md }}>
            <View>
              <Text variant="micro" tone="tertiary">
                {chapter ? `${chapter.level} · ${chapter.title}` : 'Kurs'}
              </Text>
              <Text variant="headline" style={{ marginTop: 6 }}>
                {next.title}
              </Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                {next.subtitle} · {next.minutes} Min
              </Text>
            </View>
            <Button label="Fortsetzen" onPress={() => router.push(`/lesson/${next.id}`)} />
          </Surface>
        ) : (
          <Surface style={{ gap: spacing.sm }}>
            <Text variant="headline">Alle Lektionen abgeschlossen</Text>
            <Text variant="caption" tone="secondary">
              Halte die Vokabeln mit Wiederholungen frisch.
            </Text>
            <Button label="Vokabeln wiederholen" variant="secondary" onPress={() => router.push('/review')} />
          </Surface>
        )}

        {/* Daily goal -------------------------------------------------------- */}
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text variant="caption" tone="secondary">
              Tagesziel
            </Text>
            <Text variant="caption" tone="tertiary">
              {Math.round(goal.minutes)} von {goal.goal} Min
            </Text>
          </View>
          <ProgressBar value={goal.ratio} color={goal.ratio >= 1 ? colors.success : colors.accent} />
        </View>

        {/* Metrics ----------------------------------------------------------- */}
        <View style={{ flexDirection: 'row', gap: spacing.lg }}>
          <Metric value={String(streak)} label={streak === 1 ? 'Tag Serie' : 'Tage Serie'} />
          <Metric value={String(learnedWordCount({ cards }))} label="Wörter" />
          <Metric value={String(totalXp(activities))} label="XP" />
        </View>

        <Divider />

        {/* Week -------------------------------------------------------------- */}
        <View>
          <SectionLabel>Diese Woche</SectionLabel>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 76, gap: 8 }}>
            {week.map((day) => {
              const height = Math.max(3, (day.minutes / maxMinutes) * 56);
              const isToday = day.key === week[week.length - 1].key;
              return (
                <View key={day.key} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 6,
                      height,
                      borderRadius: 3,
                      backgroundColor: day.minutes > 0 ? (isToday ? colors.accent : 'rgba(139,123,255,0.4)') : 'rgba(255,255,255,0.07)',
                    }}
                  />
                  <Text variant="caption" tone={isToday ? 'secondary' : 'tertiary'} style={{ fontSize: 10 }}>
                    {day.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Today ------------------------------------------------------------- */}
        <View>
          <SectionLabel action="Alle" onPressAction={() => router.push('/challenges')}>
            Heute
          </SectionLabel>
          <Text variant="caption" tone="tertiary" style={{ marginBottom: spacing.sm }}>
            {challengeStats.done} von {challengeStats.total} Challenges erledigt
          </Text>
          <ProgressBar value={challengeStats.total === 0 ? 0 : challengeStats.done / challengeStats.total} />
          {challenges.slice(0, 2).map((challenge) => (
            <View key={challenge.id} style={{ paddingTop: spacing.md, gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="caption" style={{ flex: 1 }}>
                  {challenge.title}
                </Text>
                <Text variant="caption" tone={challenge.done ? 'success' : 'tertiary'}>
                  {challenge.value}/{challenge.target}
                </Text>
              </View>
              <ProgressBar
                value={challenge.value / challenge.target}
                height={2}
                color={challenge.done ? colors.success : colors.accent}
              />
            </View>
          ))}
          {plan.items[0] ? (
            <View style={{ marginTop: spacing.lg }}>
              <Divider />
              <ListRow
                title={plan.items[0].title}
                subtitle={`Empfehlung · ${plan.items[0].reason}`}
                value={`${plan.items[0].minutes} Min`}
                onPress={() => router.push(plan.items[0].href as never)}
              />
              <Divider />
              <ListRow title="Lernplan" subtitle="Alle Empfehlungen und Wissenslücken" onPress={() => router.push('/learn/plan')} />
            </View>
          ) : null}
        </View>

        {/* Next up ----------------------------------------------------------- */}
        <View>
          <SectionLabel>Als Nächstes</SectionLabel>
          <View>
            <ListRow
              title="Vokabeln wiederholen"
              subtitle={due.length > 0 ? `${due.length} Karten fällig` : 'Nichts fällig – neue Wörter freischalten'}
              onPress={() => router.push(due.length > 0 ? '/review' : '/vocab')}
            />
            <Divider />
            <ListRow
              title={grammar ? `Grammatik: ${grammar.title}` : 'Grammatik'}
              subtitle={grammar ? `${grammar.minutes} Min · ${grammar.summary}` : 'Regeln und Übungen'}
              onPress={() => router.push(grammar ? `/grammar/${grammar.slug}` : '/grammar')}
            />
            <Divider />
            <ListRow
              title="Aussprache"
              subtitle="Sätze nachsprechen und bewerten lassen"
              onPress={() => router.push('/speaking')}
            />
          </View>
        </View>

        {/* Course progress --------------------------------------------------- */}
        <View>
          <SectionLabel action="Kurs" onPressAction={() => router.push('/(tabs)/course')}>
            Kursfortschritt
          </SectionLabel>
          <ProgressBar value={progress.ratio} />
          <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
            {progress.done} von {progress.total} Lektionen abgeschlossen
          </Text>
        </View>

        {activities.length > 0 ? (
          <View>
            <SectionLabel>Verlauf</SectionLabel>
            {activities.slice(0, 4).map((activity, index) => (
              <View key={activity.id}>
                {index > 0 ? <Divider /> : null}
                <ListRow
                  title={activity.label}
                  subtitle={new Date(activity.at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                  value={`+${activity.xp} XP`}
                />
              </View>
            ))}
          </View>
        ) : null}

        <Pressable onPress={() => router.push('/(tabs)/more')} style={{ paddingVertical: spacing.sm }}>
          <Text variant="caption" tone="tertiary">
            Alle Bereiche und Einstellungen unter „Mehr“
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

