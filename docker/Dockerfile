FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.2-alpine AS server
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/build ./build

# Non-root user for security
RUN adduser -D bunuser
USER bunuser

EXPOSE 3000
CMD ["bun", "run", "start"]
