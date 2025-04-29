/**
 * Gestionnaire de cache audio
 * Précharge et stocke les objets Audio pour une lecture plus rapide
 */
const AudioCache = {
    _cache: new Map(),
    
    /**
     * Précharge et met en cache les sons au démarrage
     * @param {Object} soundMappings - Mappings des mots-clés vers les sons
     * @returns {Promise} - Promesse résolue lorsque tous les sons sont préchargés
     */
    async preload(soundMappings) {
        const promises = [];
        
        for (const [keyword, soundList] of Object.entries(soundMappings)) {
            if (!Array.isArray(soundList) || soundList.length === 0) continue;
            
            if (Config.optimization.lazyPreload) {
                // En mode préchargement paresseux, ne charger que quelques sons par catégorie
                const count = Math.min(Config.optimization.initialPreloadCount, soundList.length);
                for (let i = 0; i < count; i++) {
                    const promise = this.loadSound(soundList[i]);
                    promises.push(promise);
                }
            } else {
                // Mode préchargement complet
                for (const soundPath of soundList) {
                    const promise = this.loadSound(soundPath);
                    promises.push(promise);
                }
            }
        }
        
        // Attendre que les sons prioritaires soient préchargés
        return Promise.allSettled(promises);
    },
    
    /**
     * Charge un son dans le cache
     * @param {string} path - Chemin du fichier audio
     * @returns {Promise} - Promesse résolue avec l'objet Audio
     */
    loadSound(path) {
        return new Promise((resolve, reject) => {
            if (this._cache.has(path)) {
                resolve(this._cache.get(path));
                return;
            }
            
            const audio = new Audio();
            
            // Réduire le temps d'attente en résolvant dès que l'audio est suffisamment chargé
            audio.addEventListener('canplay', () => {
                this._cache.set(path, audio);
                resolve(audio);
            }, { once: true });
            
            audio.onerror = (error) => {
                log(`Erreur de préchargement de l'audio: ${path}`, true);
                reject(error);
            };
            
            audio.src = path;
            audio.load();
            
            // Timeout de sécurité pour éviter d'attendre trop longtemps
            setTimeout(() => {
                if (!this._cache.has(path)) {
                    this._cache.set(path, audio);
                    resolve(audio);
                }
            }, 1000);
        });
    },
    
    /**
     * Obtient un son préchargé du cache, ou le charge si nécessaire
     * @param {string} path - Chemin du fichier audio
     * @returns {Audio} - Objet Audio (existant ou nouvellement créé)
     */
    get(path) {
        // Si le son n'est pas dans le cache, le créer directement
        if (!this._cache.has(path)) {
            const audio = new Audio(path);
            this._cache.set(path, audio);
            
            // Charger en arrière-plan pour la prochaine utilisation
            audio.load();
        }
        
        return this._cache.get(path);
    },
    
    /**
     * Vérifie si un son est dans le cache
     * @param {string} path - Chemin du fichier audio
     * @returns {boolean} - Vrai si le son est dans le cache
     */
    has(path) {
        return this._cache.has(path);
    }
};