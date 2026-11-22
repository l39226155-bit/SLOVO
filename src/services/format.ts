export function dayKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatMinutes(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  if (total < 60) return `${total} Min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} Std` : `${hours} Std ${rest} Min`;
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${`${s % 60}`.padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}, ${d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function relativeDue(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const minutes = Math.round(diff / 60000);
  if (minutes <= 0) return 'jetzt';
  if (minutes < 60) return `in ${minutes} Min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} Std`;
  const days = Math.round(hours / 24);
  if (days < 30) return `in ${days} Tg`;
  return `in ${Math.round(days / 30)} Mon`;
}

export function percent(value: number): string {
  return `${Math.round(value * 100)} %`;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Gute Nacht';
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Hallo';
  return 'Guten Abend';
}

export function weekdayShort(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Normalises user input for tolerant answer comparison. */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,!?;:«»"'’()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAnswerCorrect(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  return accepted.some((candidate) => {
    const target = normalizeAnswer(candidate);
    if (target === normalized) return true;
    // Accept answers that differ only by stress marks / accents.
    return target.normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
      normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  });
}
