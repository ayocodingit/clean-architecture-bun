import { expect, test, describe, beforeAll } from 'bun:test'
import config from '../../config/config'
import Logger from '../../pkg/logger'
import Redis from '../../external/redis'

describe('Redis Basic Functionality Test', () => {
    let redis: Redis
    const logger = new Logger(config)

    beforeAll(async () => {
        redis = new Redis(config, logger)
        // Wait a bit for connection if needed, though client.connect() is called in constructor
        // We can wait for the ready state or just try an operation
        await new Promise(resolve => setTimeout(resolve, 1000))
    })

    test('should be able to Store and Get data from Redis', async () => {
        try {
            await redis.Store('test_key', 'test_value', 60)
            const value = await redis.Get('test_key')
            
            expect(value).toBe('test_value')
            console.log('Redis test passed: test_key ->', value)
        } catch (error) {
            console.error('Redis test failed:', error)
            // If redis is not running, we might want to skip or mark as failed depending on environment
            // but for this task we want to verify if it WORKS if configured correctly.
            throw error
        }
    })
})
