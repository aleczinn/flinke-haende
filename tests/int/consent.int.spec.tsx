import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ConsentProvider } from '@/components/consent/ConsentProvider'
import { ExternalMedia } from '@/components/module/ExternalMedia'

const locale = { language: 'de', country: 'DE', label: 'Deutsch' }

describe('external media consent', () => {
    afterEach(() => {
        cleanup()
        document.cookie.split(';').forEach((entry) => {
            const name = entry.split('=')[0]?.trim()
            if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
        })
    })

    it('does not render third-party resources before an explicit click', () => {
        const view = render(
            <ConsentProvider>
                <ExternalMedia locale={locale} url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            </ConsentProvider>,
        )

        expect(view.container.querySelector('iframe')).toBeNull()
        expect(view.container.querySelector('img')).toBeNull()
        expect(view.container.innerHTML).not.toContain('i.ytimg.com')

        fireEvent.click(screen.getByRole('button', { name: /erlauben und video abspielen/i }))

        const iframe = view.container.querySelector('iframe')
        expect(iframe?.getAttribute('src')).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
    })
})
