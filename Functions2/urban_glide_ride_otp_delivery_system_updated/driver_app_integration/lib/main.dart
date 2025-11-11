import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async { WidgetsFlutterBinding.ensureInitialized(); await Firebase.initializeApp(); runApp(MyApp()); }
class MyApp extends StatelessWidget{ @override Widget build(BuildContext c) => MaterialApp(home: DriverHome()); }
class DriverHome extends StatefulWidget { @override State<DriverHome> createState() => _DriverHomeState(); }
class _DriverHomeState extends State<DriverHome> {
  final functions = FirebaseFunctions.instance;
  final db = FirebaseDatabase.instance.ref();
  final _rideIdCtrl = TextEditingController(); final _otpCtrl = TextEditingController(); String _status='';
  @override void initState(){ super.initState(); _saveFcm(); }
  Future<void> _saveFcm() async { try{ final token = await FirebaseMessaging.instance.getToken(); final uid = FirebaseAuth.instance.currentUser?.uid ?? 'demo_driver'; if(token!=null) await db.child('fcmTokens/$uid').push().set(token); }catch(e){print('fcm save err $e');} }
  Future<void> _acceptRide() async { final rideId=_rideIdCtrl.text.trim(); if(rideId.isEmpty) return setState(()=>_status='Enter rideId'); try{ final res = await functions.httpsCallable('generateOtpOnAccept').call({'rideId': rideId}); setState(()=>_status='OTP generated and delivered to rider (masked: '+(res.data['masked']??'')+')'); }catch(e){ setState(()=>_status='Error: $e'); } }
  Future<void> _verifyOtp() async { final rideId=_rideIdCtrl.text.trim(); final otp=_otpCtrl.text.trim(); if(rideId.isEmpty||otp.isEmpty) return setState(()=>_status='Enter rideId and OTP'); try{ final res = await functions.httpsCallable('verifyRideOtp').call({'rideId': rideId, 'otp': otp}); setState(()=>_status='OTP verified; ride active'); }catch(e){ setState(()=>_status='Verify error: $e'); } }
  @override Widget build(BuildContext c){ return Scaffold(appBar: AppBar(title: Text('Driver - OTP')), body: Padding(padding: EdgeInsets.all(16), child: Column(children:[ TextField(controller:_rideIdCtrl, decoration: InputDecoration(labelText:'Ride ID')), SizedBox(height:8), ElevatedButton(onPressed:_acceptRide, child: Text('Accept Ride & Send OTP to Rider')), Divider(), TextField(controller:_otpCtrl, decoration: InputDecoration(labelText:'Customer OTP')), SizedBox(height:8), ElevatedButton(onPressed:_verifyOtp, child: Text('Verify OTP & Start Ride')), SizedBox(height:12), Text(_status) ]))); }
}
