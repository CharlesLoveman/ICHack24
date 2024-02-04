FROM node:18

WORKDIR /home/node/app
EXPOSE 80



COPY ./Frontend/app .

RUN npm ci

ENV NODE_ENV="production"

CMD ["npm", "start"]
