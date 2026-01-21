FROM node:18

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY ./Frontend/app .

RUN pnpm install --quiet

COPY . .

RUN pnpm run build

ENV NODE_ENV="production"

EXPOSE 5173

CMD ["pnpm", "dev"]
