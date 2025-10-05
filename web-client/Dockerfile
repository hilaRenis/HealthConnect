# Base dependencies layer reused by dev and build stages
FROM node:18-alpine AS base

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# Development stage provides hot-reload server
FROM base AS dev

ENV PORT=3000

CMD ["npm", "start"]

# Production build stage
FROM base AS build

RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.21.0-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy the default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
