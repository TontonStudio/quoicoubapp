#!/bin/bash

# Script pour générer un APK à partir de l'application WebView Android

# Vérifier si Android SDK est installé
if [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "Erreur : Android SDK n'est pas configuré. Définissez la variable ANDROID_SDK_ROOT."
    exit 1
fi

# Créer les répertoires nécessaires
mkdir -p build/android/app/src/main/java/com/tontonstudio/quoicoubapp
mkdir -p build/android/app/src/main/res/layout
mkdir -p build/android/app/src/main/res/values
mkdir -p build/android/app/src/main/assets/www

# Copier les fichiers source
cp MainActivity.java build/android/app/src/main/java/com/tontonstudio/quoicoubapp/
cp AndroidManifest.xml build/android/app/src/main/
cp res/layout/activity_main.xml build/android/app/src/main/res/layout/

# Copier les ressources web
cp -r ../../*.html ../../*.js ../../manifest.json ../../sw.js build/android/app/src/main/assets/www/
cp -r ../../sounds build/android/app/src/main/assets/www/

# Créer le fichier de chaînes
echo '<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Quoicoubapp</string>
</resources>' > build/android/app/src/main/res/values/strings.xml

# Créer le fichier de styles
echo '<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.NoTitleBar.Fullscreen">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
    </style>
</resources>' > build/android/app/src/main/res/values/styles.xml

# Créer le fichier build.gradle
echo 'apply plugin: "com.android.application"

android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.tontonstudio.quoicoubapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation "androidx.appcompat:appcompat:1.6.1"
    implementation "androidx.core:core:1.9.0"
}' > build/android/app/build.gradle

# Créer le fichier settings.gradle
echo 'include ":app"' > build/android/settings.gradle

# Créer le fichier build.gradle principal
echo 'buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:7.4.2"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}' > build/android/build.gradle

# Créer le fichier gradle.properties
echo 'org.gradle.jvmargs=-Xmx2048m
android.useAndroidX=true
android.enableJetifier=true' > build/android/gradle.properties

# Créer le wrapper Gradle
cd build/android
gradle wrapper --gradle-version 7.6

# Construire l'APK
./gradlew assembleDebug

# Copier l'APK généré vers le répertoire principal
cp app/build/outputs/apk/debug/app-debug.apk ../../quoicoubapp.apk

echo "APK généré avec succès : quoicoubapp.apk"
