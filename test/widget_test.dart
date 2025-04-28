import 'package:flutter_test/flutter_test.dart';
import 'package:quoicoubapp/app/app.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const QuoicoubApp());

    expect(find.text('Bienvenue dans Quoicoub App!'), findsOneWidget);
  });
}