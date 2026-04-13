# Repository Layer

Layer akses data (persistence). **Independen dari module** — hanya bergantung pada **Schema (database)** dan types di folder ini.

## Konvensi

-   **Folder:** `[nama-entity]/` (mis. `category/`)
-   **repository.ts** — class `[Nama]Repository`, CRUD + query ke Sequelize
-   **types.ts** — kontrak input repository: `CreateXxxInput`, `UpdateXxxInput`, `ListXxxParams`. Menggambarkan kebutuhan DB/schema, tidak import dari module mana pun.
-   **contract.ts** — (opsional tapi disarankan) **kontrak nilai tetap / enum alur bisnis** untuk entity itu: object `as const`, type union, dan array nilai untuk `Joi.valid(...)`. Satu sumber kebenaran dengan string yang disimpan di kolom DB.

Helper tipe: `ValuesOf` dari [`src/helpers/valuesOf.ts`](../../helpers/valuesOf.ts).

## Contoh struktur

```
repository/
├── README.md
└── category/
    ├── contract.ts     # mis. CategoryLifecycle + CategoryLifecycleValues (sesuaikan DB)
    ├── types.ts        # CreateCategoryInput, UpdateCategoryInput, ListCategoryParams
    └── repository.ts   # CategoryRepository, hanya import Schema + ./types (+ ./contract jika perlu)
```

## Contract / enum bisnis (di folder repository)

**Kenapa di sini, bukan folder global?** Supaya jelas **pemilik domain**: status milik entity `post` tinggal di `repository/post/contract.ts`. Module HTTP tetap boleh import dari path itu (repository layer = kontrak persistence + nilai yang valid di DB).

Pola di `contract.ts`:

```typescript
import type { ValuesOf } from '../../../helpers/valuesOf'

export const CategoryLifecycle = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
} as const

export type CategoryLifecycleValue = ValuesOf<typeof CategoryLifecycle>

export const CategoryLifecycleValues: CategoryLifecycleValue[] =
    Object.values(CategoryLifecycle)
```

-   **Joi** (di `modules/.../entity/schema.ts`): `Joi.string().valid(...CategoryLifecycleValues)`.
-   **Usecase:** bandingkan dengan `CategoryLifecycle.DRAFT`, bukan magic string.
-   **types.ts:** field filter/status bisa bertipe `CategoryLifecycleValue`.

Generator **`make:model`** menambahkan `contract.ts` starter; sesuaikan nama object / nilai dengan migrasi.

## Alur

1. Repository mendefinisikan sendiri types-nya (sesuai kebutuhan tabel/schema).
2. Repository hanya bergantung: `Schema` (sequelize), `Logger`, dan `./types` (plus `./contract` jika dipakai di query).
3. Usecase (di module) memanggil repository dengan data yang shape-nya cocok (mis. RequestBody dari entity punya `title`, `description` → sama dengan `CreateCategoryInput`). Tidak ada dependency repository → module.
