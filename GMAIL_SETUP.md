# Quick Setup for Gmail

## Step-by-Step (5 minutes)

### 1. Enable 2-Factor Authentication
🔗 https://myaccount.google.com/security
- Find "2-Step Verification"
- Click "Get started"
- Follow the prompts

### 2. Generate App Password
🔗 https://myaccount.google.com/apppasswords
- Select app: **Mail**
- Select device: **Other (Custom name)**
- Type: **AI Chat**
- Click **Generate**
- Copy the 16-character password (no spaces)

### 3. Update Your .env File

Replace the EMAIL section in your `.env` file with:

```env
# --- 3. EMAIL CONFIGURATION (GMAIL) ---
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER="bishaldhungana600@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-char-app-password-here"
EMAIL_FROM="AI Chat <bishaldhungana600@gmail.com>"
```

### 4. Restart Your Server

Close your dev server (Ctrl+C) and restart:
```bash
npm run dev
```

### 5. Test It!

Run the test script:
```bash
node test-email.mjs
```

You should see:
```
✅ Connection successful!
✅ Test email sent successfully!
```

And receive an email at bishaldhungana600@gmail.com

---

## Already Done ✅

Your account is verified! You can log in right now at http://localhost:3000

Once you fix the email configuration above, new signups will automatically receive verification emails.
