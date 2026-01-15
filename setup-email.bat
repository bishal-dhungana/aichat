@echo off
echo ================================================
echo    AI Chat - Email Verification Setup Helper
echo ================================================
echo.

:menu
echo Choose your email provider:
echo.
echo [1] Fix Zoho (keep current aichat@bishal.site)
echo [2] Switch to Gmail (bishaldhungana600@gmail.com)
echo [3] Test current configuration
echo [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto zoho
if "%choice%"=="2" goto gmail
if "%choice%"=="3" goto test
if "%choice%"=="4" exit
goto menu

:zoho
echo.
echo ================================================
echo    Setting up Zoho Email
echo ================================================
echo.
echo Step 1: Generate Zoho App Password
echo    1. Go to: https://mail.zoho.com
echo    2. Click Settings ^> Security ^> App Passwords
echo    3. Generate new password for "SMTP"
echo.
set /p zohopw="Paste your Zoho App Password here: "

echo.
echo Updating .env file...
powershell -Command "(Get-Content .env) -replace 'EMAIL_SERVER_PASSWORD=.*', 'EMAIL_SERVER_PASSWORD=\"%zohopw%\"' | Set-Content .env"

echo.
echo ✅ Configuration updated!
echo.
goto test

:gmail
echo.
echo ================================================
echo    Switching to Gmail
echo ================================================
echo.
echo Step 1: Enable 2-Factor Authentication
echo    Go to: https://myaccount.google.com/security
echo.
echo Step 2: Generate Gmail App Password
echo    Go to: https://myaccount.google.com/apppasswords
echo.
pause
echo.
set /p gmailpw="Paste your Gmail App Password (16 chars, no spaces): "

echo.
echo Updating .env file...
powershell -Command "$content = Get-Content .env; $newContent = @(); $skipLines = $false; foreach ($line in $content) { if ($line -match '^# --- 3\. EMAIL CONFIGURATION') { $skipLines = $true; $newContent += '# --- 3. EMAIL CONFIGURATION (GMAIL) ---'; $newContent += 'EMAIL_SERVER_HOST=\"smtp.gmail.com\"'; $newContent += 'EMAIL_SERVER_PORT=465'; $newContent += 'EMAIL_SERVER_USER=\"bishaldhungana600@gmail.com\"'; $newContent += 'EMAIL_SERVER_PASSWORD=\"%gmailpw%\"'; $newContent += 'EMAIL_FROM=\"AI Chat <bishaldhungana600@gmail.com>\"'; continue; } if ($skipLines -and $line -match '^EMAIL_') { continue; } if ($skipLines -and $line -match '^$') { $skipLines = $false; } if (-not $skipLines) { $newContent += $line; } } $newContent | Set-Content .env"

echo.
echo ✅ Switched to Gmail!
echo.
goto test

:test
echo.
echo ================================================
echo    Testing Email Configuration
echo ================================================
echo.
node test-email-from-env.mjs
echo.
echo.
echo If you see "✅ Connection successful!", your email is working!
echo Check bishaldhungana600@gmail.com for a test email.
echo.
pause
goto menu
