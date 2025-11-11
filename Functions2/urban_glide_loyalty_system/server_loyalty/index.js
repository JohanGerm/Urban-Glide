/**
 * Loyalty & Ratings Server Example
 * - Demonstrates two approaches:
 *   1) Cloud Function style: run by listening to /rides child_changed and when status == 'completed' ->
 *      - Increment rider points based on a formula (e.g., base points + distance multiplier if available)
 *      - Record a "pending_rating" record so rider can submit rating
 *      - Recalculate driver average rating when new rating submitted (endpoint example)
 *
 * - This is an example Express server using Firebase Admin SDK.
 * - For production, use Cloud Functions or a secure server and validate ID tokens.
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
const app = express();
app.use(bodyParser.json());

// Listen for ride completion and award loyalty points + create rating placeholder
const ridesRef = db.ref('rides');
ridesRef.on('child_changed', async (snap, prev) => {
  const ride = snap.val();
  const rideId = snap.key;
  const prevVal = prev && prev.val ? prev.val() : null;
  const prevStatus = prevVal ? prevVal.status : null;
  if (!ride) return;
  if (prevStatus === 'active' && ride.status === 'completed') {
    console.log('Ride completed:', rideId);
    const riderUid = ride.rider_uid;
    const driverUid = ride.driver_uid || null;

    // Award points: simple formula: 10 points per ride + 1 point per km if ride.distance exists
    let points = 10;
    if (ride.distance_km) {
      points += Math.round(ride.distance_km);
    }

    // Increment rider points safely (transaction)
    const userPointsRef = db.ref(`points/${riderUid}/balance`);
    await userPointsRef.transaction(curr => (curr || 0) + points);

    // Mark ride as awaiting rating from rider
    await db.ref(`ratings_pending/${rideId}`).set({
      rider_uid: riderUid,
      driver_uid: driverUid,
      ride_id: rideId,
      ts: new Date().toISOString()
    });

    // Log point award
    await db.ref(`points/${riderUid}/history`).push({
      ride_id: rideId,
      points: points,
      ts: new Date().toISOString(),
      reason: 'ride_completed'
    });

    console.log('Awarded', points, 'points to', riderUid);
  }
});

// Endpoint: rider posts rating for completed ride
// Expected body: { idToken: '<Firebase ID token>', rideId: '<rideId>', rating: 4, comment: 'Good driver' }
app.post('/submitRating', async (req, res) => {
  const { idToken, rideId, rating, comment } = req.body;
  if (!idToken || !rideId || (typeof rating === 'undefined')) return res.status(400).send('Missing parameters');
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    // Check pending rating exists and rider matches
    const pendingSnap = await db.ref(`ratings_pending/${rideId}`).get();
    if (!pendingSnap.exists()) return res.status(400).send('No pending rating for this ride');
    const pending = pendingSnap.val();
    if (pending.rider_uid !== uid) return res.status(403).send('Not allowed');

    // Save rating under /ratings/<driverUid>/<autoId>
    const driverUid = pending.driver_uid || 'unknown_driver';
    const rref = db.ref(`ratings/${driverUid}`).push();
    await rref.set({
      ride_id: rideId,
      rider_uid: uid,
      rating: rating,
      comment: comment || '',
      ts: new Date().toISOString()
    });

    // Remove pending flag
    await db.ref(`ratings_pending/${rideId}`).remove();

    // Recalculate average rating for driver (simple aggregate)
    const ratingsSnap = await db.ref(`ratings/${driverUid}`).get();
    let avg = 0;
    if (ratingsSnap.exists()) {
      const all = ratingsSnap.val();
      const vals = Object.keys(all).map(k => all[k].rating || all[k].rating === 0 ? all[k].rating : null).filter(v => v !== null);
      const sum = vals.reduce((a,b) => a + b, 0);
      avg = sum / vals.length;
    }

    await db.ref(`drivers/${driverUid}/rating`).set(avg);
    await db.ref(`drivers/${driverUid}/rating_count`).set(ratingsSnap.exists() ? Object.keys(ratingsSnap.val()).length : 0);

    return res.send({ success: true, average: avg });
  } catch (e) {
    console.error('submitRating error', e);
    return res.status(401).send('Invalid token or server error');
  }
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log('Loyalty server listening on', PORT));
