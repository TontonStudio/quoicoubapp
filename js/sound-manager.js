/**
 * Gestionnaire de sons
 * Gère la lecture et les événements audio
 */
const SoundManager = {
    isSoundPlaying: false,
    currentSound: null,
    lastPlayedKeyword: null,
    soundMapping: {},
    onSoundEnd: null,
    audioBuffers: {}, // Stockage des buffers audio prédécodés
    
    /**
     * Initialise le gestionnaire de sons
     * @param {Object} soundMapping - Mapping des mots-clés vers les sons
     * @param {Function} onSoundEnd - Callback appelée quand un son se termine
     */
    init(soundMapping, onSoundEnd) {
        this.soundMapping = soundMapping;
        this.onSoundEnd = onSoundEnd;
        
        // Créer des éléments audio pour chaque type de son et les précharger
        // pour une meilleure réactivité au premier clic
        const mainSounds = [];
        for (const [keyword, sounds] of Object.entries(soundMapping)) {
            if (Array.isArray(sounds) && sounds.length > 0) {
                mainSounds.push(sounds[0]);
            }
        }

        // Caching optimisé en arrière-plan avec priorité faible
        setTimeout(() => {
            AudioCache.preload(soundMapping)
                .then(results => {
                    log(`Préchargement audio terminé: ${results.length} sons traités`);
                })
                .catch(error => {
                    log('Erreur lors du préchargement des sons: ' + error, true);
                });
        }, 100);
        
        // Précharger immédiatement les sons principaux pour une réponse instantanée
        for (const sound of mainSounds) {
            const audio = new Audio(sound);
            audio.load();
            this.audioBuffers[sound] = audio;
        }
        
        log('SoundManager initialisé');
    },
    
    /**
     * Obtient un son aléatoire pour un mot-clé
     * @param {string} keyword - Mot-clé pour lequel obtenir un son
     * @returns {string|null} - Chemin du son aléatoire
     */
    getRandomSound(keyword) {
        const sounds = this.soundMapping[keyword];
        if (!Array.isArray(sounds) || sounds.length === 0) {
            return null;
        }
        
        // Optimisation: utiliser une randomisation plus efficace
        const randomIndex = Math.floor(Math.random() * sounds.length);
        return sounds[randomIndex];
    },
    
    /**
     * Joue un son pour un mot-clé
     * @param {string} keyword - Mot-clé pour lequel jouer un son
     * @returns {boolean} - Vrai si la lecture a démarré
     */
    play(keyword) {
        if (this.isSoundPlaying) {
            log('Un son est déjà en cours de lecture, ignoré: ' + keyword);
            return false; // Éviter de jouer plusieurs sons simultanément
        }
        
        try {
            const soundPath = this.getRandomSound(keyword);
            if (!soundPath) {
                log(`Aucun son disponible pour le mot-clé: ${keyword}`, true);
                return false;
            }
            
            log(`Lecture du son: ${soundPath}`);
            this.isSoundPlaying = true;
            this.lastPlayedKeyword = keyword;
            
            let audioElement;
            
            // Tentative 1: Utiliser un son préchargé dans notre cache audioBuffers
            if (this.audioBuffers[soundPath]) {
                audioElement = this.audioBuffers[soundPath];
                audioElement.currentTime = 0;
            }
            // Tentative 2: Utiliser le son du cache AudioCache
            else if (AudioCache.has(soundPath)) {
                audioElement = AudioCache.get(soundPath);
                audioElement.currentTime = 0;
            }
            // Tentative 3: Créer un nouvel élément audio
            else {
                audioElement = new Audio(soundPath);
                audioElement.preload = 'auto';
                // Sauvegarder pour une utilisation future
                this.audioBuffers[soundPath] = audioElement;
            }
            
            this.currentSound = audioElement;
            
            // Configurer les gestionnaires d'événements
            const onEndedHandler = this.handleSoundEnd.bind(this);
            const onErrorHandler = this.handleSoundError.bind(this);
            
            audioElement.onended = onEndedHandler;
            audioElement.onerror = onErrorHandler;
            
            // Jouer le son immédiatement
            audioElement.play().catch(error => {
                log('Erreur de lecture audio: ' + error, true);
                this.handleSoundError(error);
            });
            
            return true;
        } catch (error) {
            log('Erreur lors de la lecture du son: ' + error, true);
            this.handleSoundError(error);
            return false;
        }
    },
    
    /**
     * Gestionnaire de fin de son
     */
    handleSoundEnd() {
        log('Son terminé: ' + this.lastPlayedKeyword);
        this.isSoundPlaying = false;
        this.currentSound = null;
        
        // Déclencher le callback de fin de son immédiatement sans animation frame
        if (typeof this.onSoundEnd === 'function') {
            this.onSoundEnd(this.lastPlayedKeyword);
        }
    },
    
    /**
     * Gestionnaire d'erreur de lecture audio
     * @param {Error} error - Erreur de lecture
     */
    handleSoundError(error) {
        log('Erreur de lecture audio: ' + error, true);
        this.isSoundPlaying = false;
        this.currentSound = null;
        
        // Déclencher le callback de fin de son même en cas d'erreur
        if (typeof this.onSoundEnd === 'function') {
            this.onSoundEnd(this.lastPlayedKeyword);
        }
    },
    
    /**
     * Arrête la lecture du son actuel
     */
    stop() {
        if (this.currentSound) {
            try {
                this.currentSound.pause();
                this.currentSound.currentTime = 0;
                
                log('Lecture audio arrêtée');
            } catch (e) {
                log('Erreur lors de l\'arrêt du son: ' + e, true);
            }
            
            this.isSoundPlaying = false;
            this.currentSound = null;
        }
    }
};