# Urban Glide 🚗💨

**DRIVEN BY THE NEW GENERATION**

A modern e-hailing platform built with Flutter/Dart, featuring real-time ride booking, driver tracking, and comprehensive admin management.

![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)
![Dart](https://img.shields.io/badge/Dart-3.0+-0175C2?logo=dart)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🎯 Project Overview

Urban Glide is a production-ready ride-hailing platform consisting of three interconnected applications:

- **🚖 Passenger App** - Request rides, track drivers in real-time, manage payments
- **🚙 Driver App** - Accept ride requests, navigate to passengers, track earnings
- **📊 Admin Dashboard** - Monitor platform activity, manage users, view analytics

**Repository:** https://github.com/JohanGerm/urban-glide
**Status:** ✅ **Ready for Production** (after Firebase/Maps configuration)

---

## ✨ Key Features

### Implemented & Production-Ready ✅
- ✅ **Real-time Location Tracking** - Live driver location updates (10m/5s intervals)
- ✅ **Push Notifications** - FCM + Cloud Functions for ride status updates
- ✅ **Intelligent Matching** - Proximity-based driver-passenger matching with scoring
- ✅ **Payment Integration** - PayFast gateway with MD5 signature security
- ✅ **Security Rules** - Production-ready Firestore rules with role-based access
- ✅ **Error Handling** - Comprehensive error service with retry logic
- ✅ **State Management** - Provider pattern for reactive UI updates
- ✅ **Testing Suite** - 36+ tests (unit, widget, integration, performance, security)

### Architecture Highlights
- **Backend:** Firebase (Auth, Firestore, Cloud Functions, Cloud Messaging)
- **Maps:** Google Maps Platform (real-time tracking, geocoding, routing)
- **State:** Provider pattern with ChangeNotifier
- **Payment:** PayFast integration (South African market)
- **Design:** Modern neon aesthetic with cyan accent (#00D9FF)

---

## 🚀 Quick Start

See `SETUP_COMPLETE.md` for detailed setup instructions.

### Prerequisites
- Flutter SDK 3.35.7+
- Firebase CLI
- Android Studio / VS Code
- Google Maps API keys

### Install & Run
```bash
# Install dependencies
cd passenger_app && flutter pub get

# Run on device
flutter run
```

---

## 📁 Project Structure

```
urban-glide/
├── passenger_app/     # Passenger mobile app
├── driver_app/        # Driver mobile app
├── admin_app/         # Admin web dashboard
├── firebase/          # Backend (Firestore rules, Cloud Functions)
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

---

## 📚 Documentation

- `SETUP_COMPLETE.md` - Complete setup guide
- `FIREBASE_SETUP.md` - Firebase configuration
- `GRADLE_CONFIG.md` - Android build configuration
- `RUN_COMMANDS.md` - Development commands
- `docs/ANDROID_STUDIO_SETUP.md` - IDE setup
- `.github/copilot-instructions.md` - Project context

---

## 🔧 Tech Stack

**Frontend:**
- Flutter 3.35.7
- Dart 3.9.2
- Provider (state management)
- Google Maps Flutter

**Backend:**
- Firebase Auth
- Cloud Firestore
- Cloud Functions (Node.js)
- Firebase Cloud Messaging

**Services:**
- Google Maps Platform
- PayFast Payment Gateway

---

## 📄 License

Proprietary - Urban Glide Transport © 2025

---

## 👨‍💻 Author

**Johan Germishuys**
- Company: Urban Glide Transport
- Location: South Africa
- GitHub: [@JohanGerm](https://github.com/JohanGerm)