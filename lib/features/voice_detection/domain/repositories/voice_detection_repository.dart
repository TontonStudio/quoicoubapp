abstract class VoiceDetectionRepository {
  Future<bool> initializeSpeechRecognition();
  Future<void> startListening({
    required Function(String) onResult,
    required Function() onListening,
  });
  Future<void> stopListening();
  Future<void> playDetectionSound(String word);
  bool get isListening;
}