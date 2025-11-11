const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
admin.initializeApp();
const db = admin.database();

// Generate OTP for freeze (Master Admin)
exports.generateFreezeOTP = functions.https.onCall(async (data, context)=>{
  const uid = context.auth.uid;
  if(!uid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const snap = await db.ref(`admins/${uid}`).get();
  if(!snap.exists() || snap.val().role!=='master') throw new functions.https.HttpsError('permission-denied','Only master admin can generate OTP');
  const otp = (''+Math.floor(100000+Math.random()*900000));
  const otpId = crypto.randomBytes(8).toString('hex');
  await db.ref(`otp_freeze_requests/${otpId}`).set({otp, issued_by: uid, ts: Date.now(), used: false});
  return {otp, otpId};
});

// Senior Admin triggers freeze with OTP
exports.freezeSystem = functions.https.onCall(async (data, context)=>{
  const uid = context.auth.uid;
  if(!uid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const snap = await db.ref(`admins/${uid}`).get();
  if(!snap.exists() || snap.val().role!=='senior') throw new functions.https.HttpsError('permission-denied','Only senior admin can execute freeze with OTP');
  const {otpId, otp} = data;
  const otpSnap = await db.ref(`otp_freeze_requests/${otpId}`).get();
  if(!otpSnap.exists() || otpSnap.val().used) throw new functions.https.HttpsError('failed-precondition','Invalid or used OTP');
  if(otpSnap.val().otp !== otp) throw new functions.https.HttpsError('permission-denied','OTP incorrect');
  const now = Date.now();
  if(now - otpSnap.val().ts > 10*60*1000) throw new functions.https.HttpsError('deadline-exceeded','OTP expired');

  // mark OTP used
  await db.ref(`otp_freeze_requests/${otpId}/used`).set(true);
  // set system frozen
  await db.ref('system_status').set({state:'frozen', last_changed_by:uid, ts: new Date().toISOString()});
  // log action
  const logRef = db.ref(`admin_actions/${uid}`).push();
  await logRef.set({action:'freeze_system', otpId, ts: new Date().toISOString()});
  return {ok:true, msg:'System frozen'};
});

// Unfreeze (similar, requires OTP from master if Senior triggers)
exports.unfreezeSystem = functions.https.onCall(async (data, context)=>{
  const uid = context.auth.uid;
  if(!uid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const snap = await db.ref(`admins/${uid}`).get();
  if(!snap.exists() || (snap.val().role!=='senior' && snap.val().role!=='master')) throw new functions.https.HttpsError('permission-denied','Unauthorized');
  if(snap.val().role==='senior'){
    const {otpId, otp} = data;
    const otpSnap = await db.ref(`otp_freeze_requests/${otpId}`).get();
    if(!otpSnap.exists() || otpSnap.val().used) throw new functions.https.HttpsError('failed-precondition','Invalid or used OTP');
    if(otpSnap.val().otp !== otp) throw new functions.https.HttpsError('permission-denied','OTP incorrect');
    const now = Date.now();
    if(now - otpSnap.val().ts > 10*60*1000) throw new functions.https.HttpsError('deadline-exceeded','OTP expired');
    await db.ref(`otp_freeze_requests/${otpId}/used`).set(true);
  }
  await db.ref('system_status').set({state:'active', last_changed_by:uid, ts: new Date().toISOString()});
  const logRef = db.ref(`admin_actions/${uid}`).push();
  await logRef.set({action:'unfreeze_system', ts: new Date().toISOString()});
  return {ok:true, msg:'System active'};
});
