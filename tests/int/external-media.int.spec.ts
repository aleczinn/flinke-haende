import { describe, expect, it } from 'vitest'
import { getVimeoId, getYouTubeId } from '@/components/module/ExternalMedia'

describe('external media URL parsing', () => {
    it.each([
        ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
        ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
        ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ])('extracts YouTube IDs from %s', (url, expected) => {
        expect(getYouTubeId(url)).toBe(expected)
    })

    it('rejects malformed YouTube URLs', () => {
        expect(getYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    })

    it('extracts Vimeo IDs', () => {
        expect(getVimeoId('https://vimeo.com/123456789')).toBe('123456789')
    })
})
