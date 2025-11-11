# Urban Glide - VS Code Complete Setup Guide

## 📁 Project Structure Overview

```
urban_glide/
├── passenger_app/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   │   ├── user_model.dart
│   │   │   ├── ride_model.dart
│   │   │   ├── driver_model.dart
│   │   │   └── location_data.dart
│   │   ├── providers/
│   │   │   ├── auth_provider.dart
│   │   │   ├── ride_provider.dart
│   │   │   ├── location_provider.dart
│   │   │   └── realtime_ride_provider.dart
│   │   ├── services/
│   │   │   ├── error_handler.dart
│   │   │   ├── firebase_service_wrapper.dart
│   │   │   ├── connectivity_service.dart
│   │   │   ├── realtime_location_service.dart
│   │   │   ├── notification_service.dart
│   │   │   └── matching_service.dart
│   │   ├── screens/
│   │   │   ├── splash_screen.dart
│   │   │   ├── login_screen.dart
│   │   │   ├── home_screen.dart
│   │   │   ├── ride_booking_screen.dart
│   │   │   ├── active_ride_screen.dart
│   │   │   ├── ride_history_screen.dart
│   │   │   └── profile_screen.dart
│   │   └── widgets/
│   │       └── async_button.dart
│   ├── android/
│   ├── ios/
│   ├── test/
│   ├── pubspec.yaml
│   └── README.md
├── driver_app/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── providers/
│   │   ├── services/
│   │   └── screens/
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   └── README.md
├── admin_app/
│   ├── lib/
│   │   ├── main.dart
│   │   └── screens/
│   ├── pubspec.yaml
│   └── README.md
├── firebase/
│   ├── firestore.rules
│   └── functions/
│       ├── index.js
│       └── package.json
└── docs/
    ├── setup_guide.md
    ├── testing_guide.md
    └── deployment_guide.md
```

---

## 🚀 STEP-BY-STEP SETUP INSTRUCTIONS

### Step 1: Prerequisites Installation (30 minutes)

**1.1 Install Flutter SDK**
```bash
# macOS (using Homebrew)
brew install flutter

# Windows
# Download from: https://docs.flutter.dev/get-started/install/windows
# Extract to C:\src\flutter

# Linux
sudo snap install flutter --classic

# Verify installation
flutter doctor
```

**1.2 Install VS Code**
- Download from: https://code.visualstudio.com/
- Install and launch VS Code

**1.3 Install VS Code Extensions**
- Open VS Code
- Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
- Install these extensions:
  1. **Flutter** (by Dart Code)
  2. **Dart** (by Dart Code)
  3. **Firebase** (by Toba)
  4. **Error Lens** (by Alexander)
  5. **Better Comments** (by Aaron Bond)
  6. **Bracket Pair Colorizer** (by CoenraadS)

**1.4 Install Android Studio** (for Android development)
- Download from: https://developer.android.com/studio
- Install Android SDK
- Accept Android licenses: `flutter doctor --android-licenses`

**1.5 Install Xcode** (for iOS development - macOS only)
- Download from Mac App Store
- Run: `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`
- Run: `sudo xcodebuild -runFirstLaunch`

---

### Step 2: Create Project Structure (10 minutes)

**2.1 Open Terminal/Command Prompt**

**2.2 Create Main Directory**
```bash
# Navigate to your workspace
cd ~/Documents  # macOS/Linux
cd C:\Users\YourName\Documents  # Windows

# Create main project folder
mkdir urban_glide
cd urban_glide
```

**2.3 Create Flutter Apps**
```bash
# Create Passenger App
flutter create passenger_app
cd passenger_app

# Create Driver App
cd ..
flutter create driver_app

# Create Admin App
cd ..
flutter create admin_app
```

**2.4 Create Additional Directories**
```bash
# Still in urban_glide directory
mkdir firebase
mkdir docs
mkdir firebase/functions
```

---

### Step 3: Open in VS Code (5 minutes)

**3.1 Launch VS Code**
```bash
# From urban_glide directory
code .
```

**3.2 Configure VS Code Workspace**
- File → Add Folder to Workspace
- Add `passenger_app`
- Add `driver_app`
- Add `admin_app`
- File → Save Workspace As → `urban_glide.code-workspace`

**3.3 Configure Flutter in VS Code**
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
- Type "Flutter: New Project"
- Verify Flutter SDK path is detected

