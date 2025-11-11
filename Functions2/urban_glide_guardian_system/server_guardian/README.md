Guardian Notification Server

This server listens to ride status changes and notifies guardians for the rider.

Setup:
1. Create a service account in Firebase console and download the JSON.
2. Set env var: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
3. Install deps: npm install
4. Run: node index.js

Data format:
- Guardians stored under /guardians/<riderUid>/<guardianId> = { name, phone, email?, fcmToken? }

Security:
- Add authentication checks (verifyIdToken) before exposing endpoints in production.
