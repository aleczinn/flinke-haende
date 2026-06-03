import type { Field } from 'payload'

export const backgroundColorOptions = ['automatic', 'primary', 'white', 'gray'] as const

export type BackgroundColor = (typeof backgroundColorOptions)[number]

export const backgroundColorClasses: Record<BackgroundColor, string> = {
    automatic: '',
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-10',
}

export const backgroundClass = (color: BackgroundColor | null | undefined) => {
    if (color) {
        return backgroundColorClasses[color]
    }
    return ''
}

export const backgroundColorField = (): Field[] => [
    {
        name: 'backgroundColor',
        type: 'select',
        required: true,
        defaultValue: 'automatic',
        label: {
            de: 'Hintergrundfarbe',
            en: 'Background color',
        },
        admin: {
            description: {
                de: 'Wähle die Hintergrundfarbe für diese Komponente',
                en: 'Choose the background color for this component',
            },
        },
        options: [
            {
                value: 'automatic',
                label: {
                    de: 'Automatisch',
                    en: 'Automatic',
                },
            },
            {
                value: 'primary',
                label: {
                    de: 'Primär',
                    en: 'Primary',
                },
            },
            {
                value: 'white',
                label: {
                    de: 'Weiß',
                    en: 'White',
                },
            },
            {
                value: 'gray',
                label: {
                    de: 'Grau',
                    en: 'Gray',
                },
            },
        ],
    },
]
