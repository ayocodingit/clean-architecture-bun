/**
 * Jalankan satu file cron: <nama>.cron.ts di folder ini.
 *
 * Contoh:
 *   bun run cron:run -- --name=sync-users
 *   bun run cron:run -- sync-users
 *   CRON_NAME=sync-users bun run cron:run
 *   bun src/cron/run.ts --name=sync-users
 */

import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

function getCronDir(): string {
    const scriptPath = process.argv[1]
    if (!scriptPath) {
        throw new Error(
            'process.argv[1] kosong; jalankan: bun src/cron/run.ts atau bun run cron:run'
        )
    }
    return dirname(scriptPath)
}

function parseCronName(): string {
    const fromEnv = process.env.CRON_NAME
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
                '  bun run cron:run -- --name=<nama>\n' +
                '  bun run cron:run -- <nama>\n' +
                '  CRON_NAME=<nama> bun run cron:run\n' +
                '\n' +
                '<nama> = nama file tanpa .cron.ts (huruf, angka, strip, underscore).'
        )
        process.exit(1)
    }
}

function listCronFiles(): string[] {
    try {
        return readdirSync(getCronDir())
            .filter((f) => f.endsWith('.cron.ts'))
            .map((f) => f.replace(/\.cron\.ts$/, ''))
    } catch {
        return []
    }
}

async function main() {
    const name = parseCronName()
    assertSafeName(name)

    const cronDir = getCronDir()
    const cronHref = pathToFileURL(join(cronDir, `${name}.cron.ts`)).href

    try {
        await import(cronHref)
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const isMissing =
            msg.includes('Cannot find module') ||
            msg.includes('ERR_MODULE_NOT_FOUND') ||
            msg.includes('Module not found')

        if (isMissing) {
            const abs = join(cronDir, `${name}.cron.ts`)
            const available = listCronFiles()
            console.error(`Cron tidak ditemukan: ${abs}`)
            if (available.length) {
                console.error(
                    'File cron yang ada di folder ini: ' + available.join(', ')
                )
            } else {
                console.error(
                    'Belum ada file *.cron.ts. Buat dengan bun run make:cron lalu jalankan: bun run cron:run -- --name=<nama>'
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
