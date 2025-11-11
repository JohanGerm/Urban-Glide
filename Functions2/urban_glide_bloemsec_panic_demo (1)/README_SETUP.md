Urban Glide - Bloemsec-linked Panic Button (Safe Demo)

Generated: 2025-11-09T19:06:34.755868Z

Components:
- rider_panic_flutter/: Flutter demo app with PANIC button (logs to /panic_alerts and subscribes device to topic 'bloemsec_ops').
- driver_panic_flutter/: Same for drivers.
- server_panic_sim/: Node.js webhook simulator that accepts POST /api/alert and logs alerts; if Firebase service account provided, writes to DB and sends FCM to topic 'bloemsec_ops'.
- web_admin_panic/: React admin page to view /panic_alerts.

How it works:
- PANIC button writes to /panic_alerts with uid, role, lat, lng, ts, status.
- The server webhook can be used by third-parties (Bloemsec) to post alerts into your system via /api/alert.
- For operator notifications, server publishes to topic 'bloemsec_ops' (drivers/admins should subscribe).

Security & production notes:
- Add authentication and rate-limiting to prevent abuse.
- Require confirmation or two-stage panic to reduce false alarms.
- Store operator tokens securely and protect admin pages with auth.
