FROM node:14
WORKDIR /

COPY package*.json ./
RUN npm ci

COPY . .
#COPY /public ./
#COPY /src ./
#COPY /tsconfig.json ./
#COPY /tslint.json ./

RUN npm run build

EXPOSE 8888
CMD ["npm", "start"]