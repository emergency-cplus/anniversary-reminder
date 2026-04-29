import { createClient } from '@/lib/supabase/server';
import { getDaysUntilNextOccurrence } from '@/lib/date-utils';
import type { Anniversary, AnniversaryWithDays } from '@/lib/types';
import AnniversaryCard from '@/components/AnniversaryCard';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: anniversaries, error } = await supabase
    .from('anniversaries')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching anniversaries:', error);
  }

  // 残り日数を計算し、直近順にソート
  const withDays: AnniversaryWithDays[] = (anniversaries as Anniversary[] || [])
    .map((a) => ({
      ...a,
      days_until: getDaysUntilNextOccurrence(a.date),
    }))
    .sort((a, b) => a.days_until - b.days_until);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            記念日一覧
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {withDays.length > 0
              ? `${withDays.length}件の記念日が登録されています`
              : '大切な記念日を登録しましょう'}
          </p>
        </div>

        <Link href="/anniversaries/new" className="btn-primary text-sm">
          ＋ 新しい記念日
        </Link>
      </div>

      {/* Anniversary list */}
      {withDays.length > 0 ? (
        <div className="space-y-3">
          {withDays.map((anniversary, index) => (
            <AnniversaryCard
              key={anniversary.id}
              anniversary={anniversary}
              index={index}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🎂</div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            まだ記念日が登録されていません
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6 max-w-xs mx-auto">
            大切な人の誕生日や記念日を登録して、<br />
            幸せにするチャンスを逃さないようにしましょう。
          </p>
          <Link href="/anniversaries/new" className="btn-primary">
            🎁 最初の記念日を登録する
          </Link>
        </div>
      )}
    </div>
  );
}
