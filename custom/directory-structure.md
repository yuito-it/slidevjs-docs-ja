# ディレクトリ構造

Slidevは設定面を最小化し、機能拡張を柔軟かつ直感的に行うために、いくつかのディレクトリ構造の規約を採用しています。

基本的な構造は以下の通りです：

```bash
your-slidev/
  ├── components/       # カスタムコンポーネント
  ├── layouts/          # カスタムレイアウト
  ├── public/           # 静的アセット
  ├── setup/            # カスタムセットアップ/フック
  ├── styles/           # カスタムスタイル
  ├── index.html        # index.htmlへのインジェクション
  ├── slides.md         # メインスライド
  └── vite.config.ts   # 拡張されたviteの設定
```

すべてオプションです。

## コンポーネント

正規表現： `./components/*.{vue,js,ts,jsx,tsx,md}`

<LinkCard link="guide/component" />

## レイアウト

正規表現： `./layouts/*.{vue,js,ts,jsx,tsx}`
<LinkCard link="guide/layout" />

## 静的アセット

規約： `./public/*`

このディレクトリに配置されているアセットは、開発中はルートパス`/`で提供され、そのままdistディレクトリのルートにコピーされます。詳細は[Vite's `public` directory](https://vitejs.dev/guide/assets.html#the-public-directory)を参照してください。

## スタイル

正規表現： `./style.css` | `./styles/index.{css,js,ts}`

このパターンに従って配置されたファイルは、Appのルートに挿入されます。複数のCSSをインポートする必要がある場合は、以下のような構造を作成し、インポートの順序を自分で管理することができます。

```bash
your-slidev/
  ├── ...
  └── styles/
      ├── index.ts
      ├── base.css
      ├── code.css
      └── layouts.css
```

```ts
// styles/index.ts

import "./base.css";
import "./code.css";
import "./layouts.css";
```

スタイルは[Windi CSS](http://windicss.org/)と[PostCSS](https://postcss.org/)で処理されるため、CSSのネストや[at-directives](https://windicss.org/features/directives.html)をそのまま使用することができます。例：

```css
.slidev-layout {
  --uno: px-14 py-10 text-[1.1rem];

  h1,
  h2,
  h3,
  h4,
  p,
  div {
    --uno: select-none;
  }

  pre,
  code {
    --uno: select-text;
  }

  a {
    color: theme("colors.primary");
  }
}
```

[シンタックスについて詳しく学ぶ](https://windicss.org/features/directives.html)

## `index.html`

正規表現： `index.html`

`index.html`はメインの`index.html`にmeteタグやscriptを挿入する機能を提供します。

例えば、次のようなカスタム`index.html`の場合：

```html [index.html]
<head>
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Nunito+Sans:wght@200;400;600&display=swap"
    rel="stylesheet"
  />
</head>

<body>
  <script src="./your-scripts"></script>
</body>
```

最終的にホストされる`index.html`は次のようになります。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://cdn.jsdelivr.net/gh/slidevjs/slidev/assets/favicon.png"
    />
    <!-- 挿入されたhead -->
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Nunito+Sans:wght@200;400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="app"></div>
    <script
      type="module"
      src="__ENTRY__"
    ></script>
    <!-- 挿入されたbody -->
    <script src="./your-scripts"></script>
  </body>
</html>
```

## グローバルレイヤー

正規表現： `global-top.vue` | `global-bottom.vue` | `custom-nav-controls.vue` | `slide-top.vue` | `slide-bottom.vue`

<LinkCard link="features/global-layers" />
