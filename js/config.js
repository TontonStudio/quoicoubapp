/**
 * Configuration de l'application Quoicoubapp
 * Contient les constantes, mappings et paramètres globaux
 */
const Config = {
    // Version de l'application
    version: '1.2.0',
    
    // Mode debug (pour les logs détaillés)
    debug: false,
    
    // Mapping optimisé des mots-clés avec expressions régulières précompilées
    keywordPatterns: {
        'pourquoi': /\bpourquoi\b/i,
        'qui': /(\s|^)qui(\s|$|\?|\.)/i,
        'comment': /\bcomment\b/i,
        'hein': /\bhein\b|(\s|^)(un|ben|1)(\s|$|\?|\.)|\b\w+bah\b|(\s|^)(fin|vin|lin|pin|brin|train|main|pain|plein|sein|frein|teint|daim|faim|rein|saint|grain|bain|gain|nain|bien|rien|chien|mien|tien|sien|loin|soin|coin|besoin|terrain|demain|lendemain|prochain|cousin|voisin|matin|malin|butin|poulain)(\s|$|\.|\?|\!)/i,
        'quoi': /\bquoi\b|\bqu[oa]i\b/i
    },
    
    // Mapping des mots-clés vers les sons
    soundMapping: {
        'pourquoi': [
            './sounds/pourquoicarabinga/pourquoicarabinga.mp3'
        ],
        'qui': [
            './sounds/quiquiriqui/quiquiriqui1.mp3'
        ],
        'comment': [
            './sounds/commandantdebord/commandantdebord.mp3'
        ],
        'hein': [
            './sounds/apanyans/apanyan1.mp3',
            './sounds/apanyans/apanyan2.mp3',
            './sounds/apanyans/apanyan3.mp3',
            './sounds/apanyans/apanyan4.mp3',
            './sounds/apanyans/apanyan5.mp3',
            './sounds/apanyans/apanyan6.mp3',
            './sounds/apanyans/apanyan7.mp3',
            './sounds/apanyans/apanyan8.mp3',
            './sounds/apanyans/apanyan9.mp3',
            './sounds/apanyans/apanyan10.mp3'
        ],
        'quoi': [
            './sounds/quoicoubeh/quoicoubeh1.mp3',
            './sounds/quoicoubeh/quoicoubeh2.mp3',
            './sounds/quoicoubeh/quoicoubeh3.mp3',
            './sounds/quoicoubeh/quoicoubeh4.mp3',
            './sounds/quoicoubeh/quoicoubeh5.mp3',
            './sounds/quoicoubeh/quoicoubeh6.mp3',
            './sounds/quoicoubeh/quoicoubeh7.mp3'
        ]
    },
    
    // Patterns de vibration pour différents mots-clés
    vibrationPatterns: {
        'pourquoi': [50, 50, 100],
        'qui': [50, 100, 50],
        'comment': [50, 100, 50],
        'hein': [100, 50, 50],
        'quoi': [50, 50, 50, 50]
    },
    
    // Paramètres de reconnaissance vocale
    speech: {
        lang: 'fr-FR',
        continuous: true,
        interimResults: true, // Changé à true pour détecter les mots plus rapidement
        maxAlternatives: 1
    },
    
    // Délais (en ms) - Réduits pour améliorer la réactivité
    delays: {
        restartRecognition: 100, // Réduit de 200 à 100
        retryAfterError: 150,    // Réduit de 300 à 150
        networkErrorRetry: 1000, // Réduit de 2000 à 1000
        soundEndRestart: 100     // Réduit de 300 à 100
    },
    
    // Options d'optimisation
    optimization: {
        // Préchargement paresseux - charge seulement quelques sons au début
        lazyPreload: true,
        // Nombre de sons à précharger par catégorie au démarrage
        initialPreloadCount: 1
    },
    
    // Nombre maximum de tentatives de redémarrage de la reconnaissance vocale
    maxRetries: 3
};

// Fonction de log avec mode débug
function log(message, forceShow = false) {
    if (Config.debug || forceShow) {
        console.log(`[Quoicoubapp] ${message}`);
    }
}