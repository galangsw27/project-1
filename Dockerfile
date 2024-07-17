FROM node:18-alpine AS base
 
WORKDIR /app
 
COPY package.json ./
COPY yarn.lock ./
 
RUN yarn install --network-timeout=300000

COPY . .
 
RUN yarn build
 
FROM node:18-alpine AS runner
 
WORKDIR /app
 
COPY --from=base /app ./
 
EXPOSE 3000
 
CMD ["yarn", "start"]
