export function formatDurationDays(days: number): string {
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

export function formatDateLabel(dayIndex: number): string {
  // Demo trip dates starting 14 days from today
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 14 + (dayIndex - 1));
  return baseDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
