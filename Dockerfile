FROM php:8.2-cli

# Instala SQLite e extensões PDO (SQLite e MySQL)
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

# Garante permissão de escrita na pasta database para o banco SQLite
RUN chmod -R 777 /app/database

EXPOSE 8080

# Mantém o servidor web PHP ativo continuamente na porta 8080 (ou $PORT do Railway)
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t /app"]
