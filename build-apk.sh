#!/bin/bash

# Script pour construire un APK à partir de la PWA Quoicoubapp
# Ce script utilise Bubblewrap pour générer un APK à partir d'une PWA

# Installer Bubblewrap si nécessaire
echo "Vérification de Bubblewrap..."
if ! command -v bubblewrap &> /dev/null; then
    echo "Installation de Bubblewrap..."
    npm install -g @bubblewrap/cli
fi

# Créer un dossier pour le build si nécessaire
mkdir -p build

# Générer le fichier TWA
echo "Génération du fichier Trusted Web Activity (TWA)..."
bubblewrap init --manifest="https://votre-url-de-deploiement.com/manifest.json" --directory="build/twa"

# Personnaliser les paramètres du TWA
cd build/twa
bubblewrap update --appVersionName="1.0.0" --appVersionCode=1 --packageId="com.tontonstudio.quoicoubapp"

# Construire l'APK
echo "Construction de l'APK..."
bubblewrap build

# Déplacer l'APK généré vers le dossier principal
cp app-release-signed.apk ../../quoicoubapp.apk

# Message de fin
echo "APK généré avec succès : quoicoubapp.apk"