---

### Step 4: Setup Firebase (20 minutes)

**4.1 Install Firebase CLI**
```bash
# Install Firebase Tools globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

**4.1.1 Login to Firebase**
```bash
# Login with your Google account
firebase login

# This will:
# 1. Open browser for Google authentication
# 2. Ask for permission to access Firebase projects
# 3. Return success message with your email
# 4. Store credentials locally for future commands

# Verify login status
firebase projects:list

# Alternative: Login with limited permissions (CI/CD)
firebase login:ci  # Generates a token for automated deployments
```

**Troubleshooting Firebase Login:**
- **Issue**: "Command not found"
  - Solution: Restart terminal after npm install, or add npm global bin to PATH
  
- **Issue**: Browser doesn't open
  - Solution: Use `firebase login --no-localhost` and paste the URL manually
  
- **Issue**: "Permission denied"
  - Solution: Ensure you have access to Firebase projects in your Google account

**4.2 Create Firebase Project**
1. Go to: https://console.firebase.google.com/
2. Click **"Add Project"** or **"Create a project"**
3. **Step 1 - Project Name**:
   - Enter: `urban-glide-production` (or your preferred name)
   - Note: Project ID will be auto-generated (e.g., `urban-glide-production-a1b2c`)
   - Click "Continue"
4. **Step 2 - Google Analytics** (optional):
   - Toggle off if you don't need analytics (simpler setup)
   - Or keep enabled and select analytics account
   - Click "Continue" or "Create Project"
5. **Step 3 - Wait for Setup** (30-60 seconds)
   - Firebase will provision your project
   - Click "Continue" when ready

**4.2.1 Enable Firebase Services**
After project creation, enable required services:
1. **Authentication**:
   - Click "Authentication" in left menu
   - Click "Get Started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider
   - Click "Save"

2. **Firestore Database**:
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Select "Start in test mode" (we'll update rules later)
   - Choose location: `us-central` (or closest to your users)
   - Click "Enable"

3. **Cloud Messaging** (for push notifications):
   - Automatically enabled with Firebase
   - No additional setup needed at this stage

**4.3 Initialize Firebase in Project**
```bash
# From urban_glide directory
firebase init

# Select:
# - Firestore
# - Functions
# - Use existing project: urban-glide-production
```

**4.4 Add Firebase to Flutter Apps**
```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Passenger App
cd passenger_app
flutterfire configure --project=urban-glide-production

# Configure Driver App
cd ../driver_app
flutterfire configure --project=urban-glide-production

# Configure Admin App
cd ../admin_app
flutterfire configure --project=urban-glide-production
```

---

### Step 5: Copy Project Files (15 minutes)

**5.1 Update pubspec.yaml Files**

Navigate to `passenger_app/pubspec.yaml` and replace with:

```yaml
name: passenger_app
description: Urban Glide Passenger Application
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  cloud_firestore: ^4.13.6
  firebase_messaging: ^14.7.9
  flutter_local_notifications: ^16.2.0
  connectivity_plus: ^5.0.2
  provider: ^6.1.1
  http: ^1.1.0
  uuid: ^4.2.1
  intl: ^0.18.1
  flutter_polyline_points: ^2.0.1
  url_launcher: ^6.2.2
  crypto: ^3.0.3
  webview_flutter: ^4.4.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
```

**Do the same for driver_app and admin_app pubspec.yaml**

**5.2 Install Dependencies**
```bash
# Passenger App
cd passenger_app
flutter pub get

# Driver App
cd ../driver_app
flutter pub get

# Admin App
cd ../admin_app
flutter pub get
```

---

### Step 6: Create File Structure (10 minutes)

**6.1 Create Directories**
```bash
# In passenger_app/
mkdir -p lib/models lib/providers lib/services lib/screens lib/widgets
mkdir -p assets/images assets/icons

# In driver_app/
mkdir -p lib/models lib/providers lib/services lib/screens
mkdir -p assets/images assets/icons

