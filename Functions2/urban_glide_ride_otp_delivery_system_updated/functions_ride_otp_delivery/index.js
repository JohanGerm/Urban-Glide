const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
const crypto = require('crypto');
admin.initializeApp();
const db = admin.database();

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_FROM || '';
const twClient = (TWILIO_SID && TWILIO_TOKEN) ? twilio(TWILIO_SID, TWILIO_TOKEN) : null;

const OTP_EXPIRY_MS = parseInt(process.env.OTP_EXPIRY_MS || (5*60*1000));
const MAX_OTP_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS || 3);
const OTP_GEN_LIMIT_PER_HOUR = parseInt(process.env.OTP_GEN_LIMIT_PER_HOUR || 10);
const OTP_HMAC_SECRET = process.env.OTP_HMAC_SECRET || '';

function generateOtp() { return ('' + Math.floor(100000 + Math.random()*900000)); }
function hmac(value) { return crypto.createHmac('sha256', OTP_HMAC_SECRET).update(value).digest('hex'); }

async function sendFcmToUser(uid, title, body, data) {
  try {
    const snap = await db.ref(`fcmTokens/${uid}`).get();
    if (!snap.exists()) return false;
    const tokens = Object.values(snap.val());
    if (!tokens.length) return false;
    const message = { notification:{title,body}, data: data || {}, tokens: tokens };
    const resp = await admin.messaging().sendMulticast(message);
    console.log('FCM result', resp.successCount, 'sent');
    return true;
  } catch (e) { console.error('FCM send error', e); return false; }
}

async function checkAndUpdateGenerationQuota(driverUid) {
  const metaRef = db.ref(`otp_gen_meta/${driverUid}`);
  const now = Date.now();
  return metaRef.transaction(meta => {
    if (!meta) {
      return { countLastHour:1, windowStart: now, backoffLevel:0, nextAllowedTs:0 };
    }
    const windowStart = meta.windowStart || now;
    if (now - windowStart > 60*60*1000) {
      meta.countLastHour = 1;
      meta.windowStart = now;
      meta.backoffLevel = Math.max(0, (meta.backoffLevel || 0) - 1);
      meta.nextAllowedTs = 0;
      return meta;
    }
    meta.countLastHour = (meta.countLastHour || 0) + 1;
    if (meta.countLastHour > OTP_GEN_LIMIT_PER_HOUR) {
      meta.backoffLevel = (meta.backoffLevel || 0) + 1;
      const backoffMinutes = Math.pow(2, meta.backoffLevel);
      meta.nextAllowedTs = now + backoffMinutes * 60 * 1000;
    }
    return meta;
  }).then(()=> db.ref(`otp_gen_meta/${driverUid}`).get().then(s=> s.val()));
}

exports.generateOtpOnAccept = functions.https.onCall(async (data, context) => {
  const callerUid = context.auth && context.auth.uid;
  if (!callerUid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const { rideId } = data;
  if (!rideId) throw new functions.https.HttpsError('invalid-argument','Missing rideId');
  const rideSnap = await db.ref(`rides/${rideId}`).get();
  if (!rideSnap.exists()) throw new functions.https.HttpsError('not-found','Ride not found');
  const ride = rideSnap.val();
  const riderUid = ride.rider_uid || ride.customer_uid;
  if (!riderUid) throw new functions.https.HttpsError('not-found','Rider UID missing on ride');

  const metaSnap = await db.ref(`otp_gen_meta/${callerUid}`).get();
  const now = Date.now();
  if (metaSnap.exists()) {
    const m = metaSnap.val();
    if (m.nextAllowedTs && now < m.nextAllowedTs) {
      throw new functions.https.HttpsError('resource-exhausted','OTP generation temporarily blocked due to rate limits. Try later.');
    }
  }
  const updatedMeta = await checkAndUpdateGenerationQuota(callerUid);
  if (updatedMeta.nextAllowedTs && now < updatedMeta.nextAllowedTs) {
    throw new functions.https.HttpsError('resource-exhausted','OTP generation temporarily blocked due to rate limits. Try later.');
  }

  const otp = generateOtp();
  const hash = OTP_HMAC_SECRET ? hmac(otp + '|' + rideId) : otp;
  const rec = { hash, driver_uid: callerUid, customer_uid: riderUid, ts: now, used: false, expiresAt: now + OTP_EXPIRY_MS, attempts: 0 };
  await db.ref(`ride_otps/${rideId}`).set(rec);

  const fcmSent = await sendFcmToUser(riderUid, 'Driver OTP', `Your driver has arrived. Open the app to see the OTP.`, { rideId: String(rideId) });
  let smsSent = false;
  try {
    const userSnap = await db.ref(`users/${riderUid}`).get();
    const phone = userSnap.exists() && userSnap.val().phone;
    if (twClient && TWILIO_FROM && phone) {
      await twClient.messages.create({ body: `Urban Glide: your ride OTP is ${otp}`, from: TWILIO_FROM, to: phone });
      smsSent = true;
    }
  } catch (e) { console.error('SMS send failed', e); }

  return { ok:true, rideId, fcmSent, smsSent, expiresAt: rec.expiresAt, masked: ('***' + otp.slice(-2)) };
});

exports.verifyRideOtp = functions.https.onCall(async (data, context) => {
  const callerUid = context.auth && context.auth.uid;
  if (!callerUid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const { rideId, otp } = data;
  if (!rideId || !otp) throw new functions.https.HttpsError('invalid-argument','Missing rideId or otp');
  const otpRef = db.ref(`ride_otps/${rideId}`);
  const otpSnap = await otpRef.get();
  if (!otpSnap.exists()) throw new functions.https.HttpsError('not-found','OTP not found for ride');
  const otpRec = otpSnap.val();
  const now = Date.now();
  if (otpRec.used) throw new functions.https.HttpsError('failed-precondition','OTP already used');
  if (now > (otpRec.expiresAt || 0)) { await otpRef.update({ expired: true }); throw new functions.https.HttpsError('deadline-exceeded','OTP expired'); }
  const attempts = otpRec.attempts || 0;
  if (attempts >= MAX_OTP_ATTEMPTS) { await db.ref(`user_flags/${otpRec.customer_uid}`).push({ reason: 'otp_max_attempts', ts: now }); throw new functions.https.HttpsError('permission-denied','Too many incorrect attempts'); }

  const expectedHash = OTP_HMAC_SECRET ? hmac(String(otp) + '|' + rideId) : String(otp);
  if (expectedHash !== otpRec.hash) { await otpRef.child('attempts').transaction(curr => (curr || 0) + 1); throw new functions.https.HttpsError('permission-denied','Incorrect OTP'); }

  await otpRef.update({ used: true, used_by: callerUid, used_ts: now });
  await db.ref(`rides/${rideId}/status`).set('active');
  await db.ref(`rides/${rideId}/started_at`).set(new Date().toISOString());
  await db.ref(`ride_otp_logs`).push({ rideId, driver: callerUid, ts: now });
  return { ok: true, rideId };
});
