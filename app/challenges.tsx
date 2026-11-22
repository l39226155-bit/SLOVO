import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Divider, ProgressBar, Screen, ScreenHeader, SectionLabel, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { challengeSummary, dailyChallenges } from '@/services/challenges';
import { useAppStore } from '@/store/useAppStore';

export default function ChallengesScreen() {
  const router = useRouter();
  const activities = useAppStore((state) => state.activities);
  const cards = useAppStore((state) => state.cards);
  const claims = useAppStore((state) => state.challengeClaims);
  const profile = useAppStore((state) => state.profile);
  const claimChallenge = useAppStore((state) => state.claimChallenge);
  const [message, setMessage] = useState<string | null>(null);

  const challenges = useMemo(
    () => dailyChallenges({ activities, cards, challengeClaims: claims, profile }),
    [activities, cards, claims, profile],
  );
  const summary = challengeSummary(challenges);
  const allDone = summary.done === summary.total;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Tages-Challenges"
        subtitle={new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        onBack={() => router.back()}
      />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.xl }}>
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="headline">
                {summary.done} von {summary.total}
              </Text>
              <Text variant="caption" tone="tertiary">
                {allDone ? 'Alle Aufgaben erledigt' : `${summary.total - summary.done} offen`}
              </Text>
            </View>
            <ProgressBar
              value={summary.total === 0 ? 0 : summary.done / summary.total}
              color={allDone ? colors.success : colors.accent}
            />
            <Text variant="caption" tone="tertiary">
              Niveau {profile?.level ?? 'A0'} · die Aufgaben wechseln täglich und richten sich nach deinem Niveau.
            </Text>
          </View>

          <View>
            {challenges.map((challenge, index) => (
              <View key={challenge.id}>
                {index > 0 ? <Divider /> : null}
                <View style={{ paddingVertical: spacing.md, gap: spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
                    <Text variant="body" weight="500" style={{ flex: 1 }}>
                      {challenge.title}
                    </Text>
                    <Text variant="caption" tone={challenge.done ? 'success' : 'tertiary'}>
                      {challenge.value}/{challenge.target} {challenge.unit}
                    </Text>
                  </View>
                  <Text variant="caption" tone="tertiary">
                    {challenge.hint}
                  </Text>
                  <ProgressBar value={challenge.value / challenge.target} height={3} color={challenge.done ? colors.success : colors.accent} />
                  {challenge.done ? (
                    challenge.claimed ? (
                      <Text variant="caption" tone="success">
                        Abgeschlossen · +{challenge.xp} XP gutgeschrieben
                      </Text>
                    ) : (
                      <Button
                        label={`+${challenge.xp} XP abholen`}
                        variant="secondary"
                        style={{ height: 36, alignSelf: 'flex-start', paddingHorizontal: spacing.md }}
                        onPress={() => {
                          const ok = claimChallenge({ key: challenge.key, xp: challenge.xp, label: `Challenge: ${challenge.title}` });
                          setMessage(ok ? 'Belohnung gutgeschrieben.' : 'Bereits abgeholt.');
                        }}
                      />
                    )
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          {message ? (
            <Text variant="caption" tone="success">
              {message}
            </Text>
          ) : null}

          <View>
            <SectionLabel>Weiterlernen</SectionLabel>
            <Button label="Lernplan öffnen" variant="secondary" onPress={() => router.push('/learn/plan')} />
          </View>

          <Text variant="caption" tone="tertiary">
            Die Belohnung ist bewusst klein: XP, kein Badge, keine Push-Nachricht. Erledigte Aufgaben werden aus echten
            Aktivitäten des Tages berechnet.
          </Text>
        </View>
      </Screen>
    </View>
  );
}
