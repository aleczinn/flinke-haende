'use client'

import { useEffect } from 'react'
import { useLocaleSwitcher } from '@/components/layout/locale/LocaleSwitcherContext'

export function LocaleSwitcherUpdater({ alternates }: { alternates: Record<string, string> }) {
    const { setAlternates } = useLocaleSwitcher()

    useEffect(() => {
        setAlternates(alternates)
    }, [alternates, setAlternates])

    return null
}