# In admin_app/
mkdir -p lib/screens lib/widgets
mkdir -p assets/images assets/icons
```

**6.1.1 Add Logo and Icon Assets**
Place these files in `passenger_app/assets/`:
- `assets/images/logo.png` - Full color logo (for light backgrounds)
- `assets/images/logo_white.png` - White logo (for dark backgrounds/app bars)
- `assets/images/splash_bg.png` - Splash screen background
- `assets/icons/location_pin.png` - Location pin icon (brand marker)
- `assets/icons/driver_icon.png` - Driver marker icon
- `assets/icons/passenger_icon.png` - Passenger marker icon

**Logo Specifications:**
- **Format**: PNG with transparency
- **Size**: 512x512px (logo), 1080x1920px (splash_bg)
- **Color Scheme**: Primary cyan #00D9FF on transparent background (logo.png), white on transparent (logo_white.png)
- **Usage**: 
  - `logo.png`: Splash screen, about page, marketing materials
  - `logo_white.png`: App bar, dark theme screens
  - `location_pin.png`: Replaces default map markers for brand consistency

Repeat for `driver_app` and `admin_app` assets folders.

**6.2 Create Empty Files**

For **Passenger App**, create these files:
```bash
cd passenger_app/lib

# Models
touch models/user_model.dart
touch models/ride_model.dart
touch models/driver_model.dart
touch models/location_data.dart

# Providers
touch providers/auth_provider.dart
touch providers/ride_provider.dart
touch providers/location_provider.dart
touch providers/realtime_ride_provider.dart

# Services
touch services/error_handler.dart
touch services/firebase_service_wrapper.dart
touch services/connectivity_service.dart
touch services/realtime_location_service.dart
touch services/notification_service.dart
touch services/matching_service.dart
touch services/payment_service.dart

# Screens
touch screens/splash_screen.dart
touch screens/login_screen.dart
touch screens/home_screen.dart
touch screens/ride_booking_screen.dart
touch screens/active_ride_screen.dart
touch screens/ride_history_screen.dart
touch screens/profile_screen.dart

# Widgets
touch widgets/async_button.dart
```

**Repeat similar structure for driver_app and admin_app**

---

### Step 7: Copy Code to Files (30 minutes)

I'll provide you with all the complete files. Follow this order:

**7.1 Copy Models**
- Open the artifacts I provided earlier
- Copy each model code into respective files

**7.2 Copy Services**
- Copy all service files (error_handler, location_service, etc.)

**7.3 Copy Providers**
- Copy all provider files

**7.4 Copy Screens**
- Copy all screen files

**7.5 Copy main.dart**
- Replace the default main.dart with the updated version

---

### Step 8: Configure Android (15 minutes)

**8.1 Update android/app/build.gradle**
```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.urbanglide.passenger"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }
}

dependencies {
    implementation 'com.android.support:multidex:1.0.3'
}
```

**8.2 Update AndroidManifest.xml**
```xml
<manifest>
    <!-- Add permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    
    <application
        android:label="Urban Glide"
        android:icon="@mipmap/ic_launcher">
        <!-- Add Google Maps API Key -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
            
        <!-- Add notification icon -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@mipmap/ic_launcher"/>
    </application>
</manifest>
```

**8.3 Add App Icon (Optional but Recommended)**
Replace default launcher icon with Urban Glide logo:
1. Create launcher icons using: https://icon.kitchen/ or https://appicon.co/
2. Upload `logo.png` to generate all required sizes
3. Download and replace files in:
   - `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - Include: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi

---

### Step 9: Configure iOS (15 minutes - macOS only)

**9.1 Update ios/Podfile**
```ruby
platform :ios, '12.0'

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
    end
  end
end
```

**9.2 Update Info.plist**
```xml
<key>CFBundleDisplayName</key>
<string>Urban Glide</string>

<key>CFBundleName</key>
<string>Urban Glide</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby drivers and calculate routes</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to track your ride and connect you with passengers</string>

<key>UIBackgroundModes</key>
<array>
    <string>location</string>
    <string>remote-notification</string>
</array>

<key>GMSApiKey</key>
<string>YOUR_GOOGLE_MAPS_API_KEY</string>
```

**9.3 Add App Icon (Optional but Recommended)**
Replace default app icon with Urban Glide logo:
1. Create iOS icons using: https://appicon.co/
2. Upload `logo.png` to generate AppIcon.appiconset
3. Replace `ios/Runner/Assets.xcassets/AppIcon.appiconset/` contents
4. Ensure all sizes included: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt (1x, 2x, 3x)

**9.4 Install Pods**
```bash
cd ios
pod install
cd ..
```

---

### Step 10: Configure Firestore Rules (5 minutes)

