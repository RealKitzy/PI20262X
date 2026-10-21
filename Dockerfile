FROM php:8.2-cli-alpine

WORKDIR /app
COPY . /app

# Garante permissão de escrita na pasta database para o banco SQLite (já nativo na imagem oficial do PHP)
RUN mkdir -p /app/database && chmod -R 777 /app/database

EXPOSE 8080

# Mantém o servidor web PHP ativo continuamente na porta 8080 (ou $PORT do Railway)
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t /app"]
