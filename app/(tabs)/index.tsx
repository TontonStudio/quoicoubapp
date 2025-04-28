import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [soundObjects, setSoundObjects] = useState<{ [key: string]: Audio.Sound }>({});
  const [lastTriggered, setLastTriggered] = useState('');

  // Mots clés et sons associés
  const triggerWords = {
    'quoi': 'quoicoubeh.mp3',
    'hein': 'apanyan.mp3',
    'pourquoi': 'pourquoicarabinga.mp3'
  };

  // Chargement des sons
  useEffect(() => {
    loadSounds();
    return () => {
      // Décharger les sons lorsque le composant est démonté
      Object.values(soundObjects).forEach(async (sound) => {
        await sound.unloadAsync();
      });
    };
  }, []);

  // Configuration de Voice
  useEffect(() => {
    // Événements Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartial = onSpeechPartial;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      // Nettoyage des événements Voice
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Effet pour surveiller les résultats partiels et déclencher les sons
  useEffect(() => {
    if (partialResults.length > 0) {
      const transcript = partialResults[0].toLowerCase();
      
      // Vérifie si l'un des mots déclencheurs est présent
      if (transcript.includes('quoi ?') || transcript.includes('quoi?')) {
        playSound('quoi');
      } else if (transcript.includes('hein ?') || transcript.includes('hein?')) {
        playSound('hein');
      } else if (transcript.includes('pourquoi ?') || transcript.includes('pourquoi?')) {
        playSound('pourquoi');
      }
    }
  }, [partialResults]);

  // Fonction pour charger les sons
  const loadSounds = async () => {
    try {
      const sounds: { [key: string]: Audio.Sound } = {};
      
      // Préparer l'audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      // Charger chaque son
      const quoiSound = await Audio.Sound.createAsync(
        require('../../assets/sounds/quoicoubeh.mp3')
      );
      const heinSound = await Audio.Sound.createAsync(
        require('../../assets/sounds/apanyan.mp3')
      );
      const pourquoiSound = await Audio.Sound.createAsync(
        require('../../assets/sounds/pourquoicarabinga.mp3')
      );
      
      sounds['quoi'] = quoiSound.sound;
      sounds['hein'] = heinSound.sound;
      sounds['pourquoi'] = pourquoiSound.sound;
      
      setSoundObjects(sounds);
      console.log('Sons chargés avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des sons:', error);
      setError('Erreur lors du chargement des sons');
    }
  };

  // Fonction pour jouer un son
  const playSound = async (trigger: string) => {
    try {
      // Évite de rejouer le même son si déjà déclenché récemment
      if (lastTriggered === trigger) {
        return;
      }
      
      const sound = soundObjects[trigger];
      if (sound) {
        await sound.replayAsync();
        setLastTriggered(trigger);
        
        // Réinitialise le dernier déclenchement après un délai
        setTimeout(() => {
          setLastTriggered('');
        }, 2000); // Délai de 2 secondes
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
    }
  };

  // Fonctions de gestion des événements Voice
  const onSpeechStart = () => {
    setRecognized('');
    console.log('Début de la reconnaissance vocale');
  };

  const onSpeechRecognized = () => {
    setRecognized('✓');
  };

  const onSpeechEnd = () => {
    // Redémarrer l'écoute automatiquement pour une écoute continue
    if (isListening) {
      startListening();
    }
  };

  const onSpeechError = (e: any) => {
    console.error('Erreur de reconnaissance vocale:', e);
    setError(JSON.stringify(e.error));
    
    // Redémarrer l'écoute automatiquement en cas d'erreur
    if (isListening) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  const onSpeechResults = (e: any) => {
    if (e && e.value) {
      setPartialResults(e.value);
    }
  };

  const onSpeechPartial = (e: any) => {
    if (e && e.value) {
      setPartialResults(e.value);
    }
  };

  // Démarrer l'écoute
  const startListening = async () => {
    try {
      await Voice.start('fr-FR');
      setIsListening(true);
      setError('');
    } catch (e) {
      console.error('Erreur lors du démarrage de l\'écoute:', e);
      setError('Erreur de microphone. Veuillez réessayer.');
    }
  };

  // Arrêter l'écoute
  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Erreur lors de l\'arrêt de l\'écoute:', e);
    }
  };

  // Fonction pour basculer l'écoute
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quoicoubapp</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>
          Status: {isListening ? 'Écoute en cours...' : 'En attente'}
        </Text>
        {isListening && <ActivityIndicator size="large" color="#8bac0f" />}
      </View>
      
      <TouchableOpacity
        style={[styles.button, isListening ? styles.buttonStop : styles.buttonStart]}
        onPress={toggleListening}>
        <Text style={styles.buttonText}>
          {isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute'}
        </Text>
      </TouchableOpacity>
      
      {partialResults.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Tu as dit :</Text>
          <Text style={styles.resultText}>{partialResults[0]}</Text>
        </View>
      )}
      
      {error !== '' && (
        <Text style={styles.errorText}>Erreur: {error}</Text>
      )}
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions :</Text>
        <Text style={styles.instructionsText}>1. Appuie sur "Commencer l'écoute"</Text>
        <Text style={styles.instructionsText}>2. Dis "Quoi ?" pour entendre "Quoicoubeh"</Text>
        <Text style={styles.instructionsText}>3. Dis "Hein ?" pour entendre "Apanyan"</Text>
        <Text style={styles.instructionsText}>4. Dis "Pourquoi ?" pour entendre "Carabinga"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#c4cfa1', // Couleur de fond inspirée de la Game Boy
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 30,
    color: '#0f380f',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#306230',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#8bac0f',
  },
  buttonStop: {
    backgroundColor: '#ac0f0f',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#306230',
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#0f380f',
  },
  errorText: {
    color: '#ac0f0f',
    marginBottom: 20,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#306230',
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#0f380f',
  },
});