**10.1 Copy Firestore Rules**

Navigate to `firebase/firestore.rules` and paste the security rules from the artifact.

**10.2 Deploy Rules**
```bash
firebase deploy --only firestore:rules
```

---

### Step 11: Setup Cloud Functions (15 minutes)

**11.1 Navigate to Functions Directory**
```bash
cd firebase/functions
```

**11.2 Update package.json**
```json
{
  "name": "functions",
  "description": "Cloud Functions for Urban Glide",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1"
  }
}
```

**11.3 Install Dependencies**
```bash
npm install
```

**11.4 Copy index.js**
- Copy the Cloud Functions code from notification_service.dart artifact comments
- Paste into `firebase/functions/index.js`

**11.5 Deploy Functions**
```bash
firebase deploy --only functions
```

---

### Step 12: Configure Google Maps (10 minutes)

**12.1 Enable APIs in Google Cloud Console**
- Go to: https://console.cloud.google.com/
- Select your Firebase project
- Enable these APIs:
  - Maps SDK for Android
  - Maps SDK for iOS
  - Places API
  - Directions API
  - Geocoding API

**12.2 Create API Key**
- APIs & Services → Credentials
- Create credentials → API key
- Copy the API key

**12.3 Restrict API Key**
- Click on API key
- Application restrictions: Android apps / iOS apps
- API restrictions: Select enabled APIs
- Save

**12.4 Add to Apps**
- Replace `YOUR_GOOGLE_MAPS_API_KEY` in AndroidManifest.xml
- Replace `YOUR_GOOGLE_MAPS_API_KEY` in Info.plist

---

### Step 13: Run and Test (15 minutes)

**13.1 Check Flutter Doctor**
```bash
flutter doctor -v
```
Resolve any issues shown.

**13.2 Connect Device or Start Emulator**

For Android:
```bash
# List devices
flutter devices

# Start emulator
flutter emulators --launch <emulator_id>
```

For iOS:
```bash
# Open simulator
open -a Simulator
```

**13.3 Run Passenger App**
```bash
cd passenger_app
flutter run
```

**13.4 Run Driver App** (on another device/emulator)
```bash
cd driver_app
flutter run
```

**13.5 Run Admin App** (on web or device)
```bash
cd admin_app
flutter run -d chrome  # For web
```

---

### Step 14: Verify Installation (10 minutes)

**14.1 Run Smoke Tests**
- [ ] Passenger app launches without errors
- [ ] Login screen displays correctly
- [ ] Can create new account
- [ ] Location permission prompts appear
- [ ] Map displays (requires API key)
- [ ] Driver app launches
- [ ] Admin app launches

**14.2 Check Firebase Console**
- Go to Firebase Console
- Check Authentication → Users (should see test accounts)
- Check Firestore → Data (should see collections)
- Check Cloud Messaging (FCM tokens saved)

**14.3 Check Logs**
```bash
# View Flutter logs
flutter logs

# View Firebase logs
firebase functions:log
```

---

### Step 15: Final Configuration (10 minutes)

**15.1 Create .gitignore**
```bash
# In urban_glide directory
cat > .gitignore << EOL
# Flutter/Dart
.dart_tool/
.packages
.pub-cache/
.pub/
build/
*.lock

# IDE
.idea/
.vscode/
*.swp
*.swo

# Firebase
**/google-services.json
**/GoogleService-Info.plist
.firebase/

# API Keys
**/apikeys.properties

# Environment
.env
.env.local
EOL
```

