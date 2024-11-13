FROM php:8.2-apache

# Install dependencies and PostgreSQL extensions
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Install PHP extensions (PDO for PostgreSQL and zip for Laravel)
RUN docker-php-ext-install pdo_pgsql zip

# Add ServerName directive to avoid Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set Apache document root to the Laravel public folder
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf


# Copy application files into the container
COPY . /var/www/html

# Set working directory to the application folder
WORKDIR /var/www/html

# Install Composer
RUN curl -sS https://getcomposer.org/installer -o composer-installer.php && \
    php composer-installer.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-installer.php

# Install PHP dependencies using Composer
RUN composer install

# Set proper permissions for Laravel storage and cache folders
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose the necessary port for Apache (port 80)
EXPOSE 80

# Command to run Apache in the foreground
CMD ["apache2-foreground"]
