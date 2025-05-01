# 1. Építő fázis
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --force --legacy-peer-deps
COPY . .

# Prisma generálás és seedelés
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npx prisma db seed

# Next.js build
RUN npm run build

# 2. Futtató fázis
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
