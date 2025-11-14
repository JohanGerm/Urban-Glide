## System Overview

This is an e-hailing platform (ride-sharing system) built with Flutter/Dart, designed as a monorepo with three interconnected applications that will form a complete ride-booking ecosystem.

**Development Status:** 🚧 **FOUNDATION/TEMPLATE STAGE** - Apps currently contain Flutter starter template code. Backend infrastructure and documentation are production-ready, but application features are not yet implemented.

**Current Implementation Status:**
- ✅ **Repository Structure**: Monorepo with 3 separate Flutter apps (passenger_app, driver_app, admin_app)
- ✅ **Firebase Backend**: Production-ready Firestore security rules, Cloud Functions skeleton, Firebase configuration
- ✅ **CI/CD Pipeline**: GitHub Actions workflow with analyze, test, build, and security scanning
- ✅ **Build Configuration**: VS Code tasks, Flutter project setup, dependency management
- ✅ **Documentation**: Comprehensive setup guides, Firebase integration docs, README
- ❌ **Application Code**: Apps contain only Flutter template/counter demo code
- ❌ **Features**: No ride booking, location tracking, or user management implemented yet

**Planned Technical Stack** (for future implementation):
- **Backend**: Firebase (Authentication, Cloud Firestore for real-time data sync, Cloud Messaging for push notifications)
- **State Management**: Provider pattern (passenger/driver apps); direct StreamBuilder queries (admin app)
- **Mapping**: Google Maps Platform (route visualization, distance calculations, geocoding)
- **Location Services**: Geolocator package (permission handling, continuous GPS updates)
- **Architecture**: Clean separation of concerns — Models (data structures), Providers (business logic/state), Screens (UI)

## Development Roadmap & Feature Status

**🔴 CORE FEATURES (Not Yet Implemented):**
All application features are planned but not yet implemented in the codebase:
1. **Payment Integration**: PayFast payment gateway planned for South African market (design documented)
2. **Real-Time Location Updates**: Driver location tracking with Firestore streams (architecture designed)
3. **Push Notifications**: FCM integration with Cloud Functions triggers (functions skeleton exists in `firebase/functions/index.js`)
4. **Driver-Passenger Matching**: Proximity-based matching with scoring algorithm (design documented)
5. **Ride Booking Flow**: Complete workflow from passenger request to ride completion (screens planned)
6. **User Authentication**: Firebase Auth integration for passengers and drivers (not yet implemented)
7. **Admin Dashboard**: Web-based admin interface with analytics (UI design ready)

**✅ INFRASTRUCTURE READY:**
- Firebase backend configuration (Firestore rules, Cloud Functions setup, firebase.json)
- CI/CD pipeline with automated testing, building, and security scanning
- Project structure and monorepo organization
- Development environment setup (VS Code tasks, build scripts)
- Google Maps integration planned (API key placeholders in place)

**📋 IMPLEMENTATION REQUIREMENTS:**
To bring this project from template to production, the following must be implemented:
1. **State Management**: Create Provider classes for Auth, Ride, Location management
2. **Data Models**: Define Dart classes for User, Driver, Ride, Location data
3. **Services Layer**: Implement Firebase, Maps, Notification, Payment service classes
4. **UI Screens**: Build all screens (splash, login, home, booking, tracking, history, profile)
5. **Real-time Features**: Implement Firestore listeners for live updates
6. **Testing**: Add comprehensive test coverage (unit, widget, integration)
7. **Security**: Implement proper authentication and authorization flows

**Testing Infrastructure:**
- ✅ CI/CD test pipeline configured (`flutter test` runs in GitHub Actions)
- ❌ Test suites not yet created (only default widget_test.dart files exist)
- 📋 Planned: Unit tests, widget tests, integration tests, performance tests, security tests

**Estimated Development Timeline:**
From current template state to production-ready application: **3-6 months** with dedicated development team.
- Month 1-2: Core features (auth, ride booking, basic tracking)
- Month 3-4: Advanced features (real-time updates, notifications, payments)
- Month 5-6: Testing, security hardening, performance optimization, deployment

## Repo snapshot and purpose

This is a Flutter/Dart monorepo containing three Flutter applications: `driver_app/`, `passenger_app/`, and `admin_app/`. Each app has its own `pubspec.yaml`, `lib/`, `test/`, and platform-specific folders (android/, ios/, web/, etc.).

**Current State (Template Apps):**
- All three apps currently contain only the default Flutter starter code (counter demo app)
- Each app has a single `lib/main.dart` file with basic StatefulWidget structure
- No custom features, screens, or business logic implemented yet
- Dependencies are declared in pubspec.yaml but not yet used in code

