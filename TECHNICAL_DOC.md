# Documentation Technique - Quoicoubapp

Ce document décrit les aspects techniques de l'application Quoicoubapp, une application web qui utilise la reconnaissance vocale pour détecter des mots-clés et jouer des sons amusants aléatoires en réponse.

## Architecture de l'application

### Structure des fichiers

```
Quoicoubapp/
├── index.html         # Page principale de l'application
├── manifest.json      # Manifeste pour la fonctionnalité PWA
├── sw.js              # Service Worker pour le fonctionnement hors ligne
├── assets/
│   └── images/        # Icônes et captures d'écran pour PWA
│       ├── icon.png
│       ├── adaptive-icon.png
│       └── screenshot1.svg
└── sounds/            # Dossiers contenant les sons par catégorie
    ├── quoicoubeh/    # Sons pour "Quoi ?"
    ├── apanyans/      # Sons pour "Hein ?"
    ├── pourquoicarabinga/ # Sons pour "Pourquoi ?"
    ├── commandantdebord/  # Sons pour "Comment ?"
    └── quiquiriqui/   # Sons pour "Qui ?"
```

### Technologies utilisées

- **HTML/CSS/JavaScript vanilla** : Pas de framework ou bibliothèque externe
- **Web Speech API** : Pour la reconnaissance vocale en continu
- **Service Worker API** : Pour le fonctionnement hors ligne et la mise en cache
- **Web App Manifest** : Pour la fonctionnalité PWA

## Fonctionnement principal

### Reconnaissance vocale

L'application utilise l'API Web Speech (SpeechRecognition) pour écouter en continu les paroles de l'utilisateur. Voici le processus :

1. Initialisation de la reconnaissance vocale via `SpeechRecognition` ou `webkitSpeechRecognition`
2. Configuration des options : `continuous: true`, `interimResults: true`
3. Traitement des résultats avec l'événement `onresult`
4. Analyse du texte pour détecter les mots-clés
5. Arrêt temporaire de la reconnaissance lors de la détection d'un mot-clé
6. Lecture du son correspondant
7. Reprise automatique de la reconnaissance après la lecture

### Gestion des sons aléatoires

La sélection aléatoire des sons est gérée par un mécanisme de mapping explicite :

```javascript
// Mapping des mots-clés vers les dossiers de sons
const soundMapping = {
    'quoi': 'quoicoubeh',
    'hein': 'apanyans',
    'pourquoi': 'pourquoicarabinga',
    'comment': 'commandantdebord',
    'qui': 'quiquiriqui'
};

// Définition des sons disponibles pour chaque mot-clé
const availableSounds = {
    'quoi': [
        './sounds/quoicoubeh/quoicoubeh1.mp3',
        './sounds/quoicoubeh/quoicoubeh2.mp3',
        // etc.
    ],
    // autres catégories...
};
```

Lorsqu'un mot-clé est détecté, l'application :
1. Identifie la catégorie de son correspondante
2. Sélectionne un fichier aléatoire dans la liste des sons disponibles
3. Charge et joue ce fichier audio

### Détection de mots-clés

La détection des mots-clés utilise différentes stratégies :

1. **Vérification simple** pour "quoi", "pourquoi", "comment" et "qui" avec `includes()`
2. **Expressions régulières** pour détecter les mots se terminant par les sons nasaux comme "in" :
   ```javascript
   /(\s|^)(bien|rien|fin|vin|...)(\s|$|\.|\?|\!)/i.test(transcript)
   ```
3. **Ordre de vérification important** : "pourquoi" est vérifié avant "quoi", et "qui" avant "quoi" pour éviter les faux positifs

### Cycle d'écoute

Le cycle complet d'interaction est le suivant :
1. Démarrage de l'écoute (manuel via bouton ou automatique)
2. Détection d'un mot-clé
3. Arrêt temporaire de l'écoute
4. Lecture du son aléatoire correspondant
5. Reprise automatique de l'écoute après la fin du son

## Fonctionnalités PWA

### Manifeste

Le fichier `manifest.json` définit :
- Nom, description et icônes de l'application
- Couleurs de thème et d'arrière-plan
- Mode d'affichage (standalone)
- Orientation préférée (portrait)

### Service Worker

Le service worker (`sw.js`) gère :
- La mise en cache des ressources essentielles lors de l'installation
- L'interception des requêtes réseau pour servir les fichiers depuis le cache
- La mise en cache dynamique des nouvelles ressources
- La gestion du mode hors ligne

## Comportement mobile et PWA

### Adaptations mobiles

- Styles adaptatifs avec media queries pour les petits écrans
- Gestion des interactions tactiles avec feedback haptique (vibrations)
- Désactivation du défilement et du pull-to-refresh
- Optimisations pour éviter les sélections de texte non désirées

### Installation PWA

L'application peut être installée comme une PWA sur :
- Appareils Android via Chrome
- iOS via Safari (ajout à l'écran d'accueil)

### Création d'APK

Pour créer un APK Android à partir de cette PWA :
1. Déployer l'application sur un serveur HTTPS
2. Utiliser PWA Builder (https://www.pwabuilder.com/)
3. Entrer l'URL de l'application
4. Suivre les instructions pour générer l'APK

## Gestion des permissions

### Microphone

La permission du microphone est gérée de manière simplifiée pour éviter les demandes répétées :
- L'application initialise directement la reconnaissance vocale sans vérification préalable
- Le navigateur se charge de demander la permission si nécessaire
- Une fois accordée, la permission est conservée pour les utilisations suivantes

### Stratégie de gestion des erreurs

Des gestionnaires d'erreurs sont implémentés pour :
- Problèmes de permission du microphone
- Erreurs de reconnaissance vocale
- Problèmes de lecture audio
- Changement de visibilité de l'application (pour économiser la batterie)

## Optimisation des performances

### Préchargement

- Les éléments audio sont préchargés avec `preload="auto"`
- Un test initial est effectué au démarrage pour vérifier la disponibilité des sons

### Gestion des événements

- Les gestionnaires d'événements sont optimisés pour éviter les fuites mémoire
- Les écouteurs d'événements sont correctement nettoyés lors des changements d'état

## Extensibilité

L'architecture permet d'étendre facilement l'application :
- Ajout de nouveaux sons dans les dossiers appropriés
- Ajout de nouveaux mots-clés en étendant les objets `soundMapping` et `availableSounds`
- Personnalisation des styles via CSS