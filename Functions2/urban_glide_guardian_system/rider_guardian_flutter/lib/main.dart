/// Rider Guardian management example:
/// - Add guardian (name, phone, optional fcmToken)
/// - List guardians (reads from /guardians/<uid>)
/// - When requesting a ride, guardians are linked to the rider UID (already under /guardians/<uid>)
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await FirebaseMessaging.instance.requestPermission();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Guardian Demo', home: AuthGate());
  }
}

class AuthGate extends StatelessWidget {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _auth.authStateChanges(),
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) return Scaffold(body: Center(child: CircularProgressIndicator()));
        if (!snap.hasData) return PhoneMockLogin();
        return GuardianHome(user: snap.data!);
      },
    );
  }
}

class PhoneMockLogin extends StatefulWidget {
  @override State<PhoneMockLogin> createState() => _PhoneMockLoginState();
}

class _PhoneMockLoginState extends State<PhoneMockLogin> {
  final _phone = TextEditingController();
  String _status = '';
  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Mock login')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      TextField(controller: _phone, decoration: InputDecoration(labelText: 'Phone (any)')),
      ElevatedButton(onPressed: () async {
        // sign in anonymously and write phone to users node
        final uc = await FirebaseAuth.instance.signInAnonymously();
        await FirebaseDatabase.instance.ref('users/${uc.user!.uid}').set({'phone': _phone.text.trim(), 'role': 'rider', 'name': 'Rider'});
      }, child: Text('Sign in (mock)')),
      Text(_status)
    ])));
  }
}

class GuardianHome extends StatefulWidget {
  final User user; GuardianHome({required this.user});
  @override State<GuardianHome> createState() => _GuardianHomeState();
}

class _GuardianHomeState extends State<GuardianHome> {
  final db = FirebaseDatabase.instance.ref();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _token = TextEditingController();
  List<Map> guardians = [];

  @override
  void initState() {
    super.initState();
    _listen();
  }

  void _listen() {
    db.child('guardians/${widget.user.uid}').onValue.listen((event) {
      final vals = event.snapshot.value;
      List<Map> list = [];
      if (vals != null && vals is Map) {
        vals.forEach((k,v) => list.add({'id': k, 'data': v}));
      }
      setState(() => guardians = list);
    });
  }

  Future<void> _addGuardian() async {
    final gref = db.child('guardians/${widget.user.uid}').push();
    await gref.set({'name': _name.text.trim(), 'phone': _phone.text.trim(), 'fcmToken': _token.text.trim()});
    _name.clear(); _phone.clear(); _token.clear();
  }

  Future<void> _remove(String id) async {
    await db.child('guardians/${widget.user.uid}/$id').remove();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Guardians - ${'{'}widget.user.uid{'}'}')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      TextField(controller: _name, decoration: InputDecoration(labelText: 'Guardian name')),
      TextField(controller: _phone, decoration: InputDecoration(labelText: 'Phone')),
      TextField(controller: _token, decoration: InputDecoration(labelText: 'FCM token (optional)')),
      SizedBox(height:8),
      ElevatedButton(onPressed: _addGuardian, child: Text('Add guardian')),
      Divider(),
      Text('My Guardians', style: TextStyle(fontWeight: FontWeight.bold)),
      Expanded(child: ListView.builder(itemCount: guardians.length, itemBuilder: (ctx,i) {
        final g = guardians[i]; final d = g['data'] as Map;
        return ListTile(title: Text(d['name'] ?? ''), subtitle: Text(d['phone'] ?? ''), trailing: IconButton(icon: Icon(Icons.delete), onPressed: () => _remove(g['id'])));
      }))
    ])));
  }
}
