# 🔐 API Keys Setup Guide

## Overview

API keys are now managed securely using environment variables instead of being hardcoded in the source code. This prevents accidental exposure of sensitive credentials in version control.

## Quick Setup

### 1. Create Environment File

For **Passenger App**:
```bash
cd passenger_app
cp .env.example .env
```

For **Driver App**:
```bash
cd driver_app
cp .env.example .env
```

### 2. Get Your API Keys

#### Google Maps API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select project: `urban-glide-transport-25` (or create a new one)
3. Click "Create Credentials" → "API Key"
4. **IMPORTANT**: Restrict your API keys immediately:

**For Android:**
- Click "Restrict Key"
- Under "Application restrictions", select "Android apps"
- Add package names:
  - Passenger App: `com.urbanglide.passenger_app`
  - Driver App: `com.urbanglide.driver_app`
- Add your app's SHA-1 fingerprint (get it with: `keytool -list -v -keystore ~/.android/debug.keystore`)

**For iOS:**
- Create a separate key for iOS
- Under "Application restrictions", select "iOS apps"
- Add bundle identifiers:
  - Passenger App: `com.urbanglide.passengerApp`
  - Driver App: `com.urbanglide.driverApp`

5. Under "API restrictions", select "Restrict key" and enable:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
   - Directions API
   - Places API

### 3. Configure Your .env File

Edit the `.env` file you created and add your actual API keys:

**Passenger App** (`passenger_app/.env`):
```env
GOOGLE_MAPS_ANDROID_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_IOS_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY

# PayFast credentials (optional, for payment processing)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true
```

**Driver App** (`driver_app/.env`):
```env
GOOGLE_MAPS_ANDROID_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_IOS_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### 4. Verify Setup

Run the app and check the console for configuration status:
```bash
flutter run
```

If configuration is missing, you'll see:
```
⚠️ Missing configuration values: GOOGLE_MAPS_ANDROID_KEY, GOOGLE_MAPS_IOS_KEY
Please copy .env.example to .env and fill in your API keys.
```

## How It Works

### Runtime Loading

1. When the app starts, `main.dart` loads the `.env` file using `flutter_dotenv`
2. The `AppConfig` class provides type-safe access to environment variables
3. API keys are accessed via getters like `AppConfig.googleMapsAndroidKey`
4. The app validates that all required keys are present

### Code Structure

```dart
// In your code, access API keys like this:
import 'package:passenger_app/config/app_config.dart';

// Get the API key
String apiKey = AppConfig.googleMapsAndroidKey;

// Check if configuration is valid
if (AppConfig.validateConfig()) {
  // All required keys are present
}
```

## Security Best Practices

### ✅ DO:
- Keep `.env` files local (they're in `.gitignore`)
- Use separate API keys for development and production
- Restrict API keys by platform (Android/iOS) and package/bundle ID
- Enable only the APIs you need
- Set up billing alerts in Google Cloud Console
- Rotate API keys regularly
- Use `.env.example` as a template for team members

### ❌ DON'T:
- Commit `.env` files to version control
- Share API keys in Slack, email, or other communication channels
- Use the same API key across multiple apps
- Leave API keys unrestricted
- Hardcode API keys in source code

## Alternative: Build-Time Configuration

If you prefer build-time injection instead of runtime loading, use Dart defines:

```bash
flutter run \
  --dart-define=GOOGLE_MAPS_ANDROID_KEY=your_android_key \
  --dart-define=GOOGLE_MAPS_IOS_KEY=your_ios_key
```

Then access them with:
```dart
const apiKey = String.fromEnvironment('GOOGLE_MAPS_ANDROID_KEY');
```

## Troubleshooting

### Error: "Unable to load .env file"

**Solution**: Ensure `.env` file exists in the app directory:
```bash
ls passenger_app/.env
# or
ls driver_app/.env
```

### Error: "Missing configuration values"

**Solution**: Check that all required keys are set in your `.env` file and match the names in `.env.example`

### Google Maps not working

**Solutions**:
1. Verify API key restrictions match your app's package/bundle ID
2. Ensure required APIs are enabled in Google Cloud Console
3. Check that billing is enabled (required for Google Maps)
4. Verify SHA-1 fingerprint for Android

### Getting SHA-1 Fingerprint

**Debug keystore**:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Release keystore**:
```bash
keytool -list -v -keystore /path/to/your/keystore.jks -alias your_alias
```

## PayFast Setup (Optional)

For payment processing with PayFast:

1. Sign up at [PayFast](https://www.payfast.co.za/)
2. Get your merchant credentials from the dashboard
3. For testing, use sandbox credentials
4. Add credentials to your `.env` file
5. Configure webhooks in PayFast dashboard to point to your backend

## CI/CD Setup

For GitHub Actions or other CI/CD platforms:

1. Add environment variables as secrets in your CI/CD platform
2. In your workflow, create `.env` file:

```yaml
- name: Create .env file
  run: |
    echo "GOOGLE_MAPS_ANDROID_KEY=${{ secrets.GOOGLE_MAPS_ANDROID_KEY }}" > passenger_app/.env
    echo "GOOGLE_MAPS_IOS_KEY=${{ secrets.GOOGLE_MAPS_IOS_KEY }}" >> passenger_app/.env
```

## Additional Resources

- [Google Maps Platform Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Flutter Environment Variables](https://pub.dev/packages/flutter_dotenv)
- [API Key Security](https://cloud.google.com/docs/authentication/api-keys)

---

**Last Updated**: November 12, 2025  
**Status**: API keys secured with environment variables
