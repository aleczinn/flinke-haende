'use client'

import React, { useId, useMemo, useState } from 'react'
import { Locale } from '@/lib/locale'
import { Accordion } from '@/payload-types'
import { css } from '@/lib/utils'
import { backgroundClass } from '@/fields/background-color'
import Section from '@/components/layout/Section'
import { Tagline } from '@/components/ui/Tagline'
import { Headline } from '@/components/ui/Headline'
import { IconPlus } from '@/components/icons'
import RichTextRenderer from '@/components/payload/RichTextRenderer'

type AccordionProps = Accordion & {
    locale: Locale
}

export const AccordionBlock: React.FC<AccordionProps> = ({
    layout,
    tagline,
    headline,
    allowMultipleOpen,
    items,
    backgroundColor,
}) => {
    const headingId = useId()

    const initialOpenItems = useMemo(
        () => new Set(items.filter((item) => item.defaultOpen && item.id).map((item) => item.id!)),
        [items],
    )

    const [openItems, setOpenItems] = useState<Set<string>>(initialOpenItems)

    function toggle(uid: string) {
        setOpenItems((prev) => {
            const next = new Set(allowMultipleOpen ? prev : [])

            if (prev.has(uid)) {
                next.delete(uid)
            } else {
                next.add(uid)
            }

            return next
        })
    }

    return (
        <Section
            variant="capped"
            outerClassName={css('py-section', backgroundClass(backgroundColor))}
            innerClassName=""
            aria-labelledby={headline ? headingId : undefined}
        >
            {tagline && <Tagline alignment={layout} children={tagline} className="mb-2" />}

            {headline && (
                <Headline id={headingId} as="h2" variant="h3" alignment={layout} design="line" className="mb-4">
                    {headline}
                </Headline>
            )}

            <div className="flex flex-col">
                {items?.map((item) => {
                    if (!item.id) return null

                    const uid = item.id
                    const isOpen = openItems.has(uid)

                    const buttonId = `acc-btn-${uid}`
                    const panelId = `acc-panel-${uid}`

                    let buttonClasses = ''

                    switch (backgroundColor) {
                        case 'white':
                            buttonClasses = 'border-b-1 border-solid border-gray-20'
                            break
                        case 'gray':
                            buttonClasses = 'border-b-1 border-solid border-gray-30'
                            break
                        default:
                            buttonClasses = ''
                            break
                    }

                    return (
                        <div key={uid}>
                            <h3>
                                <button
                                    type="button"
                                    id={buttonId}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => toggle(uid)}
                                    className={css(
                                        'w-full flex justify-between items-center py-4 text-left font-bold transition-colors duration-300 hover:text-primary hover:cursor-pointer',
                                        buttonClasses
                                    )}
                                >
                                    <span>{item.title}</span>
                                    <IconPlus
                                        className={css('transition-transform duration-300', isOpen && 'rotate-45')}
                                    />
                                </button>
                            </h3>

                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={buttonId}
                                className={css(
                                    'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                                )}
                            >
                                <div className="overflow-hidden">
                                    <div className="pt-6 pb-16">
                                        {item.text && <RichTextRenderer data={item.text} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Section>
    )
}
