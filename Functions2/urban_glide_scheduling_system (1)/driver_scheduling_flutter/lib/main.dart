import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override Widget build(BuildContext c) => MaterialApp(home: UpcomingRides());
}

class UpcomingRides extends StatefulWidget {
  @override State<UpcomingRides> createState() => _UpcomingRidesState();
}

class _UpcomingRidesState extends State<UpcomingRides> {
  final db = FirebaseDatabase.instance.ref();
  Map<String,dynamic> _rides = {};

  @override void initState() {
    super.initState();
    final uid = FirebaseAuth.instance.currentUser?.uid ?? 'demo_driver';
    db.child('scheduled_rides').onValue.listen((event) {
      final val = event.snapshot.value as Map<dynamic,dynamic>?;
      setState(() { _rides = val?.map((k,v)=>MapEntry(k,v))??{}; });
    });
  }

  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Upcoming Scheduled Rides')),
      body: ListView(
        children: _rides.entries.map((e) => ListTile(
          title: Text('${e.value['pickup']} → ${e.value['drop']}'),
          subtitle: Text('At ${e.value['scheduled_ts']} Status: ${e.value['status']}'),
        )).toList()
      )
    );
  }
}
