# Urban Glide - Git Push Script
# Run this to push your code to GitHub

Write-Host "🚀 Urban Glide - GitHub Push Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "passenger_app") -or -not (Test-Path "driver_app")) {
    Write-Host "❌ Please run this script from the project root (C:\src\Claude)" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Current directory: $PWD" -ForegroundColor Green
Write-Host ""

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
    Write-Host ""
}

# Add remote if not exists
$remoteUrl = git remote get-url origin 2>$null
if ($null -eq $remoteUrl) {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/JohanGerm/Urban-Glide.git
    Write-Host "✅ Remote added: https://github.com/JohanGerm/Urban-Glide" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "✅ Remote already configured: $remoteUrl" -ForegroundColor Green
    Write-Host ""
}

# Check git status
Write-Host "📊 Checking repository status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Ask user if they want to proceed
$proceed = Read-Host "Do you want to stage all files and commit? (y/n)"
if ($proceed -ne "y" -and $proceed -ne "Y") {
    Write-Host "❌ Operation cancelled by user" -ForegroundColor Red
    exit 0
}

# Stage all files
Write-Host "📦 Staging all files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "📝 Files to be committed:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Commit
$commitMessage = @"
Initial commit: Urban Glide e-hailing platform

✨ Features:
- Complete Flutter monorepo (passenger, driver, admin apps)
- Firebase backend with Cloud Functions
- Real-time location tracking and driver matching
- Push notifications system (FCM)
- PayFast payment gateway integration
- Production-ready Firestore security rules
- Comprehensive error handling and retry logic
- Testing suite (36+ unit, widget, integration tests)
- Complete documentation and setup guides

📱 Apps:
- Passenger App: Ride booking with real-time tracking
- Driver App: Ride acceptance and earnings tracking
- Admin App: Platform monitoring and analytics

🔧 Tech Stack:
- Flutter 3.35.7, Dart 3.9.2
- Firebase (Auth, Firestore, Functions, Messaging)
- Google Maps Platform
- Provider state management
- Gradle 8.1.4, Kotlin 1.9.22

📚 Documentation:
- README.md - Project overview
- SETUP_COMPLETE.md - Full setup guide
- FIREBASE_SETUP.md - Firebase configuration
- GRADLE_CONFIG.md - Android build config
- RUN_COMMANDS.md - Development commands
- GITHUB_SETUP.md - Git workflow guide

Status: ✅ Ready for production (after Firebase/Maps setup)
"@

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Ask about push
$pushNow = Read-Host "Push to GitHub now? (y/n)"
if ($pushNow -ne "y" -and $pushNow -ne "Y") {
    Write-Host "⏸️  Commit created but not pushed" -ForegroundColor Yellow
    Write-Host "Run 'git push origin main' to push later" -ForegroundColor Yellow
    exit 0
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

try {
    # Try to push to main
    git push -u origin main 2>&1 | Out-String
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 View your repository:" -ForegroundColor Cyan
    Write-Host "   https://github.com/JohanGerm/Urban-Glide" -ForegroundColor Blue
    Write-Host ""
}
catch {
    Write-Host "⚠️  Push failed. You may need to pull first or authenticate." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try these commands:" -ForegroundColor Yellow
    Write-Host "  git pull origin main --rebase" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host "🎉 Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit: https://github.com/JohanGerm/Urban-Glide" -ForegroundColor White
Write-Host "2. Check that all files are present" -ForegroundColor White
Write-Host "3. Verify sensitive files are not committed" -ForegroundColor White
Write-Host "4. Create feature branches for development" -ForegroundColor White
Write-Host ""
Write-Host "See GITHUB_SETUP.md for full Git workflow guide" -ForegroundColor Yellow
