import { expect, test, describe, beforeAll } from 'bun:test'
import config from '../../config/config'
import Sequelize from '../../database/sequelize/sequelize'
import Category from '../../modules/category/category'
import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Jwt from '../../pkg/jwt'

describe('Category Pagination and Validation Test', () => {
    let http: Http
    let token: string
    const logger = new Logger(config)

    beforeAll(async () => {
        const connection = await Sequelize.Connect(config, logger)
        http = new Http(logger, config, connection)
        new Category(logger, config, connection).RunHttp(http)
        
        const jwt = new Jwt(config.jwt.access_key)
        token = jwt.Sign({ id: 1, name: 'Test User' })
    })

    describe('Validation - POST /v1/categories', () => {
        test('should return 422 if body is empty', async () => {
            const res = await http.app.request('/v1/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            })

            const body = await res.json()
            expect(res.status).toBe(422)
            expect(body).toHaveProperty('errors')
            expect(body.errors).toHaveProperty('title')
            expect(body.errors).toHaveProperty('description')
        })

        test('should return 422 if title is missing', async () => {
            const res = await http.app.request('/v1/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: 'Test Description'
                })
            })

            const body = await res.json()
            expect(res.status).toBe(422)
            expect(body.errors).toHaveProperty('title')
        })
    })

    describe('Pagination - GET /v1/public/categories', () => {
        beforeAll(async () => {
            // Seed some data for pagination test if needed
            // For now we assume some data exists from previous tests or we just check the structure
            for (let i = 1; i <= 5; i++) {
                await http.app.request('/v1/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: `Pagination Category ${i}`,
                        description: `Description ${i}`
                    })
                })
            }
        })

        test('should return paginated results with meta', async () => {
            const res = await http.app.request('/v1/public/categories?per_page=2&page=1')
            const body = await res.json()
            
            expect(res.status).toBe(200)
            expect(body).toHaveProperty('data')
            expect(body).toHaveProperty('meta')
            expect(body.data.length).toBeLessThanOrEqual(2)
            expect(body.meta.per_page).toBe(2)
            expect(body.meta.current_page).toBe(1)
        })

        test('should return second page results', async () => {
            const res = await http.app.request('/v1/public/categories?per_page=2&page=2')
            const body = await res.json()
            
            expect(res.status).toBe(200)
            expect(body.meta.current_page).toBe(2)
            expect(body.meta.per_page).toBe(2)
        })
    })
})
