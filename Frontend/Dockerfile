FROM node:22

WORKDIR /home/node/app

RUN npm install -g pnpm@latest-10

ARG CI=true

COPY . .

RUN pnpm install --quiet --frozen-lockfile


RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "dev"]
