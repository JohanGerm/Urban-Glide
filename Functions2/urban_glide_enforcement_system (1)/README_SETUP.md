Urban Glide - Automated Enforcement Prototype (Option B)

Generated: 2025-11-09T19:14:09.486471Z

Contents:
- functions_enforcement/: Firebase Cloud Functions triggers that detect suspicious behavior and enforce actions (write /enforcements, set custom claims).
- server_enforcement_admin/: Admin server to view flags and lift enforcements (must add auth for production).
- web_admin_enforcement/: Admin UI to view flagged users and review cases.

Enforcement logic highlights:
- Flags: cancellations, OTP failures, many devices, impossible speeds, etc.
- Risk scoring: increments per flag; thresholds trigger 'soft_ban' or 'locked' enforcement actions.
- Automated enforcement includes setting Firebase Auth custom claim 'locked' (functions try to set this).

Safety & legal:
- This system can block users. Test in staging. Monitor false positives closely.
- Add an approval/appeal workflow and logging for transparency.
- Ensure compliance with local laws regarding account suspension, data retention, and notification requirements.

Deployment:
- Deploy functions with Firebase CLI (in functions_enforcement).
- Run admin server with service account credentials and secure it behind authentication.

Next steps (suggested):
- Add SMS/email notification to users when they are soft-banned or locked, with appeal instructions.
- Add ML-based scoring by exporting flagged data for training a model offline before applying automated actions.
