/**
 * Gestionnaire de reconnaissance vocale
 * Gère l'écoute, la détection des mots-clés et la gestion des événements de reconnaissance
 */
const SpeechManager = {
    recognition: null,
    isListening: false,
    manuallyDisabled: false,
    retryCount: 0,
    onKeywordDetected: null,
    keywordPatterns: {},
    lastTranscript: "",
    processingKeyword: false,
    
    /**
     * Initialise le gestionnaire de reconnaissance vocale
     * @param {Object} keywordPatterns - Mapping des mots-clés avec expressions régulières
     * @param {Function} onKeywordDetected - Callback appelée quand un mot-clé est détecté
     */
    init(keywordPatterns, onKeywordDetected) {
        this.keywordPatterns = keywordPatterns;
        this.onKeywordDetected = onKeywordDetected;
        this.prepareRecognition();
        
        log('SpeechManager initialisé');
    },
    
    /**
     * Prépare l'objet de reconnaissance vocale
     * @returns {boolean} - Vrai si l'initialisation a réussi
     */
    prepareRecognition() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Configuration optimisée pour la reconnaissance vocale
            this.recognition.continuous = Config.speech.continuous;
            this.recognition.interimResults = Config.speech.interimResults;
            this.recognition.maxAlternatives = Config.speech.maxAlternatives;
            this.recognition.lang = Config.speech.lang;
            
            // Définir les gestionnaires d'événements
            this.recognition.onresult = this.handleResult.bind(this);
            this.recognition.onerror = this.handleError.bind(this);
            this.recognition.onend = this.handleEnd.bind(this);
            this.recognition.onaudiostart = this.handleAudioStart.bind(this);
            
            return true;
        } catch (error) {
            log("Erreur d'initialisation de la reconnaissance vocale: " + error, true);
            return false;
        }
    },
    
    /**
     * Démarre l'écoute
     * @returns {boolean} - Vrai si le démarrage a réussi
     */
    start() {
        if (this.isListening) return false;
        
        try {
            if (!this.recognition && !this.prepareRecognition()) {
                return false;
            }
            
            this.recognition.start();
            this.isListening = true;
            this.manuallyDisabled = false;
            this.retryCount = 0;
            this.processingKeyword = false;
            
            log('Reconnaissance vocale démarrée');
            return true;
        } catch (error) {
            log("Erreur de démarrage de la reconnaissance vocale: " + error, true);
            this.resetRecognition();
            return false;
        }
    },
    
    /**
     * Arrête l'écoute
     * @returns {boolean} - Vrai si l'arrêt a réussi
     */
    stop() {
        if (!this.isListening) return true;
        
        try {
            this.recognition.stop();
            this.isListening = false;
            
            log('Reconnaissance vocale arrêtée');
            return true;
        } catch (error) {
            log("Erreur d'arrêt de la reconnaissance vocale: " + error, true);
            this.resetRecognition();
            return false;
        }
    },
    
    /**
     * Réinitialise la reconnaissance vocale
     */
    resetRecognition() {
        if (this.recognition) {
            try {
                this.recognition.abort();
            } catch (e) {
                // Ignorer les erreurs d'annulation
            }
        }
        
        this.recognition = null;
        this.isListening = false;
        this.prepareRecognition();
        
        log('Reconnaissance vocale réinitialisée');
    },
    
    /**
     * Gestionnaire de résultat de reconnaissance vocale
     * @param {SpeechRecognitionEvent} event - Événement de résultat de reconnaissance
     */
    handleResult(event) {
        // Ne pas traiter pendant qu'un mot-clé est déjà en cours de traitement
        if (this.processingKeyword) return;
        
        if (!event.results || event.results.length === 0) return;
        
        const result = event.results[event.results.length - 1];
        if (!result || result.length === 0) return;
        
        const transcript = result[0].transcript.trim().toLowerCase();
        if (!transcript) return;
        
        // Éviter de traiter la même transcription plusieurs fois
        if (transcript === this.lastTranscript) return;
        this.lastTranscript = transcript;
        
        log(`Transcription: ${transcript}`);
        
        // Détection optimisée des mots-clés avec RegExp précompilées
        for (const [keyword, pattern] of Object.entries(this.keywordPatterns)) {
            if (pattern.test(transcript)) {
                // Mot-clé détecté, arrêter l'écoute et déclencher le callback
                log(`Mot-clé détecté: ${keyword}`);
                
                // Marquer comme en cours de traitement pour éviter les déclenchements multiples
                this.processingKeyword = true;
                
                // Arrêter immédiatement la reconnaissance
                this.stop();
                
                // Déclencher le callback immédiatement
                if (typeof this.onKeywordDetected === 'function') {
                    this.onKeywordDetected(keyword, transcript);
                }
                
                return;
            }
        }
    },
    
    /**
     * Gestionnaire d'erreur de reconnaissance vocale
     * @param {SpeechRecognitionErrorEvent} event - Événement d'erreur de reconnaissance
     */
    handleError(event) {
        log("Erreur de reconnaissance vocale: " + event.error, true);
        
        // Réinitialiser l'état de traitement
        this.processingKeyword = false;
        
        // Gérer différemment selon le type d'erreur
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
            // Erreurs temporaires, tenter de redémarrer
            this.retryCount++;
            
            if (this.retryCount <= Config.maxRetries) {
                // Redémarrer après un court délai
                setTimeout(() => {
                    if (!this.manuallyDisabled) {
                        this.resetRecognition();
                        this.start();
                    }
                }, Config.delays.retryAfterError);
            } else {
                // Trop d'échecs consécutifs
                this.resetRecognition();
            }
        } else if (event.error === 'network') {
            // Problème réseau, attendre plus longtemps avant de réessayer
            setTimeout(() => {
                if (!this.manuallyDisabled) {
                    this.resetRecognition();
                    this.start();
                }
            }, Config.delays.networkErrorRetry);
        } else {
            // Autres erreurs, réinitialiser complètement
            this.resetRecognition();
        }
    },
    
    /**
     * Gestionnaire de fin de reconnaissance
     */
    handleEnd() {
        log('Fin de session de reconnaissance vocale');
        
        // Si l'arrêt n'était pas volontaire et qu'on ne traite pas un mot-clé, redémarrer
        if (this.isListening && !this.manuallyDisabled && !this.processingKeyword) {
            setTimeout(() => {
                try {
                    this.recognition.start();
                    log('Reconnaissance redémarrée après fin');
                } catch (e) {
                    log('Erreur lors du redémarrage: ' + e);
                    this.resetRecognition();
                    
                    // Essayer de recréer la reconnaissance après une erreur
                    setTimeout(() => {
                        if (!this.manuallyDisabled) {
                            this.prepareRecognition();
                            this.start();
                        }
                    }, Config.delays.retryAfterError);
                }
            }, Config.delays.restartRecognition);
        }
    },
    
    /**
     * Gestionnaire de début de capture audio
     */
    handleAudioStart() {
        log('Début de la capture audio');
        // La capture audio a commencé avec succès
        this.retryCount = 0; // Réinitialiser le compteur d'erreurs
        this.processingKeyword = false; // Réinitialiser l'état de traitement
    },
    
    /**
     * Définit manuellement l'état d'écoute
     * @param {boolean} disabled - Vrai pour désactiver manuellement l'écoute
     */
    setManualDisabled(disabled) {
        this.manuallyDisabled = disabled;
        this.processingKeyword = false;
        log(`Écoute manuelle ${disabled ? 'désactivée' : 'activée'}`);
    }
};