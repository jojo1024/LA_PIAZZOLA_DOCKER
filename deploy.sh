#!/bin/bash

# Script de déploiement PIAZZOLA
# Usage: ./deploy.sh [start|stop|restart|build|logs]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Le fichier $ENV_FILE n'existe pas"
        log_info "Copiez env.production.example vers .env.production et configurez-le"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Construction des images
build_images() {
    log_info "Construction des images Docker..."
    
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    log_success "Images construites avec succès"
}

# Démarrage des services
start_services() {
    log_info "Démarrage des services..."
    
    docker-compose -f $COMPOSE_FILE up -d
    
    log_success "Services démarrés"
    
    # Attendre que les services soient prêts
    log_info "Attente du démarrage des services..."
    sleep 30
    
    # Vérifier l'état des services
    check_services_health
}

# Arrêt des services
stop_services() {
    log_info "Arrêt des services..."
    
    docker-compose -f $COMPOSE_FILE down
    
    log_success "Services arrêtés"
}

# Redémarrage des services
restart_services() {
    log_info "Redémarrage des services..."
    
    stop_services
    start_services
}

# Vérification de la santé des services
check_services_health() {
    log_info "Vérification de la santé des services..."
    
    # Vérifier MySQL
    if docker-compose -f $COMPOSE_FILE exec -T mysql mysqladmin ping -h localhost --silent; then
        log_success "MySQL est opérationnel"
    else
        log_error "MySQL n'est pas opérationnel"
    fi
    
    # Vérifier les backends
    if curl -f http://localhost:50001/test > /dev/null 2>&1; then
        log_success "Backend Admin est opérationnel"
    else
        log_warning "Backend Admin n'est pas encore prêt"
    fi
    
    if curl -f http://localhost:50002/health > /dev/null 2>&1; then
        log_success "Backend Website est opérationnel"
    else
        log_warning "Backend Website n'est pas encore prêt"
    fi
    
    # Vérifier les frontends
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        log_success "Frontend Admin est opérationnel"
    else
        log_warning "Frontend Admin n'est pas encore prêt"
    fi
    
    if curl -f http://localhost:3002 > /dev/null 2>&1; then
        log_success "Frontend Website est opérationnel"
    else
        log_warning "Frontend Website n'est pas encore prêt"
    fi
}

# Affichage des logs
show_logs() {
    log_info "Affichage des logs..."
    
    docker-compose -f $COMPOSE_FILE logs -f
}

# Nettoyage
cleanup() {
    log_info "Nettoyage des ressources Docker..."
    
    docker system prune -f
    docker volume prune -f
    
    log_success "Nettoyage terminé"
}

# Sauvegarde de la base de données
backup_database() {
    log_info "Sauvegarde de la base de données..."
    
    BACKUP_DIR="./backups"
    BACKUP_FILE="$BACKUP_DIR/piazzola_$(date +%Y%m%d_%H%M%S).sql"
    
    mkdir -p $BACKUP_DIR
    
    docker-compose -f $COMPOSE_FILE exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > $BACKUP_FILE
    
    log_success "Sauvegarde créée: $BACKUP_FILE"
}

# Restauration de la base de données
restore_database() {
    if [ -z "$1" ]; then
        log_error "Veuillez spécifier le fichier de sauvegarde"
        exit 1
    fi
    
    log_info "Restauration de la base de données depuis $1..."
    
    docker-compose -f $COMPOSE_FILE exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < $1
    
    log_success "Restauration terminée"
}

# Affichage de l'aide
show_help() {
    echo "Script de déploiement PIAZZOLA"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes:"
    echo "  start     - Démarrer tous les services"
    echo "  stop      - Arrêter tous les services"
    echo "  restart   - Redémarrer tous les services"
    echo "  build     - Construire les images Docker"
    echo "  logs      - Afficher les logs en temps réel"
    echo "  health    - Vérifier la santé des services"
    echo "  backup    - Sauvegarder la base de données"
    echo "  restore   - Restaurer la base de données (usage: $0 restore fichier.sql)"
    echo "  cleanup   - Nettoyer les ressources Docker"
    echo "  help      - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 start"
    echo "  $0 build && $0 start"
    echo "  $0 backup"
    echo "  $0 restore backups/piazzola_20250101_120000.sql"
}

# Chargement des variables d'environnement
# if [ -f "$ENV_FILE" ]; then
#     export $(cat $ENV_FILE | grep -v '^#' | xargs)
# fi
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
fi


# Gestion des commandes
case "${1:-help}" in
    start)
        check_prerequisites
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        check_prerequisites
        restart_services
        ;;
    build)
        check_prerequisites
        build_images
        ;;
    logs)
        show_logs
        ;;
    health)
        check_services_health
        ;;
    backup)
        check_prerequisites
        backup_database
        ;;
    restore)
        check_prerequisites
        restore_database $2
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        show_help
        ;;
esac
