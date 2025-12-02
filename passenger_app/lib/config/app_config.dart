import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Configuration class for managing API keys and other sensitive data
/// 
/// API keys are loaded from .env file which is gitignored to prevent
/// exposure in version control.
/// 
/// Usage:
/// 1. Copy .env.example to .env
/// 2. Fill in your actual API keys
/// 3. Access keys via AppConfig.googleMapsAndroidKey or AppConfig.googleMapsIosKey
class AppConfig {
  /// Google Maps API key for Android
  /// Restricted to package: com.urbanglide.passenger_app
  static String get googleMapsAndroidKey {
    return dotenv.env['GOOGLE_MAPS_ANDROID_KEY'] ?? '';
  }

  /// Google Maps API key for iOS
  /// Restricted to bundle ID: com.urbanglide.passengerApp
  static String get googleMapsIosKey {
    return dotenv.env['GOOGLE_MAPS_IOS_KEY'] ?? '';
  }

  /// PayFast Merchant ID
  static String get payfastMerchantId {
    return dotenv.env['PAYFAST_MERCHANT_ID'] ?? '';
  }

  /// PayFast Merchant Key
  static String get payfastMerchantKey {
    return dotenv.env['PAYFAST_MERCHANT_KEY'] ?? '';
  }

  /// PayFast Passphrase
  static String get payfastPassphrase {
    return dotenv.env['PAYFAST_PASSPHRASE'] ?? '';
  }

  /// Whether to use PayFast sandbox mode (true for testing)
  static bool get payfastSandbox {
    final value = dotenv.env['PAYFAST_SANDBOX'] ?? 'true';
    return value.toLowerCase() == 'true';
  }

  /// Validates that all required environment variables are set
  static bool validateConfig() {
    final required = [
      googleMapsAndroidKey,
      googleMapsIosKey,
    ];

    return required.every((value) => value.isNotEmpty);
  }

  /// Returns a list of missing configuration values
  static List<String> getMissingConfigs() {
    final missing = <String>[];

    if (googleMapsAndroidKey.isEmpty) {
      missing.add('GOOGLE_MAPS_ANDROID_KEY');
    }
    if (googleMapsIosKey.isEmpty) {
      missing.add('GOOGLE_MAPS_IOS_KEY');
    }

    return missing;
  }
}
