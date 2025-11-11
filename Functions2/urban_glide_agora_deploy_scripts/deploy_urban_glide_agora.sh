#!/bin/bash
echo "🚀 Deploying Urban Glide Agora Voice Integration Functions..."

# Authenticate and target project
firebase login
firebase use urban-glide-transport-25

# Set Environment Variables (replace placeholders with your real keys)
firebase functions:config:set agora.app_id="YOUR_AGORA_APP_ID"
firebase functions:config:set agora.app_certificate="YOUR_AGORA_APP_CERTIFICATE"
firebase functions:config:set agora.expiry_seconds="300"

# Deploy Agora Functions
cd urban_glide_agora_integration/functions_agora
npm install
firebase deploy --only functions

# Verify config
echo "✅ Deployment complete. Current Agora function configs:"
firebase functions:config:get

echo "🚀 Agora voice-only system deployed successfully."
