import { expect, test, describe, beforeAll } from 'bun:test'
import config from '../../config/config'
import Sequelize from '../../database/sequelize/sequelize'
import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'

describe('Global Error Handling Test', () => {
    let http: Http
    const logger = new Logger(config)

    beforeAll(async () => {
        const connection = await Sequelize.Connect(config, logger)
        http = new Http(logger, config, connection)
        
        // Add a route that intentionally throws for testing 500
        http.app.get('/test-500', (c) => {
            throw new Error('Intentional Test Error')
        })
    })

    test('GET /non-existent-route - should return 404', async () => {
        const res = await http.app.request('/non-existent-route')
        const body = await res.json()
        
        expect(res.status).toBe(404)
        expect(body.message).toBe('Not Found')
    })

    test('GET /test-500 - should return 500', async () => {
        const res = await http.app.request('/test-500')
        const body = await res.json()
        
        expect(res.status).toBe(500)
        expect(body.message).toBe('Intentional Test Error')
    })
})
