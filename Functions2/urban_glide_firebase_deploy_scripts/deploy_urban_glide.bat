@echo off
echo 🚀 Deploying Urban Glide Firebase Functions...

firebase login
firebase use urban-glide-transport-25

echo 🔧 Setting Firebase function configs...
firebase functions:config:set otp.hmac_secret="CHANGE_THIS_TO_A_RANDOM_SECRET"
firebase functions:config:set twilio.account_sid="CHANGE_TO_YOUR_TWILIO_SID"
firebase functions:config:set twilio.auth_token="CHANGE_TO_YOUR_TWILIO_AUTH_TOKEN"
firebase functions:config:set twilio.from="+YOUR_TWILIO_NUMBER"
firebase functions:config:set bloemsec.api_key="CHANGE_TO_YOUR_BLOEMSEC_API_KEY"
firebase functions:config:set bloemsec.endpoint="https://api.bloemsec.co.za/panic"
firebase functions:config:set admin.alert_email="urbanglidebfn@gmail.com"

echo 📦 Deploying OTP + Panic System...
cd urban_glide_otp_panic\functions
firebase deploy --only functions

echo 📍 Deploying Driver Background Tracking...
cd ..\..\urban_glide_tracking\functions
firebase deploy --only functions

echo 🗂 Deploying Database Rules...
cd ..\..
firebase deploy --only database

echo ✅ Deployment complete! Current function configs:
firebase functions:config:get

echo 🚀 Urban Glide systems deployed successfully.
pause
