import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart'; // Import the package

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const FillYourDayPage(), // Set your page as the home of the app
    );
  }
}

class FillYourDayPage extends StatefulWidget {
  const FillYourDayPage({super.key});

  @override
  FillYourDayPageState createState() => FillYourDayPageState();
}

class FillYourDayPageState extends State<FillYourDayPage> {
  final PageController _controller = PageController();
  final TextEditingController _textEditingController = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    _textEditingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Fill Your Day',
          style: TextStyle(
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.lightBlue[300],
        shadowColor: Colors.blueAccent,
      ),
      body: Column(children: [
        Expanded(
          child: PageView(
            controller: _controller,
            scrollDirection: Axis.horizontal,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'What made you happy today ?',
                      textAlign: TextAlign.center,
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _textEditingController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Your answer',
                        hintText: 'Write something...',
                      ),
                      maxLines: 4, // Adjust as needed for the input size
                    ),
                  ],
                ),
              ),
              const Center(
                child: Text(
                  'Swipe left',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(16),
          child: SmoothPageIndicator(
            controller: _controller,
            count: 2,
            effect: WormEffect(
              dotHeight: 12,
              dotWidth: 12,
              activeDotColor: Colors.lightBlue[300]!,
              dotColor: Colors.grey[300]!,
            ),
          ),
        ),
      ]),
    );
  }
}
