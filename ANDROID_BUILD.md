# Création d'un APK pour Quoicoubapp

Ce document explique comment créer un APK Android à partir de l'application web Quoicoubapp.

## Méthode 1 : Utiliser PWA Builder (Recommandé)

PWA Builder est un service en ligne qui convertit facilement les Progressive Web Apps (PWA) en applications natives pour Android, iOS et autres plateformes.

### Étapes préparatoires (déjà réalisées)

1. ✅ Conversion de l'application en PWA :
   - Ajout du fichier `manifest.json` avec les paramètres corrects
   - Ajout du service worker `sw.js` avec mise en cache des ressources
   - Mise à jour du code HTML pour intégrer les éléments PWA
   - Configuration des chemins relatifs pour compatibilité

### Étapes pour générer l'APK avec PWA Builder

1. **Héberger l'application** :
   - Publiez l'application web sur un serveur avec HTTPS
   - Options d'hébergement gratuites : GitHub Pages, Netlify, Vercel
   - Assurez-vous que le manifeste et les images sont correctement accessibles

2. **Utiliser PWA Builder** :
   - Accédez à [PWA Builder](https://www.pwabuilder.com/)
   - Entrez l'URL de votre application hébergée
   - Analysez votre PWA pour vérifier sa conformité
   - Suivez les recommandations pour améliorer votre PWA si nécessaire

3. **Générer l'APK** :
   - Cliquez sur "Build" pour Android
   - Configurez les options d'application :
     - Nom de package : `com.tontonstudio.quoicoubapp`
     - Version : `1.1.0`
     - Nom de l'application : `Quoicoubapp`
   - Téléchargez le package généré

4. **Personnalisation avancée** (optionnel) :
   - Vous pouvez modifier le code source généré par PWA Builder
   - Ouvrez le projet dans Android Studio
   - Assurez-vous que les permissions du microphone sont correctement configurées
   - Apportez les modifications nécessaires
   - Générez un nouvel APK via Android Studio

## Méthode 2 : Utiliser Expo pour réactiver la version mobile

Puisque le projet contient déjà une version React Native avec Expo, vous pouvez l'utiliser pour générer un APK.

### Étapes pour générer l'APK avec Expo

1. **Configurer EAS Build** :
   ```bash
   # Installez EAS CLI
   npm install -g eas-cli
   
   # Connectez-vous à votre compte Expo
   eas login
   
   # Configurez votre projet
   eas build:configure
   ```

2. **Créer un build Android** :
   ```bash
   # Lancez un build pour Android
   eas build -p android --profile preview
   ```

3. **Télécharger l'APK** :
   - Une fois le build terminé, Expo vous fournira un lien de téléchargement
   - Téléchargez l'APK et installez-le sur votre appareil

## Méthode 3 : Utiliser Web2APK (Alternative simple)

Si les autres méthodes sont trop complexes, plusieurs services en ligne permettent de convertir des sites web en APK.

### Étapes pour utiliser Web2APK

1. **Choisir un service** :
   - [AppsGeyser](https://appsgeyser.com/)
   - [GoNative](https://gonative.io/)
   - [WebViewGold](https://webviewgold.com/)

2. **Créer l'APK** :
   - Entrez l'URL de votre site web
   - Personnalisez les paramètres de l'application
   - Générez et téléchargez l'APK

## Amélioration pour les sons aléatoires

La nouvelle version 1.1.0 inclut la prise en charge de sons aléatoires. Lors de la création de l'APK, assurez-vous que :

1. **Tous les fichiers sons sont inclus** :
   - Vérifiez que tous les dossiers sous `/sounds/` sont correctement inclus dans le package
   - Si nécessaire, modifiez le fichier AssetManager pour inclure tous les sons

2. **Les permissions sont correctes** :
   - L'API Web Speech nécessite des permissions pour le microphone
   - Vérifiez que le manifeste Android généré inclut la permission :
     ```xml
     <uses-permission android:name="android.permission.RECORD_AUDIO" />
     ```

3. **Le cache est configuré correctement** :
   - Les nouveaux sons ajoutés doivent être mis en cache par le service worker
   - Vérifiez que la stratégie de mise en cache du service worker est correcte

## Conseils pour de meilleures performances

1. **Optimisez les fichiers audio** :
   - Compressez les fichiers MP3 pour réduire la taille de l'application
   - Assurez-vous que tous les fichiers audio ont un bitrate raisonnable (128kbps est suffisant)

2. **Gestion des permissions** :
   - La demande d'accès au microphone a été simplifiée pour éviter les problèmes
   - Si des problèmes persistent sur certains appareils Android, vérifiez les logs et adapté le code

3. **Test complet** :
   - Testez l'application sur plusieurs appareils Android
   - Vérifiez que la reconnaissance vocale fonctionne correctement
   - Assurez-vous que les sons aléatoires sont bien joués

## Test de l'application

Après avoir généré l'APK, testez-le sur différents appareils Android pour vérifier :

1. La demande de permission du microphone (une seule fois)
2. Le fonctionnement de la reconnaissance vocale pour tous les mots-clés
3. La lecture correcte et aléatoire des sons
4. L'adaptation de l'interface utilisateur à différentes tailles d'écran
5. Le fonctionnement hors ligne (après avoir visité toutes les pages au moins une fois)