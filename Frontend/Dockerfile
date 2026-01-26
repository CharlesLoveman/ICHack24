FROM node:22

WORKDIR /home/node/app

RUN npm install -g pnpm@latest-10

ARG CI=true

COPY . .

RUN pnpm install --quiet --frozen-lockfile


RUN pnpm run build

EXPOSE 5173

# ARG NODE_OPTIONS=--dns-result-order=ipv4first vite

CMD ["pnpm", "dev"]
