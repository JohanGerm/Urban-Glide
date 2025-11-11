Urban Glide - Guardian System Package

Generated: 2025-11-09T18:08:41.756693Z

Components:
- server_guardian: Node.js server that notifies guardians when a rider's ride status changes.
- rider_guardian_flutter: Flutter UI for riders to add/list/remove guardians under /guardians/<riderUid>.
- web_admin_guardians: React admin page to view guardians for all riders.

DB structure:
/guardians/<riderUid>/<guardianId> = { name, phone, fcmToken? }

How it works:
- Rider adds guardians via the Flutter UI (or directly in DB).
- When rides/<rideId>.status changes, the server looks up /guardians/<riderUid> and sends FCM notifications to guardian.fcmToken.

Setup:
1. Deploy server_guardian with GOOGLE_APPLICATION_CREDENTIALS set to your service account JSON.
2. Ensure FCM tokens are collected (riders can ask guardians to provide tokens or you can implement a Guardian app that registers tokens).
3. Test flow by creating a ride for a rider and updating ride.status via DB or rider/driver flow.

Security:
- The server example does not enforce authentication on the guardian listing endpoint. Add ID token verification in production.
- Consider encrypting guardian contact details if required by privacy regulations.
