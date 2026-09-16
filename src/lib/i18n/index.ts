import {
	DEFAULT_LOCALE,
	locales,
	getDefaultForLanguage,
	toLocaleTag,
	Locale,
} from '@/lib/locale';
import deDE from './translations/de-DE.json';
import enUS from './translations/en-US.json';

/**
 * Verfügbare Übersetzungsdateien den Payload-Locale-Tags zuordnen.
 * Für neue Locales muss hier die entsprechende JSON-Datei ergänzt werden.
 *
 * Dateinamen entsprechen dem Locale-Tag: de-DE.json, de-AT.json, en-US.json
 */
const translations: Record<string, Record<string, unknown>> = {
	'de-DE': deDE,
	'en-US': enUS,
};

const translationMap = new Map(
	locales.flatMap((locale) => {
		const tag = toLocaleTag(locale);
		const translation = translations[tag];
		return translation ? [[tag, translation] as const] : [];
	}),
);

function resolve(obj: Record<string, unknown>, key: string): string | undefined {
	let current: unknown = obj;
	for (const part of key.split('.')) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'string' ? current : undefined;
}

/**
 * Übersetzt einen Key für die gegebene Locale.
 *
 * Fallback-Kette:
 *   1. Exakte Locale (z.B. de-AT.json)
 *   2. Sprach-Default (z.B. de-DE.json als Fallback für alle /de/-Varianten)
 *   3. App-Default (erster Eintrag in locales, normalerweise de-DE)
 *   4. Key selbst (macht fehlende Übersetzungen sofort sichtbar)
 */
export function t(locale: Locale, key: string, ...args: (string | number)[]): string {
	const tag = toLocaleTag(locale);
	let result: string | undefined;

	// Exakte Locale
	const exact = translationMap.get(tag);
	if (exact) result = resolve(exact, key);

	// Sprach-Default (de-AT -> de-DE)
	if (!result) {
		const langDefault = getDefaultForLanguage(locale.language);
		if (langDefault && langDefault !== locale) {
			const fallback = translationMap.get(toLocaleTag(langDefault));
			if (fallback) result = resolve(fallback, key);
		}
	}

	// App-Default
	if (!result) {
		const langDefault = getDefaultForLanguage(locale.language);
		if (DEFAULT_LOCALE !== locale && DEFAULT_LOCALE !== langDefault) {
			const appDefault = translationMap.get(toLocaleTag(DEFAULT_LOCALE));
			if (appDefault) result = resolve(appDefault, key);
		}
	}

	// Platzhalter ersetzen, Fallback auf Key
	return (result ?? key).replace(/\{(\d+)}/g, (_, i) => String(args[Number(i)] ?? ''));
}
