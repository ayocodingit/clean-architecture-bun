# Developer Examples & Manual Testing Guide

This directory contains examples of how to use various Bun-native features and core functionalities of this boilerplate.

## 🚀 Features & Usage

### 1. High-Performance File Upload

We use Bun's native `Bun.write()` and Hono's `parseBody()` for high-performance, zero-copy file storage.

**Endpoint:** `POST /v1/storage`
**Method:** `multipart/form-data`
**Payload:** `file` (File)

**Manual Test with Curl:**

```bash
curl -X POST http://localhost:3000/v1/storage \
  -F "file=@/path/to/your/image.jpg"
```

---

### 2. External API Handling (Native Fetch)

Bun has native `fetch` optimized for the runtime. You don't need `axios` or `node-fetch`.

**Example Code:**

```typescript
const response = await fetch('https://api.example.com/data')
const data = await response.json()
```

_Implementation can be found in various usecases as a standard pattern._

---

### 3. Redis Integration

The boilerplate includes a pre-configured Redis client for caching.

**Basic Operations:**

```typescript
await redis.Store('key', 'value', 3600) // Store for 1 hour
const data = await redis.Get('key')
```

---

### 4. Global Error Handling

We provide consistent error responses for 404 (Not Found) and 500 (Internal Server Error).

-   **404:** Triggered when a route is not registered.
-   **500:** Automatically catches uncaught exceptions and returns a structured JSON response.

---

### 5. Pagination & Validation

Structured metadata for listing endpoints and robust form validation using `Joi`.

**Standard Response Meta:**

```json
{
  "data": [...],
  "meta": {
    "per_page": 10,
    "current_page": 1,
    "total": 50
  }
}
```

## 🧪 Testing Policy

Automated tests are focused only on core utility functions in `src/helpers`. To run unit tests:

```bash
bun run test:unit
```

For features requiring external services (Database, Redis), manual verification or integration testing in a staging environment is recommended.
