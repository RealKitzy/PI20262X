FROM php:8.2-apache

# Instala extensões PDO para SQLite e MySQL/MariaDB
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Copia os arquivos da aplicação para o diretório público do Apache
COPY . /var/www/html/

# Garante permissão de escrita na pasta database para o banco SQLite
RUN chown -R www-data:www-data /var/www/html/database \
    && chmod -R 775 /var/www/html/database

# Ajusta dinamicamente a porta do Apache para a variável $PORT do Railway (ou 80 por padrão)
CMD sh -c "sed -i \"s/80/\${PORT:-80}/g\" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf && apache2-foreground"
