# Quoicoubapp

Une application web ludique qui écoute en permanence et réagit à certains mots-clés en jouant des sons amusants aléatoires.

## Fonctionnalités

- Reconnaissance vocale en continu via l'API Web Speech
- Détection de mots-clés spécifiques avec sélection aléatoire de sons :
  - "Quoi ?" → Joue un son aléatoire du dossier "quoicoubeh"
  - "Pourquoi ?" → Joue un son aléatoire du dossier "pourquoicarabinga"
  - "Comment ?" → Joue un son aléatoire du dossier "commandantdebord"
  - "Hein ?" et mots similaires se terminant par le son "in" → Joue un son aléatoire du dossier "apanyans"
  - "Qui ?" → Joue un son aléatoire du dossier "quiquiriqui"
- Cycle automatique : détection, arrêt de l'écoute, lecture du son, reprise de l'écoute
- Interface minimaliste avec un seul bouton pour démarrer/arrêter l'écoute
- Compatible PWA pour création d'APK via PWA Builder
- Architecture modulaire pour de meilleures performances et maintenance

## Versions disponibles

L'application est disponible en trois versions :

1. **Version standard** : La version originale (index.html)
2. **Version modulaire** : Architecture optimisée (index-modular.html)
3. **Version compilée** : Haute performance, un seul fichier JS (dist/index.html)

Pour les appareils à faible puissance, la version compilée est recommandée.

## Comment ça marche

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Commencer l'écoute"
3. Prononcez l'un des mots-clés :
   - "Quoi ?"
   - "Hein ?" (ou un mot se terminant par le son "in" comme "bien", "vin", etc.)
   - "Pourquoi ?"
   - "Comment ?"
   - "Qui ?"
4. L'application jouera automatiquement un son aléatoire correspondant
5. L'écoute reprendra automatiquement après la lecture du son
6. Cliquez sur "Arrêter l'écoute" quand vous avez terminé

## Prérequis techniques

- Navigateur moderne supportant l'API Web Speech (Chrome recommandé)
- Autorisation d'accès au microphone
- Connexion HTTPS ou localhost pour la reconnaissance vocale

## Installation

1. Clonez ce dépôt GitHub
2. Servez les fichiers via un serveur HTTP (pour le développement, vous pouvez utiliser Node.js avec `http-server` ou Python avec `python -m http.server`)
3. Ouvrez l'application dans votre navigateur à l'adresse localhost

### Compilation pour production

Pour générer la version compilée à haute performance :

```bash
chmod +x combine-js.sh
./combine-js.sh
```

Cela créera une version optimisée dans le dossier `dist/`.

## Ajouter de nouveaux sons

Pour ajouter de nouveaux sons à l'application :

1. Placez vos fichiers MP3 dans le dossier correspondant au mot-clé :
   - `sounds/quoicoubeh/` pour "Quoi ?"
   - `sounds/apanyans/` pour "Hein ?"
   - `sounds/pourquoicarabinga/` pour "Pourquoi ?"
   - `sounds/commandantdebord/` pour "Comment ?"
   - `sounds/quiquiriqui/` pour "Qui ?"

2. Nommez vos fichiers en suivant le format du dossier, par exemple :
   - `quoicoubeh8.mp3`, `quoicoubeh9.mp3`, etc.
   - `apanyan11.mp3`, `apanyan12.mp3`, etc.

3. Les nouveaux sons seront automatiquement détectés et pourront être sélectionnés aléatoirement

## Architecture technique

La version optimisée (v1.2.0+) utilise une architecture modulaire :

- **config.js** : Configuration globale de l'application
- **audio-cache.js** : Gestion optimisée du préchargement audio
- **speech-manager.js** : Reconnaissance vocale et détection des mots-clés
- **sound-manager.js** : Lecture des sons avec cache multi-niveaux
- **ui-manager.js** : Interface utilisateur réactive
- **app.js** : Point d'entrée et orchestration des composants

Voir [README-OPTIMISATION.md](README-OPTIMISATION.md) pour plus de détails techniques.

## Détection des mots-clés

L'application est optimisée pour détecter plusieurs variations des mots-clés :

- Pour "Hein ?" - détecte également les mots se terminant par les sons nasaux comme "in", "ain", "ein" (ex: "bien", "main", "plein")
- Pour tous les mots-clés - détecte les mots avec ou sans point d'interrogation

## Version Progressive Web App (PWA)

L'application est configurée comme une PWA, ce qui permet :
- L'installation sur l'écran d'accueil des appareils mobiles
- Le fonctionnement hors ligne grâce au service worker
- La création d'APK Android via PWA Builder

## Version Flutter (Branche séparée)

Une version Flutter de cette application est également disponible sur la branche `flutter`. Pour plus d'informations sur Flutter :

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)
- [Flutter documentation](https://docs.flutter.dev/)

## Développé par

[Tonton Studio](https://github.com/TontonStudio)