**15.2 Create README.md**
```markdown
# Urban Glide - E-Hailing Service
### "DRIVEN BY THE NEW GENERATION"

![Urban Glide Logo](passenger_app/assets/images/logo.png)

Modern ride-hailing platform with three applications:
- **Passenger App**: Book rides, track drivers in real-time, manage ride history
- **Driver App**: Accept ride requests, track earnings, manage availability
- **Admin Panel**: Monitor platform metrics, manage users, view analytics

## 🎨 Branding
- **Colors**: Neon cyan (#00D9FF primary), Dark navy (#0A1628 background)
- **Theme**: Modern, futuristic design with glowing UI elements
- **Logo**: Location pin icon for brand consistency across all touchpoints

## 🛠️ Tech Stack
- Flutter 3.0+
- Firebase (Auth, Firestore, Cloud Functions, FCM)
- Google Maps Platform
- Provider (State Management)
- PayFast Payment Gateway

## 📦 Assets
- Logo variants: `logo.png` (full color), `logo_white.png` (dark theme)
- Custom icons: Location pin, driver marker, passenger marker
- All assets in `assets/images/` and `assets/icons/`

## 🚀 Setup
See docs/vscode_setup_guide.md for detailed instructions.

## 🏃 Running the Apps
\`\`\`bash
# Passenger
cd passenger_app && flutter run

# Driver
cd driver_app && flutter run

# Admin
cd admin_app && flutter run -d chrome
\`\`\`

## 🧪 Testing
\`\`\`bash
flutter test
\`\`\`

## 📱 Features
- ✅ Real-time location tracking
- ✅ Push notifications
- ✅ Intelligent driver-passenger matching
- ✅ Surge pricing
- ✅ Payment integration (PayFast)
- ✅ Production-ready security rules
- ✅ Comprehensive error handling
\`\`\`
```

**15.3 Initialize Git**
```bash
git init
git add .
git commit -m "Initial commit: Urban Glide e-hailing service"
```

---

## 🎯 QUICK START CHECKLIST

After following all steps, verify:

- [ ] Flutter SDK installed and working (`flutter doctor`)
- [ ] VS Code with Flutter extension installed
- [ ] Firebase project created
- [ ] All three Flutter apps created
- [ ] Dependencies installed (`flutter pub get`)
- [ ] Firebase configured in all apps
- [ ] Google Maps API key obtained and configured
- [ ] Firestore security rules deployed
- [ ] Cloud Functions deployed
- [ ] Android permissions configured
- [ ] iOS permissions configured (macOS only)
- [ ] Logo and assets added to all apps
- [ ] App icons replaced with Urban Glide logo (optional)
- [ ] Apps run without errors
- [ ] Firebase console shows data
- [ ] Git repository initialized

---

## 🐛 TROUBLESHOOTING

### Issue: "Flutter not found"
**Solution:** Add Flutter to PATH
```bash
# macOS/Linux
export PATH="$PATH:`pwd`/flutter/bin"

# Windows (PowerShell)
$env:Path += ";C:\src\flutter\bin"
```

### Issue: "Firebase project not found"
**Solution:** Re-run FlutterFire configure
```bash
flutterfire configure --project=your-project-id
```

### Issue: "Google Maps not displaying"
**Solution:**
1. Verify API key is correct
2. Check APIs are enabled in Google Cloud Console
3. Check billing is enabled
4. Verify SHA-1 certificate (Android)

### Issue: "Build failed on iOS"
**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter clean
flutter pub get
```

### Issue: "Permission denied errors"
**Solution:**
- Check AndroidManifest.xml has all permissions
- Check Info.plist has usage descriptions
- Request permissions at runtime

### Issue: "Cloud Functions deployment failed"
**Solution:**
```bash
# Check Node version (requires 18+)
node --version

# Reinstall dependencies
cd firebase/functions
rm -rf node_modules
npm install
firebase deploy --only functions
```

---

## 📞 NEXT STEPS

After successful setup:

1. **Create Test Accounts**
   - Create 2 passenger accounts
   - Create 2 driver accounts
   - Run admin app and verify drivers

2. **Test Core Features**
   - Test passenger ride booking
   - Test driver notifications
   - Test real-time location
   - Test ride completion

3. **Configure Production**
   - Update Firebase security rules
   - Set up production API keys
   - Configure PayFast merchant credentials
   - Configure app signing
   - Prepare for deployment

4. **Documentation**
   - Read setup_guide.md
   - Read testing_guide.md
   - Read deployment_guide.md

---

## 📚 USEFUL COMMANDS

```bash
# Run app
flutter run

# Run specific device
flutter run -d <device-id>

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release

# Run tests
flutter test

# Run specific test suite
flutter test test/unit_tests/

# Check for updates
flutter upgrade

# Clean build
flutter clean

# View logs
flutter logs

# List devices
flutter devices

# Check doctor
flutter doctor -v

# Deploy Firebase
firebase deploy --only firestore:rules,functions
```

---

**Setup Time Estimate:** 3-4 hours for complete setup
**Difficulty Level:** Intermediate
**Prerequisites Knowledge:** Basic Flutter, Firebase, Git

**Status:** ✅ Ready for Development
