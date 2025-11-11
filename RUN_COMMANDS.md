# Urban Glide - Quick Run Commands 🚀

**Last Updated:** November 9, 2025  
**Current Directory:** `C:\src\Claude`

---

## 📱 Running the Passenger App

### 1️⃣ Basic Run Commands

```powershell
# Navigate to passenger app
cd C:\src\Claude\passenger_app

# Run on available device
flutter run

# Run on specific device
flutter run -d windows      # Windows desktop
flutter run -d chrome       # Chrome browser
flutter run -d edge         # Edge browser
flutter run -d <device_id>  # Android emulator (when running)
```

---

### 2️⃣ Android Emulator Setup

#### **Check Available Emulators:**
```powershell
# List all Android Virtual Devices (AVDs)
emulator -list-avds
```

#### **Start Android Emulator:**
```powershell
# Method 1: Start specific emulator
emulator -avd Pixel_6_API_33

# Method 2: Start via Android Studio
# Tools → Device Manager → Click ▶ next to emulator

# Method 3: Start default emulator
flutter emulators --launch <emulator_name>
```

#### **Verify Emulator is Running:**
```powershell
flutter devices

# Should show something like:
# Android SDK built for x86 (mobile) • emulator-5554 • android-x86 • Android 13 (API 33)
```

---

### 3️⃣ Running on Android Emulator

```powershell
# Option 1: Auto-select device (if only one running)
cd C:\src\Claude\passenger_app
flutter run

# Option 2: Specify emulator
flutter run -d emulator-5554

# Option 3: Run in debug mode (default)
flutter run --debug

# Option 4: Run in release mode
flutter run --release

# Option 5: Run with verbose logging
flutter run -v
```

---

### 4️⃣ Hot Reload & Hot Restart

**While the app is running in the terminal:**

```
r      - Hot reload (faster, preserves state)
R      - Hot restart (slower, resets state)
h      - Help (show all commands)
q      - Quit (stop app)
c      - Clear screen
d      - Detach (keep app running, exit terminal)
```

**Hot Reload Example:**
1. Make code changes in VS Code
2. Press `r` in the terminal
3. Changes appear instantly (~1-2 seconds)

**Hot Restart Example:**
1. Make structural changes (new screens, routes)
2. Press `R` in the terminal
3. App restarts with changes (~3-5 seconds)

---

### 5️⃣ Development Workflow

#### **Complete Fresh Start:**
```powershell
cd C:\src\Claude\passenger_app

# Clean build cache
flutter clean

# Get dependencies
flutter pub get

# Run app
flutter run
```

#### **Quick Restart After Issues:**
```powershell
# Stop app (if running)
q

# Clean and run in one command
flutter clean && flutter pub get && flutter run
```

---

### 6️⃣ Health Check Commands

```powershell
# Check Flutter environment
flutter doctor -v

# Check available devices
flutter devices

# Check emulators
flutter emulators

# Check dependencies
cd C:\src\Claude\passenger_app
flutter pub get

# Analyze code
flutter analyze

# Run tests
flutter test
```

---

### 7️⃣ Building APK/App Bundle

```powershell
cd C:\src\Claude\passenger_app

# Build debug APK
flutter build apk --debug

# Build release APK
flutter build apk --release

# Build app bundle (for Play Store)
flutter build appbundle --release

# Output location:
# build/app/outputs/flutter-apk/app-debug.apk
# build/app/outputs/flutter-apk/app-release.apk
# build/app/outputs/bundle/release/app-release.aab
```

---

### 8️⃣ Running Driver App

```powershell
# Navigate to driver app
cd C:\src\Claude\driver_app

# Run on device
flutter run

# All commands same as passenger app
```

---

### 9️⃣ Running Admin App (Web)

```powershell
# Navigate to admin app
cd C:\src\Claude\admin_app

# Run on Chrome
flutter run -d chrome

# Run on Edge
flutter run -d edge

# Build web app
flutter build web

# Output location: build/web/
```

---

## 🔧 Troubleshooting

### Issue: No devices found

**Problem:** `flutter devices` shows only Windows/Chrome/Edge

**Solution:**
```powershell
# Start Android emulator first
emulator -list-avds           # List available emulators
emulator -avd Pixel_6_API_33  # Start specific emulator
flutter devices               # Verify emulator appears
flutter run                   # Run app
```

