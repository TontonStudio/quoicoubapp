# Documentation Technique Quoicoubapp

## Architecture de l'application

Quoicoubapp est une application web simple qui utilise l'API Web Speech Recognition pour détecter des mots-clés spécifiques et déclencher des sons correspondants.

### Structure des fichiers

```
quoicoubapp/
├── index.html         # Application principale (HTML, CSS et JavaScript)
├── README.md          # Documentation utilisateur
├── CHANGELOG.md       # Historique des modifications
├── TECHNICAL_DOC.md   # Documentation technique (ce document)
├── LICENSE            # Licence MIT
└── sounds/
    ├── quoicoubeh.mp3         # Son joué quand "quoi" est détecté
    ├── apanyan.mp3            # Son joué quand "hein" est détecté
    ├── pourquoicarabinga.mp3  # Son joué quand "pourquoi" est détecté
    ├── commandantdebord.mp3   # Son joué quand "comment" est détecté
    └── default.mp3            # Son par défaut (non utilisé actuellement)
```

### Technologies utilisées

- **HTML5** : Structure de base
- **CSS3** : Styles et animations
- **JavaScript** : Logique de l'application
- **Web Speech API** : Reconnaissance vocale
- **Audio API** : Lecture des fichiers son

## Fonctionnement technique

### 1. Reconnaissance vocale

L'application utilise l'API `webkitSpeechRecognition` (ou `SpeechRecognition`) pour la reconnaissance vocale continue. Cette API est accessible dans les navigateurs modernes, principalement Chrome et Edge.

```javascript
// Initialisation de la reconnaissance vocale
recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'fr-FR';
```

### 2. Détection des mots-clés

L'application analyse la transcription vocale pour détecter des mots-clés spécifiques. L'ordre de détection est important pour éviter les faux positifs (par exemple, "pourquoi" contient "quoi").

#### Mots-clés principaux

- **"comment"** : Déclenche le son commandantdebord.mp3
- **"pourquoi"** : Déclenche le son pourquoicarabinga.mp3
- **"hein" et similaires** : Déclenche le son apanyan.mp3
  - Inclut des mots se terminant par les sons nasaux "in", "ain", "ein"
  - Inclut spécifiquement "un", "ben" et "1"
  - Inclut les mots se terminant par "bah"
- **"quoi"** : Déclenche le son quoicoubeh.mp3

La méthode de détection utilise une combinaison de `includes()` et d'expressions régulières pour les mots plus complexes :

```javascript
// Extrait de code pour la détection de mots se terminant par le son nasal "in"
/(\s|^)(fin|vin|lin|pin|brin|train|main|pain|plein|sein|frein|teint|daim|faim|rein|saint|grain|bain|gain|nain)(\s|$|\.|\?|\!)/i.test(transcript)
```

### 3. Gestion du cycle d'écoute

L'application suit ce cycle :
1. Démarrage de l'écoute
2. Détection d'un mot-clé
3. Arrêt de l'écoute
4. Lecture du son correspondant
5. Reprise automatique de l'écoute une fois le son terminé

Pour éviter les détections multiples d'un même mot ou phrase, l'application utilise une variable `lastProcessedText` qui mémorise la dernière transcription traitée.

### 4. Lecture audio

La lecture audio est gérée via l'API Audio standard du navigateur. Chaque son est préchargé dans un élément `<audio>` distinct :

```html
<audio id="quoiSound" src="sounds/quoicoubeh.mp3" preload="auto"></audio>
<audio id="heinSound" src="sounds/apanyan.mp3" preload="auto"></audio> 
<audio id="pourquoiSound" src="sounds/pourquoicarabinga.mp3" preload="auto"></audio>
<audio id="commentSound" src="sounds/commandantdebord.mp3" preload="auto"></audio>
```

La fonction `playSound(trigger)` gère la lecture des sons, en s'assurant qu'un son n'est pas joué si un autre est déjà en cours :

```javascript
function playSound(trigger) {
    // Sélection du bon élément audio selon le déclencheur
    let sound;
    if (trigger === 'quoi') {
        sound = quoiSound;
    } else if (trigger === 'hein') {
        sound = heinSound;
    } else if (trigger === 'pourquoi') {
        sound = pourquoiSound;
    } else if (trigger === 'comment') {
        sound = commentSound;
    }
    
    // Lecture du son
    sound.currentTime = 0;
    sound.play();
    
    // Gestion de la fin du son
    sound.onended = function() {
        // Redémarrage de l'écoute si nécessaire
        startListening();
    };
}
```

### 5. Gestion d'état

L'application utilise plusieurs variables d'état pour gérer son comportement :

- `isListening` : Indique si la reconnaissance vocale est active
- `isSoundPlaying` : Indique si un son est en cours de lecture
- `manuallyDisabled` : Indique si l'utilisateur a manuellement arrêté l'écoute
- `lastProcessedText` : Mémorise la dernière transcription traitée pour éviter les déclenchements multiples

## Optimisations et problématiques résolues

### Problèmes de détection

- **Détection de "quoi" dans "pourquoi"** : Résolu en inversant l'ordre des conditions pour tester d'abord les mots plus spécifiques
- **Difficulté à détecter "hein"** : Résolu en ajoutant de nombreuses variantes et mots similaires
- **Double déclenchement** : Résolu en mémorisant la dernière transcription traitée

### Problèmes audio

- **Sons qui se jouent deux fois** : Résolu en vérifiant si un son est déjà en cours de lecture
- **Redémarrage de l'écoute pendant la lecture** : Résolu en attendant la fin du son avant de redémarrer

### Problèmes d'interface

- **Persistance de l'arrêt manuel** : Résolu avec la variable `manuallyDisabled`
- **Retour à l'état d'écoute après arrêt** : Résolu en respectant l'intention de l'utilisateur

## Compatibilité et limitations

- **Navigateurs supportés** : Chrome, Edge, et autres navigateurs basés sur Chromium
- **Limitations** : Firefox et Safari ont un support limité ou inexistant de l'API Web Speech
- **Exigences** : Connexion HTTPS ou localhost pour la reconnaissance vocale
- **Permissions** : Nécessite l'autorisation d'accès au microphone

## Extensions possibles

1. **Ajout de nouveaux mots-clés et sons**
2. **Interface pour ajouter des mots-clés personnalisés**
3. **Visualisation de la détection vocale (ondes sonores)**
4. **Support hors-ligne via Service Workers**
5. **Adaptation en Progressive Web App (PWA)**
6. **Interface de gestion des sons (volume, vitesse)**
7. **Mode jeu avec score (compte le nombre de détections)**

## Debugging

En cas de problème, le débogage peut être activé en modifiant la ligne :
```javascript
<div id="debug" style="display:none; ...">
```
en
```javascript
<div id="debug" style="display:block; ...">
```

Cela affichera les logs de l'application, y compris les transcriptions vocales et les événements de détection.

## Notes pour les contributeurs

- L'application utilise délibérément une approche "tout-en-un" sans frameworks pour maximiser la portabilité
- Le code JavaScript est organisé par fonctionnalités plutôt que par classes
- Les variables sont bien nommées pour faciliter la compréhension
- La détection des mots-clés est hautement optimisée pour le français
