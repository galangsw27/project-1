FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -frozen-lockfile

COPY . .
    COPY .env.production .env
    
RUN npm run build
ENV NODE_ENV=production
ENV NODE_ENV=production

    