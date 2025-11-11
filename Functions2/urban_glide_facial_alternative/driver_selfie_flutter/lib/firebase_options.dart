// Placeholder FirebaseOptions. Replace with your Firebase config from console.
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return FirebaseOptions(
        apiKey: 'REPLACE_WITH_API_KEY',
        authDomain: 'REPLACE_WITH_PROJECT.firebaseapp.com',
        projectId: 'REPLACE_WITH_PROJECT',
        storageBucket: 'REPLACE_WITH_PROJECT.appspot.com',
        messagingSenderId: 'REPLACE_WITH_NUMBER',
        appId: 'REPLACE_WITH_WEB_APP_ID',
        measurementId: 'G-REPLACE_ME',
      );
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return FirebaseOptions(
        apiKey: 'REPLACE_WITH_ANDROID_API_KEY',
        appId: 'REPLACE_WITH_ANDROID_APP_ID',
        messagingSenderId: 'REPLACE_WITH_NUMBER',
        projectId: 'REPLACE_WITH_PROJECT',
        storageBucket: 'REPLACE_WITH_PROJECT.appspot.com',
      );
    }
    return FirebaseOptions(
      apiKey: 'REPLACE_WITH_IOS_API_KEY',
      appId: 'REPLACE_WITH_IOS_APP_ID',
      messagingSenderId: 'REPLACE_WITH_NUMBER',
      projectId: 'REPLACE_WITH_PROJECT',
      storageBucket: 'REPLACE_WITH_PROJECT.appspot.com',
    );
  }
}
