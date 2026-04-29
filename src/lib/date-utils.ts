/**
 * 日付ユーティリティ
 * 記念日までの残り日数計算や日本語フォーマットを提供
 */

/**
 * 次の記念日までの残り日数を計算する
 * 記念日は毎年繰り返すため、月日ベースで計算
 */
export function getDaysUntilNextOccurrence(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr);
  const targetMonth = date.getMonth();
  const targetDay = date.getDate();

  // 今年の記念日
  const thisYear = new Date(today.getFullYear(), targetMonth, targetDay);
  thisYear.setHours(0, 0, 0, 0);

  // 今年の記念日がまだ来ていない or 今日の場合
  if (thisYear >= today) {
    const diff = thisYear.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // 今年の記念日が過ぎている → 来年の記念日
  const nextYear = new Date(today.getFullYear() + 1, targetMonth, targetDay);
  nextYear.setHours(0, 0, 0, 0);
  const diff = nextYear.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * 日付を日本語フォーマットで返す
 * 例: "4月25日"
 */
export function formatDateJP(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 残り日数に応じた表示テキスト
 */
export function getDaysLabel(days: number): string {
  if (days === 0) return '🎉 今日！';
  if (days === 1) return 'あと1日';
  return `あと${days}日`;
}

/**
 * 通知タイミングの日本語ラベル
 */
export function getRemindOffsetLabel(offset: number): string {
  switch (offset) {
    case 1:
      return '1日前';
    case 3:
      return '3日前';
    case 7:
      return '1週間前';
    default:
      return `${offset}日前`;
  }
}
