/**
 * Application principale Quoicoubapp
 * Point d'entrée et orchestration des différents composants
 */
const App = {
    /**
     * Initialisation de l'application
     */
    init() {
        // Initialiser l'interface utilisateur
        const ui = UIManager.init();
        
        // Initialiser le gestionnaire de sons avec réaction rapide
        SoundManager.init(Config.soundMapping, (keyword) => {
            // Callback de fin de son - redémarrage direct pour plus de réactivité
            if (!SpeechManager.manuallyDisabled) {
                SpeechManager.start();
                UIManager.updateListeningState(true);
            } else {
                UIManager.updateListeningState(false);
            }
            
            UIManager.updatePlayingState(false);
        });
        
        // Initialiser le gestionnaire de reconnaissance vocale
        SpeechManager.init(Config.keywordPatterns, (keyword, transcript) => {
            // Callback de détection de mot-clé - réaction immédiate
            log(`Mot-clé détecté: ${keyword} (${transcript})`);
            
            // Vibrer pour donner un feedback tactile
            UIManager.vibrate(Config.vibrationPatterns[keyword] || [50, 50]);
            
            // Mettre à jour l'interface immédiatement
            UIManager.updateListeningState(false);
            UIManager.updateTranscription(transcript);
            
            // Jouer le son correspondant sans délai
            const soundPath = SoundManager.getRandomSound(keyword);
            if (soundPath) {
                UIManager.updatePlayingState(true, soundPath);
                SoundManager.play(keyword);
            }
        });
        
        // Configurer les écouteurs d'événements avec optimisation
        this.setupEventListeners();
        
        // Optimisation de démarrage: écouter après un court délai pour que les fichiers JS soient complètement chargés
        setTimeout(() => {
            // Démarrer l'écoute automatiquement au lancement si l'utilisateur a déjà accepté les autorisations
            if (this.hasUserMediaPermission()) {
                try {
                    SpeechManager.start();
                    UIManager.updateListeningState(true);
                } catch (e) {
                    // Si échec, l'utilisateur pourra démarrer manuellement
                    log("Démarrage automatique impossible, attente du clic utilisateur", true);
                }
            }
        }, 200);
        
        // Vérifier l'environnement PWA ou WebView
        this.checkEnvironment();
        
        log(`Application Quoicoubapp v${Config.version} initialisée`, true);
    },
    
    /**
     * Vérifie si l'autorisation microphone a déjà été accordée
     * @returns {boolean} - Vrai si l'autorisation est déjà accordée
     */
    hasUserMediaPermission() {
        return navigator.mediaDevices && 
               navigator.permissions && 
               navigator.permissions.query ? true : false;
    },
    
    /**
     * Configure les écouteurs d'événements avec optimisation
     */
    setupEventListeners() {
        const { listenButton } = UIManager.elements;
        
        // Gérer le clic sur le bouton d'écoute - optimisé pour réponse instantanée
        listenButton.addEventListener('click', () => {
            UIManager.vibrate(20); // Vibration courte au clic
            
            if (SpeechManager.isListening) {
                SpeechManager.setManualDisabled(true);
                SpeechManager.stop();
                UIManager.updateListeningState(false);
            } else {
                SpeechManager.setManualDisabled(false);
                
                // Démarrage immédiat si possible
                if (!SoundManager.isSoundPlaying) {
                    const started = SpeechManager.start();
                    UIManager.updateListeningState(started);
                    
                    if (!started) {
                        UIManager.showError("Impossible de démarrer la reconnaissance vocale");
                    }
                }
            }
        });
        
        // Gestion optimisée de la visibilité - réduit la consommation des ressources
        if (typeof document.hidden !== "undefined") {
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    // L'application est en arrière-plan
                    if (SpeechManager.isListening) {
                        log('App en arrière-plan, arrêt temporaire de l\'écoute');
                        SpeechManager.stop();
                    }
                } else {
                    // L'application est de nouveau visible - relance immédiate
                    if (!SpeechManager.manuallyDisabled && !SoundManager.isSoundPlaying) {
                        log('App de nouveau visible, reprise de l\'écoute');
                        SpeechManager.start();
                        UIManager.updateListeningState(SpeechManager.isListening);
                    }
                }
            }, false);
        }
        
        // Utiliser la capture de l'événement pour une réponse plus rapide
        window.addEventListener('blur', () => {
            if (SpeechManager.isListening) {
                log('Perte de focus, arrêt temporaire de l\'écoute');
                SpeechManager.stop();
            }
        }, { capture: true });
        
        window.addEventListener('focus', () => {
            if (!SpeechManager.manuallyDisabled && !SoundManager.isSoundPlaying) {
                log('Récupération du focus, reprise de l\'écoute');
                SpeechManager.start();
                UIManager.updateListeningState(SpeechManager.isListening);
            }
        }, { capture: true });
        
        // Activer l'audio en cas d'interaction utilisateur pour iOS
        document.body.addEventListener('touchstart', () => {
            // Création d'un contexte audio silencieux pour débloquer l'API Web Audio sur iOS
            if (window.AudioContext || window.webkitAudioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();
                
                // Jouer un son silencieux pour initialiser l'audio
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0;  // Volume à zéro
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.001);
            }
        }, { once: true, passive: true });
    },
    
    /**
     * Vérifie l'environnement (PWA installée, WebView, etc.)
     * @returns {Object} - Informations sur l'environnement
     */
    checkEnvironment() {
        // Détection de PWA installée
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                     window.navigator.standalone === true;
        
        // Détection de WebView Android
        const userAgent = navigator.userAgent.toLowerCase();
        const isWebView = userAgent.indexOf('android') > -1 && userAgent.indexOf('wv') > -1;
        
        // Optimisations spécifiques selon l'environnement
        if (isPWA) {
            log('Application lancée en mode PWA installée');
            // Précharger davantage de ressources pour PWA (meilleure expérience hors ligne)
            if (SoundManager.preloadMoreSounds) {
                SoundManager.preloadMoreSounds();
            }
        }
        
        if (isWebView) {
            log('Application lancée dans une WebView Android');
            // Ajustements spécifiques pour WebView Android si nécessaire
            document.body.classList.add('webview-mode');
        }
        
        // Détection d'iOS pour les optimisations spécifiques
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            log('Application lancée sur iOS');
            document.body.classList.add('ios-device');
            // Ajustements spécifiques pour iOS
        }
        
        return { isPWA, isWebView, isIOS };
    }
};

// Désactiver temporairement le service worker pour le développement
// À réactiver pour la production
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}

// Initialiser l'application au chargement du DOM avec priorité élevée
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init.bind(App));
} else {
    // Le DOM est déjà chargé, initialiser immédiatement
    App.init();
}