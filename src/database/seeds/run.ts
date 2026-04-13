/**
 * Jalankan satu file seed: <nama>.seed.ts di folder ini.
 *
 * Contoh:
 *   bun run seed:run -- --name=demo
 *   bun run seed:run -- --name demo
 *   bun run seed:run -- demo
 *   SEED_NAME=demo bun run seed:run
 *   bun src/database/seeds/run.ts --name=demo
 */

import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

/** Folder seeds = folder file run.ts (tanpa import.meta, aman dengan tsconfig commonjs). */
function getSeedsDir(): string {
    const scriptPath = process.argv[1]
    if (!scriptPath) {
        throw new Error(
            'process.argv[1] kosong; jalankan: bun src/database/seeds/run.ts atau bun run seed:run'
        )
    }
    return dirname(scriptPath)
}

function parseSeedName(): string {
    const fromEnv = process.env.SEED_NAME
    if (fromEnv && String(fromEnv).trim()) {
        return String(fromEnv).trim()
    }

    const fromNpm = process.env.npm_config_name
    if (fromNpm && String(fromNpm).trim()) {
        return String(fromNpm).trim()
    }

    const argv = process.argv.slice(2)
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--name') {
            const next = argv[i + 1]
            if (next && !next.startsWith('-')) {
                return next
            }
            continue
        }
        if (a.startsWith('--name=')) {
            const v = a.slice('--name='.length).trim()
            if (v) return v
        }
    }

    const positional = argv.find((x) => !x.startsWith('-'))
    return positional ? positional.trim() : ''
}

function assertSafeName(name: string) {
    if (!name || name.includes('..') || /[/\\]/.test(name)) {
        console.error(
            'Penggunaan:\n' +
                '  bun run seed:run -- --name=<nama>\n' +
                '  bun run seed:run -- <nama>\n' +
                '  SEED_NAME=<nama> bun run seed:run\n' +
                '\n' +
                '<nama> = nama file tanpa .seed.ts (huruf, angka, strip, underscore).'
        )
        process.exit(1)
    }
}

function listSeedFiles(): string[] {
    try {
        return readdirSync(getSeedsDir())
            .filter((f) => f.endsWith('.seed.ts'))
            .map((f) => f.replace(/\.seed\.ts$/, ''))
    } catch {
        return []
    }
}

async function main() {
    const name = parseSeedName()
    assertSafeName(name)

    const seedsDir = getSeedsDir()
    const seedHref = pathToFileURL(join(seedsDir, `${name}.seed.ts`)).href

    try {
        await import(seedHref)
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const isMissing =
            msg.includes('Cannot find module') ||
            msg.includes('ERR_MODULE_NOT_FOUND') ||
            msg.includes('Module not found')

        if (isMissing) {
            const abs = join(seedsDir, `${name}.seed.ts`)
            const available = listSeedFiles()
            console.error(`Seed tidak ditemukan: ${abs}`)
            if (available.length) {
                console.error(
                    'File seed yang ada di folder ini: ' + available.join(', ')
                )
            } else {
                console.error(
                    'Belum ada file *.seed.ts di folder seeds. Buat misalnya category.seed.ts lalu jalankan: bun run seed:run -- --name=category'
                )
            }
            process.exit(1)
        }
        throw e
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
