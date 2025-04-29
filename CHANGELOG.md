# Changelog

## v1.2.0 (29 avril 2025)

### Optimisations de performance
- Architecture modulaire avec séparation des responsabilités
- Optimisation du système de reconnaissance vocale pour une détection plus rapide
- Préchargement intelligent des sons pour réduire la latence
- Gestion optimisée des ressources système (mise en pause/reprise automatique)
- Version compilée unifiée pour des performances maximales en production

### Améliorations techniques
- Refonte de l'architecture avec des modules spécialisés
- Système de cache audio multi-niveaux pour une meilleure réactivité
- Réduction des délais de traitement entre les opérations
- Compatibilité améliorée avec iOS et Android WebView
- Script de compilation pour générer une version minifiée prête à l'emploi

### Structure de fichiers
- Organisation modulaire des fichiers JavaScript pour faciliter la maintenance
- Version standard (index.html)
- Version modulaire optimisée (index-modular.html)
- Version compilée et minifiée (dist/index.html)

## v1.1.0 (28 avril 2025)

### Nouvelles fonctionnalités
- Support pour plusieurs sons par mot-clé (lecture aléatoire)
- Ajout de la détection du mot-clé "Qui ?" pour le son "quiquiriqui"
- Structure de dossiers organisée par type de son
- Amélioration de la compatibilité PWA pour création d'APK

### Améliorations techniques
- Refonte complète du système de gestion des sons avec sélection aléatoire
- Correction des chemins relatifs dans le manifeste et le service worker
- Optimisation de la gestion du cache pour une meilleure expérience hors ligne
- Mise à jour de l'interface utilisateur pour inclure la nouvelle commande vocale
- Stabilisation de la gestion des permissions du microphone

### Corrections de bugs
- Résolution du problème de demande d'autorisation répétée du microphone
- Correction des chemins des ressources pour la compatibilité mobile
- Stabilisation du cycle d'écoute/détection/lecture/reprise

## v1.0.0 (25 avril 2025)

### Fonctionnalités initiales
- Implémentation de la reconnaissance vocale continue
- Détection des mots clés : "Quoi ?", "Hein ?", "Pourquoi ?"
- Lecture automatique des sons correspondants
- Interface utilisateur simple

### Améliorations
- Détection améliorée pour "Hein ?" incluant les mots se terminant par le son nasal "in"
- Ajout de la détection pour "1" et "ben" pour le son "apanyan.mp3"
- Ajout de la détection pour les mots se terminant par "bah" pour le son "apanyan.mp3"
- Ajout de la détection pour "Comment ?" avec le son "commandantdebord.mp3"
- Correction des problèmes de détections multiples avec la variable lastProcessedText
- Optimisation de la lecture audio pour éviter les déclenchements en double

### Changements
- Simplification de l'interface en supprimant les boutons de test
- Masquage de la zone d'affichage du mot détecté
- Amélioration du style du bouton principal

## Développement

### Étapes de développement
1. Création de l'application initiale en React Native/Expo
2. Migration vers une application web pour simplifier le déploiement
3. Implémentation de la reconnaissance vocale avec l'API Web Speech
4. Ajout de la détection des différents mots-clés
5. Optimisation de la lecture audio
6. Cycle automatique d'écoute et de détection
7. Amélioration de la détection du mot "Hein ?"
8. Ajout de la détection du mot "Comment ?"
9. Simplification de l'interface utilisateur
10. Correction des bugs de double détection
11. Restructuration pour supporter la sélection aléatoire de sons multiples
12. Optimisation pour la création d'APK via PWA Builder
13. Restructuration modulaire et optimisations de performance

### Problèmes résolus
- L'application détectait toujours "quoi" dans "pourquoi" → Résolu en inversant l'ordre des conditions
- Le son "commandantdebord.mp3" se jouait deux fois → Résolu avec une vérification de la dernière transcription
- Le bouton "Arrêter l'écoute" ne fonctionnait pas correctement → Résolu avec la variable manuallyDisabled
- Détection limitée pour "Hein ?" → Améliorée avec une liste de mots se terminant par un son nasal similaire
- Demande d'autorisation répétée du microphone → Résolu en simplifiant la gestion des permissions
- Lecture toujours des mêmes sons → Résolu avec un système de sélection aléatoire
- Latence entre la détection et la lecture audio → Résolue avec préchargement optimisé et architecture modulaire