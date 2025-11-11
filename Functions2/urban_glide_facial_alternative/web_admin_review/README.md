Admin Selfie Review App

Setup:
1. Create a Firebase Web app, copy the config, and replace placeholders in src/App.jsx.
2. Enable Realtime Database and Storage (used by the Flutter driver app).
3. Run: npm install && npm run dev

Usage:
- This page lists driver_selfies entries and lets an admin mark them verified or rejected.
- In production, protect this admin page behind authentication and enforce role-based access controls.
