/// Rider loyalty demo: reads points balance and allows submitting rating for a completed ride
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override Widget build(BuildContext context) => MaterialApp(home: AuthGate());
}

class AuthGate extends StatelessWidget {
  final _auth = FirebaseAuth.instance;
  @override Widget build(BuildContext context) {
    return StreamBuilder<User?>(stream: _auth.authStateChanges(), builder: (ctx, snap) {
      if (snap.connectionState == ConnectionState.waiting) return Scaffold(body: Center(child: CircularProgressIndicator()));
      if (!snap.hasData) return LoginMock();
      return RiderHome(user: snap.data!);
    });
  }
}

class LoginMock extends StatelessWidget {
  final _phone = TextEditingController();
  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Mock login')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      TextField(controller: _phone, decoration: InputDecoration(labelText: 'Phone (any)')),
      ElevatedButton(onPressed: () async {
        final uc = await FirebaseAuth.instance.signInAnonymously();
        await FirebaseDatabase.instance.ref('users/${uc.user!.uid}').set({'phone': _phone.text.trim(), 'role':'rider', 'name':'Rider'});
      }, child: Text('Sign in (mock)'))
    ])));
  }
}

class RiderHome extends StatefulWidget {
  final User user; RiderHome({required this.user});
  @override State<RiderHome> createState() => _RiderHomeState();
}

class _RiderHomeState extends State<RiderHome> {
  final db = FirebaseDatabase.instance.ref();
  int points = 0;
  List<Map> pendingRatings = [];

  @override
  void initState() {
    super.initState();
    db.child('points/${widget.user.uid}/balance').onValue.listen((ev) {
      setState(() => points = (ev.snapshot.value ?? 0) as int);
    });
    // listen for pending ratings for this user by scanning ratings_pending where rider_uid == me
    db.child('ratings_pending').orderByChild('rider_uid').equalTo(widget.user.uid).onValue.listen((ev) {
      final v = ev.snapshot.value;
      List<Map> list = [];
      if (v != null && v is Map) v.forEach((k,val) => list.add({'id': k, 'data': val}));
      setState(() => pendingRatings = list);
    });
  }

  Future<void> submitRating(String rideId, int rating, String comment) async {
    // Call server endpoint /submitRating. For demo, assume server at http://localhost:4100
    final idToken = await widget.user.getIdToken();
    final res = await http.post(Uri.parse('http://localhost:4100/submitRating'), headers: {'Content-Type':'application/json'}, body: json.encode({
      'idToken': idToken,
      'rideId': rideId,
      'rating': rating,
      'comment': comment
    }));
    if (res.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Rating submitted')));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: ' + res.body)));
    }
  }

  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Rider - Points: $points')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      Text('Points balance: $points', style: TextStyle(fontSize:18)),
      SizedBox(height:12),
      Text('Pending ratings', style: TextStyle(fontWeight: FontWeight.bold)),
      ...pendingRatings.map((p) {
        final d = p['data'] as Map;
        return Card(child: ListTile(title: Text('Ride: ${d['ride_id']}'), subtitle: Text('Driver: ${d['driver_uid'] ?? 'n/a'}'), trailing: ElevatedButton(onPressed: () {
          showDialog(context: context, builder: (_) {
            int selected = 5;
            final _c = TextEditingController();
            return AlertDialog(title: Text('Rate driver'), content: Column(mainAxisSize: MainAxisSize.min, children: [
              DropdownButton<int>(value: selected, items: [1,2,3,4,5].map((i) => DropdownMenuItem(child: Text('$i'), value: i)).toList(), onChanged: (v) { selected = v ?? 5; }),
              TextField(controller: _c, decoration: InputDecoration(labelText: 'Comment')),
            ]), actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')), TextButton(onPressed: () {
              submitRating(p['id'], selected, _c.text);
              Navigator.pop(context);
            }, child: Text('Submit'))]);
          });
        }, child: Text('Rate'))));
      }).toList()
    ])));
  }
}
