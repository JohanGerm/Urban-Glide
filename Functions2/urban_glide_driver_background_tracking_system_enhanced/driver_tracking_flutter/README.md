Driver Background Tracker (Flutter) - simplified instructions

- Use background_locator_2 or workmanager + geolocator to collect location periodically.
- Send data to functions.processDriverLocation via callable with payload { lat, lng, speed, isOnline, motionDetected, ts }.
- The app must display a foreground notification when tracking is active (Android requirement).
- Provide opt-in consent UI. To disable, call server to set meta.disabledBy; functions will respect that.
