FROM php:8.2-cli-alpine

# Instala suporte PDO para PostgreSQL e MySQL no container do Railway (além do SQLite já nativo)
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql

WORKDIR /app
COPY . /app

# Garante permissão de escrita na pasta database para o banco SQLite
RUN mkdir -p /app/database && chmod -R 777 /app/database

EXPOSE 8080

# Mantém o servidor web PHP ativo continuamente na porta 8080 (ou $PORT do Railway)
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t /app /app/router.php"]
