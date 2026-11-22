import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider, ListRow, ProgressBar, Screen, SectionLabel, Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { buildCourseMap, chapters, chapterProgress, courseProgress, lessons } from '@/data/course';
import { useAppStore } from '@/store/useAppStore';

export default function CourseScreen() {
  const router = useRouter();
  const completed = useAppStore((state) => state.lessons);
  const map = useMemo(() => buildCourseMap(completed), [completed]);
  const progress = useMemo(() => courseProgress(completed), [completed]);

  return (
    <Screen>
      <View style={{ gap: spacing.md }}>
        <Text variant="title">Kurs</Text>
        <Text variant="caption" tone="secondary">
          {progress.done} von {progress.total} Lektionen · {Math.round(progress.ratio * 100)} %
        </Text>
        <ProgressBar value={progress.ratio} />
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

        <View>
          <SectionLabel>Weitere Niveaus</SectionLabel>
          <Text variant="caption" tone="tertiary">
            A2 bis C1 folgen auf derselben Kursstruktur. Derzeit sind {lessons.length} Lektionen für A0 und A1
            vollständig ausformuliert.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
