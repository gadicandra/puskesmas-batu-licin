# Production image untuk app Next.js + Payload.
# Catatan deploy:
# - Sediakan DATABASE_URL & PAYLOAD_SECRET saat build & runtime.
# - Jalankan migrasi sebelum start: `pnpm payload migrate` (lihat PAYLOAD_PLAN Fase 7).
# - Set `push: false` di adapter untuk produksi (gunakan migrasi, bukan auto-push).

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
# sharp butuh ini di beberapa lingkungan Alpine
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
# Jalankan migrasi lalu start (aman untuk produksi).
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]
