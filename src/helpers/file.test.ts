import { expect, it, describe } from 'bun:test'
import path from 'path'
import { CustomPathFile, GetFiletype } from './file'

describe('CustomPathFile function', () => {
    it('should include a timestamp and the correct filename', () => {
        const path = 'storage'
        const file = new File([''], 'file1.jpg')

        const result = CustomPathFile(path, file)

        expect(result).toContain(path)
        expect(result).toContain('file1.jpg')
        // Check if it has a timestamp-like prefix (digits followed by dash)
        const parts = result.split('/')
        const filename = parts[parts.length - 1]
        expect(filename).toMatch(/^\d+-file1\.jpg$/)
    })
})

describe('GetFiletype function', () => {
    it('should return the correct filetype for images', () => {
        const imageFiles = ['image1.jpg', 'image2.png', 'image3.svg']

        imageFiles.forEach((filename) => {
            const result = GetFiletype(filename)
            expect(result).toBe('image')
        })
    })

    it('should return the correct filetype for documents', () => {
        const documentFiles = [
            'document1.doc',
            'document2.docx',
            'document3.pdf',
        ]

        documentFiles.forEach((filename) => {
            const result = GetFiletype(filename)
            expect(result).toBe('document')
        })
    })

    it('should return the correct filetype for videos', () => {
        const videoFiles = ['video1.mp4', 'video2.mkv']

        videoFiles.forEach((filename) => {
            const result = GetFiletype(filename)
            expect(result).toBe('video')
        })
    })

    it('should return the file extension if not an image, document, or video', () => {
        const otherFiles = ['file1.txt', 'file2.zip']

        otherFiles.forEach((filename) => {
            const result = GetFiletype(filename)
            expect(result).toBe(path.extname(filename).replace('.', ''))
        })
    })
})
