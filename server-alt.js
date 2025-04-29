const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Utilisation d'un port différent

const server = http.createServer((req, res) => {
  // Définir le chemin du fichier
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index-modular.html'; // Utiliser notre nouvelle version modulaire
  }

  // Déterminer le type de contenu en fonction de l'extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
  }

  // Lire le fichier
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Page non trouvée - on redirige vers l'original si notre version modular n'est pas trouvée
        if (filePath === './index-modular.html') {
          fs.readFile('./index.html', (error, content) => {
            if (error) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('Page not found', 'utf-8');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content, 'utf-8');
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('Page not found', 'utf-8');
        }
      } else {
        // Autre erreur serveur
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      // Succès
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
  console.log(`Version modulaire de Quoicoubapp disponible sur http://localhost:${PORT}/index-modular.html`);
  console.log(`Version hybride optimisée disponible sur http://localhost:${PORT}/index-hybrid.html`);
  console.log(`Version originale disponible sur http://localhost:${PORT}/index.html`);
});