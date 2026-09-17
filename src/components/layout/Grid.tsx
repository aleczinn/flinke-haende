import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { css } from '@/lib/utils'

export type GridItemVariant = 'full' | 'wide' | 'small'

type GridProps<T extends ElementType> = {
    as?: T
} & ComponentPropsWithoutRef<T>

type GridItemProps<T extends ElementType> = {
    as?: T
    variant?: GridItemVariant
} & ComponentPropsWithoutRef<T>

const itemVariantClasses: Record<GridItemVariant, string> = {
    full: 'col-span-12',
    wide: 'col-span-12 lg:col-span-10 lg:col-start-2',
    small: 'col-span-12 lg:col-span-8 lg:col-start-3',
}

export function Grid<T extends ElementType = 'div'>({ as, className, ...props }: GridProps<T>) {
    const Component: ElementType = as ?? 'div'

    return <Component className={css('grid w-full grid-cols-12 gap-4', className)} {...props} />
}

export function GridItem<T extends ElementType = 'div'>({
    as,
    variant = 'full',
    className,
    ...props
}: GridItemProps<T>) {
    const Component: ElementType = as ?? 'div'

    return <Component className={css(itemVariantClasses[variant], className)} {...props} />
}
