import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async { WidgetsFlutterBinding.ensureInitialized(); await Firebase.initializeApp(); runApp(MyApp()); }
class MyApp extends StatelessWidget{ @override Widget build(BuildContext c) => MaterialApp(home: RiderHome()); }
class RiderHome extends StatefulWidget { @override State<RiderHome> createState() => _RiderHomeState(); }
class _RiderHomeState extends State<RiderHome> {
  final db = FirebaseDatabase.instance.ref();
  String? currentOtp; int? expiresAt; Timer? t; int remaining=0; StreamSubscription? sub;
  @override void initState(){ super.initState(); _initMessaging(); _listenMessages(); }
  Future<void> _initMessaging() async { try { final token = await FirebaseMessaging.instance.getToken(); final uid = FirebaseAuth.instance.currentUser?.uid ?? 'demo_rider'; if(token!=null) await db.child('fcmTokens/$uid').push().set(token); } catch(e){ print('FCM token error $e'); } }
  void _listenMessages(){ final uid = FirebaseAuth.instance.currentUser?.uid ?? 'demo_rider'; sub = db.child('messages/$uid').onChildAdded.listen((ev){ final v = ev.snapshot.value as Map<dynamic,dynamic>?; if(v!=null && v['type']=='ride_otp'){ setState(()=>{ currentOtp=v['otp'].toString(); expiresAt = v['expiresAt'] ?? (v['ts'] + 5*60*1000); }); _startTimer(); } }); }
  void _startTimer(){ t?.cancel(); t = Timer.periodic(Duration(seconds:1), (_){ if(expiresAt==null) return; final rem = ((expiresAt! - DateTime.now().millisecondsSinceEpoch)/1000).ceil(); if(rem<=0){ t?.cancel(); setState(()=> currentOtp=null); } else setState(()=> remaining=rem); }); }
  @override void dispose(){ sub?.cancel(); t?.cancel(); super.dispose(); }
  @override Widget build(BuildContext c){ return Scaffold(appBar: AppBar(title: Text('Rider - OTP')), body: Center(child: currentOtp==null?Text('No OTP') : Column(mainAxisSize: MainAxisSize.min, children:[ Text('Show this to driver'), SizedBox(height:8), Text(currentOtp!, style: TextStyle(fontSize:36)), SizedBox(height:8), Text('Expires in $remaining s') ]))); }
}
