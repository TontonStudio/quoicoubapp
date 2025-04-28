// Service Worker pour Quoicoubapp

const CACHE_NAME = 'quoicoubapp-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sounds/quoicoubeh/quoicoubeh1.mp3',
  './sounds/quoicoubeh/quoicoubeh2.mp3',
  './sounds/quoicoubeh/quoicoubeh3.mp3',
  './sounds/quoicoubeh/quoicoubeh4.mp3',
  './sounds/quoicoubeh/quoicoubeh5.mp3',
  './sounds/quoicoubeh/quoicoubeh6.mp3',
  './sounds/quoicoubeh/quoicoubeh7.mp3',
  './sounds/apanyans/apanyan1.mp3',
  './sounds/apanyans/apanyan2.mp3',
  './sounds/apanyans/apanyan3.mp3',
  './sounds/apanyans/apanyan4.mp3',
  './sounds/apanyans/apanyan5.mp3',
  './sounds/apanyans/apanyan6.mp3',
  './sounds/apanyans/apanyan7.mp3',
  './sounds/apanyans/apanyan8.mp3',
  './sounds/apanyans/apanyan9.mp3',
  './sounds/apanyans/apanyan10.mp3',
  './sounds/pourquoicarabinga/pourquoicarabinga.mp3',
  './sounds/commandantdebord/commandantdebord.mp3',
  './sounds/quiquiriqui/quiquiriqui1.mp3',
  './assets/images/icon.png',
  './assets/images/adaptive-icon.png',
  './assets/images/screenshot1.svg'
];

// Fonction pour mettre en cache dynamiquement tous les sons
async function cacheSoundsDirectory(cache) {
  const soundFolders = ['quoicoubeh', 'apanyans', 'pourquoicarabinga', 'commandantdebord', 'quiquiriqui'];
  
  for (const folder of soundFolders) {
    try {
      // Essayer de mettre en cache un index.json s'il existe
      try {
        const indexResponse = await fetch(`./sounds/${folder}/index.json`);
        if (indexResponse.ok) {
          await cache.put(`./sounds/${folder}/index.json`, indexResponse.clone());
          const indexData = await indexResponse.json();
          
          // Mettre en cache tous les fichiers listés dans l'index
          if (indexData && Array.isArray(indexData.files)) {
            for (const file of indexData.files) {
              try {
                const fileURL = `./sounds/${folder}/${file}`;
                const fileResponse = await fetch(fileURL);
                if (fileResponse.ok) {
                  await cache.put(fileURL, fileResponse.clone());
                  console.log(`Fichier mis en cache: ${fileURL}`);
                }
              } catch (e) {
                console.error(`Erreur lors de la mise en cache du fichier: ${e.message}`);
              }
            }
          }
        }
      } catch (e) {
        console.log(`Pas d'index.json trouvé pour ${folder}, tentative de mise en cache des fichiers individuels`);
      }
      
      // Tentative alternative avec des patterns de noms de fichiers
      for (let i = 1; i <= 20; i++) {
        try {
          const fileURL = `./sounds/${folder}/${folder}${i}.mp3`;
          const response = await fetch(fileURL, { method: 'HEAD' });
          if (response.ok) {
            const fileResponse = await fetch(fileURL);
            await cache.put(fileURL, fileResponse);
            console.log(`Fichier mis en cache: ${fileURL}`);
          }
        } catch (e) {
          // Ignorer les erreurs pour les fichiers qui n'existent pas
        }
      }
      
      // Tenter de mettre en cache le fichier avec le nom simple du dossier
      try {
        const fileURL = `./sounds/${folder}/${folder}.mp3`;
        const response = await fetch(fileURL, { method: 'HEAD' });
        if (response.ok) {
          const fileResponse = await fetch(fileURL);
          await cache.put(fileURL, fileResponse);
          console.log(`Fichier mis en cache: ${fileURL}`);
        }
      } catch (e) {
        // Ignorer les erreurs pour les fichiers qui n'existent pas
      }
      
    } catch (error) {
      console.error(`Erreur lors de la mise en cache du dossier ${folder}: ${error.message}`);
    }
  }
}

// Installation du Service Worker
self.addEventListener('install', (event) => {
  // Effectuer l'installation et mettre en cache les ressources essentielles
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Cache ouvert');
        // Mettre en cache les ressources essentielles
        await cache.addAll(urlsToCache);
        
        // Ensuite, tenter de mettre en cache tous les sons
        await cacheSoundsDirectory(cache);
        
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Erreur lors de la mise en cache des ressources:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Supprimer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Vérifier si c'est une requête pour un fichier son
  const isSoundRequest = event.request.url.includes('/sounds/') && event.request.url.endsWith('.mp3');
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Cloner la requête
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cloner la réponse
            const responseToCache = response.clone();
            
            // Mettre en cache la nouvelle ressource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                
                // Si c'est un nouveau fichier son, on pourrait vouloir le mettre en cache
                if (isSoundRequest) {
                  console.log(`Nouveau fichier son mis en cache: ${event.request.url}`);
                }
              });
              
            return response;
          })
          .catch(() => {
            // En cas d'échec, essayer de retourner une page hors ligne
            // si c'est une requête de navigation
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            // Pour les autres requêtes, retourner une erreur simple
            return new Response('Erreur réseau, application en mode hors ligne.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des notifications push (pour extension future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nouveau message!',
      icon: './assets/images/icon.png',
      badge: './assets/images/icon.png',
      vibrate: [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification('Quoicoubapp', options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});

// Processus de mise à jour rapide lorsqu'une nouvelle version est disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
