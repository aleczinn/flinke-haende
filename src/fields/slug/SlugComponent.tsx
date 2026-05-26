'use client'

import React, { useCallback } from 'react'
import { Button, FieldLabel, TextInput, useField, useFormFields, useTranslation } from '@payloadcms/ui'
import { formatSlug } from './formatSlug'

type LocalizedString = string | Record<string, string>

type SlugComponentProps = {
    fieldToUse: string
    description?: LocalizedString
    path: string
    readOnly?: boolean
}

const resolveLocalized = (input: LocalizedString | undefined, lang: string): string => {
    if (!input) return ''
    if (typeof input === 'string') return input
    return input[lang] ?? input['de'] ?? input['en'] ?? Object.values(input)[0] ?? ''
}

export const SlugComponent: React.FC<SlugComponentProps> = ({ fieldToUse, description, path, readOnly }) => {
    const { value, setValue } = useField<string>({ path: path || 'slug' })
    const { i18n } = useTranslation()
    const targetFieldValue = useFormFields(([fields]) => fields[fieldToUse]?.value as string)

    const handleGenerate = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            if (targetFieldValue) setValue(formatSlug(targetFieldValue))
        },
        [targetFieldValue, setValue],
    )

    const resolvedDescription = resolveLocalized(description, i18n.language.split('-')[0])

    return (
        <div className="field-type f-slug">
            <div className="f-slug__wrapper">
                <FieldLabel htmlFor={`field-${path}`} label="Slug" />
                <Button
                    buttonStyle="none"
                    className="f-slug__btn"
                    onClick={handleGenerate}
                    disabled={!targetFieldValue}
                >
                    Generieren
                </Button>
            </div>

            <TextInput
                value={value ?? ''}
                onChange={(e: any) => setValue(e.target.value)}
                path={path || 'slug'}
                readOnly={Boolean(readOnly)}
            />

            {resolvedDescription && <div className="f-slug__description">{resolvedDescription}</div>}
        </div>
    )
}
