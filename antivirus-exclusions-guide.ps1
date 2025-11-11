# Quick Fix for Flutter Development
# This script adds antivirus exclusions WITHOUT disabling protection

# ADD THESE EXCLUSIONS MANUALLY:
# 1. Open Windows Security (Win + I → Privacy & Security → Windows Security)
# 2. Click "Virus & threat protection"
# 3. Scroll to "Virus & threat protection settings" → Click "Manage settings"
# 4. Scroll to "Exclusions" → Click "Add or remove exclusions"
# 5. Click "Add an exclusion" → "Folder"
# 6. Add these folders one by one:

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Folders to Add as Exclusions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy these paths and add them manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. C:\src\Claude" -ForegroundColor Green
Write-Host "2. C:\src\flutter" -ForegroundColor Green
Write-Host "3. $env:LOCALAPPDATA\Android\Sdk" -ForegroundColor Green
Write-Host "4. $env:USERPROFILE\.gradle" -ForegroundColor Green
Write-Host ""
Write-Host "Or run these commands in PowerShell as Administrator:" -ForegroundColor Yellow
Write-Host ""
Write-Host 'Add-MpPreference -ExclusionPath "C:\src\Claude"' -ForegroundColor Cyan
Write-Host 'Add-MpPreference -ExclusionPath "C:\src\flutter"' -ForegroundColor Cyan
Write-Host "Add-MpPreference -ExclusionPath `"$env:LOCALAPPDATA\Android\Sdk`"" -ForegroundColor Cyan
Write-Host "Add-MpPreference -ExclusionPath `"$env:USERPROFILE\.gradle`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
