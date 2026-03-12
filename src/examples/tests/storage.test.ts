import { expect, test, describe, beforeAll } from 'bun:test'
import config from '../../config/config'
import Sequelize from '../../database/sequelize/sequelize'
import Storage from '../../modules/storage/storage'
import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'

describe('Storage Upload Integration Test', () => {
    let http: Http
    const logger = new Logger(config)

    beforeAll(async () => {
        const connection = await Sequelize.Connect(config, logger)
        http = new Http(logger, config, connection)
        new Storage(logger, config).RunHttp(http)
    })

    test('POST /v1/storage - should upload a file', async () => {
        const formData = new FormData()
        const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
        formData.append('file', file)

        const res = await http.app.request('/v1/storage', {
            method: 'POST',
            body: formData
        })

        const body = await res.json()
        expect(res.status).toBe(201)
        expect(body.message).toBe('UPLOADED')
        expect(body.data).toHaveProperty('filename')
        expect(body.data.filename).toContain('hello.txt')
    })
})
