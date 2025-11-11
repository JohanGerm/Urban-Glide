# Firebase Cloud Functions - Deployment Guide

## 🚀 Quick Deploy

```powershell
# 1. Navigate to Firebase directory
cd C:\src\Claude\firebase

# 2. Install function dependencies
cd functions
npm install

# 3. Return to firebase root
cd ..

# 4. Deploy all functions
firebase deploy --only functions
```

---

## 📋 Pre-Deployment Checklist

- ✅ Firebase CLI installed (`firebase --version`)
- ✅ Logged in to Firebase (`firebase login`)
- ✅ Project selected (`firebase use urban-glide-transport-25`)
- ✅ Functions code ready (`firebase/functions/index.js`)
- ✅ Dependencies installed (`npm install` in functions/)

---

## 🔧 Firebase Admin SDK Configuration

### Current Setup (Recommended):
```javascript
admin.initializeApp(); // Uses default Firebase credentials
```

**✅ This is correct for Firebase Functions deployment!**

### Alternative (Service Account):
If you need to use a service account key:

1. **Download key from Firebase Console:**
   - https://console.firebase.google.com/project/urban-glide-transport-25/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save as `firebase/functions/serviceAccountKey.json`

2. **Update `index.js`:**
   ```javascript
   const serviceAccount = require('./serviceAccountKey.json');
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

3. **⚠️ Security:**
   - NEVER commit serviceAccountKey.json to Git
   - Already added to `.gitignore`
   - Only use for local testing

---

## 📦 Cloud Functions Included

### 1. `onRideCreated`
- **Trigger:** New ride document created (status: 'searching')
- **Action:** Find nearby available drivers (5km radius), send push notifications
- **Dependencies:** Firestore, FCM

### 2. `onRideAccepted`
- **Trigger:** Ride status changes from 'searching' to 'accepted'
- **Action:** Notify passenger with driver details
- **Dependencies:** Firestore, FCM

### 3. `onDriverArrived`
- **Trigger:** Ride status changes to 'pickup'
- **Action:** Notify passenger that driver has arrived
- **Dependencies:** Firestore, FCM

### 4. `onRideCompleted`
- **Trigger:** Ride status changes to 'completed'
- **Action:** Notify both passenger and driver, prompt for ratings
- **Dependencies:** Firestore, FCM

---

## 🧪 Testing Functions

### Local Emulator (Recommended):
```powershell
cd C:\src\Claude\firebase

# Start emulators
firebase emulators:start

# Access Emulator UI
# http://localhost:4000
```

### Test Individual Function:
```powershell
# Create test ride document in Firestore
# Function will automatically trigger

# Or call function directly (advanced)
firebase functions:shell
```

### View Logs:
```powershell
# Real-time logs
firebase functions:log --follow

# Recent logs
firebase functions:log --limit 50
```

---

## 🔍 Monitoring & Debugging

### Firebase Console:
- Functions: https://console.firebase.google.com/project/urban-glide-transport-25/functions
- Logs: https://console.firebase.google.com/project/urban-glide-transport-25/logs

### Common Issues:

**1. `npm install` fails:**
```powershell
cd C:\src\Claude\firebase\functions
rm -rf node_modules
rm package-lock.json
npm install
```

**2. Deployment fails:**
```powershell
# Check Firebase CLI version
firebase --version

# Update if needed
npm install -g firebase-tools@latest

# Re-authenticate
firebase logout
firebase login
```

**3. Function not triggering:**
- Check Firestore rules allow writes
- Verify FCM tokens are saved in user documents
- Check function logs for errors

---

## 💰 Cost Estimation

**Firebase Functions Pricing (Spark Plan - Free Tier):**
- 2M invocations/month FREE
- 400,000 GB-seconds compute FREE
- 200,000 GHz-seconds compute FREE

**Your Usage (Estimated):**
- ~1000 rides/month = ~4000 function calls
- Well within free tier ✅

**Upgrade to Blaze (Pay-as-you-go) for production:**
- Same free tier included
- Only pay for usage above limits
- ~$0.0001 per additional function call

---

## 📚 Resources

- **Firebase Functions Docs:** https://firebase.google.com/docs/functions
- **Admin SDK Reference:** https://firebase.google.com/docs/reference/admin/node
- **Cloud Functions for Firebase (YouTube):** https://www.youtube.com/playlist?list=PLl-K7zZEsYLkPZHe41m4jfAxUi0JjLgSM

---

## ✅ Next Steps

1. **Deploy functions:**
   ```powershell
   cd C:\src\Claude\firebase\functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

2. **Test in app:**
   - Create a ride as passenger
   - Check driver receives notification
   - Accept ride as driver
   - Verify passenger receives notification

3. **Monitor:**
   - Check Firebase Console for function execution
   - View logs for any errors
   - Confirm notifications are sent

**Your Cloud Functions are ready to deploy!** 🚀
