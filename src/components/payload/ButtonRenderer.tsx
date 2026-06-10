import { css } from '@/lib/utils'
import { Locale } from '@/lib/locale'
import { Page } from '@/payload-types'
import { Button, ButtonStyle } from '@/components/ui/Button'
import { ButtonItem } from '@/fields/button'
import { resolveButtonHref } from '@/lib/utilities/button'

interface ButtonRendererProps {
    locale: Locale
    buttons: ButtonItem[] | null | undefined
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

                return (
                    <Button
                        key={btn.id ?? href}
                        href={href}
                        variant={btn.variant ?? 'primary'}
                        target={btn.newTab ? '_blank' : undefined}
                    >
                        {label}
                    </Button>
                )
            })}
        </div>
    )
}