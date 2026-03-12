FROM oven/bun:alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY package.json ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:alpine AS server
WORKDIR /app
RUN apk add --no-cache git

# Install PM2 if you still want to use it, although Bun can be run directly
RUN bun add -g pm2

COPY package.json ./
RUN bun install --production
COPY --from=builder /app/build ./build
COPY ecosystem.config.js ./

EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]
