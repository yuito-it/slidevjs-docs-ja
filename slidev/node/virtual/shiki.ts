import type { LanguageInput, LanguageRegistration, MaybeGetter, SpecialLanguage, ThemeInput, ThemeRegistration } from 'shiki'
import { loadShikiSetups } from '../setups/shiki'
import { resolveImportUrl } from '../resolver'
import type { VirtualModuleTemplate } from './types'

export const templateShiki: VirtualModuleTemplate = {
  id: '/@slidev/shiki',
  getContent: async ({ clientRoot, roots }) => {
    const options = await loadShikiSetups(clientRoot, roots)
    const langs = await resolveLangs(options.langs || ['javascript', 'typescript', 'html', 'css'])
    const resolvedThemeOptions = 'themes' in options
      ? {
          themes: Object.fromEntries(await Promise.all(Object.entries(options.themes)
            .map(async ([name, value]) => [name, await resolveTheme(value!)]),
          )) as Record<string, ThemeRegistration | string>,
        }
      : {
          theme: await resolveTheme(options.theme || 'vitesse-dark'),
        }

    const themes = resolvedThemeOptions.themes
      ? Object.values(resolvedThemeOptions.themes)
      : [resolvedThemeOptions.theme!]

    const themeOptionsNames = resolvedThemeOptions.themes
      ? { themes: Object.fromEntries(Object.entries(resolvedThemeOptions.themes).map(([name, value]) => [name, typeof value === 'string' ? value : value.name])) }
      : { theme: typeof resolvedThemeOptions.theme === 'string' ? resolvedThemeOptions.theme : resolvedThemeOptions.theme.name }

    async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
      return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
    }

    async function resolveLangs(langs: (LanguageInput | SpecialLanguage | string)[]): Promise<(LanguageRegistration | string)[]> {
      return Array.from(new Set((
        await Promise.all(
          langs.map(async lang => await normalizeGetter(lang as LanguageInput).then(r => Array.isArray(r) ? r : [r])),
        )).flat()))
    }

    async function resolveTheme(theme: string | ThemeInput): Promise<ThemeRegistration | string> {
      return typeof theme === 'string' ? theme : await normalizeGetter(theme)
    }

    const langsInit = await Promise.all(langs
      .map(async lang =>
        typeof lang === 'string'
          ? `import('${await resolveImportUrl(`shiki/langs/${lang}.mjs`)}')`
          : JSON.stringify(lang)),
    )

    const themesInit = await Promise.all(themes
      .map(async theme =>
        typeof theme === 'string'
          ? `import('${await resolveImportUrl(`shiki/themes/${theme}.mjs`)}')`
          : JSON.stringify(theme)))

    const langNames = langs
      .flatMap(lang => typeof lang === 'string' ? lang : lang.name)

    const lines: string[] = []
    lines.push(
      `import { getHighlighterCore } from "${await resolveImportUrl('shiki/core')}"`,
      `export { shikiToMonaco } from "${await resolveImportUrl('@shikijs/monaco')}"`,

      `export const languages = ${JSON.stringify(langNames)}`,
      `export const themes = ${JSON.stringify(themeOptionsNames.themes || themeOptionsNames.theme)}`,

      'export const shiki = getHighlighterCore({',
      `  themes: [${themesInit.join(',')}],`,
      `  langs: [${langsInit.join(',')}],`,
      `  loadWasm: import('${await resolveImportUrl('shiki/wasm')}'),`,
      '})',
    )

    return lines.join('\n')
  },
}
