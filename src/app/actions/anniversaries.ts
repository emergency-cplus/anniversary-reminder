'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const anniversarySchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  category: z.enum(['birthday', 'anniversary'], {
    message: 'カテゴリを選択してください',
  }),
  date: z.string().min(1, '日付を選択してください'),
  remind_offset: z.coerce.number().refine((v) => [1, 3, 7].includes(v), {
    message: '通知タイミングを選択してください',
  }),
});

export type AnniversaryFormState = {
  errors?: {
    title?: string[];
    category?: string[];
    date?: string[];
    remind_offset?: string[];
  };
  message?: string;
} | undefined;

export async function createAnniversary(
  prevState: AnniversaryFormState,
  formData: FormData
): Promise<AnniversaryFormState> {
  const validated = anniversarySchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    date: formData.get('date'),
    remind_offset: formData.get('remind_offset'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: '認証エラーが発生しました。再度ログインしてください。' };
  }

  const { error } = await supabase.from('anniversaries').insert({
    user_id: user.id,
    title: validated.data.title,
    category: validated.data.category,
    date: validated.data.date,
    remind_offset: validated.data.remind_offset,
  });

  if (error) {
    return { message: '記念日の登録に失敗しました。もう一度お試しください。' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateAnniversary(
  prevState: AnniversaryFormState,
  formData: FormData
): Promise<AnniversaryFormState> {
  const id = formData.get('id') as string;

  const validated = anniversarySchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    date: formData.get('date'),
    remind_offset: formData.get('remind_offset'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: '認証エラーが発生しました。再度ログインしてください。' };
  }

  const { error } = await supabase
    .from('anniversaries')
    .update({
      title: validated.data.title,
      category: validated.data.category,
      date: validated.data.date,
      remind_offset: validated.data.remind_offset,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { message: '記念日の更新に失敗しました。もう一度お試しください。' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteAnniversary(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  await supabase
    .from('anniversaries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
