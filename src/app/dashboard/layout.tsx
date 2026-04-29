import { logout } from '@/app/actions/auth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 bg-warm-subtle">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-[var(--foreground)]"
            style={{ textDecoration: 'none' }}
          >
            <span className="text-xl">🎁</span>
            <span className="text-sm tracking-tight">Anniversary Reminder</span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
