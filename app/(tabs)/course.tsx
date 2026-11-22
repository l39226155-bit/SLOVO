import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider, ListRow, ProgressBar, Screen, SectionLabel, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { buildCourseMap, chapters, chapterProgress, courseProgress } from '@/data/course';
import { levelProgress } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export default function CourseScreen() {
  const router = useRouter();
  const completed = useAppStore((state) => state.lessons);
  const map = useMemo(() => buildCourseMap(completed), [completed]);
  const progress = useMemo(() => courseProgress(completed), [completed]);
  const levels = useMemo(() => levelProgress(completed), [completed]);

  return (
    <Screen>
      <View style={{ gap: spacing.md }}>
        <Text variant="title">Kurs</Text>
        <Text variant="caption" tone="secondary">
          {progress.done} von {progress.total} Lektionen · {Math.round(progress.ratio * 100)} %
        </Text>
        <ProgressBar value={progress.ratio} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
          {levels.map((entry) => (
            <View
              key={entry.level}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: entry.done > 0 ? colors.accent : colors.border,
                backgroundColor: entry.done > 0 ? colors.accentSoft : 'transparent',
              }}
            >
              <Text variant="caption" tone={entry.done > 0 ? 'accent' : 'tertiary'}>
                {entry.level} {entry.total === 0 ? '—' : `${entry.done}/${entry.total}`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {chapters.map((chapter) => {
          const nodes = map.filter((node) => node.chapter.id === chapter.id);
          const chapterStat = chapterProgress(chapter.id, completed);
          const chapterLocked = nodes.every((node) => node.status === 'locked');

          return (
            <View key={chapter.id}>
              <SectionLabel>
                {`${chapter.level} · ${chapter.title}`}
              </SectionLabel>
              <Text variant="caption" tone="tertiary" style={{ marginTop: -spacing.xs, marginBottom: spacing.xs }}>
                {chapter.subtitle} · {chapterStat.done}/{chapterStat.total}
              </Text>

              {chapterLocked ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md }}>
                  <Ionicons name="lock-closed-outline" size={15} color={colors.textTertiary} />
                  <Text variant="caption" tone="tertiary">
                    Wird nach dem vorherigen Kapitel freigeschaltet
                  </Text>
                </View>
              ) : (
                nodes.map((node, index) => (
                  <View key={node.lesson.id}>
                    {index > 0 ? <Divider /> : null}
                    <ListRow
                      title={`${node.indexInChapter}. ${node.lesson.title}`}
                      subtitle={node.lesson.subtitle}
                      value={
                        node.status === 'done'
                          ? node.bestScore > 0
                            ? `${node.bestScore} %`
                            : 'Fertig'
                          : node.status === 'locked'
                            ? undefined
                            : `${node.lesson.minutes} Min`
                      }
                      leading={
                        node.status === 'done' ? (
                          <Ionicons name="checkmark" size={17} color={colors.success} />
                        ) : node.status === 'locked' ? (
                          <Ionicons name="lock-closed-outline" size={15} color={colors.textTertiary} />
                        ) : (
                          <Ionicons name="play" size={14} color={colors.accent} />
                        )
                      }
                      disabled={node.status === 'locked'}
                      onPress={() => router.push(`/lesson/${node.lesson.id}`)}
                    />
                  </View>
                ))
              )}
            </View>
          );
        })}

        <Text variant="caption" tone="tertiary">
          {progress.total} Lektionen von A0 bis C1. Jede Lektion enthält Vokabeln, Grammatik, Hören, Schreiben und
          einen Abschlusstest.
        </Text>
      </View>
    </Screen>
  );
}
