import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:geolocator/geolocator.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(); // replace with options if using firebase_options.dart
  await FirebaseMessaging.instance.requestPermission();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override Widget build(BuildContext c) => MaterialApp(home: AuthGate());
}

class AuthGate extends StatelessWidget {
  final _auth = FirebaseAuth.instance;
  @override Widget build(BuildContext context) {
    return StreamBuilder<User?>(stream: _auth.authStateChanges(), builder: (ctx,snap) {
      if (snap.connectionState == ConnectionState.waiting) return Scaffold(body: Center(child:CircularProgressIndicator()));
      if (!snap.hasData) return LoginMock();
      return PanicHome(user: snap.data!);
    });
  }
}

class LoginMock extends StatelessWidget {
  final _phone = TextEditingController();
  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Mock login')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      TextField(controller: _phone, decoration: InputDecoration(labelText: 'Phone (any)')),
      ElevatedButton(onPressed: () async { final uc = await FirebaseAuth.instance.signInAnonymously(); await FirebaseDatabase.instance.ref('users/${uc.user!.uid}').set({'phone': _phone.text.trim(), 'role':'driver'}); }, child: Text('Sign in (mock)'))
    ])));
  }
}

class PanicHome extends StatefulWidget {
  final User user; PanicHome({required this.user});
  @override State<PanicHome> createState() => _PanicHomeState();
}

class _PanicHomeState extends State<PanicHome> {
  final db = FirebaseDatabase.instance.ref();
  String _status = 'Ready';
  bool _sending = false;

  Future<void> _sendPanic() async {
    setState(() { _sending = true; _status = 'Locating...'; });
    Position pos;
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return setState(() { _status = 'Enable location services'; _sending=false; });
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) perm = await Geolocator.requestPermission();
      if (perm == LocationPermission.denied) return setState(() { _status='Location permission denied'; _sending=false; });
      pos = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.best);
    } catch (e) {
      setState(() { _status='Location error: $e'; _sending=false; });
      return;
    }

    final alertRef = db.child('panic_alerts').push();
    final alert = {
      'uid': widget.user.uid,
      'role': 'driver',
      'lat': pos.latitude,
      'lng': pos.longitude,
      'ts': DateTime.now().toIso8601String(),
      'status': 'open'
    };
    await alertRef.set(alert);
    // send to topic 'bloemsec_ops' for operators (drivers/admins subscribed)
    try {
      await FirebaseMessaging.instance.subscribeToTopic('bloemsec_ops');
    } catch (e) {}
    setState(() { _status = 'Panic sent'; _sending=false; });
  }

  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Driver Panic')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      Text('User: ${'{'}widget.user.uid{'}'}'),
      SizedBox(height:20),
      ElevatedButton(onPressed: _sending ? null : _sendPanic, child: Text(_sending ? 'Sending...' : 'PANIC'), style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white, padding: EdgeInsets.symmetric(vertical:20, horizontal:40))),
      SizedBox(height:12),
      Text(_status)
    ])));
  }
}
