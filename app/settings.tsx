import React, { useState } from 'react';
import { Platform, Pressable, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Dialog, Divider, Input, Screen, ScreenHeader, SectionLabel, Segmented, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import type { Level } from '@/data/types';
import type { Goal } from '@/store/types';
import { useAudioStore } from '@/services/audio';
import { syncReminders } from '@/services/reminders';
import { useAppStore } from '@/store/useAppStore';
import { dueCards, todayMinutes } from '@/store/selectors';
import type { Reminders } from '@/store/types';

const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];
const GOALS: { value: Goal; label: string }[] = [
  { value: 'travel', label: 'Reisen' },
  { value: 'work', label: 'Beruf' },
  { value: 'family', label: 'Familie' },
  { value: 'culture', label: 'Kultur' },
  { value: 'exam', label: 'Prüfung' },
];
const MINUTES = [5, 10, 15, 20, 30];
const RATES = [
  { value: '0.7', label: 'Langsam' },
  { value: '0.85', label: 'Normal' },
  { value: '1', label: 'Schnell' },
];
const REMINDER_HOURS = [7, 8, 12, 17, 18, 19, 20, 21];
const REMINDER_DAYS = [
  { value: 1, label: 'Mo' },
  { value: 2, label: 'Di' },
  { value: 3, label: 'Mi' },
  { value: 4, label: 'Do' },
  { value: 5, label: 'Fr' },
  { value: 6, label: 'Sa' },
  { value: 7, label: 'So' },
];

function ToggleChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityState={{ selected: active }}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.border,
      }}
    >
      <Text variant="caption" tone={active ? 'default' : 'tertiary'}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const settings = useAppStore((state) => state.settings);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const voiceLabel = useAudioStore((state) => state.voiceLabel);
  const voiceAvailable = useAudioStore((state) => state.voiceAvailable);
  const updateReminders = useAppStore((state) => state.updateReminders);
  const activities = useAppStore((state) => state.activities);
  const cards = useAppStore((state) => state.cards);
  const [reminderNote, setReminderNote] = useState<string | null>(null);
  const reminders = settings.reminders;

  const applyReminders = async (patch: Partial<Reminders>) => {
    const next = { ...reminders, ...patch };
    updateReminders(patch);
    const result = await syncReminders(next, {
      minutesToday: todayMinutes({ activities }),
      dueCount: dueCards({ cards }).length,
    });
    setReminderNote(
      result.permission === 'unavailable'
        ? 'Im Browser nicht verfügbar – auf iOS und Android aktiv.'
        : result.permission === 'denied'
          ? 'Benachrichtigungen sind im System blockiert. Erlaube sie in den Geräteeinstellungen.'
          : next.enabled
            ? `${result.scheduled} Erinnerungen pro Woche geplant.`
            : 'Erinnerungen ausgeschaltet.',
    );
  };

  const [name, setName] = useState(profile?.name ?? '');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const saveName = () => {
    updateProfile({ name: name.trim() || 'Lernende:r' });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Einstellungen" onBack={() => router.back()} />
      <Screen contentStyle={{ paddingTop: 0 }}>
        <View style={{ gap: spacing.xl }}>
          <View>
            <SectionLabel>Profil</SectionLabel>
            <Input label="Anzeigename" value={name} onChangeText={setName} onSubmitEditing={saveName} returnKeyType="done" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm }}>
              <Button label="Speichern" variant="secondary" onPress={saveName} style={{ height: 40 }} />
              {saved ? (
                <Text variant="caption" tone="success">
                  Gespeichert
                </Text>
              ) : null}
            </View>
          </View>

          <View>
            <SectionLabel>Niveau</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {LEVELS.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => updateProfile({ level })}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: profile?.level === level ? colors.accent : colors.border,
                  }}
                >
                  <Text variant="caption" tone={profile?.level === level ? 'default' : 'tertiary'}>
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Ziel</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {GOALS.map((goal) => (
                <Pressable
                  key={goal.value}
                  onPress={() => updateProfile({ goal: goal.value })}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: profile?.goal === goal.value ? colors.accent : colors.border,
                  }}
                >
                  <Text variant="caption" tone={profile?.goal === goal.value ? 'default' : 'tertiary'}>
                    {goal.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Tägliche Lernzeit</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {MINUTES.map((minutes) => (
                <Pressable
                  key={minutes}
                  onPress={() => updateProfile({ dailyMinutes: minutes })}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: profile?.dailyMinutes === minutes ? colors.accent : colors.border,
                  }}
                >
                  <Text variant="caption" tone={profile?.dailyMinutes === minutes ? 'default' : 'tertiary'}>
                    {minutes} Min
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Wiedergabe</SectionLabel>
            <Text variant="caption" tone="secondary" style={{ marginBottom: spacing.sm }}>
              Sprechgeschwindigkeit
            </Text>
            <Segmented options={RATES} value={String(settings.speechRate)} onChange={(value) => updateSettings({ speechRate: Number(value) })} />

            <View style={{ marginTop: spacing.md }}>
              <Divider />
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body">Transkription anzeigen</Text>
                  <Text variant="caption" tone="tertiary">
                    Aussprachehilfe unter Vokabeln
                  </Text>
                </View>
                <Switch
                  value={settings.showTranscription}
                  onValueChange={(value) => updateSettings({ showTranscription: value })}
                  trackColor={{ false: 'rgba(255,255,255,0.14)', true: 'rgba(139,123,255,0.5)' }}
                  thumbColor={settings.showTranscription ? colors.accent : '#9AA0AC'}
                />
              </View>
              <Divider />
              <View style={{ paddingVertical: spacing.md, gap: 2 }}>
                <Text variant="body">Stimme</Text>
                <Text variant="caption" tone={voiceAvailable === false ? 'danger' : 'tertiary'}>
                  {voiceLabel ??
                    (voiceAvailable === false
                      ? 'Keine russische Stimme installiert – Anhören ist erst nach der Installation möglich'
                      : 'Russische Systemstimme (ru-RU)')}
                </Text>
              </View>
              <Divider />
            </View>
          </View>

          <View>
            <SectionLabel>Erinnerungen</SectionLabel>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text variant="body">Tägliche Erinnerung</Text>
                <Text variant="caption" tone="tertiary">
                  Ruhig, ohne Serien-Druck
                </Text>
              </View>
              <Switch
                value={reminders.enabled}
                onValueChange={(value) => void applyReminders({ enabled: value })}
                trackColor={{ false: 'rgba(255,255,255,0.14)', true: 'rgba(139,123,255,0.5)' }}
                thumbColor={reminders.enabled ? colors.accent : '#9AA0AC'}
              />
            </View>

            {reminders.enabled ? (
              <View style={{ gap: spacing.md, paddingBottom: spacing.md }}>
                <Text variant="caption" tone="secondary">
                  Uhrzeit
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {REMINDER_HOURS.map((hour) => (
                    <ToggleChip
                      key={hour}
                      label={`${hour}:00`}
                      active={reminders.hour === hour}
                      onPress={() => void applyReminders({ hour, minute: 0 })}
                    />
                  ))}
                </View>

                <Text variant="caption" tone="secondary">
                  Tage
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {REMINDER_DAYS.map((day) => (
                    <ToggleChip
                      key={day.value}
                      label={day.label}
                      active={reminders.days.includes(day.value)}
                      onPress={() =>
                        void applyReminders({
                          days: reminders.days.includes(day.value)
                            ? reminders.days.filter((value) => value !== day.value)
                            : [...reminders.days, day.value].sort((a, b) => a - b),
                        })
                      }
                    />
                  ))}
                </View>

                <Text variant="caption" tone="secondary">
                  Ziel
                </Text>
                <Segmented
                  options={[
                    { value: 'minutes', label: 'Minuten' },
                    { value: 'words', label: 'Wörter' },
                    { value: 'lesson', label: 'Lektion' },
                  ]}
                  value={reminders.goal}
                  onChange={(value) => void applyReminders({ goal: value })}
                />

                <Text variant="caption" tone="secondary">
                  Nachrichtentyp
                </Text>
                <Segmented
                  options={[
                    { value: 'reminder', label: 'Kurze Erinnerung' },
                    { value: 'summary', label: 'Wochenstand' },
                  ]}
                  value={reminders.type}
                  onChange={(value) => void applyReminders({ type: value })}
                />
              </View>
            ) : null}

            {reminderNote ? (
              <Text variant="caption" tone="secondary">
                {reminderNote}
              </Text>
            ) : null}
            {Platform.OS === 'web' && reminders.enabled ? (
              <Text variant="caption" tone="warning">
                Im Browser werden keine lokalen Benachrichtigungen geplant. Auf iPhone und Android übernimmt das die
                App nach der Installation.
              </Text>
            ) : null}
            <Text variant="caption" tone="tertiary" style={{ marginTop: spacing.sm }}>
              Eine Erinnerung pro gewähltem Tag, ohne Werbung und ohne Serien-Warnungen. Änderungen ersetzen die vorherige
              Planung sofort.
            </Text>
          </View>

          <View>
            <SectionLabel>Daten</SectionLabel>
            <Text variant="caption" tone="secondary">
              Fortschritt und Vokabeln liegen ausschließlich auf diesem Gerät. Es gibt kein Konto und keine Übertragung an
              Server. Der KI-Tutor sendet nur dann Text, wenn er eingerichtet und geöffnet ist.
            </Text>
            <Button
              label="Fortschritt zurücksetzen"
              variant="danger"
              onPress={() => setConfirmReset(true)}
              style={{ marginTop: spacing.md }}
            />
          </View>

          <View>
            <SectionLabel>Über</SectionLabel>
            <Text variant="caption" tone="tertiary">
              SLOVO 1.0 · A0–A1 · 12 Lektionen · 144 Vokabeln · 33 Buchstaben · 14 Grammatikthemen · 5 Geschichten · 10
              Alltagssituationen. Erinnerungen werden lokal auf dem Gerät geplant.
            </Text>
          </View>
        </View>
      </Screen>

      <Dialog
        visible={confirmReset}
        title="Fortschritt löschen?"
        message="Alle Lektionen, Vokabelstände und Statistiken werden entfernt. Das lässt sich nicht rückgängig machen."
        confirmLabel="Löschen"
        destructive
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          resetProgress();
          router.replace('/onboarding');
        }}
      />
    </View>
  );
}
