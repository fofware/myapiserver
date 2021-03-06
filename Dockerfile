FROM node:15.5.1

RUN mkdir -p /src/usr/app

WORKDIR /src/usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
