import Section from '@/components/layout/Section'
import Link from 'next/link'
import { t } from '@/lib/i18n'
import { IconFullLogo } from '@/components/icons'
import { Locale } from '@/lib/locale'
import { getHeaderConfig } from '@/lib/queries'
import ServiceBar from '@/components/layout/header/ServiceBar'
import DesktopNavigation from '@/components/layout/header/DesktopNavigation'
import { Button } from '@/components/ui/Button'
import MobileNavigation from '@/components/layout/header/MobileNavigation'

interface HeaderProps {
    locale: Locale
}

export default async function Header({ locale }: HeaderProps) {
    const header = await getHeaderConfig(locale)

    const contactHref = '';

    return (
        <header className="sticky top-0 bg-gray-90 shadow-xl shadow-gray-90/5 z-50 shrink-0">
            <ServiceBar locale={locale}/>

            <Section
                as="div"
                variant="capped"
                outerClassName="py-4 bg-white"
                innerClassName="flex flex-row justify-between items-center"
            >
                <Link
                    href={`/${locale.language}`}
                    className="hover:cursor-pointer focus-element"
                    title={t(locale, 'home')}
                    aria-label={t(locale, 'home')}
                >
                    <IconFullLogo className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto" />
                </Link>

                {/* Skip-Target. tabIndex=-1 erlaubt programmatischen Fokus
                    durch Skiplink, ohne die Tab-Reihenfolge zu beeinflussen */}
                <a id="navigation" tabIndex={-1} className="sr-only">
                    {t(locale, 'header.navigation')}
                </a>

                <DesktopNavigation locale={locale} items={header.navigation} />

                <div className="flex flex-row gap-4 items-center">
                    <Button variant="primary" href={contactHref} className="hidden lg:flex">
                        {t(locale, 'footer.contact.label')}
                    </Button>

                    {/*<LocaleSwitcher locale={locale} alternates={{ byTranslated, pathsByReal }} />*/}

                    <MobileNavigation locale={locale} items={header.navigation} />
                </div>
            </Section>
        </header>
    )
}
