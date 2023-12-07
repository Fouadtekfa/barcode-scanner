# Client
## Rappel du Sujet

Ce TP vise à la création d'une application d'achat d'objets, offrant une polyvalence d'utilisation et intégrant le système de paiement Stripe. Les utilisateurs ont la possibilité de scanner des codes-barres pour ajouter des articles au panier ou d'effectuer des ajouts manuels lorsque l'accès à la caméra n'est pas disponible. L'application interagit avec une API dédiée pour vérifier la disponibilité des articles.

Le panier de l'application offre une expérience complète, permettant aux utilisateurs de visualiser les articles scannés, de les ajuster en termes de quantité, de les supprimer si nécessaire et de procéder à un paiement sécurisé grâce à l'intégration du système Stripe. La sauvegarde locale du panier garantit aux utilisateurs la persistance de leurs sélections pour des achats futurs. Un historique des articles payés a également été envisagé pour offrir une traçabilité des transactions.

Sur le plan technique, le projet repose sur une structure utilisant une API FastAPI dédiée à l'intégration du système de paiement Stripe du côté serveur. Côté client, une application React Native est mise en place, exploitant la bibliothèque Expo.SQLite pour assurer la persistance des données. Cette approche permet de sauvegarder des informations cruciales telles que la quantité et l'identifiant de chaque article directement dans la base de données SQLite côté client.

Pour améliorer l'expérience utilisateur, un thème jour/nuit a été intégré, offrant une personnalisation visuelle en fonction des préférences de l'utilisateur.

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


 ### Travail Réalisé

 ### Navigateur principal

 ![capteure1](./capture/theme_jour/Navigation.png) 

 ### Thème Jour/Nuit

   Le choix du thème jour/nuit s'effectue depuis la page d'accueil en cliquant sur le bouton "Activer le Mode Jour". De même, lorsque l'application est en mode jour, il est possible d'activer le mode nuit en un simple clic.

   <img src="./capture/theme_jour/capture_1.jpg" width="300">
   <img src="./capture/theme_nuit/capture_1.jpg" width="300">
   </br>

### Scan de Codes-Barres
La page de scan des codes-barres assure la numérisation et la vérification. Chaque code-barres scanné génère un identifiant unique associé à un article. La première vérification s'effectue côté serveur via l'API, confirmant ainsi l'existence de l'article. En cas de correspondance, la page effectue une seconde vérification côté client dans la base de données SQLite pour déterminer si l'article est déjà présent dans le panier. Si c'est le cas, la quantité est mise à jour ; sinon, l'article est ajouté avec une quantité de 1. En revanche, si aucune correspondance n'est trouvée côté serveur, une alerte indique que l'article n'existe pas.

Pour tester le scan d'articles générant des identifiants, utilisez le fichier [exemple_cod_93.pdf.](./capture/exemple_cod_93.pdf)

   <img src="./capture/theme_jour/capture_2.jpg" width="300">
    <br>


 vérification via l'API : 
 
  
  <img src="./capture/theme_jour/capture_4.jpg" width="300"> <br>

Vérification Côté Client dans la Base de Données SQLite : 

  <img src="./capture/theme_jour/capture_5.jpg" width="300">   
  <img src="./capture/theme_jour/capture_6.jpg" width="300"> <br>

#### Ajout Manuel des Articles

En cas d'indisponibilité de l'appareil photo, une fonctionnalité d'ajout manuel a été mise en place. Cette fonctionnalité permet aux utilisateurs d'ajouter des articles en saisissant manuellement les identifiants. Les mêmes vérifications que pour le scan de codes-barres sont appliquées pour garantir la cohérence des données.

 <img src="./capture/theme_nuit/capture_6.jpg" width="300"><br>

### Gestion du Panier

Le panier regroupe tous les articles scannés, offrant la flexibilité de retirer des articles, d'ajuster les quantités, et de procéder au paiement sécurisé via Stripe en appuyant sur le bouton "Payer". Un indicateur informe du nombre d'articles identiques ajoutés, facilitant la gestion. Les données du panier, incluant les quantités et les identifiants, sont sauvegardées côté client grâce à Expo SQLite.

Pour une gestion fine, des boutons "+" et "-" permettent d'ajuster les quantités. Si la quantité atteint zéro, l'article est automatiquement supprimé du panier. De plus, un bouton dédié permet de supprimer directement l'article du panier.


Pour tester le paiement, utilisez le numéro de carte 4242 4242 4242...

 <img src="./capture/theme_jour/capture_10.jpg" width="300"><br>
 <img src="./capture/theme_jour/capture_11.jpg" width="300"> <br>
 <img src="./capture/theme_jour/capture_12.jpg" width="300"><br>

### Historique des Articles Payés

 L'historique des articles payés fournit aux utilisateurs une trace de leurs transactions passées, améliorant la transparence et la gestion des achats. Cet historique inclut des détails tels que l'identifiant de paiement, l'identifiant du client, le montant total payé, la date du paiement, ainsi que la liste des articles inclus dans la transaction. Les données des paiements sont récupérées à partir de l'API associée à l'identifiant de l'utilisateur actuel.

La liste des paiements est mise à jour en temps réel grâce à une fonction de rafraîchissement, accessible par un simple geste de tirer vers le bas. Seuls les paiements vérifiés, associés à l'identifiant du client, sont inclus dans la liste,

 <img src="./capture/theme_nuit/capture_2.jpg" width="300">

<img src="./capture/theme_jour/capture_15.jpg" width="300">


 ### 

 Pour une vision plus détaillée de ma réalisation, je vous invite à explorer le répertoire  [**capture**](./capture) où vous trouverez des captures d'écran détaillées, couvrant les diverses fonctionnalités et thèmes demandés.


