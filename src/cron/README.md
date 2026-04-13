## Folder cron job (`*.cron.ts`)

### Langkah singkat

1. Buat file dengan pola `nama.cron.ts` (atau pakai generator):

    ```bash
    bun run make:cron
    ```

2. Isi logic di dalam file (template Plop memakai async + `export default Run()`).

3. Jalankan cron yang dipilih:

    ```bash
    bun run cron:run -- --name=post
    ```

    Atau tanpa `--` di depan argumen:

    ```bash
    CRON_NAME=post bun run cron:run
    ```

    Atau posisional:

    ```bash
    bun run cron:run -- post
    ```

**Catatan:** Setelah `bun run cron:run` sebaiknya ada `--` sebelum `--name=...` supaya argumen sampai ke script (sama seperti `seed:run`).

### Contoh isi file

```typescript
const Run = async () => {
    // logic cron job
}

export default Run()
```

Untuk production, biasanya kamu build app dulu lalu jadwalkan perintah di server (systemd timer, Kubernetes CronJob, dll.) yang menjalankan `bun run cron:run` dengan env atau argumen di atas.
