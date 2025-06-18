import type { DefaultTheme } from "vitepress";
import { fileURLToPath } from "node:url";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";
import { groupIconMdPlugin } from "vitepress-plugin-group-icons";
import { version } from "../package.json";
import Customizations from "./customizations";
import { Advanced, BuiltIn, Guides, Resources } from "./pages";
import { getSidebarObject } from "./sidebar-gen";

export const slidebars: DefaultTheme.SidebarItem[] = [
  {
    text: "ガイド",
    items: Guides,
  },
  {
    text: "上級",
    items: Advanced,
  },
  {
    text: "カスタマイズ",
    items: Customizations,
  },
  {
    text: "ビルトイン",
    items: BuiltIn,
  },
  {
    text: "リソース",
    items: Resources,
  },
];

export default defineConfig({
  title: "Slidev",
  description: "開発者のためのプレゼンテーションスライド",
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
    ["meta", { name: "author", content: "Anthony Fu" }],
    ["meta", { property: "og:title", content: "Slidev" }],
    ["meta", { property: "og:image", content: "https://sli.dev/og-image.png" }],
    [
      "meta",
      {
        property: "og:description",
        content: "開発者のためのプレゼンテーションスライド",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:creator", content: "@slidevjs" }],
    ["meta", { name: "twitter:image", content: "https://sli.dev/og-image.png" }],
    ["link", { rel: "dns-prefetch", href: "https://fonts.gstatic.com" }],
    [
      "link",
      {
        rel: "preconnect",
        crossorigin: "anonymous",
        href: "https://fonts.gstatic.com",
      },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@200;400;500&family=Inter:wght@200;400;500;600",
        rel: "stylesheet",
      },
    ],
  ],
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    async shikiSetup(shiki) {
      await shiki.loadLanguage("html", "xml", "vue", "markdown", "mermaid", "latex");
    },
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          vfsRoot: fileURLToPath(import.meta.url),
          compilerOptions: {
            resolveJsonModule: true,
          },
        },
      }),
    ],
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  cleanUrls: true,
  themeConfig: {
    logo: "/logo.svg",
    editLink: {
      pattern: "https://github.com/slidevjs/slidev/edit/main/docs/:path",
      text: "このページの修正を提案",
    },

    search: {
      provider: "local",
    },

    nav: [
      {
        text: "📖 ガイド",
        items: [
          ...Guides,
          {
            text: "上級",
            items: Advanced,
          },
        ],
      },
      {
        text: "✨ 機能",
        link: "/features/",
      },
      {
        text: "リファレンス",
        items: [
          {
            text: "ビルトイン",
            items: BuiltIn,
          },
          {
            text: "カスタマイズ",
            items: Customizations,
          },
        ],
      },
      {
        text: "リソース",
        items: Resources,
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/slidevjs/slidev" },
      { icon: "twitter", link: "https://twitter.com/slidevjs" },
      { icon: "discord", link: "https://chat.sli.dev" },
    ],

    sidebar: {
      "/guide/": slidebars,
      "/themes/": slidebars,
      "/addons/": slidebars,
      "/custom/": slidebars,
      "/builtin/": slidebars,
      "/resources/": slidebars,
      // eslint-disable-next-line antfu/no-top-level-await
      ...(await getSidebarObject()),
      "/features/": [],
      "/": slidebars,
    },

    footer: {
      message: "MITライセンスで公開されています。",
      copyright: "Copyright © 2020-2025 Anthony Fu.",
    },
  },

  locales: {
    root: {
      label: `日本語 (v${version})`,
    },
    en: {
      label: "English",
      link: "https://sli.dev/",
    },
    zh: {
      label: "简体中文",
      link: "https://cn.sli.dev/",
    },
  },
});
