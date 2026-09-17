import { ReactNode } from 'react'
import { availableLanguages, DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale'
import { jakartaSans } from '@/app/(frontend)/fonts'
import '../styles.css'
import SkipLinks from '@/components/layout/SkipLinks'
import ScrollToTop from '@/components/layout/ScrollToTop'
import BackToTop from '@/components/layout/BackToTop'
import Header from '@/components/layout/header/Header'
import Footer from '@/components/layout/Footer'
import { Metadata, Viewport } from 'next'
import { BASE_URL } from '@/lib/site'
import LocalBusinessSchema from '@/components/layout/LocalBusinessSchema'
import { LocaleSwitcherProvider } from '@/components/layout/locale/LocaleSwitcherContext'
import { ConsentProvider } from '@/components/consent/ConsentProvider'
import { ConsentManager } from '@/components/consent/ConsentManager'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { brand } from '@/brand/config'

interface LangLayoutProps {
    children: ReactNode
    params: Promise<{ lang: string }>
}

// Stündlich neu generieren, sonst werden neue Pages bis zum nächsten Build nicht sichtbar
export const revalidate = 3600

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
    themeColor: brand.themeColor,
    viewportFit: 'cover',
}

export async function generateStaticParams() {
    return availableLanguages.map((lang) => ({ lang }))
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
    const { lang } = await params
    const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE

    return (
        <html lang={locale.language} className={`${jakartaSans.variable}`} data-scroll-behavior="smooth">
            <body className="font-display bg-gray-90 text-gray-90 text-pretty subpixel-antialiased flex flex-col w-full">
                <ConsentProvider>
                    <LocaleSwitcherProvider>
                        <LocalBusinessSchema locale={locale} />
                        <SkipLinks locale={locale} />
                        <ScrollToTop />
                        <BackToTop locale={locale} />
                        <Header locale={locale} />
                        {children}
                        <Footer locale={locale} />
                        <ConsentManager locale={locale} />
                        <GoogleAnalytics />
                    </LocaleSwitcherProvider>
                </ConsentProvider>
            </body>
        </html>
    )
}
