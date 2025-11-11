Urban Glide - Multi-Level Admin System

Generated: 2025-11-09T19:28:53.339849Z

Contents:
- functions_admin_levels/: Firebase Functions implementing Master/Senior OTP-based freeze, and role checks.
- web_admin_levels/: Web admin portal for generating OTP, freezing/unfreezing system.

Roles:
- master: full control, can generate OTP.
- senior: can freeze/unfreeze using OTP.
- support: view-only access.
- operator: monitor only.

System Freeze:
- Stops new ride requests, driver notifications, and marks system_status=frozen.
- Senior can only trigger freeze after OTP issued by Master.
- All actions logged under /admin_actions/<uid>.
