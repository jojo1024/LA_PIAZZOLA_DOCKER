# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Installer PM2 globalement
RUN npm install -g pm2

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copier les fichiers buildés
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs ecosystem.config.js ./

# Exposer le port
EXPOSE 50002

# Changer vers l'utilisateur non-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:50002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Démarrer avec PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
