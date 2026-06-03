'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Alternates = Record<string, string> // { de: '/de/kontakt', en: '/en/contact' }

interface ContextValue {
    alternates: Alternates
    setAlternates: (a: Alternates) => void
}

const LocaleSwitcherContext = createContext<ContextValue>({
    alternates: {},
    setAlternates: () => {},
})

export function LocaleSwitcherProvider({ children }: { children: ReactNode }) {
    const [alternates, setAlternates] = useState<Alternates>({})
    return (
        <LocaleSwitcherContext.Provider value={{ alternates, setAlternates }}>
            {children}
        </LocaleSwitcherContext.Provider>
    )
}

export function useLocaleSwitcher() {
    return useContext(LocaleSwitcherContext)
}
