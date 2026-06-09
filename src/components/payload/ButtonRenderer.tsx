import { css } from '@/lib/utils'
import { resolveButtonHref } from '@/lib/queries'
import { Locale } from '@/lib/locale'
import { Page } from '@/payload-types'
import { parseButtonForField } from '@/lib/utilities/button'
import { Button } from '@/components/ui/Button'
import { ButtonGroupItem } from '@/fields/button'

interface ButtonRendererProps {
    locale: Locale
    buttons: ButtonGroupItem[] | null | undefined
    className?: string
}

export function ButtonRenderer({ locale, buttons, className }: ButtonRendererProps) {
    if (!buttons?.length) {
        return null
    }

    return (
        <div className={css('flex', className)}>
            {buttons.map((btn) => {
                const href = resolveButtonHref(btn, locale)
                if (!href) return null

                const label =
                    btn.label?.trim() ||
                    (btn.type !== 'external' && typeof btn.reference === 'object' && btn.reference
                        ? (btn.reference as Page).title
                        : '')

                if (!label) return null

                const { variant, hollow } = parseButtonForField(btn.variant)

                return (
                    <Button
                        key={btn.id ?? href}
                        href={href}
                        variant={variant}
                        hollow={hollow}
                        target={btn.newTab ? '_blank' : undefined}
                    >
                        {label}
                    </Button>
                )
            })}
        </div>
    )
}