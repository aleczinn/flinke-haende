'use client'

import type { ReactNode } from 'react'
import type { OptionalConsentCategory } from '@/lib/consent/types'
import { useConsent } from './ConsentProvider'

export function ConsentGate({
    category,
    children,
    fallback,
}: {
    category: OptionalConsentCategory
    children: ReactNode
    fallback: (allow: () => void) => ReactNode
}) {
    const consent = useConsent()
    return consent.allows(category) ? children : fallback(() => consent.allowCategory(category))
}
