import { ArrayField, Field } from 'payload'
import deepMerge from '@/lib/utilities/deepMerge'
import { buttonCoreFields } from '@/fields/button'

type ButtonGroupType = (options?: { overrides?: Partial<ArrayField> }) => Field

export const buttonGroupField: ButtonGroupType = ({ overrides = {} } = {}) => {
    const field: Field = {
        name: 'buttons',
        type: 'array',
        labels: {
            singular: {
                de: 'Button',
                en: 'Button',
            },
            plural: {
                de: 'Buttons',
                en: 'Buttons',
            },
        },
        admin: {
            initCollapsed: true,
            description: {
                de: 'Es sollte wenn möglich nur ein Primär Button pro Komponente genutzt werden.',
                en: 'If possible, only one primary button should be used per component.',
            },
        },
        fields: buttonCoreFields()
    }
    return deepMerge(field, overrides)
}
