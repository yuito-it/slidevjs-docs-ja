# KaTeXの設定

<Environment type="node" />

以下の内容で`./setup/katex.ts`を作成します：

```ts twoslash [setup/katex.ts]
import { defineKatexSetup } from "@slidev/types";

export default defineKatexSetup(() => {
  return {
    maxExpand: 2000,
    /* ... */
  };
});
```

The return value should be the custom options for KaTeX. Refer to [KaTeX's documentation](https://katex.org/docs/options.html) or the type definition for the full options list.
