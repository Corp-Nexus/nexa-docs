# Nexa Docs - Documentação

Site de documentação da plataforma Nexa, servido via Docker com http-server.

## 🚀 Visão Geral

Este projeto containeriza o site de documentação estático da Nexa para ser servido através do domínio `docs.corpnexus.com.br`. O site roda em um container Docker com Node.js e http-server, integrado com nginx como proxy reverso.

## 📋 Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Nginx configurado como proxy reverso no VPS
- Domínio `docs.corpnexus.com.br` apontando para o VPS

## 🛠️ Estrutura do Projeto

```
nexa-docs/
├── assets/                     # Imagens e recursos estáticos
├── catalogo/                   # Documentação do catálogo
├── css/                        # Estilos CSS
├── guia/                       # Guias do usuário
├── intro/                      # Páginas de introdução
├── js/                         # Scripts JavaScript
├── suporte/                    # Páginas de suporte
├── Dockerfile                  # Configuração do container
├── docker-compose.yml          # Orquestração do container
├── package.json                # Dependências Node.js
├── .dockerignore              # Arquivos ignorados no build
├── start.sh                   # Script de inicialização
├── nginx-config-example.conf  # Exemplo de configuração nginx
└── README.md                  # Este arquivo
```

## 🚀 Deploy Rápido

### 1. Clone e Configure

```bash
# No seu VPS, navegue até o diretório desejado
cd /opt/docker-apps/  # ou onde você mantém seus containers

# Clone ou copie os arquivos do projeto
# (assumindo que você já tem os arquivos no VPS)

# Torne o script executável
chmod +x start.sh
```

### 2. Inicie o Container

```bash
# Iniciar o container
./start.sh start

# Ou usando docker-compose diretamente
docker-compose up -d --build
```

### 3. Configure o Nginx

```bash
# Copie a configuração de exemplo
sudo cp nginx-config-example.conf /etc/nginx/sites-available/docs.corpnexus.com.br

# Ative o site
sudo ln -s /etc/nginx/sites-available/docs.corpnexus.com.br /etc/nginx/sites-enabled/

# Teste a configuração
sudo nginx -t

# Recarregue o nginx
sudo systemctl reload nginx
```

### 4. Configure SSL (Let's Encrypt)

```bash
# Instale o certbot se ainda não tiver
sudo apt install certbot python3-certbot-nginx

# Obtenha o certificado SSL
sudo certbot --nginx -d docs.corpnexus.com.br

# O certbot irá modificar automaticamente a configuração do nginx
```

## 📝 Comandos Disponíveis

O script `start.sh` oferece vários comandos úteis:

```bash
./start.sh start    # Inicia os containers (padrão)
./start.sh stop     # Para os containers
./start.sh restart  # Reinicia os containers
./start.sh logs     # Mostra logs em tempo real
./start.sh status   # Mostra status dos containers
./start.sh cleanup  # Limpa recursos não utilizados
./start.sh help     # Mostra ajuda
```

## 🔧 Configuração Detalhada

### Container Docker

- **Imagem Base**: `node:18-alpine`
- **Porta Interna**: `3000`
- **Servidor**: `http-server`
- **Usuário**: `nextjs` (não-root para segurança)
- **Health Check**: Verificação automática a cada 30s

### Nginx Proxy Reverso

O nginx no VPS deve estar configurado para:
- Redirecionar HTTP (80) para HTTPS (443)
- Fazer proxy das requisições para `localhost:3000`
- Servir com SSL/TLS moderno
- Aplicar headers de segurança
- Cache otimizado para arquivos estáticos

### Variáveis de Ambiente

O container usa as seguintes variáveis:
- `NODE_ENV=production`
- `TZ=America/Sao_Paulo`

## 🔍 Monitoramento e Logs

### Verificar Status

```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f nexa-docs

# Logs das últimas 100 linhas
docker-compose logs --tail=100 nexa-docs
```

### Health Check

O container possui health check automático que verifica se o servidor está respondendo:

```bash
# Verificar saúde do container
docker inspect nexa-docs --format='{{.State.Health.Status}}'

# Testar manualmente
curl -I http://localhost:3000
```

## 🛡️ Segurança

### Medidas Implementadas

- Container roda com usuário não-root
- Nginx com headers de segurança modernos
- SSL/TLS com configurações seguras
- HSTS habilitado
- Logs estruturados para auditoria

### Firewall

Certifique-se de que apenas as portas necessárias estão abertas:

```bash
# Permitir apenas HTTP/HTTPS externamente
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# A porta 3000 deve estar acessível apenas internamente (localhost)
```

## 🔄 Atualizações

### Atualizar o Site

1. Faça as alterações nos arquivos HTML/CSS/JS
2. Reconstrua o container:

```bash
./start.sh restart
```

### Atualizar Dependências

```bash
# Atualizar http-server
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker-compose logs nexa-docs

# Verificar se a porta está em uso
sudo netstat -tlnp | grep :3000

# Reconstruir sem cache
docker-compose build --no-cache
```

### Site não acessível

```bash
# Testar container diretamente
curl -I http://localhost:3000

# Verificar configuração nginx
sudo nginx -t

# Verificar logs do nginx
sudo tail -f /var/log/nginx/docs.corpnexus.com.br.error.log
```

### SSL não funciona

```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew --dry-run

# Verificar configuração SSL
openssl s_client -connect docs.corpnexus.com.br:443
```

## 📊 Performance

### Otimizações Implementadas

- Compressão gzip para arquivos estáticos
- Cache de longa duração para assets
- Container Alpine Linux (menor footprint)
- Health checks para disponibilidade

### Monitoramento

```bash
# Uso de recursos do container
docker stats nexa-docs

# Espaço em disco
docker system df
```

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça as alterações necessárias
2. Teste localmente com `./start.sh start`
3. Verifique se o site carrega corretamente
4. Documente as mudanças

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `./start.sh logs`
2. Teste o status: `./start.sh status`
3. Consulte a seção de troubleshooting
4. Entre em contato com a equipe técnica

## 📄 Licença

Este projeto é propriedade da CorpNexus.

---

**Versão**: 1.0.0  
**Última atualização**: 2025-01-08  
**Mantido por**: CorpNexus