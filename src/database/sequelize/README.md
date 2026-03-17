# Sequelize — Define models & relations

Folder ini mengurus **koneksi DB**, **definisi model**, dan **relasi antar tabel**.

---

## Struktur

```
sequelize/
├── README.md           # file ini
├── interface.ts        # type Schema & Connection; daftar model (untuk type-safe)
├── sequelize.ts        # Connect(), Models(), Disconnect(); load model + panggil setupRelations
├── relations.ts        # Relasi antar model (hasMany, belongsTo, dll)
├── models/             # Satu file = satu tabel
│   └── category.ts
└── migrations/        # Migrasi SQL (up/down)
```

---

## Menambah model baru

1. **Buat file model** di `models/<nama>.ts`  
   - Pakai `connection.define('nama_tabel', { ...attributes }, { timestamps, ... })`.  
   - Export function yang terima `Connection` dan return hasil `define`.

2. **Daftarkan di `sequelize.ts`**  
   - Import model, panggil `NamaModel(connection)`, masukkan ke object `schema` yang dikirim ke `setupRelations(schema)` dan di-return.

3. **Daftarkan di `interface.ts`**  
   - Tambah property di type `Schema`, mis. `nama: Model`, supaya repository dan TypeScript mengenal `schema.nama`.

4. **(Opsional) Buat migrasi**  
   - `bun run make:migration` atau `make:model`, lalu isi/cek file di `migrations/`.

---

## Mendefinisikan relasi tabel

Semua relasi (hasMany, belongsTo, hasOne, belongsToMany) **hanya** didefinisikan di **`relations.ts`**, dalam fungsi `setupRelations(schema)`.

Contoh:

```ts
export function setupRelations(schema: Schema): void {
    schema.category.hasMany(schema.post, { foreignKey: 'category_id' })
    schema.post.belongsTo(schema.category, { foreignKey: 'category_id' })
}
```

Setelah model di-load di `Models()`, object `schema` (berisi semua model) dikirim ke `setupRelations(schema)`, lalu schema yang sudah berelasi di-return. Dengan begitu:

- **Define model** = di `models/*.ts` (struktur tabel).
- **Define relation** = di `relations.ts` (hubungan antar tabel).

Eager loading (include) bisa dipakai di repository setelah relasi diset di sini.
