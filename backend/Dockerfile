FROM php:8.2-apache

# Install dependencies and PostgreSQL extensions
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \          
    zip \                 
    libpq-dev && \        
    rm -rf /var/lib/apt/lists/*  

# Enable mod_rewrite for Apache (required by Laravel)
RUN a2enmod rewrite

# Install PHP extensions (PDO for PostgreSQL, zip for Laravel)
RUN docker-php-ext-install pdo_pgsql pgsql zip

# Add ServerName directive to avoid Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set Apache document root to the Laravel public folder
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Update Apache config files to serve Laravel from the public folder
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy application files into the container (application source code)
COPY . /var/www/html

# Set working directory to the application folder
WORKDIR /var/www/html

# Install Composer (PHP package manager)
RUN curl -sS https://getcomposer.org/installer -o composer-installer.php && \
    php composer-installer.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-installer.php

# Install PHP dependencies using Composer (skip dev dependencies in production)
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions for Laravel's storage and cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Run Laravel artisan commands (e.g., migrate and jwt:secret)
RUN php artisan key:generate --force && \
    php artisan jwt:secret --force

# Expose Apache port (80)
EXPOSE 8000

# Command to run Apache in the foreground (default entry point for Apache)
CMD ["apache2-foreground"]
