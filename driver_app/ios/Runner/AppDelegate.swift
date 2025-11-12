import Flutter
import UIKit
import GoogleMaps

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // IMPORTANT: API key is loaded from .env file at runtime via Flutter
    // The key is passed from Dart code when Google Maps is initialized
    // To use compile-time injection: flutter run --dart-define=GOOGLE_MAPS_IOS_KEY=your_key
    // For now using a placeholder - actual key should be set from Flutter side
    GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY_PLACEHOLDER")
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  // Handle push notifications
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }
  
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
  }
}
