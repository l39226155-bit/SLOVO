import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, Metric, ProgressBar, Screen, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { currentDifficulty, dailyPlan, estimateLevel, knowledgeGaps, recommendations } from '@/services/adaptive';
import { useAppStore } from '@/store/useAppStore';
import { dueCards, todayGoal } from '@/store/selectors';

export default function PlanScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const lessons = useAppStore((state) => state.lessons);
  const cards = useAppStore((state) => state.cards);
  const activities = useAppStore((state) => state.activities);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const estimate = useMemo(
    () => estimateLevel({ profile, lessons, cards, activities }),
    [profile, lessons, cards, activities],
  );
  const difficulty = useMemo(() => currentDifficulty(activities), [activities]);
  const gaps = useMemo(() => knowledgeGaps(activities), [activities]);
  const due = useMemo(() => dueCards({ cards }), [cards]);
  const recs = useMemo(
    () =>
      recommendations(
        { profile, lessons, cards, activities, dueCount: due.length },
        { difficulty: difficulty.difficulty },
      ),
    [profile, lessons, cards, activities, due.length, difficulty.difficulty],
  );
  const plan = useMemo(() => dailyPlan(recs, profile?.dailyMinutes ?? 10), [recs, profile]);
  const goal = useMemo(() => todayGoal({ activities, profile }), [activities, profile]);
  const doneToday = activities.filter((activity) => new Date(activity.at).toDateString() === new Date().toDateString());

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Lernplan" subtitle="Passt sich deinen Antworten an" onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.xl }}>
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <Metric value={estimate.level} label="Arbeitsniveau" />
            <Metric
              value={estimate.confidence < 0.2 ? 'gering' : `${Math.round(estimate.confidence * 100)} %`}
              label="Datenlage"
            />
            <Metric value={due.length === 0 ? '–' : String(due.length)} label="fällige Karten" />
          </View>

          <View style={{ gap: spacing.xs }}>
            {estimate.reasons.map((reason) => (
              <Text key={reason} variant="caption" tone="tertiary">
                {reason}
              </Text>
            ))}
            {estimate.declared && estimate.declared !== estimate.level ? (
              <Text variant="caption" tone="warning">
                Einstufung war {estimate.declared}, aktuell gemessen: {estimate.level}.
              </Text>
            ) : null}
          </View>

          <View>
            <SectionLabel>Heute</SectionLabel>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <Text variant="caption" tone="secondary">
                {plan.total} von {profile?.dailyMinutes ?? 10} Minuten geplant
              </Text>
              <Text variant="caption" tone="tertiary">
                {Math.round(goal.ratio * 100)} % Tagesziel
              </Text>
            </View>
            <ProgressBar value={goal.ratio} color={goal.ratio >= 1 ? colors.success : colors.accent} />
            {doneToday.length > 0 ? (
              <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
                {doneToday.length} Aktivitäten heute · {plan.left} Minuten bleiben im Plan.
              </Text>
            ) : null}
          </View>

          <View>
            {estimate.declared && estimate.declared !== estimate.level ? (
            <Button
              label={`Niveau ${estimate.level} übernehmen`}
              variant="secondary"
              onPress={() => updateProfile({ level: estimate.level })}
              style={{ marginBottom: spacing.md }}
            />
          ) : null}

          {plan.items.map((item, index) => (
              <View key={item.id}>
                {index > 0 ? <Divider /> : null}
                <View style={{ paddingVertical: spacing.md, gap: spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
                    <Text variant="body" weight="500" style={{ flex: 1 }}>
                      {item.title}
                    </Text>
                    <Text variant="caption" tone="tertiary">
                      {item.minutes} Min
                    </Text>
                  </View>
                  <Text variant="caption" tone="secondary">
                    {item.reason}
                  </Text>
                  <Button
                    label="Starten"
                    variant="secondary"
                    onPress={() => router.push(item.href as never)}
                    style={{ height: 40, alignSelf: 'flex-start', paddingHorizontal: spacing.lg }}
                  />
                </View>
              </View>
            ))}
          </View>

          {gaps.length > 0 ? (
            <View>
              <SectionLabel>Wissenslücken</SectionLabel>
              {gaps.map((gap) => (
                <View key={gap.slug} style={{ paddingVertical: spacing.sm, gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="body">{gap.title}</Text>
                    <Text variant="caption" tone="danger">
                      {Math.round(gap.accuracy * 100)} %
                    </Text>
                  </View>
                  <ProgressBar value={gap.accuracy} height={3} color={colors.danger} />
                  <Text variant="caption" tone="tertiary" onPress={() => router.push(`/grammar/${gap.slug}` as never)}>
                    Thema öffnen
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text variant="caption" tone="tertiary">
              Noch keine Wissenslücke messbar. Nach ein paar Grammatikübungen erscheint hier, was noch wackelt.
            </Text>
          )}

          <View>
            <SectionLabel>Schwierigkeit</SectionLabel>
            <Text variant="body">
              {difficulty.difficulty === 'easy'
                ? 'Ruhiger – die letzten Antworten waren unsicher.'
                : difficulty.difficulty === 'hard'
                  ? 'Anspruchsvoller – die letzten Antworten saßen.'
                  : 'Ausgeglichen – neues Material und Wiederholung im Wechsel.'}
            </Text>
            <Text variant="caption" tone="tertiary" style={{ marginTop: 4 }}>
              Grundlage: {Math.round(difficulty.accuracy * 100)} % richtige Antworten aus {difficulty.sample} Aufgaben.
              Übungen und Empfehlungen richten sich danach.
            </Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Button label="Einstufung neu messen" variant="secondary" onPress={() => router.push('/placement')} />
            <Text variant="caption" tone="tertiary">
              Der Test prüft Wortschatz, Grammatik, Lesen, Satzbau und Hören. Er ändert dein Niveau nur, wenn das Ergebnis
              klar abweicht.
            </Text>
          </View>
        </View>
      </Screen>
    </View>
  );
}
