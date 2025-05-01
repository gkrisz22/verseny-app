# Dockerfile

# 1. Építő konténer
FROM node:20-alpine AS builder

# 2. Munkakönyvtár beállítása
WORKDIR /app

# 3. package.json és lockfile másolása
COPY package.json package-lock.json* ./

# 4. Függőségek telepítése
RUN npm install --force --legacy-peer-deps

# 5. Teljes projekt bemásolása (.dockerignore-ban megadottak kivételével)
COPY . .

# 6. Prisma kliens generálása (adatbázis-kliens inicializálása)
RUN npx prisma generate

# 7. Next.js build
RUN npm run build

# 8. Futási konténer (csak ami tényleg kell)
FROM node:20-alpine AS runner

WORKDIR /app

# 9. Csak a szükséges fájlok áthozása
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prisma prisma

# 10. Környezeti változó
ENV NODE_ENV=production

# 11. Alkalmazás indítása
CMD ["npm", "start"]
