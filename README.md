# Quoicoubapp

Une application web ludique qui écoute en permanence et réagit à certains mots-clés en jouant des sons amusants.

## Fonctionnalités

- Reconnaissance vocale en continu via l'API Web Speech
- Détection de mots-clés spécifiques :
  - "Quoi ?" → Joue "quoicoubeh.mp3"
  - "Pourquoi ?" → Joue "pourquoicarabinga.mp3"
  - "Comment ?" → Joue "commandantdebord.mp3"
  - "Hein ?" et mots similaires se terminant par le son "in" → Joue "apanyan.mp3"
- Cycle automatique : détection, arrêt de l'écoute, lecture du son, reprise de l'écoute
- Interface minimaliste avec un seul bouton pour démarrer/arrêter l'écoute

## Comment ça marche

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Commencer l'écoute"
3. Prononcez l'un des mots-clés :
   - "Quoi ?"
   - "Hein ?" (ou un mot se terminant par le son "in" comme "bien", "vin", etc.)
   - "Pourquoi ?"
   - "Comment ?"
4. L'application jouera automatiquement le son correspondant
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

## Détection des mots-clés

L'application est optimisée pour détecter plusieurs variations des mots-clés :

- Pour "Hein ?" - détecte également les mots se terminant par les sons nasaux comme "in", "ain", "ein" (ex: "bien", "main", "plein")
- Pour tous les mots-clés - détecte les mots avec ou sans point d'interrogation

## Développé par

[Tonton Studio](https://github.com/TontonStudio)
