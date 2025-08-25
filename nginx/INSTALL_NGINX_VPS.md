# Guide d'installation Nginx sur VPS pour PIAZZOLA

## 📋 Prérequis

- VPS Ubuntu 20.04+ ou CentOS 8+
- Accès root ou utilisateur avec sudo
- Domaines configurés : `la-piazzola.com` et `admin.la-piazzola.com`

## 🚀 Installation d'Nginx

### Ubuntu/Debian

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation d'Nginx
sudo apt install nginx -y

# Démarrage et activation d'Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification du statut
sudo systemctl status nginx
```

### CentOS/RHEL

```bash
# Mise à jour du système
sudo yum update -y

# Installation d'Nginx
sudo yum install nginx -y

# Démarrage et activation d'Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification du statut
sudo systemctl status nginx
```

## 🔧 Configuration Nginx

### 1. Sauvegarde de la configuration par défaut

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
```

### 2. Remplacement par la configuration PIAZZOLA

```bash
# Copier la configuration personnalisée
sudo cp nginx-vps.conf /etc/nginx/nginx.conf

# Vérifier la syntaxe
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 3. Configuration des certificats SSL

#### Option A : Certificats Let's Encrypt (Recommandé)

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx -y

# Génération des certificats
sudo certbot --nginx -d la-piazzola.com -d www.la-piazzola.com
sudo certbot --nginx -d admin.la-piazzola.com -d www.admin.la-piazzola.com

# Renouvellement automatique
sudo crontab -e
# Ajouter cette ligne :
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Option B : Certificats manuels

```bash
# Créer le dossier SSL
sudo mkdir -p /etc/nginx/ssl

# Copier vos certificats
sudo cp votre-certificat.crt /etc/nginx/ssl/la-piazzola.com.crt
sudo cp votre-cle-privee.key /etc/nginx/ssl/la-piazzola.com.key
sudo cp votre-certificat-admin.crt /etc/nginx/ssl/admin.la-piazzola.com.crt
sudo cp votre-cle-privee-admin.key /etc/nginx/ssl/admin.la-piazzola.com.key

# Permissions sécurisées
sudo chmod 600 /etc/nginx/ssl/*.key
sudo chmod 644 /etc/nginx/ssl/*.crt
```

## 🔥 Configuration du Firewall

### Ubuntu/Debian (UFW)

```bash
# Installation d'UFW
sudo apt install ufw -y

# Configuration des règles
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activation du firewall
sudo ufw enable

# Vérification
sudo ufw status
```

### CentOS/RHEL (Firewalld)

```bash
# Activation du firewall
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Configuration des règles
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp

# Rechargement
sudo firewall-cmd --reload

# Vérification
sudo firewall-cmd --list-all
```

## 📊 Monitoring et Logs

### Configuration des logs

```bash
# Créer les dossiers de logs
sudo mkdir -p /var/log/nginx/piazzola

# Permissions
sudo chown -R nginx:nginx /var/log/nginx/piazzola
```

### Rotation des logs

```bash
# Créer la configuration de rotation
sudo nano /etc/logrotate.d/piazzola

# Contenu :
/var/log/nginx/piazzola/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        systemctl reload nginx
    endscript
}
```

## 🔍 Vérification de l'installation

### 1. Test de la configuration

```bash
# Vérifier la syntaxe
sudo nginx -t

# Tester les endpoints
curl -I http://localhost/health
curl -I https://la-piazzola.com
curl -I https://admin.la-piazzola.com
```

### 2. Test des redirections

```bash
# Vérifier la redirection HTTP vers HTTPS
curl -I http://la-piazzola.com
# Doit retourner 301 vers https://

curl -I http://admin.la-piazzola.com
# Doit retourner 301 vers https://
```

### 3. Test des API

```bash
# Test des backends
curl http://localhost:50001/test
curl http://localhost:50002/health

# Test via Nginx
curl https://admin.la-piazzola.com/api/test
curl https://la-piazzola.com/api/health
```

## 🛠️ Commandes utiles

```bash
# Redémarrer Nginx
sudo systemctl restart nginx

# Recharger la configuration
sudo systemctl reload nginx

# Voir les logs en temps réel
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Vérifier le statut
sudo systemctl status nginx

# Tester la configuration
sudo nginx -t
```

## 🔧 Optimisations

### 1. Performance

```bash
# Ajuster le nombre de workers selon les CPU
# Dans /etc/nginx/nginx.conf, modifier :
# worker_processes auto; (ou un nombre spécifique)

# Optimiser les buffers
# Ajouter dans http {} :
client_body_buffer_size 128k;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;
```

### 2. Sécurité

```bash
# Masquer la version d'Nginx
# Dans /etc/nginx/nginx.conf, ajouter dans http {} :
server_tokens off;

# Limiter les requêtes
# Déjà configuré dans nginx-vps.conf
```

## 🚨 Dépannage

### Problèmes courants

1. **Erreur 502 Bad Gateway**
   ```bash
   # Vérifier que les services Docker sont démarrés
   docker ps
   
   # Vérifier les logs Nginx
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Certificats SSL expirés**
   ```bash
   # Renouveler les certificats Let's Encrypt
   sudo certbot renew
   
   # Recharger Nginx
   sudo systemctl reload nginx
   ```

3. **Permissions sur les certificats**
   ```bash
   # Corriger les permissions
   sudo chmod 600 /etc/nginx/ssl/*.key
   sudo chmod 644 /etc/nginx/ssl/*.crt
   sudo chown root:root /etc/nginx/ssl/*
   ```

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `sudo tail -f /var/log/nginx/error.log`
2. Testez la configuration : `sudo nginx -t`
3. Vérifiez le statut : `sudo systemctl status nginx`
4. Consultez la documentation officielle d'Nginx
