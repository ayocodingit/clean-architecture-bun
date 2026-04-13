/**
 * Status / nilai tetap bisnis untuk entity **category**.
 * Tabel `categories` saat ini belum punya kolom status — hapus atau sesuaikan setelah migrasi.
 */
import type { ValuesOf } from '../../../helpers/valuesOf'

export const CategoryLifecycle = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
} as const

export type CategoryLifecycleValue = ValuesOf<typeof CategoryLifecycle>

export const CategoryLifecycleValues: CategoryLifecycleValue[] =
    Object.values(CategoryLifecycle)
