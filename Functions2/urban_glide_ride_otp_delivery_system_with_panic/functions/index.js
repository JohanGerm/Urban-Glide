/**
 * OTP + Panic Functions (simplified stubs)
 * ENV expected:
 * - OTP_HMAC_SECRET, TWILIO_*, BLOEMSEC_API_KEY, BLOEMSEC_ENDPOINT
 *
 * Contains:
 * - generateOtpOnAccept (HMAC, FCM/SMS)
 * - verifyRideOtp (expiry, attempts)
 * - triggerBloemsecAlert (sends panic to Bloemsec + notifies internal admins via FCM/email)
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const twilio = require('twilio');
const crypto = require('crypto');
admin.initializeApp();
const db = admin.database();

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID||'';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN||'';
const TWILIO_FROM = process.env.TWILIO_FROM||'';
const twClient = (TWILIO_SID && TWILIO_TOKEN) ? twilio(TWILIO_SID, TWILIO_TOKEN) : null;
const OTP_HMAC_SECRET = process.env.OTP_HMAC_SECRET || '';

function hmac(v){ return OTP_HMAC_SECRET ? crypto.createHmac('sha256', OTP_HMAC_SECRET).update(v).digest('hex') : v; }
function genOtp(){ return (''+Math.floor(100000+Math.random()*900000)); }

// minimal FCM helper
async function sendFcm(uid, title, body, data){ try{ const snap = await db.ref(`fcmTokens/${uid}`).get(); if(!snap.exists()) return false; const tokens = Object.values(snap.val()); if(!tokens.length) return false; await admin.messaging().sendMulticast({ notification:{title,body}, data:data||{}, tokens }); return true; }catch(e){ console.error('FCM',e); return false; } }

exports.generateOtpOnAccept = functions.https.onCall(async (data, context)=>{
  const caller = context.auth && context.auth.uid; if(!caller) throw new functions.https.HttpsError('unauthenticated','No auth');
  const {rideId} = data; if(!rideId) throw new functions.https.HttpsError('invalid-argument','Missing rideId');
  const rideSnap = await db.ref(`rides/${rideId}`).get(); if(!rideSnap.exists()) throw new functions.https.HttpsError('not-found','Ride not found');
  const ride = rideSnap.val(); const riderUid = ride.rider_uid || ride.customer_uid; if(!riderUid) throw new functions.https.HttpsError('not-found','Rider UID missing');
  const otp = genOtp(); const hash = hmac(otp+'|'+rideId); const now = Date.now();
  await db.ref(`ride_otps/${rideId}`).set({hash, driver_uid:caller, customer_uid:riderUid, ts:now, expiresAt: now + (5*60*1000), used:false, attempts:0});
  // notify rider internal FCM
  await sendFcm(riderUid, 'Your driver OTP', `Open the app to see OTP for ride ${rideId}`, {rideId:String(rideId)});
  // optional SMS
  try{ const userSnap = await db.ref(`users/${riderUid}`).get(); const phone = userSnap.exists() && userSnap.val().phone; if(twClient && TWILIO_FROM && phone){ await twClient.messages.create({body:`Urban Glide OTP for ride ${rideId}: ${otp}`, from: TWILIO_FROM, to: phone}); } }catch(e){ console.error('sms err', e); }
  // DO NOT RETURN RAW OTP in prod. Returning masked for dev.
  return {ok:true, masked:'***'+otp.slice(-2)};
});

exports.verifyRideOtp = functions.https.onCall(async (data, context)=>{
  const caller = context.auth && context.auth.uid; if(!caller) throw new functions.https.HttpsError('unauthenticated','No auth');
  const {rideId, otp} = data; if(!rideId||!otp) throw new functions.https.HttpsError('invalid-argument','Missing');
  const r = await db.ref(`ride_otps/${rideId}`).get(); if(!r.exists()) throw new functions.https.HttpsError('not-found','no otp');
  const rec = r.val(); if(rec.used) throw new functions.https.HttpsError('failed-precondition','used'); if(Date.now()>rec.expiresAt) { await db.ref(`ride_otps/${rideId}`).update({expired:true}); throw new functions.https.HttpsError('deadline-exceeded','expired'); }
  const expected = hmac(String(otp)+'|'+rideId); if(expected !== rec.hash){ await db.ref(`ride_otps/${rideId}/attempts`).transaction(a=> (a||0)+1); throw new functions.https.HttpsError('permission-denied','incorrect'); }
  await db.ref(`ride_otps/${rideId}`).update({used:true, used_by:caller, used_ts:Date.now()}); await db.ref(`rides/${rideId}/status`).set('active'); await db.ref(`rides/${rideId}/started_at`).set(new Date().toISOString());
  return {ok:true};
});

// Trigger Bloemsec alert (driver or rider)
exports.triggerBloemsecAlert = functions.https.onCall(async (data, context)=>{
  const caller = context.auth && context.auth.uid; if(!caller) throw new functions.https.HttpsError('unauthenticated','No auth');
  const { rideId, lat, lng, note } = data; if(!rideId) throw new functions.https.HttpsError('invalid-argument','Missing rideId');
  const now = new Date().toISOString();
  const entry = { rideId, triggeredBy: caller, lat, lng, note: note||'', ts: now };
  const logRef = await db.ref(`panic_alerts/${rideId}`).push(entry);
  // send to Bloemsec endpoint if configured
  const BLOEMSEC_ENDPOINT = process.env.BLOEMSEC_ENDPOINT || ''; const BLOEMSEC_API_KEY = process.env.BLOEMSEC_API_KEY || '';
  if(BLOEMSEC_ENDPOINT && BLOEMSEC_API_KEY){
    try{
      await fetch(BLOEMSEC_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json','x-api-key':BLOEMSEC_API_KEY}, body: JSON.stringify(entry) });
    }catch(e){ console.error('bloemsec send failed', e); }
  }
  // notify internal admins via FCM (broadcast to topic 'admins')
  try{ await admin.messaging().sendToTopic('urban_glide_admins', { notification:{ title:'Panic Alert', body:`Ride ${rideId} - ${note||'panic'}` }, data:{rideId:String(rideId)} }); }catch(e){ console.error('admin notify', e); }
  return {ok:true, key: logRef.key};
});
