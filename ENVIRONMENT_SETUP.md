# 🚀 Environment Setup Quick Guide

## First Time Setup

### 1. Install Dependencies

Both apps require Flutter 3.0+ and Dart SDK.

```bash
# Navigate to each app and install dependencies
cd passenger_app
flutter pub get

cd ../driver_app
flutter pub get
```

### 2. Configure API Keys

**IMPORTANT**: API keys are now managed via environment variables and are NOT committed to the repository.

#### Passenger App

```bash
cd passenger_app
cp .env.example .env
```

Edit `.env` and add your actual API keys:
```env
GOOGLE_MAPS_ANDROID_KEY=your_android_key_here
GOOGLE_MAPS_IOS_KEY=your_ios_key_here
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true
```

#### Driver App

```bash
cd driver_app
cp .env.example .env
```

Edit `.env` and add your actual API keys:
```env
GOOGLE_MAPS_ANDROID_KEY=your_android_key_here
GOOGLE_MAPS_IOS_KEY=your_ios_key_here
```

### 3. Get API Keys

Follow the detailed guide in [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) to:
- Create restricted Google Maps API keys
- Configure PayFast merchant account (for passenger app)
- Set up Firebase (if not already configured)

### 4. Run the Apps

```bash
# Passenger App
cd passenger_app
flutter run --no-sound-null-safety

# Driver App
cd driver_app
flutter run --no-sound-null-safety
```

Note: `--no-sound-null-safety` flag is required due to dependency compatibility.

## Verification

When you run the app, check the console output:

✅ **Success**:
```
Running app...
```

❌ **Missing Configuration**:
```
⚠️ Missing configuration values: GOOGLE_MAPS_ANDROID_KEY, GOOGLE_MAPS_IOS_KEY
Please copy .env.example to .env and fill in your API keys.
```

## Security Checklist

Before committing code, ensure:

- [ ] `.env` files are NOT committed (should be in `.gitignore`)
- [ ] No API keys in `AndroidManifest.xml` (should only have `YOUR_GOOGLE_MAPS_API_KEY_PLACEHOLDER`)
- [ ] No API keys in `AppDelegate.swift` (should only have `YOUR_GOOGLE_MAPS_API_KEY_PLACEHOLDER`)
- [ ] `.env.example` files contain only placeholder values
- [ ] No hardcoded secrets in any source files

## Files to Never Commit

These files contain sensitive data and must never be committed:

```
passenger_app/.env
driver_app/.env
**/google-services.json
**/GoogleService-Info.plist
payfast_config.json
merchant_credentials.json
```

## Team Onboarding

When a new developer joins:

1. Clone the repository
2. Copy `.env.example` to `.env` in both apps
3. Request API keys from team lead
4. Add keys to `.env` files
5. Run `flutter pub get` in both apps
6. Test apps locally

## Troubleshooting

### "Unable to load .env file"
- Ensure `.env` file exists in the app directory
- Verify it's named exactly `.env` (not `.env.txt`)
- Check that pubspec.yaml includes `.env` in assets

### "Missing configuration values"
- Open your `.env` file
- Ensure all required keys are present
- Check for typos in variable names
- Verify no extra spaces around `=` signs

### Google Maps not working
- Verify API key is correct
- Check API key restrictions in Google Cloud Console
- Ensure billing is enabled
- Verify required APIs are enabled (Maps SDK, Geocoding, etc.)

## Additional Resources

- [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) - Detailed API key configuration
- [SECURITY_SECRETS_GUIDE.md](./SECURITY_SECRETS_GUIDE.md) - Security best practices
- [RUN_APPS.md](./RUN_APPS.md) - Troubleshooting app runtime issues
- [QUICK_SETUP.md](./QUICK_SETUP.md) - Firebase and platform setup

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
3. Ensure all prerequisites are installed (Flutter, Android SDK, Xcode)
4. Contact the development team

---

**Last Updated**: November 12, 2025
