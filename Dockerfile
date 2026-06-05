FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Script de entrada: migrate + seed + servidor
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
