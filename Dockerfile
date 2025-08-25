# Base image
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libpng-dev \
    libonig-dev \ 
    libxml2-dev \
    nodejs \
    npm 

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copy existing app
COPY . .

# Install PHP dependencies
RUN composer install

# Install Node dependencies and build assets
RUN npm install && npm run build

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
