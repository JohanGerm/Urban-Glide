Enforcement Admin Server

- Run this server with GOOGLE_APPLICATION_CREDENTIALS set to a service account with database and auth permissions.
- IMPORTANT: Add authentication (verifyIdToken) and role checks to ensure only authorised admins can call these endpoints.
- Endpoints:
  GET /flags -> list /user_flags
  GET /enforcement/:uid -> get enforcement record
  POST /enforcement/:uid/lift -> remove enforcement and reset risk score
  POST /risk/:uid -> adjust risk score by delta
