import Section from '@/components/layout/Section'
import { t } from '@/lib/i18n'
import { IconMail, IconTelephone } from '@/components/icons'
import { UILink } from '@/components/ui/UILink'
import { Locale } from '@/lib/locale'
import { getCompanyConfig } from '@/lib/queries'

interface ServiceBarProps {
    locale: Locale
}

export default async function ServiceBar({ locale }: ServiceBarProps) {
    const company = await getCompanyConfig(locale)

    return (
        <Section
            as="nav"
            variant="capped"
            outerClassName="bg-gray-90 text-white"
            innerClassName="flex flex-row justify-center sm:justify-end items-center py-2"
            aria-label={t(locale, 'header.service_bar')}
        >
            <div className="flex flex-row gap-4">
                <UILink
                    href={`tel:${company.telephone}`}
                    icon={<IconTelephone className="w-4 h-auto" />}
                    aria-label={t(locale, 'generic.telephone.long', company.telephone)}
                >
                    {company.telephone}
                </UILink>

                <UILink
                    href={`mailto:${company.email}`}
                    icon={<IconMail className="w-4 h-auto" />}
                    aria-label={t(locale, 'generic.email.long', company.email)}
                >
                    {company.email}
                </UILink>
            </div>
        </Section>
    )
}
