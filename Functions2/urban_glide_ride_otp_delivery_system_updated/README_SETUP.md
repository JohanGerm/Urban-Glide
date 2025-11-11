Urban Glide - Ride OTP Delivery System (Updated)

Generated: 2025-11-10T21:31:50.477020Z

What's new in this update:
1) OTPs stored as HMAC hashes using OTP_HMAC_SECRET (set in environment). Raw OTPs are NOT stored.
2) Server-side rate-limiting for OTP generation per driver with exponential backoff stored at /otp_gen_meta/<driverUid>.
3) Integrated Rider/Driver apps: driver no longer shows raw OTP locally; rider receives OTP via FCM/messages. Apps save FCM tokens to /fcmTokens/<uid>.
4) Stricter DB rules and attempt limits.

Deployment steps:
- Deploy functions in functions_ride_otp_delivery and set OTP_HMAC_SECRET, Twilio creds if used.
- Update Rider and Driver apps with the integrated code and build.
- Ensure clients authenticate and save fcmTokens.

Security notes:
- Remove masked OTP from function responses in production.
- Keep OTP_HMAC_SECRET secret and rotate if needed.
- Monitor otp_gen_meta to tune thresholds.
