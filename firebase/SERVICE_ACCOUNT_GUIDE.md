# Firebase Service Account Setup

## Download Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/project/urban-glide-transport-25/settings/serviceaccounts/adminsdk

2. Click **"Generate new private key"**

3. Save as: `firebase/functions/serviceAccountKey.json`

4. ⚠️ **NEVER commit this file to Git!**

---

## Update Cloud Functions

If you downloaded the service account key, uncomment these lines in `firebase/functions/index.js`:

```javascript
// Uncomment for local testing with service account:
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Comment out the default initialization:
// admin.initializeApp();
```

---

## When to Use Each Method

### `admin.initializeApp()` - DEFAULT (Recommended)
- ✅ **Use when deploying to Firebase Functions**
- Automatically uses Firebase project credentials
- No service account file needed
- Simplest and most secure

### `admin.credential.cert(serviceAccount)` - MANUAL
- ✅ **Use for local testing/development**
- ✅ **Use when running functions on your own server**
- Requires service account JSON file
- More control over credentials

---

## Current Setup

Your Cloud Functions are configured with **default credentials** (`admin.initializeApp()`).

**This is correct for Firebase deployment!** ✅

No changes needed unless you're running locally outside Firebase Functions.

---

## Deploy Cloud Functions

```powershell
cd C:\src\Claude\firebase

# Install dependencies
cd functions
npm install

# Deploy all functions
cd ..
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:onRideCreated
```

---

## Verify Functions

After deployment:
1. Go to: https://console.firebase.google.com/project/urban-glide-transport-25/functions
2. Check function status (should be green/active)
3. View logs for any errors

---

## Functions List

Your project has 4 Cloud Functions:

1. **`onRideCreated`** - Notifies nearby drivers when ride is created
2. **`onRideAccepted`** - Notifies passenger when driver accepts
3. **`onDriverArrived`** - Notifies passenger when driver arrives
4. **`onRideCompleted`** - Notifies both users when ride completes

All use **default Firebase Admin initialization** - no service account needed! ✅
