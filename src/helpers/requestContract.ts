import { t } from 'elysia'

/** Query list (sama dengan `GetRequest` / helpers pagination). */
export const QueryPagination = t.Object({
    page: t.Optional(t.Numeric()),
    per_page: t.Optional(t.Numeric()),
    sort_by: t.Optional(t.String()),
    sort_order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
    q: t.Optional(t.String()),
})

export const ParamsIdUuid = t.Object({
    id: t.String({ format: 'uuid' }),
})

export const ResponseMeta = t.Object({
    current_page: t.Number(),
    last_page: t.Number(),
    per_page: t.Number(),
    from: t.Number(),
    to: t.Number(),
    total: t.Number(),
    has_next: t.Boolean(),
    has_prev: t.Boolean(),
})

export const ResponseList = t.Object({
    data: t.Array(t.Any()),
    meta: ResponseMeta,
})

export const ResponseData = t.Object({
    data: t.Any(),
})

export const ResponseMessage = t.Object({
    message: t.String(),
})

export const ResponseCreatedData = t.Object({
    data: t.Any(),
})

/** Respons error umum (middleware / AppError). */
export const ResponseError = t.Object({
    message: t.Optional(t.Union([t.String(), t.Record(t.String(), t.Any())])),
    errors: t.Optional(t.Record(t.String(), t.Any())),
})
