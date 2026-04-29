'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AuthState = {
  error?: string;
  message?: string;
} | undefined;

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください。' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'メールアドレスまたはパスワードが正しくありません。' };
  }

  redirect('/dashboard');
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください。' };
  }

  if (password.length < 6) {
    return { error: 'パスワードは6文字以上で入力してください。' };
  }

  if (password !== confirmPassword) {
    return { error: 'パスワードが一致しません。' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: 'アカウントの作成に失敗しました。もう一度お試しください。' };
  }

  return { message: '確認メールを送信しました。メールを確認してアカウントを有効化してください。' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
