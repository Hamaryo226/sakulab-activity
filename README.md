# GitHub Organization Analytics

GitHub Organization 内のリポジトリ、コントリビューター、アクティビティを視覚的に分析する Web アプリケーションです。

![GitHub Organization Analytics](https://via.placeholder.com/800x400/667eea/ffffff?text=GitHub+Organization+Analytics)

## 機能

- 📊 **コミットトレンド分析**: 時系列でのコミット活動を追跡し、開発のピークとトレンドを把握
- 👥 **コントリビューター分析**: アクティブなメンバーと各々の貢献度を詳細に分析
- 📁 **リポジトリ統計**: 各リポジトリのアクティビティ、言語、人気度を比較
- 🔍 **リアルタイムデータ**: GitHub REST API を使用してリアルタイムのデータを取得
- 📱 **レスポンシブデザイン**: モバイル・デスクトップ両対応の美しい UI

## 技術スタック

- **Frontend**: [Astro](https://astro.build/) - 高速な静的サイトジェネレーター
- **Visualization**: [Chart.js](https://www.chartjs.org/) - インタラクティブなチャート
- **API**: [GitHub REST API](https://docs.github.com/ja/rest) via [@octokit/rest](https://github.com/octokit/rest.js)
- **Styling**: カスタム CSS（Glass morphism デザイン）
- **Date Handling**: [date-fns](https://date-fns.org/) - 日付操作ライブラリ

## セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd sk-analytics

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 環境変数（オプション）

`.env`ファイルを作成して以下の設定を行うことができます：

```bash
# GitHub Personal Access Token (推奨)
GITHUB_TOKEN=ghp_your_token_here

# デフォルトのorganization
DEFAULT_ORG=microsoft
```

**GitHub Personal Access Token の取得方法:**

1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)にアクセス
2. "Generate new token"をクリック
3. 必要な権限を選択（public repositories の場合は最小権限で OK）
4. トークンをコピーして環境変数に設定

## 使用方法

1. **Organization 名を入力**: 分析したい GitHub Organization の名前を入力
2. **GitHub Token 設定（オプション）**: レート制限回避のために Personal Access Token を設定
3. **分析開始**: データの取得と可視化が自動で実行されます

### サポートされる機能

- ✅ Public リポジトリの分析
- ✅ Private リポジトリの分析（トークン必要）
- ✅ コミット履歴の取得
- ✅ コントリビューター情報
- ✅ リポジトリ統計
- ✅ プログラミング言語分布
- ✅ アクティビティ状況

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run astro check
```

## API 制限について

GitHub API には以下の制限があります：

- **認証なし**: 1 時間あたり 60 リクエスト
- **認証あり**: 1 時間あたり 5,000 リクエスト

大きな organization を分析する場合は、Personal Access Token の使用を強く推奨します。

## プロジェクト構造

```
src/
├── components/          # UIコンポーネント
│   ├── Chart.astro     # チャートコンポーネント
│   ├── StatCard.astro  # 統計カード
│   └── ...
├── layouts/            # レイアウトファイル
├── pages/              # ページファイル
│   ├── index.astro     # ホームページ
│   └── analytics.astro # 分析結果ページ
└── utils/              # ユーティリティ
    └── github.ts       # GitHub API ラッパー
```

## カスタマイズ

### チャートの設定

`src/components/Chart.astro`で Chart.js の設定をカスタマイズできます。

### スタイリング

`src/layouts/Layout.astro`でグローバルスタイルを変更できます。

## 貢献

プルリクエストや課題の報告を歓迎します！

## ライセンス

MIT License

## 開発者

作成者: [Your Name]

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
