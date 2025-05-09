# Changelog

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

### Problèmes résolus
- L'application détectait toujours "quoi" dans "pourquoi" → Résolu en inversant l'ordre des conditions
- Le son "commandantdebord.mp3" se jouait deux fois → Résolu avec une vérification de la dernière transcription
- Le bouton "Arrêter l'écoute" ne fonctionnait pas correctement → Résolu avec la variable manuallyDisabled
- Détection limitée pour "Hein ?" → Améliorée avec une liste de mots se terminant par un son nasal similaire
