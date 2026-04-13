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

### 3. File upload (contoh kode, bukan route aktif)

Endpoint `/v1/storage` **tidak** terdaftar di app. Untuk upload file:

1. Salin logika dari [`file-upload.example.ts`](./file-upload.example.ts) (`saveUploadedFile`) ke use case module kamu.
2. Di handler Elysia, terima `multipart/form-data` dan pass `File` ke use case.

**Contoh handler (setelah kamu buat module + route mis. `POST /v1/files`):**

```typescript
// body: multipart — field file + optional description, category
public Upload = async (ctx: Context) => {
    const body = ctx.body as { file: File; description?: string; category?: string }
    const { file, description, category } = body
    const result = await this.usecase.Save(file, { description, category })
    ctx.set.status = 201
    return { data: result, message: 'UPLOADED' }
}
```

**Contoh `curl` (sesuaikan path route yang kamu daftarkan):**

```bash
curl -X POST http://localhost:3000/v1/files \
  -F "file=@/path/to/image.png" \
  -F "description=optional"
```

File tersimpan di folder `storage/` (di `.gitignore`); pastikan `mkdir` recursive seperti di contoh.

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
