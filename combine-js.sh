#!/bin/bash
# Script pour combiner tous les fichiers JavaScript en un seul fichier optimisé

OUTPUT_DIR="dist"
OUTPUT_FILE="$OUTPUT_DIR/quoicoubapp.min.js"
TEMP_FILE="$OUTPUT_DIR/temp.js"

# Créer le répertoire de sortie si nécessaire
mkdir -p $OUTPUT_DIR

# Vider le fichier de sortie
echo "// Quoicoubapp v1.2.0 - Combined JS" > $OUTPUT_FILE

# Ordre des fichiers à combiner
FILES=(
  "js/config.js"
  "js/audio-cache.js"
  "js/speech-manager.js"
  "js/sound-manager.js"
  "js/ui-manager.js"
  "js/app.js"
)

# Combiner tous les fichiers
for file in "${FILES[@]}"; do
  # Ajouter un commentaire pour indiquer le début du fichier
  echo "// Begin: $file" >> $TEMP_FILE
  cat "$file" >> $TEMP_FILE
  echo "// End: $file" >> $TEMP_FILE
  echo "" >> $TEMP_FILE
done

# Minification simple avec sed (pas besoin d'outils supplémentaires)
cat $TEMP_FILE | sed 's/\/\*\*.*\*\///' | sed 's/\/\/.*$//' | tr -d '\n' | sed 's/  //g' > $OUTPUT_FILE

# Supprimer le fichier temporaire
rm $TEMP_FILE

echo "Combined JS file created at $OUTPUT_FILE"

# Créer aussi une version HTML minifiée
cat index-modular.html | sed 's/<!-- Scripts modulaires -->.*<\/body>/<script src="dist\/quoicoubapp.min.js"><\/script><\/body>/' > dist/index.html

echo "Optimized HTML file created at dist/index.html"

# Copier le fichier CSS
cp css/styles.css dist/styles.css

echo "All files optimized successfully!"
