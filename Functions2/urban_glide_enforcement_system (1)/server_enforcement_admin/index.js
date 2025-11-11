/**
 * Enforcement Admin Server
 * - Provides protected endpoints for admins to view flags, lift enforcements, and adjust risk scores.
 * - THIS EXAMPLE DOES NOT INCLUDE AUTH; add ID token verification in production.
 */

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp({ credential: admin.credential.applicationDefault(), databaseURL: 'https://urban-glide-transport-25.firebaseio.com' });
} else {
  console.warn('No service account - server will run in simulation mode');
}

const db = admin.database();
const app = express();
app.use(bodyParser.json());

// List flagged users (limit)
app.get('/flags', async (req, res) => {
  const snap = await db.ref('user_flags').get();
  const data = snap.exists() ? snap.val() : {};
  res.send(data);
});

// Get enforcement record for user
app.get('/enforcement/:uid', async (req, res) => {
  const uid = req.params.uid;
  const snap = await db.ref(`enforcements/${uid}`).get();
  res.send(snap.exists() ? snap.val() : {});
});

// Lift enforcement (unlock / remove ban)
app.post('/enforcement/:uid/lift', async (req, res) => {
  const uid = req.params.uid;
  // remove enforcements entry and reset risk score partially
  await db.ref(`enforcements/${uid}`).remove();
  await db.ref(`risk_score/${uid}`).set(0);
  try {
    await admin.auth().setCustomUserClaims(uid, null);
  } catch (e) {
    console.error('Failed to clear custom claims', e);
  }
  res.send({ ok: true });
});

// Adjust risk score
app.post('/risk/:uid', async (req, res) => {
  const uid = req.params.uid;
  const { delta } = req.body;
  const ref = db.ref(`risk_score/${uid}`);
  await ref.transaction(curr => (curr || 0) + (delta || 0));
  res.send({ ok: true });
});

const PORT = process.env.PORT || 4400;
app.listen(PORT, () => console.log('Enforcement admin server listening on', PORT));
