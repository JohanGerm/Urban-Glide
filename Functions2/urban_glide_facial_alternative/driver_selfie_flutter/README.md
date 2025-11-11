Driver Selfie + Device Biometric Sample

Setup:
1. Replace firebase_options.dart placeholders with your Firebase project values.
2. Add google-services.json (Android) and GoogleService-Info.plist (iOS) to the project.
3. Ensure camera permission and local_auth platform setup per plugin docs.
4. Run: flutter pub get && flutter run

Notes on privacy and compliance:
- Selfies are uploaded for manual admin verification only; no automated matching is included.
- Obtain explicit consent from drivers before collecting photos.
- Secure storage and access controls are required (use Firebase rules and server-side checks).
