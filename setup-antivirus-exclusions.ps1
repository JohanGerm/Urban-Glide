# Flutter Development - Antivirus Exclusion Script
# Run this script as Administrator to add Windows Defender exclusions

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Flutter Development Environment Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click this script and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "Or run PowerShell as Administrator first" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Function to add exclusion safely
function Add-SafeExclusion {
    param($path)
    
    if (Test-Path $path) {
        try {
            Add-MpPreference -ExclusionPath $path -ErrorAction Stop
            Write-Host "  ✅ Added: $path" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "  ⚠️  Already exists or error: $path" -ForegroundColor Yellow
            return $false
        }
    }
    else {
        Write-Host "  ⏭️  Skipped (not found): $path" -ForegroundColor Gray
        return $false
    }
}

Write-Host "📁 Adding Windows Defender Exclusions..." -ForegroundColor Cyan
Write-Host ""

$addedCount = 0

# Flutter SDK
Write-Host "[1/7] Flutter SDK..." -ForegroundColor Yellow
if (Test-Path "C:\src\flutter") {
    if (Add-SafeExclusion "C:\src\flutter") { $addedCount++ }
}
elseif (Test-Path "$env:USERPROFILE\flutter") {
    if (Add-SafeExclusion "$env:USERPROFILE\flutter") { $addedCount++ }
}
else {
    Write-Host "  ⏭️  Flutter SDK not found in common locations" -ForegroundColor Gray
}

# Urban Glide Project
Write-Host "[2/7] Urban Glide Project..." -ForegroundColor Yellow
if (Add-SafeExclusion "C:\src\Claude") { $addedCount++ }

# Passenger App
Write-Host "[3/7] Passenger App..." -ForegroundColor Yellow
if (Add-SafeExclusion "C:\src\Claude\passenger_app") { $addedCount++ }

# Driver App
Write-Host "[4/7] Driver App..." -ForegroundColor Yellow
if (Add-SafeExclusion "C:\src\Claude\driver_app") { $addedCount++ }

# Admin App
Write-Host "[5/7] Admin App..." -ForegroundColor Yellow
if (Add-SafeExclusion "C:\src\Claude\admin_app") { $addedCount++ }

# Android SDK
Write-Host "[6/7] Android SDK..." -ForegroundColor Yellow
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
if (Add-SafeExclusion $androidSdk) { $addedCount++ }

# Gradle Cache
Write-Host "[7/7] Gradle Cache..." -ForegroundColor Yellow
$gradleCache = "$env:USERPROFILE\.gradle"
if (Add-SafeExclusion $gradleCache) { $addedCount++ }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Successfully added $addedCount exclusion(s)" -ForegroundColor Green
Write-Host ""

# Show all current exclusions
Write-Host "📋 Current Windows Defender Exclusions:" -ForegroundColor Cyan
Write-Host ""
try {
    $exclusions = Get-MpPreference | Select-Object -ExpandProperty ExclusionPath
    if ($exclusions) {
        foreach ($exclusion in $exclusions) {
            if ($exclusion -like "*Claude*" -or $exclusion -like "*flutter*" -or $exclusion -like "*Android*" -or $exclusion -like "*gradle*") {
                Write-Host "  📁 $exclusion" -ForegroundColor Green
            }
            else {
                Write-Host "  📁 $exclusion" -ForegroundColor Gray
            }
        }
    }
    else {
        Write-Host "  (No exclusions found)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "  ⚠️  Could not retrieve exclusions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔧 Additional Setup Required" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Developer Mode is enabled
Write-Host "Checking Windows Developer Mode..." -ForegroundColor Yellow
$devMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -ErrorAction SilentlyContinue

if ($devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
    Write-Host "  ✅ Developer Mode is ENABLED" -ForegroundColor Green
}
else {
    Write-Host "  ❌ Developer Mode is DISABLED" -ForegroundColor Red
    Write-Host ""
    Write-Host "  To enable Developer Mode:" -ForegroundColor Yellow
    Write-Host "  1. Press Win + I (Settings)" -ForegroundColor White
    Write-Host "  2. Go to: Privacy & Security → For developers" -ForegroundColor White
    Write-Host "  3. Toggle 'Developer Mode' to ON" -ForegroundColor White
    Write-Host ""
    
    $openSettings = Read-Host "  Open Developer Settings now? (y/n)"
    if ($openSettings -eq "y" -or $openSettings -eq "Y") {
        Write-Host "  Opening Settings..." -ForegroundColor Yellow
        start ms-settings:developers
        Write-Host "  ✅ Please enable 'Developer Mode' in the window that opened" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Enable Developer Mode (if not already enabled)" -ForegroundColor White
Write-Host "2. Restart your terminal" -ForegroundColor White
Write-Host "3. Run your app:" -ForegroundColor White
Write-Host ""
Write-Host "   cd C:\src\Claude\passenger_app" -ForegroundColor Cyan
Write-Host "   flutter run -d windows" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or run on Chrome (no Developer Mode needed):" -ForegroundColor White
Write-Host "   flutter run -d chrome" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host
