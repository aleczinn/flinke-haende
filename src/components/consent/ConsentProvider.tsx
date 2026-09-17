'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SITE_SHORTCUT } from '@/lib/site'
import type { ConsentChoices, OptionalConsentCategory, StoredConsent } from '@/lib/consent/types'
import { statisticsEnabled } from '@/lib/consent/services'

const CONSENT_VERSION = 1
const COOKIE_NAME = `${SITE_SHORTCUT}_CONSENT`
const EMPTY_CHOICES: ConsentChoices = { externalMedia: false, statistics: false }

interface ConsentContextValue {
    choices: ConsentChoices
    hasDecision: boolean
    ready: boolean
    settingsOpen: boolean
    allows: (category: OptionalConsentCategory) => boolean
    acceptAll: () => void
    rejectOptional: () => void
    allowCategory: (category: OptionalConsentCategory) => void
    saveChoices: (choices: ConsentChoices) => void
    openSettings: () => void
    closeSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

function readCookie(): StoredConsent | null {
    const raw = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
        ?.slice(COOKIE_NAME.length + 1)

    if (!raw) return null

    try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>
        if (parsed.version !== CONSENT_VERSION) return null
        if (typeof parsed.externalMedia !== 'boolean' || typeof parsed.statistics !== 'boolean') return null
        return parsed as StoredConsent
    } catch {
        return null
    }
}

function writeCookie(choices: ConsentChoices) {
    const value: StoredConsent = { ...choices, version: CONSENT_VERSION, decidedAt: new Date().toISOString() }
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`
}

function clearGoogleAnalyticsCookies() {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0]?.trim()
        if (name === '_ga' || name?.startsWith('_ga_')) {
            document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
        }
    })
}

export function ConsentProvider({ children }: { children: ReactNode }) {
    const [choices, setChoices] = useState<ConsentChoices>(EMPTY_CHOICES)
    const [hasDecision, setHasDecision] = useState(false)
    const [ready, setReady] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

    useEffect(() => {
        const stored = readCookie()
        queueMicrotask(() => {
            if (stored) {
                setChoices({ externalMedia: stored.externalMedia, statistics: stored.statistics })
                setHasDecision(true)
            }
            setReady(true)
        })
    }, [])

    const saveChoices = useCallback((next: ConsentChoices) => {
        setChoices(next)
        setHasDecision(true)
        setSettingsOpen(false)
        writeCookie(next)
        if (!next.statistics) clearGoogleAnalyticsCookies()
    }, [])

    const value = useMemo<ConsentContextValue>(
        () => ({
            choices,
            hasDecision,
            ready,
            settingsOpen,
            allows: (category) => choices[category],
            acceptAll: () => saveChoices({ externalMedia: true, statistics: statisticsEnabled }),
            rejectOptional: () => saveChoices(EMPTY_CHOICES),
            allowCategory: (category) => saveChoices({ ...choices, [category]: true }),
            saveChoices,
            openSettings: () => setSettingsOpen(true),
            closeSettings: () => setSettingsOpen(false),
        }),
        [choices, hasDecision, ready, saveChoices, settingsOpen],
    )

    return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent(): ConsentContextValue {
    const context = useContext(ConsentContext)
    if (!context) throw new Error('useConsent must be used inside ConsentProvider')
    return context
}
