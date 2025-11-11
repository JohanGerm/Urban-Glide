@echo off
echo 🚀 Deploying Urban Glide Agora Voice Integration Functions...

firebase login
firebase use urban-glide-transport-25

echo 🔧 Setting environment variables...
firebase functions:config:set agora.app_id="YOUR_AGORA_APP_ID"
firebase functions:config:set agora.app_certificate="YOUR_AGORA_APP_CERTIFICATE"
firebase functions:config:set agora.expiry_seconds="300"

echo 📦 Deploying Agora Functions...
cd urban_glide_agora_integration\functions_agora
npm install
firebase deploy --only functions

echo ✅ Deployment complete. Current Agora function configs:
firebase functions:config:get

echo 🚀 Agora voice-only system deployed successfully.
pause
