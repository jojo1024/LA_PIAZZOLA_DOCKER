# 🍕 Piazzola Website Backend

Serveur backend pour le site web de la pizzeria Piazzola, développé avec Node.js, Express et TypeScript.

## 📋 Table des matières

- [Description](#description)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [PM2 Configuration](#pm2-configuration)
- [Contribuer](#contribuer)

## 📋 Prérequis

- Node.js (version recommandée : 20.15.0 ou plus)
- MySQL
- Yarn ou npm

## 🎯 Description

Piazzola Website Backend est un serveur Express qui :
- Sert les fichiers statiques du frontend React
- Gère les requêtes API pour le site web
- Fournit une interface de communication temps réel
- Assure la compression et l'optimisation des performances
- Gère le routage SPA (Single Page Application)

## 🏗️ Architecture

### Architecture générale
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Base de       │
│   (React)       │◄──►│   (Express)      │◄──►│   données       │
│                 │    │                  │    │   (MySQL)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Flux de données
1. **Requêtes statiques** : Fichiers HTML, CSS, JS servis directement
2. **API Endpoints** : Endpoints REST pour les données dynamiques
3. **WebSocket** : Communication temps réel pour les commandes
4. **Compression** : Optimisation des performances avec gzip

## 🛠️ Technologies utilisées

### Backend Core
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web minimaliste
- **TypeScript** : Typage statique pour la robustesse
- **Socket.IO** : Communication temps réel

### Middleware & Utilitaires
- **CORS** : Cross-Origin Resource Sharing
- **Compression** : Compression gzip des réponses
- **dotenv** : Gestion des variables d'environnement
- **nodemon** : Redémarrage automatique en développement

### Build & Déploiement
- **TypeScript Compiler** : Compilation TypeScript
- **PM2** : Process Manager pour la production
- **Nginx** : Reverse proxy (optionnel)

## 📋 Prérequis

- **Node.js** : Version 18 ou supérieure
- **npm** ou **yarn** : Gestionnaire de paquets
- **Git** : Contrôle de version
- **MySQL** : Base de données (si nécessaire)

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd PIAZZOLA_WEBSITE_BACK
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration de l'environnement**
   ```bash
   # Créer un fichier .env
   cp .env.example .env
   ```

4. **Variables d'environnement**
   ```env
   # Configuration du serveur
   PORT=50005
   NODE_ENV=development
   
   # Base de données (si applicable)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=piazzola_db
   
   # Autres configurations
   TZ=Africa/Abidjan
   ```

## 💻 Développement

### Démarrer le serveur de développement
```bash
npm run dev
# ou
yarn dev
```

Le serveur sera accessible à l'adresse : `http://127.0.0.1:50005`

### Scripts disponibles
```bash
# Développement
npm run dev          # Démarrer avec nodemon (redémarrage automatique)
npm start            # Démarrer le serveur

# Build
npm run build        # Compiler TypeScript vers JavaScript

# Test
npm test             # Exécuter les tests (à implémenter)
```

### Endpoint de test
```bash
curl http://127.0.0.1:50005/test
```

Réponse attendue :
```json
{
  "status": 1,
  "data": {
    "message": "Connecté au serveur avec succès au site de piazzola!"
  }
}
```

## 🏗️ Déploiement

### Build de production
```bash
npm run build
```

### Démarrage en production
```bash
npm start
```

### Avec PM2 (recommandé)
```bash
# Installation globale de PM2
npm install -g pm2

# Démarrage avec PM2
pm2 start ecosystem.config.js

# Gestion des processus
pm2 list              # Lister les processus
pm2 restart all       # Redémarrer tous les processus
pm2 stop all          # Arrêter tous les processus
pm2 logs              # Voir les logs
```

## 📁 Structure du projet

```
PIAZZOLA_WEBSITE_BACK/
├── src/
│   └── app.ts              # Point d'entrée principal
├── views/
│   └── piazzola_front/     # Fichiers statiques du frontend
│       ├── index.html      # Page principale
│       ├── assets/         # CSS, JS, images
│       └── ...
├── dist/                   # Code compilé (généré)
├── ecosystem.config.js     # Configuration PM2
├── tsconfig.json          # Configuration TypeScript
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## ⚙️ Configuration

### Configuration Express
```typescript
// Middlewares configurés
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression());
```

### Configuration TypeScript
- **Target** : ES5 pour la compatibilité
- **Module** : CommonJS
- **OutDir** : `dist/` pour le code compilé
- **Source Maps** : Activées pour le debugging

### Configuration PM2
```javascript
module.exports = {
  apps: [{
    name: "piazzola_website",
    script: './dist/app.js',
    watch: false,
    out_file: "/dev/null",
    error_file: "/dev/null"
  }]
};
```

## 🔌 API Endpoints

### Endpoints disponibles

#### GET `/test`
- **Description** : Endpoint de test de connexion
- **Réponse** : Message de confirmation de connexion
- **Statut** : 201

#### GET `/*`
- **Description** : Sert les fichiers statiques du frontend
- **Comportement** : Fallback vers `index.html` pour le SPA

### Middlewares appliqués
- **CORS** : Autorise les requêtes cross-origin
- **Compression** : Compresse les réponses avec gzip
- **Body Parser** : Parse les requêtes JSON et URL-encoded
- **Static Files** : Sert les fichiers statiques

## 📊 PM2 Configuration

### Installation PM2
```bash
npm install -g pm2
```

### Commandes utiles
```bash
# Démarrage
pm2 start ecosystem.config.js

# Monitoring
pm2 monit

# Logs
pm2 logs piazzola_website

# Redémarrage
pm2 restart piazzola_website

# Arrêt
pm2 stop piazzola_website

# Suppression
pm2 delete piazzola_website
```

### Configuration avancée
```javascript
module.exports = {
  apps: [{
    name: "piazzola_website",
    script: './dist/app.js',
    instances: 1,
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 50005
    },
    out_file: "/dev/null",
    error_file: "/dev/null"
  }]
};
```

## 🔧 Optimisations

### Performance
- **Compression gzip** : Réduction de la taille des réponses
- **Limite de taille** : 50MB pour les requêtes
- **CORS configuré** : Sécurité cross-origin
- **Static files** : Service optimisé des assets

### Sécurité
- **CORS** : Protection contre les attaques cross-origin
- **Limite de taille** : Protection contre les attaques DoS
- **Validation** : Validation des entrées (à implémenter)

## 🐳 Docker (optionnel)

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 50005

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  piazzola-backend:
    build: .
    ports:
      - "50005:50005"
    environment:
      - NODE_ENV=production
      - PORT=50005
    volumes:
      - ./views:/app/views
```

## 🤝 Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code
- Utiliser **TypeScript** pour tout nouveau code
- Suivre les conventions **ESLint** (à configurer)
- Tester les fonctionnalités avant commit
- Documenter les nouvelles fonctionnalités

## 📄 Licence

Ce projet est propriétaire de Piazzola. Tous droits réservés.

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@piazzola.fr
- **Téléphone** : [Numéro de contact]
- **Adresse** : [Adresse de la pizzeria]

## 🔍 Monitoring

### Logs
```bash
# Logs PM2
pm2 logs piazzola_website

# Logs système
journalctl -u piazzola-website
```

### Métriques
- **Port** : 50005
- **Processus** : PM2
- **Compression** : Activée
- **CORS** : Configuré

---

**Développé avec ❤️ pour Piazzola** 🍕 