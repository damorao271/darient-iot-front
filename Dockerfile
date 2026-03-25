# Frontend - React + Vite

# Development stage - hot reload via Vite dev server (source mounted as volume)
FROM node:22-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time env vars for Vite (API URL from browser perspective)
ARG VITE_API_URL=http://localhost:3000
ARG VITE_WS_URL=http://localhost:3000
ARG VITE_API_KEY=interview-api-key
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

# Production - serve static files with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
