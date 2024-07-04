import '../../domain/repositories/voice_detection_repository.dart';
import '../datasources/speech_recognition_datasource.dart';
import '../datasources/audio_player_datasource.dart';

class VoiceDetectionRepositoryImpl implements VoiceDetectionRepository {
  final SpeechRecognitionDatasource _speechRecognition;
  final AudioPlayerDatasource _audioPlayer;

  VoiceDetectionRepositoryImpl(this._speechRecognition, this._audioPlayer);

  @override
  Future<bool> initializeSpeechRecognition() {
    return _speechRecognition.initialize();
  }

  @override
  Future<void> startListening({
    required Function(String) onResult,
    required Function() onListening,
  }) {
    return _speechRecognition.startListening(
      onResult: onResult,
      onListening: onListening,
    );
  }

  @override
  Future<void> stopListening() {
    return _speechRecognition.stopListening();
  }

  @override
  Future<void> playDetectionSound(String word) async {
    String? soundPath;
    String lowerWord = word.toLowerCase();
    
    print('Texte détecté : $word');

    if (lowerWord.contains('quoi') && !lowerWord.contains('pourquoi')) {
      soundPath = 'assets/sounds/quoicoubeh.mp3';
      print('Mot-clé détecté : quoi');
    } else if (lowerWord.contains('un')) {
      soundPath = 'assets/sounds/apanyan.mp3';
      print('Mot-clé détecté : un');
    } else if (lowerWord.contains('pourquoi')) {
      soundPath = 'assets/sounds/pourquoicarabinga.mp3';
      print('Mot-clé détecté : pourquoi');
    }

    if (soundPath != null) {
      print('Playing sound: $soundPath'); // Log pour le chemin du fichier audio
      return _audioPlayer.playSound(soundPath);
    } else {
      print('No sound to play for the word: $word'); // Log pour absence de fichier audio
      return Future.value();
    }
  }

  @override
  bool get isListening => _speechRecognition.isListening;
}
