const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

// Schedule function runs every 5 minutes
exports.dispatchScheduledRides = functions.pubsub.schedule('every 5 minutes').onRun(async context => {
  const now = Date.now();
  const windowStart = new Date(now);
  const windowEnd = new Date(now + 30*60*1000); // 30 min ahead
  const snap = await db.ref('scheduled_rides').get();
  if(!snap.exists()) return null;
  const rides = snap.val();
  for(const uid in rides){
    for(const rideId in rides[uid]){
      const ride = rides[uid][rideId];
      const ts = new Date(ride.scheduled_ts).getTime();
      if(ts>=windowStart.getTime() && ts<=windowEnd.getTime() && ride.status==='pending'){
        // push notification example (simplified)
        console.log('Dispatching scheduled ride', rideId, 'for rider', uid);
        await db.ref(`scheduled_rides/${uid}/${rideId}/status`).set('ready_for_driver');
      }
    }
  }
});
