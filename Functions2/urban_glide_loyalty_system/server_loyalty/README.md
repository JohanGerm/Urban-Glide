Loyalty & Ratings Server Example

This server watches for completed rides, awards loyalty points to the rider, creates a pending rating record, and exposes an endpoint for riders to submit ratings.

Setup:
1. Create service account and set GOOGLE_APPLICATION_CREDENTIALS env var.
2. npm install
3. node index.js

Flow:
- When a ride transitions from 'active' to 'completed', the server adds points to /points/<riderUid> and writes a pending rating record to /ratings_pending/<rideId>.
- Riders call /submitRating with their ID token to submit a rating for the driver. The server saves the rating and recalculates driver's average.

Security:
- Verify tokens on server-side as shown. For Cloud Functions, use the built-in triggers and authenticated callable functions where possible.
