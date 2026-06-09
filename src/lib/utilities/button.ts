import { FieldButtonVariant } from '@/fields/button'
import { ButtonVariant } from '@/components/ui/Button'

export function parseButtonForField(v: FieldButtonVariant | null | undefined): {
    variant: ButtonVariant
    hollow: boolean
} {
    const hollow = v?.endsWith('-hollow') ?? false
    const variant = (hollow ? v!.replace('-hollow', '') : (v ?? 'primary')) as 'primary' | 'light' | 'dark'
    return { variant, hollow }
}
