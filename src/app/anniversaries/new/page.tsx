import AnniversaryForm from '@/components/AnniversaryForm';
import Link from 'next/link';

export default function NewAnniversaryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-[var(--foreground)] mt-2">
          🎁 新しい記念日を登録
        </h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          大切な人の記念日を登録して、リマインドを受け取りましょう。
        </p>
      </div>

      <div className="card p-6">
        <AnniversaryForm />
      </div>
    </div>
  );
}
