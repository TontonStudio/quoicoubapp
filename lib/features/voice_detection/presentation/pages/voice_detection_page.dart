import 'package:flutter/material.dart';
import '../../domain/repositories/voice_detection_repository.dart';

class VoiceDetectionPage extends StatefulWidget {
  final VoiceDetectionRepository repository;

  const VoiceDetectionPage({Key? key, required this.repository}) : super(key: key);

  @override
  _VoiceDetectionPageState createState() => _VoiceDetectionPageState();
}

class _VoiceDetectionPageState extends State<VoiceDetectionPage> {
  bool _isListening = false;
  String _lastWords = '';

  @override
  void initState() {
    super.initState();
    _initializeSpeechRecognition();
  }

  Future<void> _initializeSpeechRecognition() async {
    final isInitialized = await widget.repository.initializeSpeechRecognition();
    if (!isInitialized) {
      // Gérer l'échec de l'initialisation
      print('Échec de l\'initialisation de la reconnaissance vocale');
    }
  }

  void _startListening() {
    widget.repository.startListening(
      onResult: (text) {
        setState(() {
          _lastWords = text;
        });
        // Ici, vous pouvez ajouter la logique pour détecter des mots spécifiques
        print('Texte détecté : $text'); // Ajout d'un print pour voir le texte détecté
        if (text.toLowerCase().contains('quoi') || 
            text.toLowerCase().contains('hein') ||
            text.toLowerCase().contains('comment') ||
            text.toLowerCase().contains('pourquoi')) {
            print('Mot-clé détecté : $text'); // Ajout d'un print pour confirmer la détection
            widget.repository.playDetectionSound(text);
        }
      },
      onListening: () {
        setState(() {
          _isListening = widget.repository.isListening;
        });
        print('État d\'écoute : ${widget.repository.isListening}'); // Ajout d'un print pour l'état d'écoute
      },
    );
  }

  void _stopListening() {
    widget.repository.stopListening();
    setState(() {
      _isListening = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Détection Vocale'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_isListening ? 'Écoute en cours...' : 'Appuyez pour écouter'),
            const SizedBox(height: 20),
            Text(_lastWords),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isListening ? _stopListening : _startListening,
              child: Text(_isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute'),
            ),
          ],
        ),
      ),
    );
  }
}