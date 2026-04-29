# Anniversary Reminder

大切な人との記念日や誕生日を忘れないためのリマインダーアプリです。

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase
- **Emails**: Resend

---

## 🚀 開発環境のセットアップ (Getting Started)

### 1. 必要なツールのインストール
Node.js バージョン **20以上** が必要です。
```bash
nvm use 20
npm install
```

### 2. 環境変数の設定
`.env.local.example` をコピーして `.env.local` を作成し、各種キーを入力します。

```bash
cp .env.local.example .env.local
```

**`.env.local` の設定項目:**
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのProject URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの `anon` `public` API Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseの `service_role` `secret` API Key (Cron動作用)
- `RESEND_API_KEY`: ResendのAPIキー
- `RESEND_FROM_EMAIL`: 送信用メールアドレス

### 3. Supabase のセットアップ
1. [Supabase](https://supabase.com/) で新規プロジェクトを作成します。
2. 左メニューの **SQL Editor** を開き、`supabase/migrations/001_initial_schema.sql` の内容をすべて貼り付けて **Run** します。（これで必要なテーブルとセキュリティ設定が作成されます）
3. 左メニューの **Authentication** -> **Providers** -> **Email** を開き、「Enable email provider」がオンになっていることを確認します。（※開発時は「Confirm email」をオフにしておくとテストが楽です）

### 4. 開発サーバーの起動
以下のコマンドでローカルサーバーを立ち上げます。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスするとアプリが表示されます！
