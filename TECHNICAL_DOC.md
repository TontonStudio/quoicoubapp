# Documentation Technique Quoicoubapp

## Vue d'ensemble

Quoicoubapp est une application web qui utilise la reconnaissance vocale (Web Speech API) pour détecter des mots-clés spécifiques et jouer des sons amusants en réponse. L'application fonctionne entièrement côté client, sans dépendance serveur autre que pour servir les fichiers statiques.

## Architecture

### Version 1.2.0+ (Architecture modulaire)

La version 1.2.0 a été restructurée avec une architecture modulaire pour améliorer les performances et faciliter la maintenance :

```
Quoicoubapp/
├── css/
│   └── styles.css            # Styles CSS séparés
├── js/
│   ├── config.js             # Configuration et constantes
│   ├── audio-cache.js        # Système de préchargement audio
│   ├── speech-manager.js     # Gestion de la reconnaissance vocale
│   ├── sound-manager.js      # Lecture des sons
│   ├── ui-manager.js         # Interface utilisateur
│   └── app.js                # Point d'entrée et orchestration
├── dist/                     # Version compilée et minifiée
│   ├── index.html            # HTML optimisé
│   ├── quoicoubapp.min.js    # JavaScript combiné et minifié
│   └── styles.css            # CSS optimisé
├── sounds/                   # Fichiers audio organisés par catégorie
│   ├── apanyans/             # Sons pour "Hein ?"
│   ├── commandantdebord/     # Sons pour "Comment ?"
│   ├── pourquoicarabinga/    # Sons pour "Pourquoi ?"
│   ├── quiquiriqui/          # Sons pour "Qui ?"
│   └── quoicoubeh/           # Sons pour "Quoi ?"
├── index.html                # Version standard
├── index-modular.html        # Version avec architecture modulaire
├── manifest.json             # Manifeste PWA
└── sw.js                     # Service Worker pour le support hors ligne
```

### Communication entre les modules

L'application utilise un modèle de communication basé sur les callbacks et les événements :

1. `App` initialise les différents gestionnaires et configure les callbacks
2. `SpeechManager` détecte les mots-clés et notifie `App` via callback
3. `App` demande à `SoundManager` de jouer un son correspondant
4. `SoundManager` notifie `App` lorsque la lecture est terminée
5. `App` met à jour l'interface via `UIManager` et relance l'écoute

## Composants principaux

### 1. Configuration (config.js)

Points clés :
- Expressions régulières précompilées pour la détection des mots-clés
- Mapping des mots-clés vers les fichiers audio
- Paramètres de configuration pour la reconnaissance vocale
- Gestion des délais et temporisations

### 2. Gestionnaire de cache audio (audio-cache.js)

Points clés :
- Préchargement intelligent des fichiers audio
- Cache à plusieurs niveaux pour réduire la latence
- Chargement prioritaire des sons principaux
- Chargement en arrière-plan des sons secondaires

### 3. Gestionnaire de reconnaissance vocale (speech-manager.js)

Points clés :
- Initialisation optimisée de l'API Web Speech
- Détection efficace des mots-clés avec expressions régulières
- Gestion des erreurs et tentatives de reconnexion
- Mécanisme anti-double détection

### 4. Gestionnaire de sons (sound-manager.js)

Points clés :
- Lecture des sons depuis le cache
- Sélection aléatoire des sons par catégorie
- Gestion des événements de lecture audio
- Prévention des lectures simultanées

### 5. Gestionnaire de l'interface utilisateur (ui-manager.js)

Points clés :
- Mise à jour de l'état visuel de l'application
- Gestion des retours tactiles (vibration)
- Affichage des messages d'erreur
- Interface réactive et adaptative

### 6. Application principale (app.js)

Points clés :
- Orchestration des différents composants
- Gestion du cycle de vie de l'application
- Adaptation aux différents environnements (PWA, WebView)
- Optimisation des ressources système

## Version compilée

Pour une performance maximale, l'application propose une version compilée et minifiée dans le dossier `dist/`. Cette version :

1. Combine tous les fichiers JavaScript en un seul pour réduire les requêtes HTTP
2. Minifie le code pour réduire la taille des fichiers
3. Optimise les références pour un chargement plus rapide

Pour générer cette version :
```bash
./combine-js.sh
```

## API Web Speech

L'application utilise l'API Web Speech pour la reconnaissance vocale :

- `SpeechRecognition` : Interface principale pour la reconnaissance
- `continuous: true` : Permet une écoute continue
- `interimResults: true` : Améliore la réactivité de détection
- `maxAlternatives: 1` : Limite les résultats pour optimiser les performances

### Limitations et contraintes

- Nécessite une connexion HTTPS ou localhost
- Nécessite une autorisation d'accès au microphone
- Performance variable selon les navigateurs (Chrome recommandé)
- Sur iOS, nécessite une interaction utilisateur pour initialiser l'audio

## Sécurité

- L'application fonctionne entièrement côté client
- Pas de transmission de données à un serveur
- Les autorisations microphone sont gérées par le navigateur
- Le service worker ne met en cache que les ressources locales

## Compatibilité

L'application est compatible avec :
- Chrome (Desktop et Android) - Support complet
- Safari (iOS) - Support avec quelques limitations
- Firefox - Support partiel
- Edge - Support complet

## Progressive Web App (PWA)

L'application est configurée comme une PWA :
- Manifeste pour l'installation sur l'écran d'accueil
- Service worker pour le fonctionnement hors ligne
- Icons pour différentes résolutions
- Thème et couleurs personnalisés

## Performances

La version 1.2.0 inclut plusieurs optimisations de performance :
- Préchargement audio intelligent
- Expressions régulières précompilées
- Réduction des délais entre les opérations
- Architecture modulaire efficace
- Version compilée pour une performance maximale

## Dépannage

### Problèmes courants

1. **Le microphone n'est pas détecté** :
   - Vérifier que l'autorisation est accordée dans les paramètres du navigateur
   - Utiliser Chrome pour une meilleure compatibilité
   - Vérifier que le site est servi en HTTPS ou depuis localhost

2. **Détection lente ou non réactive** :
   - Utiliser la version compilée (dist/index.html) pour de meilleures performances
   - Vérifier la qualité du microphone et le niveau sonore ambiant
   - Essayer de parler plus distinctement et plus près du microphone

3. **Sons qui ne se jouent pas** :
   - Sur iOS, interagir d'abord avec l'interface pour débloquer l'audio
   - Vérifier que les fichiers audio sont correctement placés dans les dossiers
   - Vérifier le volume du système

## Licence

Voir le fichier [LICENSE](LICENSE) pour les détails.