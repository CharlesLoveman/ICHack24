FROM node:18

WORKDIR /home/node/app
EXPOSE 8080

COPY app .

RUN npm ci

CMD ["npm", "run"]
