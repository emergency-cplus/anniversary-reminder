import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-warm-gradient">
      {/* Hero section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10 animate-slide-up">
          {/* Logo / Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 shadow-md mb-6">
            <span className="text-3xl" role="img" aria-label="gift">🎁</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            Anniversary Reminder
          </h1>

          <p className="text-lg sm:text-xl font-medium text-[var(--color-amber-700)] mb-2">
            人を幸せにするチャンスを逃すな。
          </p>

          <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
            大切な人の誕生日や記念日を登録するだけ。<br />
            適切なタイミングでメールでリマインドします。
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="card w-full max-w-md p-6 sm:p-8 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <AuthForm />
        </div>

        {/* Footer note */}
        <p
          className="text-xs text-[var(--muted)] mt-8 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          受動的でノイズレスな体験を — カレンダーに混ぜず、大切な日だけを管理
        </p>
      </main>
    </div>
  );
}
