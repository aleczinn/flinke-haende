import type { Field } from 'payload'

export const backgroundColorOptions = ['automatic', 'primary', 'white', 'gray'] as const
export type BackgroundColor = (typeof backgroundColorOptions)[number]

const backgroundColorLabels: Record<
    BackgroundColor,
    {
        de: string
        en: string
    }
> = {
    automatic: {
        de: 'Automatisch',
        en: 'Automatic',
    },
    primary: {
        de: 'Primär',
        en: 'Primary',
    },
    white: {
        de: 'Weiß',
        en: 'White',
    },
    gray: {
        de: 'Grau',
        en: 'Gray',
    },
}

export const backgroundColorClasses: Record<BackgroundColor, string> = {
    automatic: '',
    primary: 'bg-primary',
    white: 'bg-white',
    gray: 'bg-gray-10',
}

type BackgroundColorFieldOptions = {
    allowedColors?: readonly BackgroundColor[]
    defaultValue?: BackgroundColor
}

export const backgroundClass = (color: BackgroundColor | null | undefined) => {
    if (color) {
        return backgroundColorClasses[color]
    }
    return ''
}

export const backgroundColorField = ({
    allowedColors = backgroundColorOptions,
    defaultValue = 'automatic',
}: BackgroundColorFieldOptions = {}): Field => ({
    name: 'backgroundColor',
    type: 'select',
    required: true,
    defaultValue,
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
    options: allowedColors.map((color) => ({
        value: color,
        label: backgroundColorLabels[color],
    })),
})
