import Link from 'next/link';
import { formatDateJP, getDaysLabel, getRemindOffsetLabel } from '@/lib/date-utils';
import type { AnniversaryWithDays } from '@/lib/types';

interface AnniversaryCardProps {
  anniversary: AnniversaryWithDays;
  index: number;
}

export default function AnniversaryCard({ anniversary, index }: AnniversaryCardProps) {
  const isBirthday = anniversary.category === 'birthday';
  const isToday = anniversary.days_until === 0;
  const isSoon = anniversary.days_until <= 7;

  return (
    <Link
      href={`/anniversaries/${anniversary.id}/edit`}
      className={`card block p-5 opacity-0 animate-fade-in stagger-${Math.min(index + 1, 6)}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left section */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              isBirthday
                ? 'bg-[var(--color-rose-50)]'
                : 'bg-[var(--color-amber-50)]'
            }`}
          >
            {isBirthday ? '🎂' : '🎉'}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--foreground)] truncate">
              {anniversary.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${isBirthday ? 'badge-birthday' : 'badge-anniversary'}`}>
                {isBirthday ? '誕生日' : '記念日'}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {formatDateJP(anniversary.date)}
              </span>
              <span className="text-xs text-[var(--muted)]">
                · 🔔 {getRemindOffsetLabel(anniversary.remind_offset)}
              </span>
            </div>
          </div>
        </div>

        {/* Days counter */}
        <div
          className={`flex-shrink-0 text-right days-counter ${
            isToday
              ? 'text-[var(--color-amber-600)] font-bold'
              : isSoon
              ? 'text-[var(--color-rose-500)] font-semibold'
              : 'text-[var(--muted)]'
          }`}
        >
          <span className={`text-sm ${isToday ? 'text-base' : ''}`}>
            {getDaysLabel(anniversary.days_until)}
          </span>
        </div>
      </div>
    </Link>
  );
}
