# Developer Examples & Manual Testing Guide

This directory contains examples of how to use various Bun-native features and core functionalities of this boilerplate.

## 🧪 Manual Testing & Feature Guide

Use these `curl` commands to verify the core features of the boilerplate.

### 1. Public Category Endpoints (No Auth)

**Fetch Categories (with Pagination):**

```bash
curl -s "http://localhost:3000/v1/public/categories?page=1&limit=5" | jq
```

**Get Specific Category:**

```bash
curl -s "http://localhost:3000/v1/public/categories/1" | jq
```

**Export to CSV:**

```bash
curl -O http://localhost:3000/v1/public/categories/export
```

---

### 2. Protected Category Endpoints (Requires Auth)

_Note: Replace `<token>` with a valid JWT._

**Create Category:**

```bash
curl -X POST http://localhost:3000/v1/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Category", "description": "Awesome stuff"}'
```

**Update Category:**

```bash
curl -X PATCH http://localhost:3000/v1/categories/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

---

### 3. High-Performance Storage

**Upload File:**

```bash
curl -X POST http://localhost:3000/v1/storage \
  -F "file=@/path/to/image.png"
```

---

### 4. Advanced Code Snippets

#### 📩 Sending Emails (Nodemailer Pattern)

We recommend using `nodemailer` in the `pkg/` directory if you need email support.

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({...})
await transporter.sendMail({
    from: 'sender@example.com',
    to: 'receiver@example.com',
    subject: 'Hello',
    html: '<b>Hello world?</b>'
})
```

#### 📊 Complex Data Export (CSV Pattern)

Implemented in `src/modules/category/delivery/http/handler.ts`:

```typescript
ctx.set.headers['Content-Type'] = 'text/csv'
ctx.set.headers['Content-Disposition'] = 'attachment; filename="data.csv"'
return 'column1,column2\nval1,val2'
```

## 🧪 Testing Policy

Automated tests are focused only on core utility functions in `src/helpers`. To run unit tests:

```bash
bun run test:unit
```

For features requiring external services (Database, Redis), manual verification via `curl` (as shown above) is the recommended approach for development.
