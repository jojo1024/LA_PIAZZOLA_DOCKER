# Piazzola Admin

## Description
Piazzola Admin est une application web d'administration développée avec React, TypeScript et Vite. Cette application utilise une architecture moderne avec Redux pour la gestion d'état et Firebase pour l'authentification et la base de données.

## Technologies principales
- React 18
- TypeScript
- Vite
- Redux Toolkit
- Firebase
- Tailwind CSS
- Material-UI
- Socket.IO

## Prérequis
- Node.js (version recommandée : 20.15.0 ou supérieure)
- Yarn ou npm

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd piazzola-admin
```

2. Installer les dépendances :
```bash
yarn install
# ou
npm install
```

3. Configurer les variables d'environnement :
Créez un fichier `.env` à la racine du projet avec les variables nécessaires pour Firebase et autres services.

## Scripts disponibles

- `yarn dev` : Lance le serveur de développement
- `yarn build` : Compile le projet pour la production
- `yarn build:client` : Compile le projet pour le client
- `yarn preview` : Prévisualise la version de production

## Structure du projet

```
src/
├── assets/         # Ressources statiques (images, fonts, etc.)
├── base-components/# Composants de base réutilisables
├── components/     # Composants React
├── layouts/        # Layouts de l'application
├── pages/         # Pages de l'application
├── router/        # Configuration du routage
├── socket/        # Configuration Socket.IO
├── stores/        # Configuration Redux
├── types/         # Types TypeScript
└── utils/         # Utilitaires et helpers
```

## Fonctionnalités principales
- Authentification avec Firebase
- Gestion des utilisateurs
- Interface d'administration
- Intégration avec Google Maps
- Éditeur de texte riche (CKEditor)
- Tableaux de données avancés
- Export de données
- Gestion des fichiers

## Développement

### Conventions de code
- Utiliser TypeScript pour tout le code
- Suivre les conventions de nommage React
- Utiliser les hooks React pour la logique
- Implémenter la gestion d'état avec Redux Toolkit

### Bonnes pratiques
- Tester les composants avant de les intégrer
- Documenter les composants complexes
- Maintenir une structure de code propre et organisée
- Utiliser les types TypeScript appropriés

## Déploiement
Le projet peut être déployé sur n'importe quel service d'hébergement statique (Vercel, Netlify, etc.) ou sur un serveur personnalisé.

## Support
Pour toute question ou problème, veuillez créer une issue dans le repository.

## Licence
[Spécifier la licence du projet] 