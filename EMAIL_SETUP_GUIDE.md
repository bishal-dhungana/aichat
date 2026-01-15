# Email Verification Setup Guide

## Current Status
✅ Your account (bishaldhungana600@gmail.com) is now verified and you can log in!

## Problem
The Zoho email configuration is failing with "535 Authentication Failed". This means either:
1. You need to use an App Password instead of your regular password
2. SMTP access needs to be enabled in your Zoho account
3. The credentials are incorrect

## Solutions

### Option 1: Fix Zoho Email (Recommended if you want to keep Zoho)

1. **Log in to Zoho Mail**: https://mail.zoho.com
2. **Go to Settings** → **Security** → **App Passwords**
3. **Generate a new App Password** for "SMTP"
4. **Copy the generated password**
5. **Update your .env file**:
   ```env
   EMAIL_SERVER_PASSWORD="<your-new-app-password>"
   ```
6. **Restart your dev server**: `npm run dev`

**Zoho SMTP Settings:**
- For paid accounts: `smtppro.zoho.com`
- For free accounts: `smtp.zoho.com`
- Port: `465` (SSL) or `587` (TLS)

### Option 2: Switch to Gmail (Easier Setup)

Gmail is easier to set up and more reliable. Here's how:

1. **Enable 2-Factor Authentication** on your Google Account:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "AI Chat"
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Update your .env file**:
   ```env
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=465
   EMAIL_SERVER_USER="bishaldhungana600@gmail.com"
   EMAIL_SERVER_PASSWORD="<your-16-char-app-password>"
   EMAIL_FROM="AI Chat <bishaldhungana600@gmail.com>"
   ```

4. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Option 3: Use a Different Email Service

Other reliable options:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go)
- **Resend** (Free tier: 100 emails/day)

## Test Your Email Configuration

After updating your .env file, run:
```bash
node test-email.mjs
```

If successful, you'll see:
```
✅ Connection successful!
✅ Test email sent successfully!
```

And you'll receive a test email at bishaldhungana600@gmail.com

## Quick Test

Once email is working, test the complete flow:
1. Open your app: http://localhost:3000
2. Click "Sign up"
3. Create a test account with a different email
4. Check that email for the verification link
5. Click the verification link
6. Log in successfully!

## Troubleshooting

### "535 Authentication Failed"
- **Zoho**: Generate an App Password
- **Gmail**: Enable 2FA and generate App Password
- Check username/password are correct

### "Connection refused"
- Check the SMTP host and port are correct
- Verify your firewall isn't blocking port 465/587

### Email not received
- Check spam/junk folder
- Verify the "to" email address is correct
- Check server logs for errors

### "Invalid login"
- Make sure you're using an App Password, not your regular password
- Verify the email account exists and is active

## Your Current Login

**You can log in NOW with:**
- Email: `bishaldhungana600@gmail.com`
- Password: `<your password>`

Your account has been manually verified! 🎉

## Need Help?

If you're still having issues:
1. Check the console logs when you try to sign up
2. The error message will tell you exactly what's wrong
3. Most commonly it's the email password that needs to be an App Password
