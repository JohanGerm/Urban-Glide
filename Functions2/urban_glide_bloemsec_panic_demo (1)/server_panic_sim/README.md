Panic webhook simulator

- POST /api/alert : accept JSON payload { uid, lat, lng, ts, role } and log it. If Firebase service account is configured, writes to Realtime DB under /panic_alerts_sim and sends FCM to topic 'bloemsec_ops'.
- Useful for integrating with Bloemsec later; this server acts as a safe demo/bridge.

Setup:
1. (Optional) Set GOOGLE_APPLICATION_CREDENTIALS to service account JSON for DB/FCM.
2. npm install
3. node index.js

Test with:
curl -X POST http://localhost:4300/api/alert -H 'Content-Type: application/json' -d '{"uid":"test","lat":-29.12,"lng":26.22,"role":"rider","ts":"2025-11-09T00:00:00Z"}'
