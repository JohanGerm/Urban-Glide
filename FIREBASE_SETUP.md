# Firebase Setup Instructions

## Prerequisites
- Firebase Project: `urban-glide-transport-25`
- Project Number: `572805775337`
- Firebase Console: https://console.firebase.google.com/

## Setup Steps

### 1. Enable Firebase Services
1. Go to Firebase Console
2. Select project `urban-glide-transport-25`
3. Enable the following services:
   - **Authentication** → Enable Email/Password provider
   - **Cloud Firestore** → Create database (start in test mode, deploy rules later)
   - **Cloud Messaging** → Already enabled by default
   - **Cloud Functions** → Enable for notifications (see step 4)

### 2. Configure Passenger App

#### Android
1. In Firebase Console → Project Settings → Add App → Android
2. Package name: `com.urbanglide.passenger_app`
3. Download `google-services.json`
4. Place in: `passenger_app/android/app/google-services.json`
5. Replace the `.PLACEHOLDER` file

#### iOS
1. In Firebase Console → Project Settings → Add App → iOS
2. Bundle ID: `com.urbanglide.passengerApp`
3. Download `GoogleService-Info.plist`
4. Place in: `passenger_app/ios/Runner/GoogleService-Info.plist`
5. Replace the `.PLACEHOLDER` file

### 3. Configure Driver App

#### Android
1. In Firebase Console → Project Settings → Add App → Android
2. Package name: `com.urbanglide.driver_app`
3. Download `google-services.json`
4. Place in: `driver_app/android/app/google-services.json`
5. Replace the `.PLACEHOLDER` file

#### iOS
1. In Firebase Console → Project Settings → Add App → iOS
2. Bundle ID: `com.urbanglide.driverApp`
3. Download `GoogleService-Info.plist`
4. Place in: `driver_app/ios/Runner/GoogleService-Info.plist`
5. Replace the `.PLACEHOLDER` file

### 4. Configure Admin App (Web)
1. In Firebase Console → Project Settings → Add App → Web
2. App nickname: `Urban Glide Admin`
3. Copy Firebase config object
4. Update `admin_app/lib/main.dart` with Firebase config in `Firebase.initializeApp()`

### 5. Deploy Firestore Security Rules
```bash
cd firebase
firebase deploy --only firestore:rules
```

### 6. Deploy Cloud Functions (for push notifications)
```bash
cd firebase/functions
npm install
firebase deploy --only functions
```

## Google Maps API Keys

### Get API Keys
1. Go to: https://console.cloud.google.com/
2. Select project: `urban-glide-transport-25`
3. Enable APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
   - Directions API
4. Create API keys (restrict by platform)

### Android Configuration
Edit `passenger_app/android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ANDROID_API_KEY"/>
```

Do the same for `driver_app/android/app/src/main/AndroidManifest.xml`

### iOS Configuration
Edit `passenger_app/ios/Runner/AppDelegate.swift`:
```swift
import GoogleMaps
GMSServices.provideAPIKey("YOUR_IOS_API_KEY")
```

Do the same for `driver_app/ios/Runner/AppDelegate.swift`

## Verification

### Test Passenger App
```bash
cd passenger_app
flutter run
```

### Test Driver App
```bash
cd driver_app
flutter run
```

### Test Admin App
```bash
cd admin_app
flutter run -d chrome
```

## Troubleshooting

### Firebase Not Initialized
- Check that `google-services.json` or `GoogleService-Info.plist` exists (without .PLACEHOLDER)
- Verify package names match Firebase Console registration
- Run `flutter clean` and rebuild

### Google Maps Not Working
- Verify API keys are correct
- Check that APIs are enabled in Google Cloud Console
- Ensure API keys are not restricted incorrectly

### Push Notifications Not Received
- Verify Cloud Functions are deployed
- Check Firebase Cloud Messaging is enabled
- Test on physical device (not emulator)

For complete setup guide, see `docs/vscode_setup_guide.md`
