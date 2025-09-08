# Use Node.js Alpine para uma imagem mais leve
FROM node:18-alpine

# Definir informações do maintainer
LABEL maintainer="CorpNexus"
LABEL description="Nexa Documentation - Static site served with http-server"
LABEL version="1.0.0"

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install --only=production && \
    npm cache clean --force

# Copiar todos os arquivos do site
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor a porta 3000
EXPOSE 3000

# Comando de saúde para verificar se o container está funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar o servidor
CMD ["npm", "start"]