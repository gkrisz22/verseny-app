FROM node:20-alpine
WORKDIR /app

# Package.json, amely tartalmazza a függőségeket
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Függőségek (dependency) telepítése
RUN npm install --force --legacy-peer-deps
COPY . .
COPY .env .env

# Adatbázis inicializálása
RUN npx prisma migrate deploy || npx prisma db push --force-reset
RUN npx prisma db seed

RUN npm run build

EXPOSE 3025

CMD ["npm", "start"]
