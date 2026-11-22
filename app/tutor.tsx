import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, ScreenHeader, Surface, Text } from '@/components/ui';
import { AudioButton } from '@/components/AudioButton';
import { colors, radii, spacing } from '@/theme/tokens';
import { scenarios } from '@/data/scenarios';
import { requestTutorReply, tutorConfigured, type ChatMessage } from '@/services/tutor';
import { stopAudio } from '@/services/audio';
import { useAppStore } from '@/store/useAppStore';

interface Message extends ChatMessage {
  id: string;
}

export default function TutorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useAppStore((state) => state.profile);
  const recordActivity = useAppStore((state) => state.recordActivity);

  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView> | null>(null);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const level = profile?.level ?? 'A0';

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy || !tutorConfigured) return;

    const userMessage: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setBusy(true);
    setError(null);

    try {
      const reply = await requestTutorReply({
        level,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        goal: scenario.goal,
        messages: history.map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: reply }]);
      recordActivity({
        kind: 'tutor',
        label: `KI-Tutor: ${scenario.title}`,
        minutes: 1,
        xp: 2,
        correct: 1,
        total: 1,
        refId: scenario.id,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unbekannter Fehler');
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }
  };

  const startScenario = (id: string) => {
    const next = scenarios.find((item) => item.id === id);
    setScenarioId(id);
    setMessages(next ? [{ id: 'opening', role: 'assistant', content: next.opening.ru }] : []);
    setError(null);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title="KI-Tutor"
        subtitle={`${scenario.title} · Niveau ${level}`}
        onBack={() => {
          void stopAudio();
          router.back();
        }}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        {!tutorConfigured ? (
          <Surface style={{ gap: spacing.sm }}>
            <Text variant="headline">Noch nicht eingerichtet</Text>
            <Text variant="body" tone="secondary">
              Der Tutor läuft über einen lokalen Proxy, damit kein Schlüssel in der App landet.
            </Text>
            <View style={styles.code}>
              <Text variant="caption" style={styles.codeLine}>
                bun run tutor
              </Text>
              <Text variant="caption" tone="secondary" style={styles.codeLine}>
                EXPO_PUBLIC_TUTOR_API_URL=http://localhost:8787
              </Text>
            </View>
            <Text variant="caption" tone="tertiary">
              Der Proxy liest OPENAI_API_KEY aus der Serverumgebung. Danach die App neu starten.
            </Text>
          </Surface>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {scenarios.map((item) => {
            const active = scenarioId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => startScenario(item.id)}
                hitSlop={4}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: active ? colors.accent : colors.border,
                }}
              >
                <Text variant="caption" weight={active ? '600' : '400'} tone={active ? 'default' : 'tertiary'}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text variant="caption" tone="tertiary">
          {scenario.goal}
        </Text>

        {messages.length === 0 ? (
          <Pressable onPress={() => startScenario(scenario.id)} style={{ paddingVertical: spacing.md }}>
            <Text variant="body" tone="accent">
              Szene beginnen
            </Text>
          </Pressable>
        ) : null}

        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              maxWidth: '86%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' ? colors.accentSoft : colors.surface,
              borderColor: message.role === 'user' ? 'rgba(139,123,255,0.3)' : colors.border,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.sm,
            }}
          >
            <Text variant="body">{message.content}</Text>
            {message.role === 'assistant' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <AudioButton text={message.content} audioKey={`tutor-${message.id}`} size="sm" accessibilityLabel="Antwort anhören" />
                <Pressable onPress={() => router.push(`/personal?add=${encodeURIComponent(message.content)}`)} hitSlop={6}>
                  <Text variant="micro" tone="tertiary">
                    Als Vokabel speichern
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}

        {busy ? (
          <Text variant="caption" tone="tertiary">
            Antwort wird geschrieben …
          </Text>
        ) : null}

        {error ? (
          <Text variant="caption" tone="danger">
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          editable={tutorConfigured}
          placeholder={tutorConfigured ? 'Auf Russisch antworten' : 'Tutor nicht eingerichtet'}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          multiline
          onSubmitEditing={() => send(input)}
        />
        <IconButton
          icon="arrow-up"
          size={40}
          tint={input.trim() && tutorConfigured ? colors.accent : colors.textTertiary}
          accessibilityLabel="Senden"
          onPress={() => send(input)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 15,
  },
  code: {
    gap: 2,
    paddingVertical: spacing.sm,
  },
  codeLine: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
