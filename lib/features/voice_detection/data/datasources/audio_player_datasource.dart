import 'package:audioplayers/audioplayers.dart';

class AudioPlayerDatasource {
  final AudioPlayer _audioPlayer = AudioPlayer();

  Future<void> playSound(String assetPath) async {
    try {
      // Assurez-vous de retirer le préfixe 'assets/' pour le chemin du fichier
      await _audioPlayer.play(AssetSource(assetPath.replaceFirst('assets/', '')));
    } catch (e) {
      print('Erreur lors de la lecture du son: $e');
    }
  }

  Future<void> stopSound() async {
    await _audioPlayer.stop();
  }

  void dispose() {
    _audioPlayer.dispose();
  }
}
