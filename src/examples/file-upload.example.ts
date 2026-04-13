/**
 * Contoh menyimpan upload file dengan Bun (`Bun.write`).
 * Modul HTTP untuk upload tidak dibundling di app; salin pola ini ke module baru (`make:module`).
 *
 * Lihat juga `src/examples/README.md` (multipart + route Elysia).
 */
import { mkdir } from 'node:fs/promises'
import { CustomPathFile } from '../helpers/file'

const LOCAL_DIR = 'storage'

export type UploadMeta = {
    description?: string
    category?: string
}

export async function saveUploadedFile(file: File, meta?: UploadMeta) {
    if (!file) {
        throw new Error('File is required')
    }

    await mkdir(LOCAL_DIR, { recursive: true })
    const filename = CustomPathFile(LOCAL_DIR, file)
    await Bun.write(filename, file)

    return {
        filename,
        size: file.size,
        type: file.type,
        ...(meta && {
            description: meta.description,
            category: meta.category,
        }),
    }
}
