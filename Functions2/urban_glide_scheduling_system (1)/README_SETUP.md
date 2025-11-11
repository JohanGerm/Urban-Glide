Urban Glide - Scheduled Rides System

Generated: 2025-11-09T19:19:17.269328Z

Contents:
- rider_scheduling_flutter/: Flutter module for riders to schedule rides up to 7 days ahead.
- driver_scheduling_flutter/: Flutter module for drivers to view upcoming rides.
- functions_scheduling/: Firebase Cloud Function that dispatches scheduled rides 30 min before start.
- web_admin_scheduling/: Admin React portal to manage tariffs and view scheduled rides.

Notes:
- Replace Firebase configuration in all modules.
- Test Cloud Function scheduling in staging before production.
- Tariff updates are written under /tariffs and can be read by apps to calculate prices.
