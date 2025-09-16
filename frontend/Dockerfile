FROM nginx:alpine

# Copie des fichiers frontend
COPY . /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Création des dossiers nécessaires
RUN mkdir -p /usr/share/nginx/html/static/icons

# Permissions
RUN chmod -R 755 /usr/share/nginx/html

# Exposition des ports
EXPOSE 80 443

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]