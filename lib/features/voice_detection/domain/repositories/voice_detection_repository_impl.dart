import '../../domain/repositories/voice_detection_repository.dart';
import '../../data/datasources/speech_recognition_datasource.dart';
import '../../data/datasources/audio_player_datasource.dart';

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
  Future<void> playDetectionSound(String word) {
    // Ici, vous pourriez avoir une logique pour choisir le son en fonction du mot détecté
    return _audioPlayer.playSound('sounds/detection.mp3');
  }

  @override
  bool get isListening => _speechRecognition.isListening;
}