#!/bin/sh

echo "Várakozás PostgreSQL szerverre..."
until nc -z db 5432; do
  sleep 1
done

npx prisma generate
npx prisma migrate deploy || npx prisma db push --force-reset
npx prisma db seed

echo "Next.js app indítása..."
npm run start
