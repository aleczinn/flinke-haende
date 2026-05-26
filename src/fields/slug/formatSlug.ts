import type { FieldHook } from 'payload'

export const formatSlug = (input: string): string => {
    if (!input) return ''

    // Deutsche Umlaute zuerst — sonst würde NFD sie zu nacktem a/o/u zerlegen
    const germanized = input
        .replace(/ä/g, 'ae')
        .replace(/Ä/g, 'Ae')
        .replace(/ö/g, 'oe')
        .replace(/Ö/g, 'Oe')
        .replace(/ü/g, 'ue')
        .replace(/Ü/g, 'Ue')
        .replace(/ß/g, 'ss')

    // Restliche Diakritika abstreifen: é → e, ñ → n, etc.
    const ascii = germanized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return ascii
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // nur a-z, 0-9, Space, Bindestrich
        .replace(/\s+/g, '-') // Space → -
        .replace(/-+/g, '-') // mehrfach- zusammenfassen
        .replace(/^-+|-+$/g, '') // führende/abschließende - weg
}

/**
 * beforeValidate-Hook:
 * - Eingegebener Slug wird in jedem Fall normalisiert.
 * - Leerer Slug bei Create → aus dem Fallback-Feld (z.B. title) erzeugen.
 */
export const formatSlugHook =
    (fallback: string): FieldHook =>
    ({ data, operation, value }) => {
        if (typeof value === 'string' && value.length > 0) {
            return formatSlug(value)
        }

        if (operation === 'create' || !value) {
            const fallbackValue = data?.[fallback]
            if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
                return formatSlug(fallbackValue)
            }
        }

        return value
    }
