import { t } from 'elysia'
import type { TProperties, TSchema } from '@sinclair/typebox'

/** Meta pagination untuk response list (Swagger/Scalar). */
export const HttpContractMeta = t.Object({
    current_page: t.Numeric(),
    last_page: t.Numeric(),
    per_page: t.Numeric(),
    from: t.Numeric(),
    to: t.Numeric(),
    total: t.Numeric(),
    has_next: t.Boolean(),
    has_prev: t.Boolean(),
})

export const HttpContractParamsId = t.Object({
    id: t.String(),
})

/**
 * Query string umum list: page, per_page, sort, search.
 * Tambahkan field filter modul lewat argumen `extra`.
 */
export function httpContractQueryList(extra: TProperties = {}) {
    return t.Object({
        page: t.Optional(t.Numeric()),
        per_page: t.Optional(t.Numeric()),
        sort_by: t.Optional(t.String()),
        sort_order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
        q: t.Optional(t.String()),
        ...extra,
    })
}

export function httpContractResponseList200<T extends TSchema>(
    entitySchema: T
) {
    return t.Object({
        meta: HttpContractMeta,
        data: t.Array(entitySchema),
    })
}

export function httpContractResponseShow200<T extends TSchema>(
    entitySchema: T
) {
    return t.Object({
        data: entitySchema,
    })
}

export function httpContractResponseCreate201<T extends TSchema>(
    entitySchema: T
) {
    return t.Object({
        data: entitySchema,
        message: t.String(),
    })
}

export function httpContractResponseUpdate200<T extends TSchema>(
    entitySchema: T
) {
    return t.Object({
        data: entitySchema,
        message: t.String(),
    })
}

/** Update tanpa body response entity (hanya pesan status). */
export const HttpContractResponseMessage = t.Object({
    message: t.String(),
})
