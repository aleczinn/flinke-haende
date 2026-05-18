import { SITE_SHORTCUT } from '@/lib/site'
import type { Config } from '@/payload-types'

export interface Locale {
  /** ISO 639-1 Sprachcode, gleichzeitig URL-Segment ('de', 'en') */
  language: string
  /** ISO 3166-1 Ländercode ('DE', 'AT', 'US') */
  country: string
  /** Anzeigename im LocaleSwitcher */
  label: string
}

export type Localized<T> = Partial<Record<PayloadLocale, T>>

export const locales: Locale[] = [
  { language: 'de', country: 'DE', label: 'Deutsch' },
  { language: 'en', country: 'US', label: 'English' },
]

/** Alle verfügbaren URL-Segmente (dedupliziert) */
export const availableLanguages = [...new Set(locales.map((l) => l.language))]

export const DEFAULT_LOCALE = locales[0]
export const COOKIE_LOCALE = `${SITE_SHORTCUT}_LANG`

/** Payload-Locale-Codes ohne den Sonderwert 'all' */
export type PayloadLocale = Exclude<Config['locale'], 'all'>

/** 'de-DE', 'en-US' — wird als Payload-Locale-Code verwendet */
export function toLocaleTag(locale: Locale): PayloadLocale {
  return `${locale.language.toLowerCase()}-${locale.country.toUpperCase()}` as PayloadLocale
}

/** 'de_DE' — für OpenGraph */
export function getOgLocale(locale: Locale): string {
  return `${locale.language.toLowerCase()}_${locale.country.toUpperCase()}`
}

export function getAlternateOgLocales(locale: Locale): string[] {
  return locales.filter((l) => l !== locale).map(getOgLocale)
}

export function isValidLanguage(value: unknown): value is string {
  return typeof value === 'string' && availableLanguages.includes(value)
}

export function getDefaultForLanguage(language: string): Locale | undefined {
  return locales.find((l) => l.language === language)
}

export function findByTag(tag: string): Locale | undefined {
  return locales.find((l) => toLocaleTag(l) === tag)
}

export function getLocaleFromLang(language: string): Locale | undefined {
  return getDefaultForLanguage(language)
}

export function resolveLocale(
  language: string,
  acceptLanguage?: string,
): Locale | undefined {
  const group = locales.filter((l) => l.language === language)
  if (group.length === 0) return undefined
  if (group.length === 1) return group[0]

  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((part) => {
        const [lang, q] = part.trim().split(';q=')
        return { lang: lang.trim().replace('_', '-'), q: q ? parseFloat(q) : 1 }
      })
      .sort((a, b) => b.q - a.q)

    for (const { lang } of preferred) {
      const match = group.find(
        (l) => toLocaleTag(l).toLowerCase() === lang.toLowerCase(),
      )
      if (match) return match
    }
  }
  return group[0]
}