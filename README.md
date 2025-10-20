# MeshiShare

**社員の交流を深める、社内飯どころ共有アプリ**

リモートワーク中心の環境で、食を通じたつながりとコミュニケーションのきっかけを創出します。

## 💡 プロダクト概要

MeshiShare は、社員が「おすすめの飯どころ」を会社内で共有・検索できるアプリケーションです。

### 目的

- **社員の交流を深める** - 食を通じたコミュニケーションのきっかけ作り
- チームランチ、出張、オフラインミーティングなどの「店選び時間」を短縮
- 社内の情報資産として飲食店データを蓄積

### MVP機能

- ✅ 店舗投稿（名前、住所、写真、ジャンル、価格帯、説明）
- ✅ 店舗一覧・検索（キーワード、ジャンル、価格帯）
- ✅ 店舗詳細表示
- ✅ レビュー・評価（⭐️1〜5、コメント）
- ✅ Google OAuth 認証（自社ドメイン限定）
- ✅ レスポンシブデザイン

## 🛠️ 技術スタック

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + daisyUI
- **Backend**: Next.js API Routes / Server Actions
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Testing**: Vitest (Unit) + Playwright (E2E)
- **Hosting**: Vercel

**MVP は完全無料で運用可能**（月額 $0）

## 📚 ドキュメント

詳細な要件定義は [`.docs/01-requirements`](./.docs/01-requirements/README.md) を参照してください。

- [製品概要](./.docs/01-requirements/01-product-overview.md)
- [MVP範囲定義](./.docs/01-requirements/02-mvp-scope.md)
- [技術スタック](./.docs/01-requirements/03-technical-stack.md)
- [データモデル](./.docs/01-requirements/04-data-model.md)
- [非機能要件](./.docs/01-requirements/05-non-functional-requirements.md)
- [開発ロードマップ](./.docs/01-requirements/06-development-roadmap.md)

## 🚀 Getting Started

### 前提条件

- Node.js 18+
- npm / yarn / pnpm
- Supabase アカウント

### セットアップ

1. **依存パッケージのインストール**

```bash
npm install
```

2. **環境変数の設定**

`.env.example` をコピーして `.env` を作成してください。

```bash
cp .env.example .env
```

必要な環境変数：
- `DATABASE_URL`: Supabase PostgreSQL 接続URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase プロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase サービスロールキー

3. **Prisma Client の生成**

```bash
npx prisma generate
```

4. **データベースマイグレーション**

```bash
npx prisma migrate dev
```

5. **開発サーバー起動**

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

### テスト

```bash
# ユニットテスト
npm run test

# カバレッジ付き
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

### その他のコマンド

```bash
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint
npx prisma studio    # Prisma Studio（データベース可視化）
```

## 📅 開発ロードマップ

| Week | タスク |
|------|--------|
| 1-2 | プロジェクトセットアップ、認証実装 |
| 3-4 | 店舗投稿・一覧・詳細機能 |
| 5-6 | レビュー・評価機能 |
| 7 | 検索・フィルタリング機能 |
| 8 | UI/UX改善、β公開 |

**β公開予定**: Week 8 終了時

## 📄 License

MIT
