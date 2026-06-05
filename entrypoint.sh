#!/bin/sh
set -e

echo "⏳ Rodando migrations..."
npx prisma migrate deploy

echo "🌱 Rodando seed..."
npx tsx prisma/seed.ts

echo "🚀 Iniciando servidor..."
exec npx tsx src/server.ts
