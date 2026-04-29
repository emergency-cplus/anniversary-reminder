'use client';

import { useActionState, useState } from 'react';
import { login, signup, type AuthState } from '@/app/actions/auth';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginState, loginAction, loginPending] = useActionState<AuthState, FormData>(login, undefined);
  const [signupState, signupAction, signupPending] = useActionState<AuthState, FormData>(signup, undefined);

  const isLogin = mode === 'login';
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tab switcher */}
      <div className="flex border-b border-[var(--card-border)] mb-6">
        <button
          type="button"
          className={`tab-btn flex-1 ${isLogin ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          ログイン
        </button>
        <button
          type="button"
          className={`tab-btn flex-1 ${!isLogin ? 'active' : ''}`}
          onClick={() => setMode('signup')}
        >
          新規登録
        </button>
      </div>

      {/* Login form */}
      {isLogin && (
        <form action={loginAction} className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="login-email" className="label">
              メールアドレス
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="email@example.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="label">
              パスワード
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input"
            />
          </div>

          {state?.error && (
            <p className="error-message" role="alert">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full"
          >
            {pending ? (
              <span className="animate-pulse-gentle">ログイン中...</span>
            ) : (
              'ログイン'
            )}
          </button>
        </form>
      )}

      {/* Signup form */}
      {!isLogin && (
        <form action={signupAction} className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="signup-email" className="label">
              メールアドレス
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="email@example.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="label">
              パスワード
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="6文字以上"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="signup-confirm" className="label">
              パスワード（確認）
            </label>
            <input
              id="signup-confirm"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="パスワードを再入力"
              className="input"
            />
          </div>

          {state?.error && (
            <p className="error-message" role="alert">{state.error}</p>
          )}
          {state?.message && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3" role="status">
              ✉️ {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full"
          >
            {pending ? (
              <span className="animate-pulse-gentle">登録中...</span>
            ) : (
              'アカウントを作成'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
