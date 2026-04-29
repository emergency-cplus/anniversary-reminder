'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAnniversary,
  updateAnniversary,
  deleteAnniversary,
  type AnniversaryFormState,
} from '@/app/actions/anniversaries';
import type { Anniversary } from '@/lib/types';
import Link from 'next/link';

interface AnniversaryFormProps {
  anniversary?: Anniversary;
}

export default function AnniversaryForm({ anniversary }: AnniversaryFormProps) {
  const isEditing = !!anniversary;
  const action = isEditing ? updateAnniversary : createAnniversary;

  const [state, formAction, pending] = useActionState<AnniversaryFormState, FormData>(
    action,
    undefined
  );

  const router = useRouter();

  const handleDelete = async () => {
    if (!anniversary) return;
    if (!confirm('この記念日を削除しますか？')) return;
    await deleteAnniversary(anniversary.id);
  };

  return (
    <form action={formAction} className="space-y-6 animate-fade-in">
      {/* Hidden ID for edit mode */}
      {isEditing && <input type="hidden" name="id" value={anniversary.id} />}

      {/* Title */}
      <div>
        <label htmlFor="title" className="label">
          タイトル
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={anniversary?.title || ''}
          placeholder="例: 〇〇の誕生日、両親の結婚記念日"
          className="input"
        />
        {state?.errors?.title && (
          <p className="error-message">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <span className="label">カテゴリ</span>
        <div className="radio-group mt-1">
          <div className="radio-option">
            <input
              type="radio"
              id="cat-birthday"
              name="category"
              value="birthday"
              defaultChecked={anniversary?.category === 'birthday' || !anniversary}
            />
            <label htmlFor="cat-birthday">🎂 誕生日</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="cat-anniversary"
              name="category"
              value="anniversary"
              defaultChecked={anniversary?.category === 'anniversary'}
            />
            <label htmlFor="cat-anniversary">🎉 記念日</label>
          </div>
        </div>
        {state?.errors?.category && (
          <p className="error-message">{state.errors.category[0]}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="label">
          日付
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={anniversary?.date || ''}
          className="input"
        />
        {state?.errors?.date && (
          <p className="error-message">{state.errors.date[0]}</p>
        )}
      </div>

      {/* Remind offset */}
      <div>
        <span className="label">通知タイミング</span>
        <div className="radio-group mt-1">
          <div className="radio-option">
            <input
              type="radio"
              id="remind-1"
              name="remind_offset"
              value="1"
              defaultChecked={anniversary?.remind_offset === 1 || !anniversary}
            />
            <label htmlFor="remind-1">🔔 1日前</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="remind-3"
              name="remind_offset"
              value="3"
              defaultChecked={anniversary?.remind_offset === 3}
            />
            <label htmlFor="remind-3">🔔 3日前</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="remind-7"
              name="remind_offset"
              value="7"
              defaultChecked={anniversary?.remind_offset === 7}
            />
            <label htmlFor="remind-7">🔔 1週間前</label>
          </div>
        </div>
        {state?.errors?.remind_offset && (
          <p className="error-message">{state.errors.remind_offset[0]}</p>
        )}
      </div>

      {/* General error */}
      {state?.message && (
        <p className="error-message">{state.message}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary flex-1"
        >
          {pending ? (
            <span className="animate-pulse-gentle">保存中...</span>
          ) : isEditing ? (
            '更新する'
          ) : (
            '登録する'
          )}
        </button>

        <Link href="/dashboard" className="btn-secondary">
          キャンセル
        </Link>
      </div>

      {/* Delete button (edit mode only) */}
      {isEditing && (
        <div className="pt-4 border-t border-[var(--card-border)]">
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger w-full"
          >
            🗑️ この記念日を削除する
          </button>
        </div>
      )}
    </form>
  );
}
