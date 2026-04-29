-- ================================================
-- Anniversary Reminder - Database Schema
-- ================================================

-- 1. profiles テーブル
-- auth.users と連携し、ユーザーのメール情報を保持
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default now() not null
);

-- profiles の RLS (Row Level Security) を有効化
alter table public.profiles enable row level security;

-- ユーザーは自分のプロフィールのみ閲覧可能
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- ユーザーは自分のプロフィールのみ更新可能
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. auth.users → profiles の自動作成トリガー
-- 新規ユーザー登録時に profiles レコードを自動作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- トリガー設定
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. anniversaries テーブル
-- 記念日データを保持
create table if not exists public.anniversaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('birthday', 'anniversary')),
  date date not null,
  remind_offset integer not null default 1 check (remind_offset in (1, 3, 7)),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- anniversaries の RLS を有効化
alter table public.anniversaries enable row level security;

-- ユーザーは自分のデータのみ操作可能
create policy "Users can view own anniversaries"
  on public.anniversaries for select
  using (auth.uid() = user_id);

create policy "Users can insert own anniversaries"
  on public.anniversaries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own anniversaries"
  on public.anniversaries for update
  using (auth.uid() = user_id);

create policy "Users can delete own anniversaries"
  on public.anniversaries for delete
  using (auth.uid() = user_id);

-- updated_at を自動更新するトリガー
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_anniversaries_updated_at
  before update on public.anniversaries
  for each row execute procedure public.update_updated_at();

-- インデックス（パフォーマンス最適化）
create index if not exists idx_anniversaries_user_id on public.anniversaries(user_id);
create index if not exists idx_anniversaries_date on public.anniversaries(date);
