import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AnniversaryForm from '@/components/AnniversaryForm';
import Link from 'next/link';
import type { Anniversary } from '@/lib/types';

export default async function EditAnniversaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: anniversary, error } = await supabase
    .from('anniversaries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !anniversary) {
    notFound();
  }

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
          ✏️ 記念日を編集
        </h1>
      </div>

      <div className="card p-6">
        <AnniversaryForm anniversary={anniversary as Anniversary} />
      </div>
    </div>
  );
}