---

### Issue: App won't start on emulator

**Problem:** App crashes or shows errors

**Solution:**
```powershell
# 1. Clean build
flutter clean

# 2. Get dependencies
flutter pub get

# 3. Check for missing files
# Verify google-services.json exists:
ls C:\src\Claude\passenger_app\android\app\google-services.json

# 4. Run with verbose logging
flutter run -v
```

---

### Issue: "google-services.json not found"

**Problem:** Build fails with Firebase error

**Solution:**
```powershell
# 1. Download from Firebase Console
# https://console.firebase.google.com/project/urban-glide-transport-25

# 2. Copy to correct location
Copy-Item google-services.json C:\src\Claude\passenger_app\android\app\
Copy-Item google-services.json C:\src\Claude\driver_app\android\app\

# 3. Remove .PLACEHOLDER files
Remove-Item C:\src\Claude\passenger_app\android\app\google-services.json.PLACEHOLDER
Remove-Item C:\src\Claude\driver_app\android\app\google-services.json.PLACEHOLDER
```

---

### Issue: Gradle build fails

**Problem:** Android build errors

**Solution:**
```powershell
cd C:\src\Claude\passenger_app\android

# Clean Gradle cache
.\gradlew clean

# Rebuild
.\gradlew build --refresh-dependencies

# Or use Flutter clean
cd ..
flutter clean
flutter pub get
flutter run
```

---

### Issue: Slow builds

**Problem:** Initial build takes 5-10 minutes

**Solution:**
```powershell
# This is normal for first build!
# Subsequent builds will be faster (30-60 seconds)

# To optimize:
# 1. Already configured in gradle.properties (parallel builds, caching)
# 2. Keep emulator running between builds
# 3. Use hot reload (r) instead of full restart
```

---

## 📊 Current Environment Status

**Flutter:**
- ✅ Version: 3.35.7 (stable)
- ✅ Dart: 3.9.2
- ✅ Channel: stable

**Android Toolchain:**
- ✅ SDK: 36.1.0
- ✅ Emulator: 36.2.12.0
- ✅ Build Tools: 36.1.0
- ✅ Java: JDK 21 (OpenJDK)

**Available Devices:**
- ✅ Windows (desktop)
- ✅ Chrome (web)
- ✅ Edge (web)
- ⚠️ Android Emulator (not running - needs to be started)

**Dependencies:**
- ✅ passenger_app dependencies installed
- ✅ driver_app dependencies installed
- ✅ admin_app dependencies installed

---

## 🎯 Recommended Workflow

### **Daily Development:**

```powershell
# 1. Start emulator (once per session)
emulator -avd Pixel_6_API_33 &

# 2. Wait for emulator to boot (~2 minutes)

# 3. Run app
cd C:\src\Claude\passenger_app
flutter run

# 4. Make changes in VS Code

# 5. Hot reload (while app is running)
r

# 6. Hot restart if needed
R

# 7. Keep emulator running for fast iterations
```

### **Testing on Multiple Apps:**

```powershell
# Terminal 1: Passenger app
cd C:\src\Claude\passenger_app
flutter run

# Terminal 2: Driver app
cd C:\src\Claude\driver_app
flutter run

# Both can run simultaneously on different devices/emulators
```

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `flutter run` | Run app on available device |
| `flutter run -d <device>` | Run on specific device |
| `flutter devices` | List available devices |
| `flutter emulators` | List Android emulators |
| `flutter doctor -v` | Check environment |
| `flutter clean` | Clean build cache |
| `flutter pub get` | Install dependencies |
| `flutter analyze` | Analyze code |
| `flutter test` | Run tests |
| `r` | Hot reload (while running) |
| `R` | Hot restart (while running) |
| `q` | Quit app (while running) |

---

**Next Steps:**
1. Start Android emulator: `emulator -list-avds` then `emulator -avd <name>`
2. Run passenger app: `cd C:\src\Claude\passenger_app && flutter run`
3. Make changes and use `r` for instant updates
4. See `ANDROID_STUDIO_SETUP.md` for emulator setup details

**Status:** ✅ Ready to run (emulator needs to be started)
