# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build de production
RUN npm run build

