FROM node:20-alpine
WORKDIR /app

# Package.json, amely tartalmazza a függőségeket
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Függőségek (dependency) telepítése
RUN npm install --force --legacy-peer-deps
COPY . .

RUN npm run build

EXPOSE 3025

ENTRYPOINT ["./entrypoint.sh"]
