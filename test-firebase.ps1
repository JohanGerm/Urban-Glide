# Firebase Quick Test Script
# Tests Firebase connectivity and configuration

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Firebase Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Check if Firebase CLI is installed
Write-Host "[1/6] Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>$null
    if ($firebaseVersion) {
        Write-Host "  ✅ Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
        $testsPassed++
    }
    else {
        throw "Not found"
    }
}
catch {
    Write-Host "  ❌ Firebase CLI not installed" -ForegroundColor Red
    Write-Host "  Install with: npm install -g firebase-tools" -ForegroundColor Yellow
    $testsFailed++
}

# Test 2: Check Firebase project configuration
Write-Host "[2/6] Checking firebase.json..." -ForegroundColor Yellow
if (Test-Path "C:\src\Claude\firebase\firebase.json") {
    Write-Host "  ✅ firebase.json found" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "  ❌ firebase.json not found" -ForegroundColor Red
    $testsFailed++
}

# Test 3: Check Firestore rules
Write-Host "[3/6] Checking firestore.rules..." -ForegroundColor Yellow
if (Test-Path "C:\src\Claude\firebase\firestore.rules") {
    Write-Host "  ✅ firestore.rules found" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "  ❌ firestore.rules not found" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Check google-services.json (Android)
Write-Host "[4/6] Checking Android config..." -ForegroundColor Yellow
$passengerAndroid = Test-Path "C:\src\Claude\passenger_app\android\app\google-services.json"
$driverAndroid = Test-Path "C:\src\Claude\driver_app\android\app\google-services.json"

if ($passengerAndroid -and $driverAndroid) {
    Write-Host "  ✅ google-services.json files configured" -ForegroundColor Green
    $testsPassed++
}
elseif ((Test-Path "C:\src\Claude\passenger_app\android\app\google-services.json.PLACEHOLDER") -or 
        (Test-Path "C:\src\Claude\driver_app\android\app\google-services.json.PLACEHOLDER")) {
    Write-Host "  ⚠️  PLACEHOLDER files found - Firebase not configured" -ForegroundColor Yellow
    Write-Host "  Download from: https://console.firebase.google.com/project/urban-glide-transport-25" -ForegroundColor Yellow
    $testsFailed++
}
else {
    Write-Host "  ❌ google-services.json not found" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Check GoogleService-Info.plist (iOS)
Write-Host "[5/6] Checking iOS config..." -ForegroundColor Yellow
$passengerIOS = Test-Path "C:\src\Claude\passenger_app\ios\Runner\GoogleService-Info.plist"
$driverIOS = Test-Path "C:\src\Claude\driver_app\ios\Runner\GoogleService-Info.plist"

if ($passengerIOS -and $driverIOS) {
    Write-Host "  ✅ GoogleService-Info.plist files configured" -ForegroundColor Green
    $testsPassed++
}
elseif ((Test-Path "C:\src\Claude\passenger_app\ios\Runner\GoogleService-Info.plist.PLACEHOLDER") -or 
        (Test-Path "C:\src\Claude\driver_app\ios\Runner\GoogleService-Info.plist.PLACEHOLDER")) {
    Write-Host "  ⚠️  PLACEHOLDER files found - Firebase not configured" -ForegroundColor Yellow
    Write-Host "  Download from: https://console.firebase.google.com/project/urban-glide-transport-25" -ForegroundColor Yellow
    $testsFailed++
}
else {
    Write-Host "  ❌ GoogleService-Info.plist not found" -ForegroundColor Red
    $testsFailed++
}

# Test 6: Try to connect to Firebase (requires login)
Write-Host "[6/6] Testing Firebase connection..." -ForegroundColor Yellow
try {
    $projects = firebase projects:list --json 2>$null | ConvertFrom-Json
    if ($projects) {
        $urbanGlide = $projects | Where-Object { $_.projectId -eq "urban-glide-transport-25" }
        if ($urbanGlide) {
            Write-Host "  ✅ Connected to Firebase project: urban-glide-transport-25" -ForegroundColor Green
            $testsPassed++
        }
        else {
            Write-Host "  ⚠️  Connected but project not found" -ForegroundColor Yellow
            Write-Host "  Run: firebase use urban-glide-transport-25" -ForegroundColor Yellow
            $testsFailed++
        }
    }
    else {
        throw "No projects found"
    }
}
catch {
    Write-Host "  ⚠️  Not logged in to Firebase" -ForegroundColor Yellow
    Write-Host "  Run: firebase login" -ForegroundColor Yellow
    $testsFailed++
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests Passed: $testsPassed/6" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed/6" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✅ Firebase is fully configured and ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Deploy Firestore rules: cd firebase; firebase deploy --only firestore:rules" -ForegroundColor White
    Write-Host "2. Deploy Cloud Functions: cd firebase; firebase deploy --only functions" -ForegroundColor White
    Write-Host "3. Run app: cd passenger_app; flutter run -d chrome" -ForegroundColor White
}
elseif ($testsPassed -ge 3) {
    Write-Host "⚠️  Firebase partially configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required actions:" -ForegroundColor Cyan
    
    if (-not $passengerAndroid -or -not $driverAndroid) {
        Write-Host "1. Download google-services.json from Firebase Console" -ForegroundColor White
        Write-Host "   URL: https://console.firebase.google.com/project/urban-glide-transport-25" -ForegroundColor Gray
        Write-Host "   Place in: passenger_app/android/app/ and driver_app/android/app/" -ForegroundColor Gray
    }
    
    if (-not $passengerIOS -or -not $driverIOS) {
        Write-Host "2. Download GoogleService-Info.plist from Firebase Console" -ForegroundColor White
        Write-Host "   Place in: passenger_app/ios/Runner/ and driver_app/ios/Runner/" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "See FIREBASE_TESTING.md for detailed instructions" -ForegroundColor Yellow
}
else {
    Write-Host "❌ Firebase not configured" -ForegroundColor Red
    Write-Host ""
    Write-Host "Setup steps:" -ForegroundColor Cyan
    Write-Host "1. Install Firebase CLI: npm install -g firebase-tools" -ForegroundColor White
    Write-Host "2. Login to Firebase: firebase login" -ForegroundColor White
    Write-Host "3. Download config files from Firebase Console" -ForegroundColor White
    Write-Host "4. See FIREBASE_SETUP.md for complete guide" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed testing instructions, see: FIREBASE_TESTING.md" -ForegroundColor Gray
Write-Host ""
