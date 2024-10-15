import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'dart:convert';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

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
      home: const FillYourDayPage(),
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
  List<String> _questions = []; // Store the questions here

  @override
  void initState() {
    super.initState();
    _loadQuestions(); // Load questions when the page is initialized
  }

  Future<void> _loadQuestions() async {
    // Load the JSON file from the assets
    String jsonString = await rootBundle.loadString('assets/questions.json');
    List<dynamic> jsonResponse = json.decode(jsonString);

    // Extract the questions from the JSON data
    List<String> questions =
        jsonResponse.map((item) => item['question'] as String).toList();

    // Update the state with the fetched questions
    setState(() {
      _questions = questions;
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _textEditingController.dispose();
    super.dispose();
  }

  String _getFormattedDate() {
    final now = DateTime.now();
    return "${now.day}/${now.month}/${now.year}"; // Format: 15/10/2024
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Fill Your Day',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 4), // Add spacing between title and date
              Text(
                _getFormattedDate(), // Display the current date
                style: const TextStyle(
                  color: Color.fromARGB(
                      255, 33, 22, 22), // Lighter color for the date
                  fontSize: 18, // Smaller font size for the date
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          centerTitle: true,
          backgroundColor: Colors.lightBlue[300],
          shadowColor: Colors.blueAccent,
        ),
        body: _questions
                .isEmpty // Show loading indicator while questions are loading
            ? const Center(child: CircularProgressIndicator())
            : GestureDetector(
                onTap: () {
                  // Unfocus when tapping outside of the box
                  FocusScope.of(context).unfocus();
                },
                child: Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _controller,
                        itemCount: _questions.length,
                        itemBuilder: (context, index) {
                          return Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  _questions[index],
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                TextField(
                                  controller: _textEditingController,
                                  decoration: const InputDecoration(
                                    border: OutlineInputBorder(),
                                    labelText: 'Your answer',
                                    hintText: 'Write something...',
                                  ),
                                  maxLines: 4,
                                ),
                                const SizedBox(height: 90),
                                ElevatedButton(
                                  onPressed: () {},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.lightBlue[300],
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 40, vertical: 15),
                                    shadowColor: Colors.blueAccent,
                                  ),
                                  child: const Text(
                                    'Submit',
                                    style: TextStyle(
                                        fontSize: 18, color: Colors.white),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(16),
                      child: SmoothPageIndicator(
                        controller: _controller,
                        count: _questions
                            .length, // Dots should match the number of questions
                        effect: WormEffect(
                          dotHeight: 12,
                          dotWidth: 12,
                          activeDotColor: Colors.lightBlue[300]!,
                          dotColor: Colors.grey[300]!,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
