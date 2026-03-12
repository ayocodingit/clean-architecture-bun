import { expect, test, describe, beforeAll, afterAll } from 'bun:test'
import config from '../../config/config'
import Sequelize from '../../database/sequelize/sequelize'
import Category from './category'
import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Jwt from '../../pkg/jwt'

describe('Category CRUD Integration Test', () => {
    let http: Http
    let token: string
    let categoryId: number
    const logger = new Logger(config)

    beforeAll(async () => {
        const connection = await Sequelize.Connect(config, logger)
        http = new Http(logger, config, connection)
        new Category(logger, config, connection).RunHttp(http)
        
        const jwt = new Jwt(config.jwt.access_key)
        token = jwt.Sign({ id: 1, name: 'Test User' })
    })

    test('POST /v1/categories - should create a category', async () => {
        const res = await http.app.request('/v1/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Category',
                description: 'Test Description'
            })
        })

        const body = await res.json()
        expect(res.status).toBe(201)
        expect(body.data).toHaveProperty('id')
        categoryId = body.data.id
    })

    test('GET /v1/public/categories - should fetch categories', async () => {
        const res = await http.app.request('/v1/public/categories')
        const body = await res.json()
        expect(res.status).toBe(200)
        expect(Array.isArray(body.data)).toBe(true)
    })

    test('GET /v1/public/categories/:id - should show a category', async () => {
        const res = await http.app.request(`/v1/public/categories/${categoryId}`)
        const body = await res.json()
        expect(res.status).toBe(200)
        expect(body.data.id).toBe(categoryId)
    })

    test('PATCH /v1/categories/:id - should update a category', async () => {
        const res = await http.app.request(`/v1/categories/${categoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Updated Category',
                description: 'Updated Description'
            })
        })

        const body = await res.json()
        expect(res.status).toBe(200)
        expect(body.message).toBe('UPDATED')
    })

    test('DELETE /v1/categories/:id - should delete a category', async () => {
        const res = await http.app.request(`/v1/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const body = await res.json()
        expect(res.status).toBe(200)
        expect(body.message).toBe('DELETED')
    })
})
