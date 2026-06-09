import { Hero } from '@/payload-types'
import { Locale } from '@/lib/locale'
import React from 'react'

type HeroProps = Hero & {
    locale: Locale
}

export const HeroBlock: React.FC<HeroProps> = ({ locale }) => {
    return (
        <div>
            hero
        </div>
    )
}
