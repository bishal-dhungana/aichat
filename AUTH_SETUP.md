# Authentication Setup Guide

## Issues Fixed

### 1. **TypeScript & Type Definition Issues**
   - ✅ Added missing `@types/nodemailer` package
   - ✅ Fixed NextAuth adapter type compatibility with proper Adapter import
   - ✅ Fixed MongoDB client promise declaration to use const instead of let
   - ✅ Updated to use `node:crypto` prefix for crypto module

### 2. **NextAuth Configuration Issues**
   - ✅ Fixed adapter casting to use proper `Adapter` type from 'next-auth/adapters'
   - ✅ Added email verification check in authorize function
   - ✅ Enhanced signIn callback to verify email for credentials login
   - ✅ Added proper error handling with try-catch in authorize function
   - ✅ Added fallback values for Google OAuth environment variables

### 3. **Email Verification System**
   - ✅ Added email format validation in signup
   - ✅ Made email verification optional (auto-verifies if email server not configured)
   - ✅ Added better error handling for email sending failures
   - ✅ Fixed email verification to prevent unverified credential logins

### 4. **Error Handling Improvements**
   - ✅ Better error messages for various failure scenarios
   - ✅ Graceful fallback when email server is not configured
   - ✅ Proper error handling in all authentication routes

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

#### Required Variables:
```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb://localhost:27017
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# NextAuth Secret (REQUIRED - Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret-here

# App URL (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
```

#### Optional Variables (for Google Sign-In):
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To get Google OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Optional Variables (for Email Verification):
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=AI Chat <noreply@aichat.com>
```

**Note:** If email variables are not configured, users will be automatically verified upon signup.

For Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an app password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated password in `EMAIL_SERVER_PASSWORD`

### 3. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally and start the service
mongod --dbpath /path/to/data
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your database user password
5. Use the full connection string in `MONGODB_URI`

### 4. Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Copy the output and use it as `NEXTAUTH_SECRET` in your `.env` file.

### 5. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

### Authentication Methods
- ✅ **Email/Password Login** - Traditional credential-based authentication
- ✅ **Google Sign-In** - OAuth authentication with Google
- ✅ **Email Verification** - Optional email verification for new accounts

### Security Features
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT session strategy
- ✅ Email verification tokens (24-hour expiry)
- ✅ Password requirements (minimum 6 characters)
- ✅ Email format validation
- ✅ Duplicate account prevention

## Troubleshooting

### Issue: "Please verify your email before logging in"
**Solution:** Check your email for the verification link. If email is not configured, the account is auto-verified.

### Issue: Email not receiving verification link
**Solutions:**
1. Check spam/junk folder
2. Verify email server configuration in `.env`
3. Check server logs for email sending errors
4. If email is not critical, you can manually verify users in the database:
   ```javascript
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { emailVerified: new Date() } }
   )
   ```

### Issue: "This account uses Google sign-in"
**Solution:** Use the "Continue with Google" button instead of email/password login.

### Issue: MongoDB connection failed
**Solutions:**
1. Verify MongoDB is running (local) or accessible (Atlas)
2. Check `MONGODB_URI` is correct in `.env`
3. For Atlas, ensure your IP is whitelisted
4. Check database user has proper permissions

### Issue: Google Sign-In not working
**Solutions:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check authorized redirect URI in Google Console matches: `{NEXTAUTH_URL}/api/auth/callback/google`
3. Ensure Google+ API is enabled in Google Cloud Console

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed, optional for Google users),
  emailVerified: Date | null,
  verificationToken: String (optional, removed after verification),
  tokenExpiry: Date (optional, removed after verification),
  image: String (optional, from Google),
  createdAt: Date
}
```

## API Routes

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login with credentials
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /verify-email?token=xxx` - Verify email address

## Next Steps

1. ✅ Set up your `.env` file with all required variables
2. ✅ Ensure MongoDB is running and accessible
3. ✅ Test signup with email/password
4. ✅ Test Google sign-in (if configured)
5. ✅ Test email verification (if email is configured)
6. 🎉 Start building your app!
