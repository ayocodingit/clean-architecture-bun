# Repository Layer

Layer akses data (persistence). **Independen dari module** — hanya bergantung pada **Schema (database)** dan types di folder ini.

## Konvensi

- **Folder:** `[nama-entity]/` (mis. `category/`)
- **repository.ts** — class `[Nama]Repository`, CRUD + query ke Sequelize
- **types.ts** — kontrak input repository: `CreateXxxInput`, `UpdateXxxInput`, `ListXxxParams`. Menggambarkan kebutuhan DB/schema, tidak import dari module mana pun.

## Contoh struktur

```
repository/
├── README.md
└── category/
    ├── types.ts        # CreateCategoryInput, UpdateCategoryInput, ListCategoryParams
    └── repository.ts   # CategoryRepository, hanya import Schema + ./types
```

## Alur

1. Repository mendefinisikan sendiri types-nya (sesuai kebutuhan tabel/schema).
2. Repository hanya bergantung: `Schema` (sequelize), `Logger`, dan `./types`.
3. Usecase (di module) memanggil repository dengan data yang shape-nya cocok (mis. RequestBody dari entity punya `title`, `description` → sama dengan `CreateCategoryInput`). Tidak ada dependency repository → module.
