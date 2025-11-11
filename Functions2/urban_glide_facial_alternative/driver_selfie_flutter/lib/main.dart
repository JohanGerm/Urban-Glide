import 'dart:io';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:image_picker/image_picker.dart';
import 'package:local_auth/local_auth.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final LocalAuthentication auth = LocalAuthentication();
  bool _canCheckBiometrics = false;
  bool _authorized = false;

  @override
  void initState() {
    super.initState();
    _checkBiometrics();
  }

  Future<void> _checkBiometrics() async {
    bool canCheck = await auth.canCheckBiometrics || await auth.isDeviceSupported();
    setState(() => _canCheckBiometrics = canCheck);
  }

  Future<void> _authenticate() async {
    try {
      bool didAuth = await auth.authenticate(localizedReason: 'Please authenticate to access driver features', options: const AuthenticationOptions(biometricOnly: true));
      setState(() => _authorized = didAuth);
    } catch (e) {
      setState(() => _authorized = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: Scaffold(appBar: AppBar(title: Text('Driver Selfie & Biometric')), body: Center(
      child: _authorized ? DriverHome() : Column(mainAxisSize: MainAxisSize.min, children: [
        Text('Device biometric available: ' + (_canCheckBiometrics ? 'Yes' : 'No')),
        SizedBox(height:12),
        ElevatedButton(onPressed: _authenticate, child: Text('Unlock with device biometric')),
        SizedBox(height:8),
        ElevatedButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => SelfieUpload())), child: Text('Skip biometric — Upload selfie')),
      ])
    )));
  }
}

class SelfieUpload extends StatefulWidget {
  @override State<SelfieUpload> createState() => _SelfieUploadState();
}

class _SelfieUploadState extends State<SelfieUpload> {
  XFile? _file;
  final ImagePicker _picker = ImagePicker();
  String _status = '';

  Future<void> _takePhoto() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera, imageQuality: 80);
    if (photo == null) return;
    setState(() => _file = photo);
  }

  Future<void> _upload() async {
    if (_file == null) return setState(() => _status = 'No photo taken');
    final uid = FirebaseAuth.instance.currentUser?.uid ?? 'anonymous_${DateTime.now().millisecondsSinceEpoch}';
    final ref = FirebaseStorage.instance.ref('driver_selfies/$uid/${DateTime.now().millisecondsSinceEpoch}.jpg');
    final task = ref.putFile(File(_file!.path));
    await task.whenComplete((){});
    final url = await ref.getDownloadURL();
    // store reference in Realtime DB for admin review
    await FirebaseDatabase.instance.ref('driver_selfies/$uid').push().set({'url': url, 'ts': DateTime.now().toIso8601String(), 'verified': false});
    setState(() => _status = 'Uploaded. URL: ' + url);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Capture & Upload Selfie')), body: Padding(padding: EdgeInsets.all(16), child: Column(children: [
      _file == null ? Placeholder(fallbackHeight:200) : Image.file(File(_file!.path), height:200),
      SizedBox(height:12),
      ElevatedButton(onPressed: _takePhoto, child: Text('Take photo')),
      SizedBox(height:8),
      ElevatedButton(onPressed: _upload, child: Text('Upload for review')),
      SizedBox(height:12),
      Text(_status),
    ])));
  }
}

class DriverHome extends StatelessWidget {
  @override Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('Driver Home')), body: Center(child: Text('Driver features go here')));
  }
}
