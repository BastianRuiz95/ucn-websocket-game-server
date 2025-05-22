FROM node:24-alpine3.20

WORKDIR /home/app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 4000 4010

CMD ["npm", "run", "start:prod"]