/**
 * Kontrak input Repository Category — hanya bergantung pada kebutuhan DB/schema.
 * Tidak import dari module mana pun; layer repository independen.
 */

export type CreateCategoryInput = {
    title: string
    description: string
}

export type UpdateCategoryInput = {
    title: string
    description: string
}

/** Custom filter untuk list (dikombinasi dengan RequestParams dari helpers) */
export type CategoryFilter = {
    start_date?: string
    // tambah field filter lain sesuai kebutuhan query
}
