# Styles Directory

このディレクトリには、プロジェクト全体の CSS ファイルが含まれています。ファイルは機能とスコープに基づいて分離されています。

## ファイル構造

### 📁 Core Styles

- **`global.css`** - グローバルスタイル、リセット、デザインシステム
  - CSS Reset & Base Styles
  - Design System (CSS Custom Properties)
  - Typography Base
  - Utility Classes
  - Responsive Design
  - Interactive Elements
  - Card Component Base

### 📁 Component Styles

- **`components.css`** - 再利用可能なコンポーネントスタイル
  - Badge Component
  - Alert Component
  - Loading Component
  - Language Tags
  - Status Badges

### 📁 Layout Styles

- **`bento-grid.css`** - Bento グリッドシステム
  - Grid Layout
  - Card Positioning
  - Content Layouts
  - Icons & Typography
  - Progress Bars
  - Activity Charts
  - Responsive Design

### 📁 Page Styles

- **`index.css`** - インデックスページ固有のスタイル
  - Chart Containers
  - Page Layout Utilities
  - Grid Utilities
  - Responsive Design

## 使用方法

### Layout.astro (全ページ共通)

```astro
<style is:global>
  @import "../styles/global.css";
  @import "../styles/components.css";
</style>
```

### index.astro (ページ固有)

```astro
<style>
  @import "../styles/bento-grid.css";
  @import "../styles/index.css";
</style>
```

## デザインシステム

### カスタムプロパティ

すべてのスタイルは CSS Custom Properties（CSS 変数）を使用して統一性を保っています：

- **Typography**: `--font-family`, `--text-*`, `--font-weight-*`
- **Colors**: `--color-*` (gray scale, semantic colors)
- **Spacing**: `--spacing-*` (1-24 のスケール)
- **Border Radius**: `--radius-*` (sm, md, lg, xl, full)
- **Shadows**: `--shadow-*` (sm, md, lg, xl)
- **Transitions**: `--transition-*` (base, colors)

### レスポンシブデザイン

- **Mobile**: 480px 以下
- **Tablet**: 768px 以下
- **Desktop**: 1024px 以上

## メンテナンス

### 新しいコンポーネントを追加する場合

1. `components.css`に新しいコンポーネントスタイルを追加
2. 既存のパターンとネーミング規則に従う
3. CSS Custom Properties を使用して統一性を保つ

### 新しいページを追加する場合

1. 必要に応じて新しいページ固有の CSS ファイルを作成
2. 対応する Astro ページで CSS をインポート
3. グローバルスタイルとの重複を避ける

### パフォーマンスの考慮事項

- CSS ファイルは必要な場所でのみインポート
- 未使用のスタイルは定期的に削除
- CSS Custom Properties を使用してコードの重複を避ける