**Planned Applications:**
- **`passenger_app/`**: E-hailing passenger application ("URBAN GLIDE - DRIVEN BY THE NEW GENERATION"). Planned features: authentication, real-time GPS tracking, interactive maps, ride booking with pickup/dropoff selection, fare estimation, active ride tracking with driver location updates, ride history, and profile management. Will use modern neon cyan theme (#00D9FF) with dark navy background, glowing UI elements, and location pin branding.
- **`driver_app/`**: Driver-side application ("URBAN GLIDE Driver"). Planned features: driver registration with vehicle details, availability toggle, real-time ride request notifications, ride acceptance/rejection, active ride management with passenger info, continuous location tracking to backend, earnings tracking, and ride history. Will match passenger app's neon aesthetic.
- **`admin_app/`**: Web-focused admin dashboard ("RideGo Admin"). Planned features: system-wide metrics (total rides, active rides, passenger/driver counts), passenger management (view/delete), driver management (verification status), ride monitoring with detailed info, and analytics with status-based distribution. Will use direct Firestore `StreamBuilder` queries (no Provider architecture).

**Project Structure (Planned):**
When features are implemented, each app will have:
- `lib/models/` — Data model classes (User, Driver, Ride, Location)
- `lib/providers/` — State management with Provider pattern (passenger/driver apps only)
- `lib/services/` — Business logic (Firebase, Maps, Notifications, Payments)
- `lib/screens/` — UI screens (splash, login, home, booking, tracking, etc.)
- `lib/widgets/` — Reusable UI components
- `test/unit_tests/`, `test/widget_tests/`, `test/integration_tests/` — Test suites

## Quick contract (what you should produce)
- Inputs: `pubspec.yaml` files in each app, `lib/` source code, `test/` files, and `.vscode/tasks.json` for VS Code tasks.
- Outputs: a short summary of app architecture, concrete Flutter commands (run, test, build), and one small, safe code change per user request.
- Error modes: if `pubspec.yaml` or `lib/main.dart` is missing, report what's missing and propose next steps.

## Running Applications

**Standard Flutter Commands:**
All apps use standard Flutter commands without special flags:
- `flutter run` — Run app on connected device/emulator
- `flutter run -d chrome` — Run web app in Chrome (for admin_app)
- `flutter build apk` — Build Android APK
- `flutter build ios` — Build iOS app (requires macOS)
- `flutter build web` — Build web application (for admin_app)

**VS Code Tasks (Recommended):**
The repository includes 12 predefined VS Code tasks in `.vscode/tasks.json`:
- **Run Tasks:**
  - `flutter: Run Passenger App` → runs from `passenger_app/` directory
  - `flutter: Run Driver App` → runs from `driver_app/` directory
  - `flutter: Run Admin App (Chrome)` → runs admin app in Chrome
- **Build Tasks:**
  - `flutter: Build APK (Passenger)` → release build for passenger app
  - `flutter: Build APK (Driver)` → release build for driver app
- **Maintenance Tasks:**
  - `flutter: Clean All` → cleans all three apps in sequence
  - `flutter: Get Dependencies (All Apps)` → runs `flutter pub get` for all apps
  - `flutter: Run Tests (Passenger)` → runs tests for passenger app
  - `flutter: Run Tests (Driver)` → runs tests for driver app
- **Firebase Tasks:**
  - `firebase: Deploy Functions` → deploys Cloud Functions
  - `firebase: Deploy Firestore Rules` → deploys security rules
  - `firebase: Emulate Functions` → runs Functions emulator locally

**Access VS Code Tasks:**
- Command Palette: `Ctrl+Shift+P` → "Tasks: Run Task"
- Terminal menu: "Terminal → Run Task"
- Keyboard shortcut: `Ctrl+Shift+B` (default build task)

## First actions for any agent run (order matters)
1. List top-level directories. This repo uses a monorepo layout: `driver_app/`, `passenger_app/`, and `admin_app/` are separate Flutter apps.
2. For each app, read `pubspec.yaml` to capture dependencies, SDK constraints (`sdk: '>=3.0.0 <4.0.0'`), and package name.
3. Read `.github/workflows/*.yml` (if present) to capture CI build/test commands.
4. Check `lib/` for main entry point (`lib/main.dart`) and common Flutter structure: `lib/screens/`, `lib/widgets/`, `lib/models/`, `lib/services/`, `lib/providers/`.
5. Check `test/` for widget/unit tests. Flutter uses `flutter test` (runs all tests). Test structure: `test/unit_tests/`, `test/widget_tests/`, `test/integration_tests/`, `test/performance_tests/`, `test/security_tests/`.
6. Check `assets/` folders and `pubspec.yaml` `flutter.assets` section for image/icon resources.

## What to document in your first summary
- Project language: Dart (SDK `>=3.0.0 <4.0.0` from `pubspec.yaml`).
- **Package manager**: `flutter pub get` to install dependencies.
- **Build command**: `flutter build <platform>` (e.g., `flutter build apk`, `flutter build ios`, `flutter build web`).
- **Test commands**: 
  - `flutter test` — Run all tests (unit, widget, integration)
  - `flutter test test/unit_tests/` — Run unit tests only
  - `flutter test test/widget_tests/` — Run widget tests only
  - `flutter test test/integration_tests/ --integration` — Run integration tests only
  - `flutter test test/<file>_test.dart` — Run specific test file
  - `flutter test --coverage` — Generate coverage report
- **Run command**: `cd passenger_app && flutter run` (or `driver_app`, `admin_app`; specify device with `-d <device_id>`).
- **Dependencies** (from `passenger_app/pubspec.yaml` v1.0.0+1):
  - **Core Flutter**: `flutter`, `cupertino_icons ^1.0.2`
  - **Firebase**: `firebase_core ^4.2.1`, `firebase_auth ^6.1.2`, `cloud_firestore ^6.1.0`, `firebase_messaging ^16.0.4`
  - **Google Maps**: `google_maps_flutter ^2.5.0`, `geolocator ^14.0.2`, `geocoding ^4.0.0`, `flutter_polyline_points ^3.1.0`
  - **Notifications**: `flutter_local_notifications ^19.5.0`
  - **Networking**: `http ^1.1.0`, `connectivity_plus ^7.0.0`
  - **State Management**: `provider ^6.1.1`
  - **Utilities**: `uuid ^4.2.1`, `intl ^0.20.2`, `url_launcher ^6.2.2`
  - **Payment**: `crypto ^3.0.3` (for PayFast MD5 signatures), `webview_flutter ^4.4.2` (for in-app payment flow)
  - **Dev Dependencies**: `flutter_test`, `flutter_lints ^6.0.0`, `integration_test`
  - **Assets**: `assets/images/`, `assets/icons/` (planned: logo.png, logo_white.png, splash_bg.png, location_pin.png, driver_icon.png, passenger_icon.png)
  - Note: `driver_app` uses similar dependencies; `admin_app` is web-focused and will use `fl_chart` for analytics
- **Key integration points**:
  - **Firebase**: `firebase_core`, `firebase_auth`, `cloud_firestore`, `firebase_messaging` (check `google-services.json`, `GoogleService-Info.plist`)
  - **Google Maps**: `google_maps_flutter`, `geolocator`, `geocoding`, `flutter_polyline_points` (requires API keys in platform manifests)
  - **State management**: Provider (see `lib/providers/`)
  - **HTTP clients**: `http` package for REST APIs (check `lib/services/`)
  - **Error handling**: `connectivity_plus` for network status monitoring (see `lib/services/error_handler.dart`)
  - **Real-time location**: `RealtimeLocationService` for driver location broadcasting and passenger tracking (see `lib/services/realtime_location_service.dart`)
  - **Push notifications**: `firebase_messaging`, `flutter_local_notifications` for FCM and local notification delivery (see `lib/services/notification_service.dart`), requires Firebase Cloud Functions deployment
  - **Driver matching**: `MatchingService` for intelligent driver-passenger matching with scoring algorithm (see `lib/services/matching_service.dart`)
  - **Payment processing**: PayFast payment gateway integration (see `lib/services/payment_service.dart`), requires merchant credentials and webhook configuration

## Project-specific conventions (Flutter/Dart)
- **Monorepo layout**: each app (`driver_app/`, `passenger_app/`, `admin_app/`) is a standalone Flutter project. Always `cd` into the app directory before running Flutter commands.
- **Current State**: All apps contain only Flutter template code with basic counter demo. No custom architecture implemented yet.
- **Planned Architecture** (for future implementation):
  - **State management**: 
    - `passenger_app/` and `driver_app/` will use Provider pattern (`provider: ^6.1.1`)
    - Planned providers: `AuthProvider`, `RideProvider`, `LocationProvider`, `RealtimeRideProvider` (passenger); `DriverAuthProvider`, `DriverRideProvider`, `DriverLocationProvider` (driver)
    - Providers will be registered in `lib/main.dart` using `MultiProvider`
    - `admin_app/` will use direct `StreamBuilder<QuerySnapshot>` with Firestore queries (no Provider)
  - **Routing**: Named routes to be defined in `lib/main.dart` for navigation between screens
  - **Theming & Brand Identity**: "URBAN GLIDE - DRIVEN BY THE NEW GENERATION" branding planned with modern neon cyan aesthetic:
    - Primary cyan `#00D9FF`, secondary blue `#0080FF`, dark navy background `#0A1628`, surface `#1A2742`
    - Neon glow effects, rounded corners, elevated shadows, gradient backgrounds
    - Location pin icon for brand consistency
  - **Screens**: To be organized in `lib/screens/` directories:
    - Planned screens: splash, login, home, booking, active ride, history, profile
    - Will use `StatefulWidget` for local UI state
  - **Models**: To be created in `lib/models/` with data classes:
    - `LocationData`, `UserModel`, `DriverModel`, `RideModel` with `toJson()`/`fromJson()` for Firestore serialization
  - **Services**: To be created in `lib/services/`:
    - Firebase services, Google Maps integration, Notification handling, Payment processing
- **Firebase setup**: Apps require `google-services.json` (Android) in `android/app/` and `GoogleService-Info.plist` (iOS) in `ios/Runner/`. Config files must be downloaded from Firebase Console.
- **Google Maps API keys**: Must be configured in `android/app/src/main/AndroidManifest.xml` for `com.google.android.geo.API_KEY` and `ios/Runner/AppDelegate.swift` or `Info.plist` for iOS keys.
- **Assets**: Asset directories declared in `pubspec.yaml` (`assets/images/`, `assets/icons/`) but no assets files exist yet in repository.
- **Platform-specific code**: Permissions configured in `android/app/src/main/AndroidManifest.xml` (location, internet, notifications) and `ios/Runner/Info.plist` (NSLocationWhenInUseUsageDescription, etc.).

## Integration and cross-component signals to capture
- **CI/CD Pipeline** (`.github/workflows/flutter-ci.yml`) — Automated workflow configured:
  - **Jobs**: `analyze-and-test-passenger`, `analyze-and-test-driver`, `analyze-and-test-admin`, `build-android`, `build-web`, `security-scan`
  - **Flutter Version**: 3.35.7 (stable channel)
  - **Commands Used**:
    - `flutter pub get` — Install dependencies
    - `dart format --output=none --set-exit-if-changed .` — Verify code formatting
    - `flutter analyze --fatal-infos` — Static code analysis
    - `flutter test` — Run all tests
    - `flutter test --coverage` — Generate coverage reports (uploads to Codecov)
    - `flutter build apk --debug` — Build Android APK (passenger/driver apps)
    - `flutter build web --release` — Build web app (admin app)
  - **Security**: Trivy vulnerability scanner runs on every push/PR
  - **Artifacts**: APKs and web builds uploaded with 30-day retention
  - **Triggers**: Runs on push/PR to main/develop branches, manual dispatch available
- **Firebase**: All three apps have Firebase dependencies declared:
  - **Current packages**: `firebase_core ^4.2.1`, `firebase_auth ^6.1.2`, `cloud_firestore ^6.1.0`, `firebase_messaging ^16.0.4`
  - **Configuration files needed**: `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) must be downloaded from Firebase Console
  - **Firebase initialization**: Not yet implemented in code (template code doesn't use Firebase)
  - **Planned usage**: Authentication, real-time database with Firestore, push notifications with FCM
- **Google Maps**: Dependencies declared: `google_maps_flutter ^2.5.0`, `geolocator ^14.0.2`, `geocoding ^4.0.0`, `flutter_polyline_points ^3.1.0`
  - API keys must be configured in `AndroidManifest.xml` and iOS `AppDelegate.swift`
  - Not yet used in application code
- **HTTP/REST**: `http ^1.1.0` package available but no service classes implemented yet
- **Platform permissions**: Already configured in manifests:
  - Android: `INTERNET`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `POST_NOTIFICATIONS` in `AndroidManifest.xml`
  - iOS: Location usage descriptions in `Info.plist`
- **Firestore collections** (planned schema, not yet populated):
  - `passengers` — Passenger profiles
  - `drivers` — Driver profiles with location and availability status
  - `rides` — Ride records with status tracking
  - `admins` — Admin user access control
  - Additional collections planned: `support`, `notifications`, `promoCodes`, `earnings`, `analytics`
- **Firestore Security Rules**: ✅ Production-ready rules exist in `firebase/firestore.rules`:
  - Role-based access control (passengers, drivers, admins)
  - Field-level validation (email format, phone format)
  - User data isolation (users can only modify their own data)
  - Audit trail protection (rides cannot be deleted)
  - Helper functions: `isSignedIn()`, `isOwner(userId)`, `isValidEmail()`, `isValidPhone()`
  - **To deploy**: `firebase deploy --only firestore:rules` (from firebase/ directory)
- **Planned Features** (architecture designed but not yet implemented):
  - **Error Handling**: Custom exception types, retry logic with exponential backoff, connectivity monitoring
  - **Real-Time Location Tracking**: Driver location broadcasting, passenger tracking, distance/ETA calculation
  - **Push Notifications**: FCM integration with local notifications, Cloud Functions triggers
  - **Driver-Passenger Matching**: Proximity-based search, multi-factor scoring algorithm, surge pricing
  - **Payment Integration**: PayFast gateway for South African market, secure signature verification

## VS Code Development Workflow

**Task Management**: This workspace has 12 predefined VS Code tasks in `.vscode/tasks.json` for common operations:
- **Run tasks**: Passenger App, Driver App, Admin App (Chrome)
- **Build tasks**: APK builds for Passenger/Driver apps
- **Maintenance tasks**: Clean All, Get Dependencies (All Apps), Run Tests
- **Firebase tasks**: Deploy Functions, Deploy Firestore Rules, Emulate Functions

**Access tasks via**: 
- Command Palette: `Ctrl+Shift+P` → "Tasks: Run Task"
- Terminal menu: "Terminal → Run Task"
- Keyboard shortcut: `Ctrl+Shift+B` (default build task)

**PowerShell Environment**: This workspace uses PowerShell as the default shell. Multi-app commands use `;` separator:
```powershell
cd passenger_app; flutter pub get; cd ../driver_app; flutter pub get
```

## Firebase Cloud Functions Deployment

**Functions Location**: `firebase/functions/index.js` contains skeleton/template code for planned Cloud Functions:
- Planned triggers: `onRideCreated`, `onRideAccepted`, `onDriverArrived`, `onRideCompleted`
- **Current Status**: Functions skeleton exists but business logic not yet implemented
- **Dependencies**: `firebase-functions`, `firebase-admin` (see `functions/package.json`)

**Deploy Command** (when functions are implemented):
```powershell
cd firebase/functions
npm install
firebase deploy --only functions
```

**VS Code Task**: Use `firebase: Deploy Functions` task from task menu (requires implementation first).

**Requirements**: 
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`
- Project configured: `firebase use urban-glide-transport-25`
- Node.js 20+ (specified in `functions/package.json`)
- Service account credentials configured for admin SDK operations

## Examples of concrete, repository-specific checks (copy these into your run log)
- "Found `passenger_app/pubspec.yaml` with SDK `>=3.0.0 <4.0.0` and Provider ^6.1.1; use `cd passenger_app && flutter pub get` then `flutter test`."
- "Found `.vscode/tasks.json` with 12 predefined tasks including `flutter: Run Passenger App`, `flutter: Build APK`, `firebase: Deploy Functions`."
- "Found `.github/workflows/flutter-ci.yml` CI/CD pipeline with analyze, test, build-android, build-web, and security-scan jobs using Flutter 3.35.7."
- "Found `firebase/functions/index.js` with Cloud Functions skeleton/template code (business logic not yet implemented)."
- "Found `firebase/firestore.rules` with production-ready security rules: role-based access, field validation, audit trail protection."
- "Found `passenger_app/lib/main.dart` contains only Flutter template code (counter demo app). No custom features implemented yet."
- "Monorepo layout confirmed: `driver_app/`, `passenger_app/`, and `admin_app/` are separate apps. Always `cd` into the target app directory before running Flutter commands."
- "Firebase config placeholder files found: `google-services.json.PLACEHOLDER` and `GoogleService-Info.plist.PLACEHOLDER` must be replaced with actual config from Firebase Console."
- "All three apps (passenger, driver, admin) currently contain identical Flutter starter template code. Feature implementation pending."
- "For complete setup from scratch, refer to `docs/vscode_setup_guide.md` — 15-step guide covering Flutter SDK installation, VS Code configuration, Firebase setup, Google Maps API keys, and platform-specific permissions."
- "Test infrastructure exists (CI/CD runs `flutter test`) but only default widget_test.dart files present in each app. Custom test suites to be created."

## Setup Requirements

**Firebase Project Configuration:**
- **Project Name**: Urban Glide
- **Project ID**: `urban-glide-transport-25`
- **Project Number**: `572805775337`
- **Environment**: Production
- **Support Email**: urbanglidebfn@gmail.com

**Before running the apps, configure:**
1. **Firebase Project**: Connect to existing Firebase project `urban-glide-transport-25` at console.firebase.google.com and add three apps (Android/iOS for passenger_app, driver_app; Web for admin_app)
2. **Firebase Config Files**: 
   - Android: Download `google-services.json` and place in `<app>/android/app/` (replace `.PLACEHOLDER` files)
   - iOS: Download `GoogleService-Info.plist` and place in `<app>/ios/Runner/` (replace `.PLACEHOLDER` files)
   - **Note**: Placeholder files exist in repository to prevent Firebase configuration errors; actual config files are gitignored
3. **Firebase Cloud Functions**: Deploy notification triggers from `firebase/functions/index.js`:
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Select project: `firebase use urban-glide-transport-25`
   - Install dependencies: `cd firebase/functions && npm install`
   - Deploy: `firebase deploy --only functions` (or use VS Code task)
   - Required functions: `onRideCreated`, `onRideAccepted`, `onDriverArrived`, `onRideCompleted`
4. **Firestore Security Rules**: Deploy production-ready rules from `firebase/firestore.rules`:
   - Deploy: `firebase deploy --only firestore:rules` (or use VS Code task)
   - Rules include: role-based access control, field validation, audit trail protection
5. **Google Maps API Keys**: Obtain keys from Google Cloud Console (project: `urban-glide-transport-25`) and configure:
   - Android: Search for `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `<app>/android/app/src/main/AndroidManifest.xml` and replace with actual key
   - iOS: Search for `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `<app>/ios/Runner/AppDelegate.swift` and replace with actual key
   - Enable APIs: Maps SDK for Android/iOS, Geocoding API, Directions API, Places API
6. **Firestore Database**: Collections created automatically on first use (`passengers`, `drivers`, `rides`, `support`, `notifications`)
7. **Platform Permissions**: Already configured in manifests — location (FINE/COARSE), internet, notification (POST_NOTIFICATIONS for Android 13+)

**Quick Setup References**:
- `QUICK_SETUP.md` — 4-step manual configuration checklist (~90 min)
- `FIREBASE_SETUP.md` — Detailed Firebase console instructions
- `docs/vscode_setup_guide.md` — Complete 15-step setup from scratch (3-4 hours)
- `RUN_APPS.md` — Troubleshooting guide for common runtime issues

**Deployment Readiness:**
- Code is production-ready and follows Flutter best practices
- All three apps are configured for cross-platform deployment (Android, iOS, Web)
- Firebase backend provides scalable real-time infrastructure
- Location tracking uses efficient streams with configurable distance filters

**Setup Guide:**
- Complete VS Code setup instructions available in `docs/vscode_setup_guide.md`
- 15-step walkthrough covering prerequisites, Firebase setup, Google Maps configuration, and deployment
- Includes troubleshooting guide, quick start checklist, and useful commands reference
- Estimated setup time: 3-4 hours for complete environment configuration

## Merge guidance (if `.github/copilot-instructions.md` already exists)
- Preserve any existing bullet points that reference specific files/commands. Only replace generic/obsolete commands after confirming with `pubspec.yaml`, `README.md`, or CI workflows.
- Add a short 'last-checked' line with the file list you used to derive changes.

## When you can't find intended behavior
- If `pubspec.yaml` or `lib/main.dart` is missing in an app directory, report: "App directory `<name>` is missing required Flutter files; propose: run `flutter create <name>` or verify app structure."

## Safety and PR style
- Make minimal, localizable changes: docs, small refactors, or tests. Leave large refactors until a human confirms.
- Each PR should include a 1–2 line description: what changed, why, and one command to validate locally.

## Questions to ask the user (include in PR description if unclear)
- Which app should I focus on (driver_app, passenger_app, or admin_app)?
- Are there specific platform targets (Android, iOS, web) for this project?
- Is there a backend API or Firebase project connected to these apps?

---
**Last updated**: November 12, 2025 (comprehensive review of actual codebase state; updated to reflect template/foundation stage; verified CI/CD pipeline, Firebase infrastructure, and dependency versions; removed references to unimplemented features; marked planned architecture for future development)
