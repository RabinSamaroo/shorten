FROM node:14
ENV NODE_ENV=production
WORKDIR /

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8888
CMD ["npm", "start"]
