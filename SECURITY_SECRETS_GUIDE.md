# 🔐 Secrets Management Guide

## ⚠️ CRITICAL: API Keys Were Exposed in Git History

**Exposed API Key:** `AIzaSyDUmsVApCUC9n2YKfeu_-gah4bXUYTSY1k` (Google Maps API)

### Immediate Actions Required:

1. **Revoke Compromised API Keys** (DO THIS FIRST!)
   - Go to https://console.cloud.google.com/apis/credentials
   - Select project: `urban-glide-transport-25`
   - Find and delete the exposed API key
   - Create new restricted API keys (separate for Android/iOS)

2. **Apply API Key Restrictions:**
   - **Android Key:** Restrict to package name `com.urbanglide.passenger_app` and `com.urbanglide.driver_app`
   - **iOS Key:** Restrict to Bundle ID `com.urbanglide.passengerApp` and `com.urbanglide.driverApp`
   - **Enabled APIs:** Maps SDK for Android, Maps SDK for iOS, Geocoding, Directions, Places

---

## 🔧 Proper API Key Setup

### Step 1: Get New API Keys

```bash
# 1. Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials?project=urban-glide-transport-25

# 2. Create API Key → Restrict Key
# - Android: Application restrictions → Android apps → Add package name/fingerprint
# - iOS: Application restrictions → iOS apps → Add bundle identifier

# 3. Copy the new keys
```

### Step 2: Configure Apps Securely

**Android** (`passenger_app/android/app/src/main/AndroidManifest.xml`):
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_NEW_ANDROID_API_KEY_HERE"/>
```

**iOS** (`passenger_app/ios/Runner/AppDelegate.swift`):
```swift
GMSServices.provideAPIKey("YOUR_NEW_IOS_API_KEY_HERE")
```

**Repeat for `driver_app/`**

### Step 3: Verify API Keys Are NOT Committed

```powershell
# Check for exposed keys before committing
git diff | Select-String "AIzaSy"

# If found, DO NOT COMMIT
```

---

## 🚨 Never Commit These Files:

✅ **Already Protected by .gitignore:**
- `google-services.json` (Firebase config)
- `GoogleService-Info.plist` (Firebase iOS config)
- `.env` files (environment variables)

⚠️ **Manually Check Before Commit:**
- `AndroidManifest.xml` — should only contain placeholders
- `AppDelegate.swift` — should only contain placeholders
- Any file with API keys, passwords, or tokens

---

## 📝 Best Practices

### Use Environment Variables (Recommended for Production)

**Create `.env` file** (gitignored):
```
GOOGLE_MAPS_ANDROID_KEY=your_android_key_here
GOOGLE_MAPS_IOS_KEY=your_ios_key_here
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
```

**Flutter Environment Plugin:**
```yaml
# pubspec.yaml
dependencies:
  flutter_dotenv: ^5.1.0
```

**Load at runtime:**
```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  final apiKey = dotenv.env['GOOGLE_MAPS_ANDROID_KEY'];
  runApp(MyApp());
}
```

### Alternative: Build-time Configuration

**Use Dart defines:**
```bash
flutter run --dart-define=GOOGLE_MAPS_KEY=your_key_here
```

**Access in code:**
```dart
const apiKey = String.fromEnvironment('GOOGLE_MAPS_KEY');
```

---

## 🔍 Verify Security

### Check for Exposed Secrets

```powershell
# Search for API key patterns
git log -p | Select-String "AIzaSy"

# Search current files
Get-ChildItem -Recurse -File | Select-String "AIzaSy" -List
```

### Audit Commits

```powershell
# Check recent commits for secrets
git log --oneline -10
git show <commit-hash>
```

---

## 📚 Additional Resources

- [Google Maps API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) (remove secrets from Git history)

---

**Last Updated:** November 11, 2025  
**Status:** API keys removed from code, awaiting revocation in Google Cloud Console
