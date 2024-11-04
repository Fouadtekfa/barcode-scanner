

# Barcode Scanner

|   Nom   | Prénom | 
|---------|--------|
|   TEKFA   |  Fouad  | 

## Technologies requises

Vous aurez besoin des technologies suivantes :
- [Android Studio](https://developer.android.com/studio "Android Studio") ainsi que la [JDK 20+](https://www.oracle.com/fr/java/technologies/downloads "JDK")
- [Docker](https://www.docker.com "Docker") Desktop ou CLI
- [NodeJS LTS](https://nodejs.org/fr "NodeJS")
- Un compte [Stripe](https://stripe.com/fr "Stripe")

## Travail réalisé

L'application développée permet l'achat d'objets variés en utilisant Stripe.

Elle comprend les pages/fonctionnalités suivantes :

- Scan de codes-barres
    - Accès au panier
    - Si l'appareil photo n'est pas disponible, ajout manuel des articles
    - Vérification via l'API pour confirmer l'existence de l'article
- Un panier
    - Contient l'ensemble des articles scannés
    - Accessible depuis la page de scan des articles
    - Possibilité de retirer un article scanné du panier
    - Indicateur du nombre d'un même article ajouté plusieurs fois
    - Possibilité d'augmenter la quantité d'un article déjà scanné
    - Paiement des articles sélectionnés via Stripe
    - Sauvegarde du panier pour de futurs achats
- Un historique des articles payés
- Un [thème jour/nuit](https://m2.material.io/design/color/dark-theme.html#ui-application)

Le projet est composé des éléments suivants :
- [Server](./server/README.md) : une API développée avec FastAPI pour intégrer Stripe.
- [Client](./client/README.md) : une application React Native où l'application est développée.

La persistance des données côté client est assurée par `Expo.SQLite`.

***Il est important de configurer le serveur avant le client.***

## Informations

Le projet a été créé avec la commande suivante :

```shell
npx create-expo-app -t expo-template-blank-typescript
```

Il est possible de lancer l'application dans un émulateur Android et/ou iOS :

```shell
npx expo run:android  # npx expo run:ios
```
