Functions Enforcement - Deployment notes

- These are Firebase Realtime Database triggers. Deploy via Firebase CLI in your functions project.
- They set /user_flags/<uid>, increment /risk_score/<uid>, and write /enforcements/<uid> when thresholds are reached.
- When enforcement writes action 'locked', the function also attempts to set a custom claim 'locked' on the Firebase Auth user. That requires that the functions service account has proper permissions.

Testing & Safety:
- Test in staging with synthetic data. Do NOT enable auto-locks in production until thresholds and false-positive rates are validated.
- Admin override endpoints are provided in a separate server component.
