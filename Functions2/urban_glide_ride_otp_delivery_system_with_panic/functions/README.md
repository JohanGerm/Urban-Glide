Urban Glide Functions - OTP + Panic

Generated: 2025-11-10T21:40:41.677661Z

This folder contains stub Firebase Functions:
- generateOtpOnAccept (HMAC), verifyRideOtp
- triggerBloemsecAlert: logs panic, POSTs to BLOEMSEC_ENDPOINT, notifies internal admins via FCM topic 'urban_glide_admins'

ENV variables recommended: OTP_HMAC_SECRET, TWILIO_*, BLOEMSEC_API_KEY, BLOEMSEC_ENDPOINT

Deploy with Firebase CLI in your project.
