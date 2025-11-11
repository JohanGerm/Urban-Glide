Payment OTP Server

This server implements an OTP system for card payments. It creates a payment record, generates an OTP, stores a hashed HMAC of the OTP with expiry in Realtime DB, and sends the OTP via Twilio (or logs for dev). Then it verifies the OTP and marks the payment as authorized.

Setup:
1. Create service account JSON for Firebase and set GOOGLE_APPLICATION_CREDENTIALS env var.
2. (Optional) Create Twilio account and set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM env vars.
3. Set OTP_HMAC_SECRET to a strong secret in env vars.
4. npm install
5. node index.js

DB structure:
- payments/<paymentId> = { riderUid, amount, cardLast4, status }
- payment_otps/<paymentId> = { hash, expiresAt, attempts }

Security notes:
- Use HTTPS and protect endpoints with authentication where appropriate.
- Do not log raw OTPs in production. The dev logging in this example is only for testing.
- Consider rate limiting and additional fraud checks.
