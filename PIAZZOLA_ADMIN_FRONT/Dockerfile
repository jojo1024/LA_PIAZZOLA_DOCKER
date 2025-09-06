# Stage 1: Build
FROM node:20.15.0-bullseye AS builder

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installer les dépendances
RUN npm install --legacy-peer-deps
# RUN npm install --legacy-peer-deps

# Copier le code source
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build de production
RUN npm run build

