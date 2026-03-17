FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.2-alpine AS server
WORKDIR /app

# Non-root user for security
RUN adduser -D bunuser
USER bunuser

COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["bun", "./build/app.js"]
