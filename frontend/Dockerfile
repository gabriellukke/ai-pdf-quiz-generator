FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

COPY . .

ENV CI=true

RUN pnpm install

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "dev"]

