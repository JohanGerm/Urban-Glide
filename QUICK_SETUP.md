# 🚀 Quick Setup Card - Manual Configuration Required

## ⚠️ CRITICAL: Complete These Before Running Apps

### 1️⃣ Google Maps API Keys (30 min)

**Get Keys:**
- Go to: https://console.cloud.google.com/
- Project: `urban-glide-transport-25`
- Enable APIs: Maps SDK for Android, Maps SDK for iOS, Geocoding, Directions
- Create 2 API keys (Android + iOS with platform restrictions)

**Update Files:**

**Android (2 files):**
```powershell
# Open in editor and search for: YOUR_GOOGLE_MAPS_API_KEY_HERE
notepad passenger_app/android/app/src/main/AndroidManifest.xml
notepad driver_app/android/app/src/main/AndroidManifest.xml
```

**iOS (2 files):**
```powershell
# Open in editor and search for: YOUR_GOOGLE_MAPS_API_KEY_HERE
notepad passenger_app/ios/Runner/AppDelegate.swift
notepad driver_app/ios/Runner/AppDelegate.swift
```

---

### 2️⃣ Firebase Config Files (30 min)

**Get Files:**
- Go to: https://console.firebase.google.com/
- Project: `urban-glide-transport-25`
- Add 2 Android apps: `com.urbanglide.passenger_app`, `com.urbanglide.driver_app`
- Add 2 iOS apps: `com.urbanglide.passengerApp`, `com.urbanglide.driverApp`
- Download config files

**Replace Placeholders:**

**Android:**
```powershell
# Download google-services.json from Firebase Console, then:
Copy-Item ~/Downloads/google-services.json passenger_app/android/app/google-services.json
Copy-Item ~/Downloads/google-services.json driver_app/android/app/google-services.json

# Delete .PLACEHOLDER files
Remove-Item passenger_app/android/app/google-services.json.PLACEHOLDER
Remove-Item driver_app/android/app/google-services.json.PLACEHOLDER
```

**iOS:**
```powershell
# Download GoogleService-Info.plist from Firebase Console, then:
Copy-Item ~/Downloads/GoogleService-Info.plist passenger_app/ios/Runner/GoogleService-Info.plist
Copy-Item ~/Downloads/GoogleService-Info.plist driver_app/ios/Runner/GoogleService-Info.plist

# Delete .PLACEHOLDER files
Remove-Item passenger_app/ios/Runner/GoogleService-Info.plist.PLACEHOLDER
Remove-Item driver_app/ios/Runner/GoogleService-Info.plist.PLACEHOLDER
```

---

### 3️⃣ Deploy Firebase Backend (15 min)

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy Firestore rules
cd firebase
firebase deploy --only firestore:rules

# Deploy Cloud Functions
cd functions
npm install
firebase deploy --only functions

cd ..\..
```

---

### 4️⃣ Test First Run (15 min)

```powershell
# Test passenger app
cd passenger_app
flutter run

# Test driver app (in new terminal)
cd driver_app
flutter run
```

---

## ✅ Verification Checklist

Before running apps, verify:

- [ ] Google Maps Android API key added to both AndroidManifest.xml files
- [ ] Google Maps iOS API key added to both AppDelegate.swift files
- [ ] google-services.json exists (not .PLACEHOLDER) for both Android apps
- [ ] GoogleService-Info.plist exists (not .PLACEHOLDER) for both iOS apps
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed
- [ ] Physical device or emulator connected: `flutter devices`

---

## 🎯 Commands Quick Reference

```powershell
# Check Flutter setup
flutter doctor

# List devices
flutter devices

# Run passenger app
cd passenger_app; flutter run

# Run driver app
cd driver_app; flutter run

# Run admin app (web)
cd admin_app; flutter run -d chrome

# Clean build
flutter clean; flutter pub get

# Check for errors
flutter analyze
```

---

## 📞 Common Issues

**"Google Maps not loading"**
→ Check API keys are correct and APIs are enabled

**"Firebase not initialized"**
→ Verify google-services.json / GoogleService-Info.plist exist (not .PLACEHOLDER)

**"Location permissions not working"**
→ Test on physical device, not emulator

**"Push notifications not received"**
→ Verify Cloud Functions are deployed: `firebase functions:list`

---

**Time Required:** ~1.5 hours total  
**See Full Details:** `PLATFORM_CONFIG.md`, `FIREBASE_SETUP.md`, `SETUP_COMPLETE.md`
