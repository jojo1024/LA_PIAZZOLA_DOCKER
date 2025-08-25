# 🍕 Piazzola Website

Site web moderne et responsive pour la pizzeria Piazzola, développé avec React, TypeScript et Vite.

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Développement](#développement)
- [Build et déploiement](#build-et-déploiement)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Docker](#docker)
- [Contribuer](#contribuer)

## 📋 Prérequis

- Node.js (version recommandée : 20.15.0 ou plus)
- MySQL
- Yarn ou npm

## 🎯 Description

Piazzola Website est une application web moderne permettant aux clients de :
- Consulter le menu de la pizzeria
- Passer des commandes en ligne
- Gérer leur compte client
- Suivre leurs commandes en temps réel
- Participer au programme de fidélité
- Contacter l'équipe

## ✨ Fonctionnalités

### 🏠 Page d'accueil
- Présentation de la pizzeria
- Menu du jour
- Promotions en cours
- Navigation intuitive

### 🍽️ Menu et commandes
- **Menu Pizza** : Catalogue complet des pizzas avec photos et descriptions
- **Menu Restaurant** : Plats du restaurant avec options de personnalisation
- **Panier** : Gestion des commandes avec calcul automatique
- **Suivi de commandes** : Historique et statut en temps réel

### 👤 Espace client
- **Inscription/Connexion** : Authentification sécurisée
- **Compte client** : Gestion des informations personnelles
- **Fidélité** : Programme de points et récompenses
- **Historique** : Suivi des commandes passées

### 📞 Contact et informations
- **Contact** : Formulaire de contact et informations
- **Mentions légales** : Conformité RGPD
- **CGV/CGU** : Conditions générales

## 🛠️ Technologies utilisées

### Frontend
- **React 18** : Bibliothèque UI moderne
- **TypeScript** : Typage statique pour la robustesse
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **Redux Toolkit** : Gestion d'état globale
- **React Router** : Navigation SPA

### UI/UX
- **Headless UI** : Composants accessibles
- **Heroicons** : Icônes modernes
- **React Hot Toast** : Notifications élégantes
- **Slick Carousel** : Carrousels interactifs
- **Tippy.js** : Tooltips avancés

### Authentification & Sécurité
- **Google OAuth** : Connexion sociale
- **JWT** : Tokens d'authentification
- **Crypto-js** : Chiffrement des données

### Communication temps réel
- **Socket.IO** : Communication bidirectionnelle
- **Redux Persist** : Persistance des données

## 📋 Prérequis

- **Node.js** : Version 18 ou supérieure
- **npm** ou **yarn** : Gestionnaire de paquets
- **Git** : Contrôle de version

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd PIAZZOLA_WEBSITE
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration de l'environnement**
   ```bash
   # Créer un fichier .env.local (optionnel)
   cp .env.example .env.local
   ```

## 💻 Développement

### Démarrer le serveur de développement
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Scripts disponibles
```bash
# Développement
npm run dev          # Démarrer le serveur de développement
npm run preview      # Prévisualiser le build de production

# Build et optimisation
npm run build        # Construire pour la production
npm run lint         # Vérifier le code avec ESLint
```

## 🏗️ Build et déploiement

### Build de production
```bash
npm run build
```

Le build optimisé sera généré dans le dossier `dist/`

### Optimisations incluses
- **Code splitting** : Découpage automatique des chunks
- **Compression** : Gzip des assets
- **Tree shaking** : Élimination du code inutilisé
- **Minification** : Réduction de la taille des fichiers

## 📁 Structure du projet

```
PIAZZOLA_WEBSITE/
├── public/                 # Assets statiques
├── src/
│   ├── app/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── Button/     # Boutons personnalisés
│   │   │   ├── Navigation/ # Navigation principale
│   │   │   └── ...
│   │   └── pages/         # Pages de l'application
│   │       ├── Home.tsx    # Page d'accueil
│   │       ├── MenuPizza.tsx
│   │       ├── Cart.tsx    # Panier
│   │       └── ...
│   ├── routers/           # Configuration des routes
│   ├── store/             # Redux store
│   ├── socket/            # Configuration Socket.IO
│   ├── utils/             # Utilitaires et constantes
│   └── styles/            # Styles SCSS
├── Dockerfile             # Configuration Docker
├── vite.config.ts         # Configuration Vite
└── package.json           # Dépendances et scripts
```

## ⚙️ Configuration

### Variables d'environnement
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Autres configurations
VITE_APP_NAME=Piazzola
```

### Configuration Vite
Le projet utilise une configuration Vite optimisée avec :
- **Code splitting** automatique
- **Compression** des assets
- **Suppression des console.log** en production
- **Optimisation des chunks** pour de meilleures performances

## 🐳 Docker

### Build de l'image Docker
```bash
docker build -t piazzola-website .
```

### Exécution avec Docker
```bash
docker run -p 80:80 piazzola-website
```

### Docker Compose (optionnel)
```yaml
version: '3.8'
services:
  piazzola-website:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## 🤝 Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code
- Utiliser **TypeScript** pour tout nouveau code
- Suivre les conventions **ESLint** configurées
- Tester les fonctionnalités avant commit
- Documenter les nouvelles fonctionnalités

## 📄 Licence

Ce projet est propriétaire de Piazzola. Tous droits réservés.

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@piazzola.fr
- **Téléphone** : [Numéro de contact]
- **Adresse** : [Adresse de la pizzeria]

---

**Développé avec ❤️ pour Piazzola** 🍕
