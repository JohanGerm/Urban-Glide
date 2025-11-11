import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override Widget build(BuildContext c) => MaterialApp(home: ScheduleRide());
}

class ScheduleRide extends StatefulWidget {
  @override State<ScheduleRide> createState() => _ScheduleRideState();
}

class _ScheduleRideState extends State<ScheduleRide> {
  final _pickup = TextEditingController();
  final _drop = TextEditingController();
  DateTime? _scheduledTime;
  final db = FirebaseDatabase.instance.ref();

  Future<void> _submit() async {
    if (_scheduledTime == null) return;
    final uid = FirebaseAuth.instance.currentUser?.uid ?? 'demo_user';
    final rideRef = db.child('scheduled_rides/$uid').push();
    await rideRef.set({
      'pickup': _pickup.text,
      'drop': _drop.text,
      'scheduled_ts': _scheduledTime!.toIso8601String(),
      'status': 'pending'
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Ride scheduled!')));
  }

  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Schedule Ride')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(children: [
          TextField(controller: _pickup, decoration: InputDecoration(labelText:'Pickup')),
          TextField(controller: _drop, decoration: InputDecoration(labelText:'Drop-off')),
          SizedBox(height:12),
          ElevatedButton(onPressed: () async {
            final dt = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(Duration(days:7)));
            if(dt==null) return;
            final t = await showTimePicker(context: context, initialTime: TimeOfDay.now());
            if(t==null) return;
            setState(() { _scheduledTime = DateTime(dt.year, dt.month, dt.day, t.hour, t.minute); });
          }, child: Text(_scheduledTime==null?'Pick Date & Time':'Scheduled: ${_scheduledTime}')),
          SizedBox(height:12),
          ElevatedButton(onPressed: _submit, child: Text('Schedule Ride'))
        ])
      )
    );
  }
}
