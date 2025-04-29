/**
 * Gestionnaire de l'interface utilisateur
 * Gère les interactions et les mises à jour de l'interface
 */
const UIManager = {
    elements: {},
    
    /**
     * Initialise l'interface utilisateur
     * @returns {Object} - Éléments DOM de l'interface
     */
    init() {
        // Récupérer les éléments DOM une seule fois
        this.elements = {
            listenButton: document.getElementById('listenButton'),
            statusElement: document.getElementById('status'),
            resultElement: document.getElementById('result'),
            indicatorElement: document.getElementById('indicator'),
            currentSoundElement: document.getElementById('currentSound'),
            audioContainer: document.getElementById('audioContainer')
        };
        
        // Désactiver la sélection de texte sur les boutons
        this.elements.listenButton.addEventListener('selectstart', e => e.preventDefault());
        
        // Eviter le défilement sur les boutons tactiles
        this.elements.listenButton.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
        
        log('UIManager initialisé');
        return this.elements;
    },
    
    /**
     * Met à jour l'état de l'interface (écoute active/inactive)
     * @param {boolean} isListening - Vrai si l'écoute est active
     */
    updateListeningState(isListening) {
        const { listenButton, statusElement, indicatorElement } = this.elements;
        
        if (isListening) {
            statusElement.textContent = "Écoute en cours...";
            indicatorElement.style.display = 'inline-block';
            listenButton.textContent = "Arrêter l'écoute";
            listenButton.classList.add('stop');
        } else {
            statusElement.textContent = "En attente";
            indicatorElement.style.display = 'none';
            listenButton.textContent = "Commencer l'écoute";
            listenButton.classList.remove('stop');
        }
    },
    
    /**
     * Met à jour l'état de l'interface pendant la lecture d'un son
     * @param {boolean} isPlaying - Vrai si un son est en cours de lecture
     * @param {string} soundPath - Chemin du son en cours de lecture
     */
    updatePlayingState(isPlaying, soundPath = null) {
        const { statusElement, currentSoundElement } = this.elements;
        
        if (isPlaying) {
            statusElement.textContent = "Lecture du son en cours...";
            
            if (soundPath) {
                currentSoundElement.textContent = `Son: ${soundPath}`;
                currentSoundElement.style.display = 'block';
            }
        } else {
            currentSoundElement.style.display = 'none';
        }
    },
    
    /**
     * Met à jour l'état de l'interface en cas d'erreur
     * @param {string} message - Message d'erreur à afficher
     */
    showError(message) {
        const { statusElement, indicatorElement } = this.elements;
        
        statusElement.textContent = message || "Une erreur est survenue";
        indicatorElement.style.display = 'none';
        
        log('Erreur affichée: ' + message, true);
    },
    
    /**
     * Vibre (si disponible) pour donner un feedback tactile
     * @param {number|Array} pattern - Durée ou motif de vibration
     */
    vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    },
    
    /**
     * Met à jour l'affichage de la transcription (en mode debug)
     * @param {string} text - Texte de la transcription
     */
    updateTranscription(text) {
        if (Config.debug && this.elements.resultElement) {
            this.elements.resultElement.textContent = text;
            this.elements.resultElement.style.display = 'block';
        }
    }
};