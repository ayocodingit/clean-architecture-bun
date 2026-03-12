import { expect, test, describe } from 'bun:test'

describe('External API with Native Fetch', () => {
    test('should be able to fetch from external API', async () => {
        // Bun has native fetch built-in, no need for axios!
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
        
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data).toHaveProperty('id', 1)
        expect(data).toHaveProperty('title')
        
        console.log('Fetch Result:', data.title)
    })

    test('should handle POST request with fetch', async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        expect(response.status).toBe(201)
        const data = await response.json()
        expect(data.title).toBe('foo')
    })
})
