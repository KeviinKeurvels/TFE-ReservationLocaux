import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EPHEC RESERVATION',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: Color.fromARGB(255, 236, 143, 20),
          secondary: Color.fromARGB(255, 236, 143, 20),
        ),
      ),
      home: const MyHomePage(title: 'EPHEC RESERVATION'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      //quand on clique sur le nombre pour rebuild
      _counter++;
    });
  }

  void getNext() {
    print("appel à la fonction");
  }

  @override
  Widget build(BuildContext context) {
    //va rerun en même temps que setState
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: SingleChildScrollView(
        child: Column(children: [
          Center(
            child: Column(
              children: <Widget>[
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                const Text(
                  'You have pushed the button this many times:',
                ),
                Counter(counter: _counter),
                Wrap(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        getNext();
                      },
                      child: Text('Test'),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        getNext();
                      },
                      icon: Icon(Icons.favorite_border),
                      label: Text('Like'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        getNext();
                      },
                      child: Text('Test'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
          InkWell(
            child: Card(
              elevation: 8,
              shadowColor: Colors.black,
              margin: EdgeInsets.all(20),
              shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.white)),
              child: ListTile(
                title: Text("Codesinsider.com"),
              ),
            ),
            onTap: () {
              print("Click event on Container");
            },
          ),
        ]),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}

class Counter extends StatelessWidget {
  const Counter({
    super.key,
    required int counter,
  }) : _counter = counter;

  final int _counter;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    var style = theme.textTheme.displayMedium!.copyWith(
      //je copy le style et je change juste la couleur
      backgroundColor: Colors.grey,
      color: Colors.black,
    );
    return Card(
      color: Colors.grey,
      child: Padding(
        padding: const EdgeInsets.all(25.0),
        child: Text(
          '$_counter',
          style: style,
        ),
      ),
    );
  }
}
