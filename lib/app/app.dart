import 'package:flutter/material.dart';
import '../features/voice_detection/data/datasources/speech_recognition_datasource.dart';
import '../features/voice_detection/data/datasources/audio_player_datasource.dart';
import '../features/voice_detection/data/repositories/voice_detection_repository_impl.dart';
import '../features/voice_detection/presentation/pages/voice_detection_page.dart';

class QuoicoubApp extends StatelessWidget {
  const QuoicoubApp({super.key});

  @override
  Widget build(BuildContext context) {
    final speechRecognition = SpeechRecognitionDatasource();
    final audioPlayer = AudioPlayerDatasource();
    final repository = VoiceDetectionRepositoryImpl(speechRecognition, audioPlayer);

    return MaterialApp(
      title: 'Quoicoub App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: VoiceDetectionPage(repository: repository),
    );
  }
}