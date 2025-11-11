/**
 * Payment OTP Server (example)
 * Flow:
 * 1) Client calls POST /initiatePayment with { riderUid, amount, cardLast4, phone }
 *    - Server creates a payment record in Realtime DB with status 'pending_otp'
 *    - Server generates a 6-digit OTP, stores a hashed version in DB with expiry (5 minutes)
 *    - Server sends OTP via SMS using Twilio (or logs it in console for testing)
 *
 * 2) Client calls POST /verifyPaymentOtp with { paymentId, otp }
 *    - Server verifies OTP (hash match + not expired)
 *    - If valid, marks payment as 'authorized' and returns success
 *    - If invalid, increments attempt counter and may lock after repeated failures
 *
 * Security notes:
 * - Use HTTPS in production.
 * - Store service credentials (Twilio, Firebase) in env vars or secret manager.
 * - Use hashed OTPs (we store HMAC using a server secret) and do not expose raw OTPs in logs.
 */

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const twilio = require('twilio');
const crypto = require('crypto');

// Initialize Firebase Admin if GOOGLE_APPLICATION_CREDENTIALS is set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Firebase DB operations will fail if attempted.');
}
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://urban-glide-transport-25.firebaseio.com'
});

const db = admin.database();
const app = express();
app.use(bodyParser.json());

// Twilio client (set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM env vars)
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_FROM || '';
let twClient = null;
if (TWILIO_SID && TWILIO_TOKEN) twClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// Helper: generate OTP and HMAC hash
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}
function hmacHash(secret, value) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

const SERVER_HMAC_SECRET = process.env.OTP_HMAC_SECRET || 'replace-with-strong-secret';

// Initiate payment and send OTP
app.post('/initiatePayment', async (req, res) => {
  const { riderUid, amount, cardLast4, phone } = req.body;
  if (!riderUid || !amount) return res.status(400).send('Missing riderUid or amount');
  try {
    const payRef = db.ref('payments').push();
    const paymentId = payRef.key;
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const hashed = hmacHash(SERVER_HMAC_SECRET, otp + '|' + paymentId);

    // Store payment with pending_otp and store hashed otp metadata under /payment_otps/<paymentId>
    await payRef.set({ riderUid, amount, cardLast4: cardLast4 || null, status: 'pending_otp', ts: new Date().toISOString() });
    await db.ref(`payment_otps/${paymentId}`).set({ hash: hashed, expiresAt, attempts: 0 });

    // Send OTP via Twilio if available, otherwise log it (dev)
    if (twClient && TWILIO_FROM && phone) {
      await twClient.messages.create({ body: `Your Urban Glide payment OTP: ${otp}`, from: TWILIO_FROM, to: phone });
      console.log('OTP sent via Twilio to', phone);
    } else {
      console.log('OTP for payment', paymentId, 'is (dev-only):', otp);
    }

    return res.send({ paymentId, status: 'otp_sent', expiresAt });
  } catch (e) {
    console.error('initiatePayment error', e);
    return res.status(500).send('Server error');
  }
});

// Verify OTP
app.post('/verifyPaymentOtp', async (req, res) => {
  const { paymentId, otp } = req.body;
  if (!paymentId || !otp) return res.status(400).send('Missing paymentId or otp');
  try {
    const otpSnap = await db.ref(`payment_otps/${paymentId}`).get();
    if (!otpSnap.exists()) return res.status(400).send('OTP not found or expired');
    const otpRec = otpSnap.val();
    if (Date.now() > otpRec.expiresAt) {
      // expire
      await db.ref(`payment_otps/${paymentId}`).remove();
      return res.status(400).send('OTP expired');
    }
    if ((otpRec.attempts || 0) >= 5) {
      return res.status(403).send('Too many attempts');
    }
    const expectedHash = otpRec.hash;
    const providedHash = hmacHash(SERVER_HMAC_SECRET, otp + '|' + paymentId);
    if (providedHash === expectedHash) {
      // success: mark payment authorized
      await db.ref(`payments/${paymentId}`).update({ status: 'authorized', authorizedAt: new Date().toISOString() });
      await db.ref(`payment_otps/${paymentId}`).remove();
      return res.send({ success: true, paymentId });
    } else {
      // increment attempts
      await db.ref(`payment_otps/${paymentId}/attempts`).transaction(curr => (curr || 0) + 1);
      return res.status(403).send('Invalid OTP');
    }
  } catch (e) {
    console.error('verifyPaymentOtp error', e);
    return res.status(500).send('Server error');
  }
});

// Simple health check
app.get('/health', (req, res) => res.send({ ok: true, ts: new Date().toISOString() }));

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log('Payment OTP server listening on', PORT));
