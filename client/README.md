# Client

## Configuration de l'application

Avant de lancer l'application, assurez-vous de suivre attentivement ces étapes :

1. **Création du fichier `.env` :**

   Avant de démarrer l'application, vous devez créer un fichier `.env` dans le répertoire client. Utilisez la commande suivante pour le créer :

   ```shell
   touch client/.env
   ```

2. **Configuration de la variable `USER_ID` :**

   ```env
   USER_ID=1254582568
   ```

   Remplacez `1254582568` par l'ID utilisateur réel 

3. **Adresse IP :**

   Il est essentiel de connaître l'adresse IP de votre machine sur le réseau, car l'émulateur a son propre réseau, différent de localhost. Obtenez cette adresse en utilisant la commande :

   ```shell
   ip a # ou ipconfig ou ifconfig
   ```

4. **Installation des dépendances :**

   Exécutez la commande suivante pour installer les dépendances nécessaires :

   ```shell
   npm i
   ```

5. **Lancement de l'application :**

   Utilisez la commande suivante pour démarrer l'application en spécifiant les variables d'environnement nécessaires :

   ```shell
   API_URL={API_URL} STRIPE_PK={STRIPE_PK} npm run android
   ```

   La clé publique `STRIPE_PK` est disponible depuis le tableau de bord de Stripe.