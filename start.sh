#!/bin/bash

# Script de inicialização para o container nexa-docs
# Autor: CorpNexus
# Versão: 1.0.0

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Função para parar containers existentes
stop_containers() {
    log "Parando containers existentes..."
    docker-compose down --remove-orphans
    success "Containers parados com sucesso"
}

# Função para construir e iniciar containers
start_containers() {
    log "Construindo e iniciando containers..."
    docker-compose up --build -d
    
    # Aguardar o container ficar saudável
    log "Aguardando container ficar saudável..."
    timeout=60
    counter=0
    
    while [ $counter -lt $timeout ]; do
        if docker-compose ps | grep -q "healthy"; then
            success "Container está saudável e funcionando!"
            break
        fi
        
        if [ $counter -eq $((timeout-1)) ]; then
            error "Timeout: Container não ficou saudável em ${timeout}s"
            docker-compose logs nexa-docs
            exit 1
        fi
        
        sleep 1
        counter=$((counter+1))
        echo -n "."
    done
    echo ""
}

# Função para mostrar logs
show_logs() {
    log "Mostrando logs do container..."
    docker-compose logs -f nexa-docs
}

# Função para mostrar status
show_status() {
    log "Status dos containers:"
    docker-compose ps
    echo ""
    log "Testando conectividade..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3010 | grep -q "200"; then
        success "Site está acessível em http://localhost:3010"
    else
        warning "Site pode não estar acessível ainda. Verifique os logs."
    fi
}

# Função para limpeza
cleanup() {
    log "Limpando recursos não utilizados..."
    docker system prune -f
    success "Limpeza concluída"
}

# Menu principal
case "${1:-start}" in
    "start")
        log "Iniciando Nexa Docs..."
        stop_containers
        start_containers
        show_status
        ;;
    "stop")
        log "Parando Nexa Docs..."
        stop_containers
        ;;
    "restart")
        log "Reiniciando Nexa Docs..."
        stop_containers
        start_containers
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Uso: $0 [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start    - Inicia os containers (padrão)"
        echo "  stop     - Para os containers"
        echo "  restart  - Reinicia os containers"
        echo "  logs     - Mostra logs em tempo real"
        echo "  status   - Mostra status dos containers"
        echo "  cleanup  - Limpa recursos não utilizados"
        echo "  help     - Mostra esta ajuda"
        ;;
    *)
        error "Comando inválido: $1"
        echo "Use '$0 help' para ver os comandos disponíveis"
        exit 1
        ;;
esac