FROM node:18

WORKDIR /home/node/app
EXPOSE 80

COPY ./Frontend/app .

RUN npm ci

CMD ["npm", "start"]
