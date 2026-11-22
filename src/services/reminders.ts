import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { ReminderGoal, Reminders, ReminderType } from '@/store/types';

/**
 * Optional daily reminders. Nothing is scheduled while the switch is off, and
 * every change replaces the previous schedule instead of stacking duplicates.
 */

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export type PermissionResult = 'granted' | 'denied' | 'unavailable';

export async function ensureNotificationPermission(): Promise<PermissionResult> {
  if (Platform.OS === 'web') return 'unavailable';
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return 'granted';
    if (current.canAskAgain === false) return 'denied';
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}

const GOAL_TEXT: Record<ReminderGoal, string> = {
  words: 'Ein paar Wörter wiederholen',
  minutes: 'Deine Lernminuten für heute',
  lesson: 'Die nächste Lektion wartet',
};

const TYPE_TEXT: Record<ReminderType, string> = {
  reminder: 'Kurz und ruhig – ohne Streak-Druck.',
  summary: 'Mit dem Stand der Woche.',
};

export function reminderBody(reminders: Reminders, minutesToday: number, dueCount: number): string {
  if (reminders.type === 'summary') {
    return `${minutesToday} Minuten diese Woche geschafft, ${dueCount} Wörter warten auf Wiederholung.`;
  }
  return `${GOAL_TEXT[reminders.goal]}: ${dueCount > 0 ? `${dueCount} Karten sind fällig.` : 'fünf Minuten genügen.'}`;
}

export async function syncReminders(
  reminders: Reminders,
  context: { minutesToday: number; dueCount: number },
): Promise<{ scheduled: number; permission: PermissionResult }> {
  if (Platform.OS === 'web') return { scheduled: 0, permission: 'unavailable' };

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!reminders.enabled || reminders.days.length === 0) {
    return { scheduled: 0, permission: 'granted' };
  }

  const permission = await ensureNotificationPermission();
  if (permission !== 'granted') return { scheduled: 0, permission };

  const body = reminderBody(reminders, context.minutesToday, context.dueCount);
  let scheduled = 0;

  for (const day of reminders.days) {
    // Expo uses 1 = Sunday … 7 = Saturday; our UI uses 1 = Monday … 7 = Sunday.
    const weekday = day === 7 ? 1 : day + 1;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'SLOVO',
          body,
          sound: false,
          data: { kind: 'reminder', type: reminders.type, goal: reminders.goal },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: reminders.hour,
          minute: reminders.minute,
        },
      });
      scheduled += 1;
    } catch {
      // A failing day must not discard the others.
    }
  }

  return { scheduled, permission };
}

export async function cancelReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduledReminderCount(): Promise<number> {
  if (Platform.OS === 'web') return 0;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length;
  } catch {
    return 0;
  }
}

export const REMINDER_TYPE_HINT = TYPE_TEXT;
