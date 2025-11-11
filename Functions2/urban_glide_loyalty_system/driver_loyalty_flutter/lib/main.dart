/// Driver loyalty & ratings viewer:
/// - Shows average rating from /drivers/<uid>/rating and rating_count
/// - Shows points earned (if you also maintain driver points under /points_drivers/<uid>)
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(MyApp());
}

class MyApp extends StatelessWidget { @override Widget build(BuildContext c) => MaterialApp(home: AuthGate()); }
class AuthGate extends StatelessWidget {
  final _auth = FirebaseAuth.instance;
  @override Widget build(BuildContext context) {
    return StreamBuilder<User?>(stream: _auth.authStateChanges(), builder: (ctx,snap) {
      if (snap.connectionState == ConnectionState.waiting) return Scaffold(body: Center(child:CircularProgressIndicator()));
      if (!snap.hasData) return LoginMock();
      return DriverHome(user: snap.data!);
    });
  }
}

class LoginMock extends StatelessWidget {
  final _phone = TextEditingController();
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('Mock login')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
    TextField(controller: _phone, decoration: InputDecoration(labelText: 'Phone (any)')),
    ElevatedButton(onPressed: () async { final uc = await FirebaseAuth.instance.signInAnonymously(); await FirebaseDatabase.instance.ref('drivers/${uc.user!.uid}').set({'name':'Driver','rating':0,'rating_count':0}); }, child: Text('Sign in (mock)'))
  ])));
}

class DriverHome extends StatefulWidget { final User user; DriverHome({required this.user}); @override State<DriverHome> createState() => _DriverHomeState(); }
class _DriverHomeState extends State<DriverHome> {
  final db = FirebaseDatabase.instance.ref();
  double rating = 0.0;
  int ratingCount = 0;
  int points = 0;

  @override
  void initState() {
    super.initState();
    db.child('drivers/${widget.user.uid}/rating').onValue.listen((ev) { setState(() => rating = double.tryParse((ev.snapshot.value ?? '0').toString()) ?? 0.0); });
    db.child('drivers/${widget.user.uid}/rating_count').onValue.listen((ev) { setState(() => ratingCount = (ev.snapshot.value ?? 0) as int); });
    db.child('points_drivers/${widget.user.uid}/balance').onValue.listen((ev) { setState(() => points = (ev.snapshot.value ?? 0) as int); });
  }

  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Driver - Ratings & Points')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      Text('Average rating: ' + rating.toStringAsFixed(2)),
      Text('Rating count: ' + ratingCount.toString()),
      SizedBox(height:12),
      Text('Points (driver program): ' + points.toString())
    ])));
  }
}
