/**
 * Firebase Cloud Functions - Automated Enforcement Prototype
 * - Detects fraud/spam patterns and takes enforcement actions (lock account, soft ban, device ban).
 * - WARNING: This is a powerful enforcement prototype. Test carefully in staging.
 *
 * Triggers implemented:
 *  - /rides child_added and child_changed to detect excessive cancellations or rapid requests.
 *  - /payment_otps/* attempts counter for OTP failures -> mark high risk and auto-lock after threshold.
 *  - /users/<uid>/deviceIds updates to detect many device IDs per account (possible account sharing).
 *
 * Enforcement actions:
 *  - Write /user_flags/<uid> entries with reason and riskScore increment.
 *  - If riskScore crosses thresholds, write /enforcements/<uid> with action: locked, soft_ban, device_banned
 *  - Revoke custom claims? (Example shows setting 'locked' custom claim using Admin SDK. Requires careful permissioning.)
 *
 * Admin can override via server admin endpoints (separate component).
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.database();
const USERS = 'users';
const RIDES = 'rides';
const PAYMENT_OTPS = 'payment_otps';
const USER_FLAGS = 'user_flags';
const ENFORCEMENTS = 'enforcements';
const DEVICE_BANS = 'device_bans';

// Helper: add flag and increment risk score
async function flagUser(uid, reason, delta=10) {
  const ref = db.ref(`${USER_FLAGS}/${uid}`).push();
  await ref.set({ reason, ts: new Date().toISOString() });
  // increment risk score
  const scoreRef = db.ref(`risk_score/${uid}`);
  await scoreRef.transaction(curr => (curr || 0) + delta);
  const snap = await scoreRef.get();
  const score = snap.val() || 0;
  console.log('User', uid, 'flagged for', reason, 'newScore', score);
  // enforce based on score thresholds
  if (score >= 100) {
    await db.ref(`${ENFORCEMENTS}/${uid}`).set({ action: 'soft_ban', ts: new Date().toISOString(), score });
  } else if (score >= 200) {
    await db.ref(`${ENFORCEMENTS}/${uid}`).set({ action: 'locked', ts: new Date().toISOString(), score });
    // Optionally set custom claim 'locked' (requires privileges).
    try {
      await admin.auth().setCustomUserClaims(uid, { locked: true });
      console.log('Set custom claim locked for', uid);
    } catch (e) {
      console.error('Failed to set custom claim', e);
    }
  }
}

// Detect rapid cancellations: when ride changes to cancelled, check cancellations count in short window
exports.onRideChanged = functions.database.ref('/rides/{rideId}').onUpdate(async (change, context) => {
  const before = change.before.val();
  const after = change.after.val();
  if (!before || !after) return null;
  if (before.status !== 'cancelled' && after.status === 'cancelled') {
    const riderUid = after.rider_uid;
    if (!riderUid) return null;
    // increment cancellation counter with TTL-like entry
    const cRef = db.ref(`cancellations/${riderUid}`).push();
    await cRef.set({ ts: new Date().toISOString() });
    // prune entries older than 1 hour and count
    const now = Date.now();
    const oneHourAgo = now - (60*60*1000);
    const snap = await db.ref(`cancellations/${riderUid}`).get();
    let recent = 0;
    if (snap.exists()) {
      const vals = snap.val();
      for (const k of Object.keys(vals)) {
        const ts = new Date(vals[k].ts).getTime();
        if (ts < oneHourAgo) {
          await db.ref(`cancellations/${riderUid}/${k}`).remove();
        } else {
          recent++;
        }
      }
    }
    if (recent >= 5) {
      await flagUser(riderUid, 'excessive_cancellations', 50);
    } else if (recent >= 3) {
      await flagUser(riderUid, 'multiple_cancellations', 20);
    }
  }
  return null;
});

// Detect OTP failures: watch payment_otps/<paymentId>/attempts updates and flag user if too many
exports.onOtpAttempts = functions.database.ref('/payment_otps/{paymentId}/attempts').onWrite(async (change, context) => {
  const attempts = change.after.val() || 0;
  const paymentId = context.params.paymentId;
  // fetch payment record to get riderUid
  const pSnap = await db.ref(`payments/${paymentId}`).get();
  if (!pSnap.exists()) return null;
  const payment = pSnap.val();
  const riderUid = payment.riderUid;
  if (!riderUid) return null;
  if (attempts >= 3 && attempts < 6) {
    await flagUser(riderUid, 'otp_attempts_warning', 15);
  } else if (attempts >= 6) {
    await flagUser(riderUid, 'otp_attempts_suspected_fraud', 80);
  }
  return null;
});

// Detect many device IDs per account (possible account sharing or device churn)
exports.onUserDeviceChange = functions.database.ref('/users/{uid}/deviceIds').onWrite(async (change, context) => {
  const uid = context.params.uid;
  const devices = change.after.val() || {};
  const count = Object.keys(devices).length;
  if (count >= 5) {
    await flagUser(uid, 'many_devices', 40);
  }
  return null;
});

// Detect impossible movement (GPS spoofing) by checking locations timestamps and computing speed
exports.onLocationUpdate = functions.database.ref('/locations/{uid}').onWrite(async (change, context) => {
  // expects locations/<uid> = { lat, lng, ts }
  const uid = context.params.uid;
  const val = change.after.val();
  if (!val) return null;
  const lat = parseFloat(val.lat);
  const lng = parseFloat(val.lng);
  const ts = new Date(val.ts || new Date().toISOString()).getTime();
  // get previous location history (last stored under locations_history/<uid>)
  const histRef = db.ref(`locations_history/${uid}`);
  await histRef.push({ lat, lng, ts });
  // prune history older than 10 minutes and compute speed between last two points
  const snap = await histRef.orderByChild('ts').limitToLast(2).get();
  if (!snap.exists()) return null;
  const entries = [];
  snap.forEach(s => entries.push(s.val()));
  if (entries.length < 2) return null;
  const a = entries[0]; const b = entries[1];
  const dt = Math.abs(b.ts - a.ts) / 1000.0; // seconds
  if (dt <= 0) return null;
  const R = 6371e3;
  function toRad(deg){ return deg * Math.PI / 180; }
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lng - a.lng);
  const aa = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
  const dist = R * c; // meters
  const speedMps = dist / dt;
  const speedKph = speedMps * 3.6;
  if (speedKph > 300) { // impossible speed threshold
    await flagUser(uid, 'impossible_speed', 70);
  }
  return null;
});

// Optional: scheduled cleanup / decay risk scores (not implemented here, can be CRON-based function)
// Admin functions should be used to lift bans / modify risk scores
