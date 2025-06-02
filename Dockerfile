FROM node:22-alpine3.20

WORKDIR /home/app
COPY . .

RUN npm install && npm run build

EXPOSE 80 8080

CMD ["npm", "run", "start:prod"]