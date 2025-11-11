/**
 * Panic webhook simulator
 * - POST /api/alert accepts alert payload (uid, lat, lng, ts, role) and logs to a file and to Realtime DB (if Firebase initialized)
 * - Sends notification to topic 'bloemsec_ops' via Admin SDK if initialized with service account.
 *
 * Setup:
 * - For DB and FCM, set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON.
 * - Run: npm install && node index.js
 */

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
app.use(bodyParser.json());

let db = null;
let messaging = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp({ credential: admin.credential.applicationDefault(), databaseURL: 'https://urban-glide-transport-25.firebaseio.com' });
  db = admin.database();
  messaging = admin.messaging();
} else {
  console.log('No GOOGLE_APPLICATION_CREDENTIALS - running in simulation mode (no DB/FCM)');
}

app.post('/api/alert', async (req, res) => {
  const alert = req.body;
  alert.receivedAt = new Date().toISOString();
  // log to file
  const logPath = path.join(__dirname, 'alerts.log');
  fs.appendFileSync(logPath, JSON.stringify(alert) + '\n');
  // write to Realtime DB if available
  if (db) {
    try {
      const ref = db.ref('panic_alerts_sim').push();
      await ref.set(alert);
    } catch (e) {
      console.error('DB write error', e);
    }
  }
  // send to topic 'bloemsec_ops' if messaging available
  if (messaging) {
    const payload = {
      notification: { title: 'Panic Alert', body: `User ${alert.uid} - ${alert.role}` },
      data: { uid: alert.uid, lat: String(alert.lat), lng: String(alert.lng), ts: alert.ts || '' }
    };
    try { await messaging.sendToTopic('bloemsec_ops', payload); } catch (e) { console.error('FCM error', e); }
  }
  return res.send({ ok: true });
});

app.get('/health', (req, res) => res.send({ ok: true, ts: new Date().toISOString() }));

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => console.log('Panic simulator listening on', PORT));
