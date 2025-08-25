# Piazzola Backend

Ce projet est le backend de l'application Piazzola, développé avec Node.js, Express et TypeScript.

## 🚀 Technologies Utilisées

- Node.js
- Express.js
- TypeScript
- MySQL
- Socket.IO
- Firebase
- JWT pour l'authentification
- Nodemailer pour les emails
- Et plus encore...

## 📋 Prérequis

- Node.js (version recommandée : 20.15.0 ou plus)
- MySQL
- Yarn ou npm

## 🔧 Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd piazzola-back
```

2. Installez les dépendances :
```bash
yarn install
# ou
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env` à la racine du projet avec les variables nécessaires.

## 🏃‍♂️ Démarrage

### Développement
```bash
yarn dev
# ou
npm run dev
```

### Production
```bash
yarn start
# ou
npm start
```

## 🛠️ Scripts Disponibles

- `yarn dev` : Lance le serveur en mode développement avec nodemon
- `yarn start` : Démarre le serveur en mode production
- `yarn build` : Compile le TypeScript en JavaScript
- `yarn test` : Lance les tests (à implémenter)

## 📦 Structure du Projet

```
piazzola-back/
├── src/           # Code source
├── public/        # Fichiers statiques
├── views/         # Templates
├── .github/       # Configuration GitHub
└── ...
```

## 🔐 Sécurité

- Authentification JWT
- Validation des données avec express-validator et zod
- Protection CORS
- Hachage des mots de passe avec bcrypt

## 📧 Communication

- Socket.IO pour la communication en temps réel
- Nodemailer pour l'envoi d'emails

## 🐳 Docker

Le projet inclut un Dockerfile pour la conteneurisation. Pour construire et exécuter :

```bash
docker build -t piazzola-back .
docker run -p 3000:3000 piazzola-back
```

## 📝 Licence

ISC

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request. 