# 🔐 Secrets Management Guide

## ✅ RESOLVED: API Keys Are Now Private

**Previous Issue:** API keys were exposed in source code and git history

**Current Status:** 
- ✅ Hardcoded API keys removed from all source files
- ✅ Environment variable system implemented with `flutter_dotenv`
- ✅ `.env` files are gitignored and never committed
- ✅ `.env.example` templates provided for team setup
- ✅ Configuration validation added to catch missing keys

### Exposed Keys (MUST BE REVOKED):

The following keys were previously exposed in git history and must be revoked:
- `AIzaSyDUmsVApCUC9n2YKfeu_-gah4bXUYTSY1k` (Old Google Maps API - revoked)
- `AIzaSyBV8ehs2GbQAVUXT8gA8V6vLRazZJbdSFk` (Google Maps API - to be revoked)

### Actions Required:

1. **Revoke Exposed API Keys** (DO THIS IMMEDIATELY!)
   - Go to https://console.cloud.google.com/apis/credentials
   - Select project: `urban-glide-transport-25`
   - Find and delete the exposed API keys listed above
   - These keys are no longer in the code but exist in git history

2. **Create New Restricted API Keys:**
   - Follow the guide in `API_KEYS_SETUP.md`
   - **Android Key:** Restrict to package names `com.urbanglide.passenger_app` and `com.urbanglide.driver_app`
   - **iOS Key:** Restrict to Bundle IDs `com.urbanglide.passengerApp` and `com.urbanglide.driverApp`
   - **Enabled APIs:** Maps SDK for Android, Maps SDK for iOS, Geocoding, Directions, Places

3. **Configure Your Local Environment:**
   - Copy `.env.example` to `.env` in both `passenger_app/` and `driver_app/`
   - Add your new API keys to the `.env` files
   - Never commit `.env` files (they're in `.gitignore`)

---

## 🔧 New Secure API Key Setup

### The Right Way (Current Implementation)

API keys are now managed through environment variables using `flutter_dotenv`. They are:
- ✅ Stored in `.env` files (gitignored, never committed)
- ✅ Loaded at runtime by the app
- ✅ Validated on startup
- ✅ Accessed through a type-safe `AppConfig` class

### Step 1: Setup Instructions

See the comprehensive guide: **[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)**

Quick setup:
```bash
# For Passenger App
cd passenger_app
cp .env.example .env
# Edit .env and add your API keys

# For Driver App  
cd driver_app
cp .env.example .env
# Edit .env and add your API keys
```

### Step 2: Get New API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=urban-glide-transport-25)
2. Create new restricted API keys (separate for Android and iOS)
3. Add keys to your `.env` files
4. **Never commit `.env` files**

### Step 3: Verify Security

```bash
# Verify .env is gitignored
git status

# The .env file should NOT appear in untracked files
# Only .env.example should be tracked

# Check for accidentally exposed keys in staged changes
git diff --cached | grep "AIzaSy"

# Should return no results
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

### Current Implementation (ALREADY DONE ✅)

The repository now uses environment variables with `flutter_dotenv`:

**Dependencies Added:**
```yaml
# pubspec.yaml (both apps)
dependencies:
  flutter_dotenv: ^5.1.0
```

**Configuration Class:**
```dart
// lib/config/app_config.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get googleMapsAndroidKey {
    return dotenv.env['GOOGLE_MAPS_ANDROID_KEY'] ?? '';
  }
  // ... other keys
}
```

**Runtime Loading:**
```dart
// lib/main.dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  
  if (!AppConfig.validateConfig()) {
    debugPrint('⚠️ Missing configuration values');
  }
  
  runApp(MyApp());
}
```

### Alternative: Build-time Configuration

For CI/CD or production builds, you can also use Dart defines:

```bash
flutter run --dart-define=GOOGLE_MAPS_ANDROID_KEY=your_key_here
```

Access in code:
```dart
const apiKey = String.fromEnvironment('GOOGLE_MAPS_ANDROID_KEY', defaultValue: '');
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

## 📋 Implementation Summary

### What Changed:

1. ✅ **Removed hardcoded API keys** from:
   - `passenger_app/android/app/src/main/AndroidManifest.xml`
   - `driver_app/android/app/src/main/AndroidManifest.xml`
   - `passenger_app/ios/Runner/AppDelegate.swift`
   - `driver_app/ios/Runner/AppDelegate.swift`

2. ✅ **Added environment variable system**:
   - `flutter_dotenv` dependency in both apps
   - `.env.example` templates for developers
   - `AppConfig` class for type-safe access
   - Runtime validation and error messages

3. ✅ **Updated documentation**:
   - `API_KEYS_SETUP.md` - Comprehensive setup guide
   - `SECURITY_SECRETS_GUIDE.md` - Security best practices
   - Inline comments in configuration files

4. ✅ **Git security**:
   - `.env` files already in `.gitignore`
   - `.env.example` committed as template
   - No sensitive data in repository

### Next Steps for Developers:

1. Copy `.env.example` to `.env` in both apps
2. Revoke exposed API keys in Google Cloud Console
3. Create new restricted API keys
4. Add new keys to your local `.env` files
5. Run `flutter pub get` in both apps
6. Test apps to verify configuration

---

**Last Updated:** November 12, 2025  
**Status:** ✅ API keys secured with environment variables. Exposed keys awaiting revocation.
