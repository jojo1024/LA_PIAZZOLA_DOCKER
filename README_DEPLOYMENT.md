# 🚀 Guide de Déploiement PIAZZOLA avec Docker

## 📋 Vue d'ensemble

Ce guide vous accompagne dans le déploiement de l'application PIAZZOLA en production avec Docker et Nginx installé manuellement sur le VPS.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (VPS)   │    │   Docker Compose │    │   Base de données │
│                 │    │                 │    │                 │
│ - Reverse Proxy │◄──►│ - Admin Backend │◄──►│ - MySQL 8.0     │
│ - SSL/TLS       │    │ - Admin Frontend│    │                 │
│ - Rate Limiting │    │ - Website Backend│   │                 │
│ - Load Balancing│    │ - Website Frontend│  │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Services Docker

| Service | Port | Description |
|---------|------|-------------|
| `mysql` | 3306 | Base de données MySQL |
| `admin-back` | 50001 | Backend administration |
| `admin-front` | 3001 | Frontend administration |
| `website-back` | 50002 | Backend site web |
| `website-front` | 3002 | Frontend site web |
| `prometheus` | 9090 | Monitoring (optionnel) |
| `grafana` | 3000 | Dashboards (optionnel) |

## 🚀 Démarrage Rapide

### 1. Prérequis

```bash
# Vérifier Docker et Docker Compose
docker --version
docker-compose --version

# Vérifier les ports disponibles
netstat -tulpn | grep -E ':(3001|3002|50001|50002|3306)'
```

### 2. Configuration

```bash
# Copier le fichier d'environnement
cp env.production.example .env.production

# Éditer les variables d'environnement
nano .env.production
```

### 3. Déploiement

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Construire et démarrer les services
./deploy.sh build
./deploy.sh start

# Vérifier l'état des services
./deploy.sh health
```

## 🔧 Configuration Détaillée

### Variables d'environnement (.env.production)

```bash
# Configuration MySQL
MYSQL_ROOT_PASSWORD=VotreMotDePasseRootMySQL
MYSQL_DATABASE=piazzola_db
MYSQL_USER=piazzola_user
MYSQL_PASSWORD=VotreMotDePasseMySQL

# Configuration JWT et Chiffrement
JWT_SECRET=VotreSecretJWTTrèsLongEtComplexe
ENCRYPTION_KEY=VotreCléDeChiffrementTrèsLongue

# Configuration Firebase
FIREBASE_PROJECT_ID=piazzola-web-push
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@piazzola-web-push.iam.gserviceaccount.com
```

### Sécurité des mots de passe

```bash
# Générer un secret JWT sécurisé
openssl rand -base64 64

# Générer une clé de chiffrement
openssl rand -base64 32
```

## 🌐 Configuration Nginx

### Installation manuelle sur VPS

Suivez le guide complet dans `nginx/INSTALL_NGINX_VPS.md`

### Points clés de la configuration

1. **Reverse Proxy** : Route le trafic vers les services Docker
2. **SSL/TLS** : Certificats Let's Encrypt recommandés
3. **Rate Limiting** : Protection contre les attaques
4. **Compression** : Optimisation des performances
5. **Security Headers** : Protection supplémentaire

## 📊 Monitoring

### Prometheus & Grafana (Optionnel)

```bash
# Accéder à Prometheus
http://votre-vps:9090

# Accéder à Grafana
http://votre-vps:3000
# Login: admin / mot_de_passe_grafana
```

### Métriques disponibles

- Utilisation CPU/Mémoire des conteneurs
- Temps de réponse des APIs
- Nombre de requêtes par minute
- Erreurs 4xx/5xx
- Utilisation de la base de données

## 🔄 Gestion des Services

### Commandes de base

```bash
# Démarrer tous les services
./deploy.sh start

# Arrêter tous les services
./deploy.sh stop

# Redémarrer tous les services
./deploy.sh restart

# Voir les logs en temps réel
./deploy.sh logs

# Vérifier la santé des services
./deploy.sh health
```

### Maintenance

```bash
# Sauvegarder la base de données
./deploy.sh backup

# Restaurer la base de données
./deploy.sh restore backups/piazzola_20250101_120000.sql

# Nettoyer les ressources Docker
./deploy.sh cleanup
```

## 🔍 Dépannage

### Problèmes courants

1. **Services ne démarrent pas**
   ```bash
   # Vérifier les logs
   ./deploy.sh logs
   
   # Vérifier l'espace disque
   df -h
   
   # Vérifier la mémoire
   free -h
   ```

2. **Erreurs de connexion à la base de données**
   ```bash
   # Vérifier que MySQL est démarré
   docker-compose ps mysql
   
   # Vérifier les logs MySQL
   docker-compose logs mysql
   ```

3. **Problèmes de certificats SSL**
   ```bash
   # Vérifier les certificats
   sudo nginx -t
   
   # Renouveler les certificats Let's Encrypt
   sudo certbot renew
   ```

### Logs utiles

```bash
# Logs Docker Compose
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f admin-back

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Mots de passe forts** : Utilisez des générateurs de mots de passe
2. **Certificats SSL** : Renouvelez automatiquement avec Let's Encrypt
3. **Firewall** : Configurez UFW ou Firewalld
4. **Mises à jour** : Maintenez le système à jour
5. **Backups** : Automatisez les sauvegardes

### Configuration sécurisée

```bash
# Désactiver l'accès root SSH
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no

# Configurer le firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

## 📈 Performance

### Optimisations recommandées

1. **Docker** : Utilisez des images Alpine pour réduire la taille
2. **Nginx** : Activez la compression gzip
3. **MySQL** : Optimisez les paramètres de performance
4. **Monitoring** : Surveillez les métriques de performance

### Ressources recommandées

| Composant | CPU | RAM | Stockage |
|-----------|-----|-----|----------|
| VPS | 2 cores | 4 GB | 50 GB SSD |
| MySQL | 1 core | 2 GB | 20 GB |
| Applications | 1 core | 2 GB | 10 GB |

## 🔄 Mises à jour

### Procédure de mise à jour

```bash
# 1. Sauvegarder la base de données
./deploy.sh backup

# 2. Arrêter les services
./deploy.sh stop

# 3. Récupérer le nouveau code
git pull origin main

# 4. Reconstruire les images
./deploy.sh build

# 5. Redémarrer les services
./deploy.sh start

# 6. Vérifier la santé
./deploy.sh health
```

## 📞 Support

### En cas de problème

1. **Vérifiez les logs** : `./deploy.sh logs`
2. **Testez la santé** : `./deploy.sh health`
3. **Consultez la documentation** : Ce README et les guides dans `nginx/`
4. **Vérifiez les ressources** : CPU, RAM, disque

### Ressources utiles

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

## 📝 Notes importantes

- ⚠️ **Ne jamais commiter** le fichier `.env.production`
- 🔒 **Changez tous les mots de passe** par défaut
- 📊 **Configurez les sauvegardes** automatiques
- 🔄 **Planifiez les mises à jour** régulières
- 📈 **Surveillez les performances** avec Prometheus/Grafana

---

**PIAZZOLA** - Système de gestion de pizzeria moderne et sécurisé 🍕
