# Utilisation d'une image légère de Node.js
FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code
COPY . .

# Construction de l'application
RUN npm run build

# Exposition du port
EXPOSE 3000

# Lancement de l'application
CMD ["npm", "start"]