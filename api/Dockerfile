FROM node:22

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn prisma generate client
RUN yarn prisma migrate deploy
RUN yarn prisma db seed

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start:dev"] 