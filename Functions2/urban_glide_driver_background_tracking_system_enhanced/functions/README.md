Driver Background Tracking Functions - Enhanced

Generated: 2025-11-10T21:40:41.677661Z

Functions:
- processDriverLocation: called by driver service; logs location, history, triggers panic on motion while offline
- forceStopTracking: callable by admins to disable tracking for a driver (add role checks in production)
- scheduledCleanup: clears old history older than retention window (24h)

Requires BLOEMSEC_ENDPOINT & BLOEMSEC_API_KEY for external panic posting. Admins are notified via FCM topic 'urban_glide_admins'.
