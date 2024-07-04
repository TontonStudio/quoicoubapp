import 'package:speech_to_text/speech_to_text.dart' as stt;

class SpeechRecognitionDatasource {
  final stt.SpeechToText _speech = stt.SpeechToText();

  Future<bool> initialize() async {
    return await _speech.initialize();
  }

  Future<void> startListening({
    required Function(String) onResult,
    required Function() onListening,
  }) async {
    if (!_speech.isListening) {
      await _speech.listen(
        onResult: (result) => onResult(result.recognizedWords),
        listenFor: Duration(seconds: 60), // Écouter plus longtemps
        partialResults: true, // Utiliser des résultats partiels
        onSoundLevelChange: (level) => onListening(),
        cancelOnError: true,
        listenMode: stt.ListenMode.dictation,
        localeId: "fr_FR",
      );
    }
  }

  Future<void> stopListening() async {
    await _speech.stop();
  }

  bool get isListening => _speech.isListening;
}
