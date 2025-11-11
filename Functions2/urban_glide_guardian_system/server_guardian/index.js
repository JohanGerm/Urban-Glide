/**
 * Guardian Notification Server
 * - Watches rides for status changes. When a rider's ride changes to 'requested', 'active', or 'completed',
 *   finds that rider's guardians in Realtime DB under /guardians/<riderUid> and notifies them.
 * - Notification method: FCM to tokens stored under guardian.fcmToken (if present). Falls back to logging.
 *
 * Setup:
 * 1. Create a service account JSON and set GOOGLE_APPLICATION_CREDENTIALS env var to its path.
 * 2. npm install
 * 3. node index.js
 */

const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://urban-glide-transport-25.firebaseio.com'
});

const db = admin.database();
const messaging = admin.messaging();
const app = express();
app.use(bodyParser.json());

// Simple health endpoint
app.get('/health', (req, res) => res.send({ok: true, ts: new Date().toISOString()}));

// Listen for /rides child_changed events and notify guardians when status transitions
const ridesRef = db.ref('rides');
ridesRef.on('child_changed', async (snapshot, prev) => {
  const ride = snapshot.val();
  const rideId = snapshot.key;
  const prevVal = prev && prev.val ? prev.val() : null;
  const prevStatus = prevVal ? prevVal.status : null;
  const newStatus = ride.status;

  // If status didn't change, skip
  if (prevStatus === newStatus) return;

  console.log(`Ride ${rideId} changed: ${prevStatus} -> ${newStatus}`);

  // Notify guardians of the rider
  const riderUid = ride.rider_uid;
  if (!riderUid) return console.log('No rider_uid for ride', rideId);

  const guardiansSnap = await db.ref(`guardians/${riderUid}`).get();
  if (!guardiansSnap.exists()) return console.log('No guardians for rider', riderUid);

  const guardians = guardiansSnap.val();
  const payload = {
    notification: {
      title: `Ride ${newStatus}`,
      body: `Ride ${rideId} is now ${newStatus}. Pickup: ${ride.pickup || ''}`
    },
    data: {
      rideId: rideId,
      status: newStatus,
      pickup: ride.pickup || '',
      dropoff: ride.dropoff || ''
    }
  };

  // Send FCM to each guardian token (if available)
  const tokens = [];
  Object.keys(guardians).forEach(k => {
    const g = guardians[k];
    if (g && g.fcmToken) tokens.push(g.fcmToken);
  });

  if (tokens.length > 0) {
    try {
      const resp = await messaging.sendToDevice(tokens, payload);
      console.log('Notified guardians via FCM:', resp.results.length);
    } catch (e) {
      console.error('FCM error notifying guardians', e);
    }
  } else {
    console.log('No guardian tokens, guardians:', guardians);
  }
});

// Endpoint to list guardians for a rider (secured example token check omitted for brevity)
app.get('/guardians/:riderUid', async (req, res) => {
  const riderUid = req.params.riderUid;
  const snap = await db.ref(`guardians/${riderUid}`).get();
  res.send({ guardians: snap.exists() ? snap.val() : {} });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Guardian server listening on', PORT));
