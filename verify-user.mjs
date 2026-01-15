// Manual Email Verification Script
// This script will verify your email in the database

import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://bishal4543_db_user:3zEy3gKMcYruX87k@aichat.e1fgk40.mongodb.net/aichat?retryWrites=true&w=majority";
const EMAIL_TO_VERIFY = "bishaldhungana600@gmail.com";

async function verifyEmail() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('aichat');
        const usersCollection = db.collection('users');
        
        // Check if user exists
        const user = await usersCollection.findOne({ email: EMAIL_TO_VERIFY });
        
        if (!user) {
            console.log('❌ User not found with email:', EMAIL_TO_VERIFY);
            return;
        }
        
        console.log('✅ User found:', user.name);
        console.log('Current verification status:', user.emailVerified ? 'Verified' : 'Not verified');
        
        // Verify the email
        const result = await usersCollection.updateOne(
            { email: EMAIL_TO_VERIFY },
            {
                $set: { emailVerified: new Date() },
                $unset: { verificationToken: '', tokenExpiry: '' }
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log('🎉 Email verified successfully!');
            console.log('You can now log in with your email and password.');
        } else {
            console.log('ℹ️ Email was already verified or no changes made.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

verifyEmail();
