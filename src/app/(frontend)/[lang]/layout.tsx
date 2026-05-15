import { ReactNode } from 'react'
import { availableLanguages, DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale'
import '../styles.css'

interface LangLayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return availableLanguages.map((lang) => ({ lang }))
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE

  return (
    <html lang={locale.language} className="" data-scroll-behavior="smooth">
      <body className="font-display bg-gray-90 text-gray-90 text-pretty subpixel-antialiased flex flex-col w-full">
        {children}
      </body>
    </html>
  )
}
