'use client'

import {
  Button,
  FieldLabel,
  TextInput,
  useField,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui'
import { useCallback } from 'react'

type SlugFieldProps = {
  path: string
  field: { label?: string; required?: boolean }
  titleField?: string
}

export const SlugField = ({ path, field, titleField = 'title' }: SlugFieldProps) => {
  const { t } = useTranslation()
  const { value, setValue } = useField<string>({ path })
  const titleValue = useFormFields(([fields]) => fields[titleField]?.value as string)

  const generateSlug = useCallback(() => {
    if (!titleValue) return
    setValue(
      titleValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-'),
    )
  }, [titleValue, setValue])

  return (
    <div className="field-type text">
      <FieldLabel label={field.label ?? 'Slug'} required={field.required} />
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <TextInput path={path} value={value ?? ''} onChange={(e: any) => setValue(e.target.value)} />
        </div>

        <Button onClick={generateSlug} buttonStyle="pill" size="large">
          {t('admin:generateSlug' as any)}
        </Button>
      </div>
    </div>
  )
}
