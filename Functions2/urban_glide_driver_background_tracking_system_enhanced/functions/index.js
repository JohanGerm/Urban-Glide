/**
 * Driver Background Tracking Functions (enhanced)
 * - processDriverLocation: called by driver background service to write location and evaluate motion alerts
 * - forceStopTracking: admin callable to disable driver's tracking
 * - scheduledCleanup: removes old tracking data
 * - triggerBloemsecAlert: posts to Bloemsec and notifies admins (shared with OTP package)
 *
 * ENV:
 * BLOEMSEC_ENDPOINT, BLOEMSEC_API_KEY
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp();
const db = admin.database();

exports.processDriverLocation = functions.https.onCall(async (data, context)=>{
  const uid = context.auth && context.auth.uid; if(!uid) throw new functions.https.HttpsError('unauthenticated','No auth');
  const {lat, lng, speed, isOnline, motionDetected, ts} = data;
  const now = ts || Date.now();
  await db.ref(`driver_tracking/${uid}/latest`).set({lat, lng, speed: speed||0, isOnline: !!isOnline, motionDetected: !!motionDetected, ts: now});
  await db.ref(`driver_tracking/${uid}/history`).push({lat, lng, speed: speed||0, ts: now});
  // if motion detected while offline -> escalate and trigger panic to Bloemsec
  if(motionDetected && !isOnline){
    const panic = { uid, lat, lng, note: 'motion_while_offline', ts: new Date().toISOString() };
    await db.ref(`panic_alerts/driver_${uid}`).push(panic);
    // call bloemsec if configured
    const BLOEMSEC_ENDPOINT = process.env.BLOEMSEC_ENDPOINT||''; const BLOEMSEC_API_KEY = process.env.BLOEMSEC_API_KEY||'';
    if(BLOEMSEC_ENDPOINT && BLOEMSEC_API_KEY){
      try{ await fetch(BLOEMSEC_ENDPOINT, { method:'POST', headers:{ 'Content-Type':'application/json','x-api-key':BLOEMSEC_API_KEY }, body: JSON.stringify(panic) }); }catch(e){ console.error('bloemsec fail', e); }
    }
    // notify admins via topic
    try{ await admin.messaging().sendToTopic('urban_glide_admins', { notification:{ title:'Driver Panic', body:`Driver ${uid} motion while offline` }, data:{ uid } }); }catch(e){ console.error('notify fail', e); }
  }
  return {ok:true};
});

exports.forceStopTracking = functions.https.onCall(async (data, context)=>{
  const caller = context.auth && context.auth.uid; if(!caller) throw new functions.https.HttpsError('unauthenticated','No auth');
  // in prod verify caller is Master or Senior admin
  const { targetUid } = data; if(!targetUid) throw new functions.https.HttpsError('invalid-argument','Missing targetUid');
  await db.ref(`driver_tracking/${targetUid}/meta/disabledBy`).set({by: caller, ts: new Date().toISOString()});
  return {ok:true};
});

exports.scheduledCleanup = functions.pubsub.schedule('every 24 hours').onRun(async (context)=>{
  const cutoff = Date.now() - (24*60*60*1000);
  const snaps = await db.ref('driver_tracking').get();
  if(!snaps.exists()) return null;
  const all = snaps.val();
  for(const uid in all){ if(all[uid].history){ const histRef = db.ref(`driver_tracking/${uid}/history`); const hs = await histRef.orderByChild('ts').endAt(cutoff).get(); hs.forEach(s=> s.ref.remove()); } }
  return null;
});
