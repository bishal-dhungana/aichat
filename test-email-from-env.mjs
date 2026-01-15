// Load environment variables
import { config } from 'dotenv';
config();

// Email Configuration Test Script
import nodemailer from 'nodemailer';

const emailConfig = {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
};

async function testEmail() {
    console.log('🧪 Testing email configuration from .env file...\n');
    console.log('📧 Email Provider:', emailConfig.host || '❌ NOT SET');
    console.log('🔌 Port:', emailConfig.port);
    console.log('👤 User:', emailConfig.auth.user || '❌ NOT SET');
    console.log('🔑 Password:', emailConfig.auth.pass ? '✓ SET' : '❌ NOT SET');
    console.log('---\n');
    
    if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
        console.error('❌ Missing email configuration in .env file!');
        console.log('\n💡 Please set these variables in your .env file:');
        console.log('   EMAIL_SERVER_HOST');
        console.log('   EMAIL_SERVER_USER');
        console.log('   EMAIL_SERVER_PASSWORD\n');
        console.log('📄 See GMAIL_SETUP.md for setup instructions');
        return;
    }
    
    try {
        const transporter = nodemailer.createTransport(emailConfig);
        
        // Verify connection
        console.log('🔄 Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection successful!\n');
        
        // Send test email
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"AI Chat" <${emailConfig.auth.user}>`,
            to: "bishaldhungana600@gmail.com",
            subject: "✅ AI Chat Email Verification is Working!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #7c3aed; text-align: center; margin-top: 0;">🎉 Email Configuration Successful!</h1>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Great news! Your email verification system is now working correctly.
                        </p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0; color: #666;"><strong>From:</strong> ${emailConfig.auth.user}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Host:</strong> ${emailConfig.host}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Port:</strong> ${emailConfig.port}</p>
                        </div>
                        <p style="font-size: 16px; color: #333;">
                            New users will now receive verification emails when they sign up! ✨
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000" style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Go to AI Chat
                            </a>
                        </div>
                    </div>
                </div>
            `,
        });
        
        console.log('✅ Test email sent successfully! 🎉');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n📧 Check your inbox at bishaldhungana600@gmail.com');
        console.log('💡 If you don\'t see it, check your spam folder\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\n');
        
        if (error.message.includes('Authentication Failed') || error.message.includes('Invalid login')) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💡 SOLUTION: You need an App Password');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            if (emailConfig.host.includes('gmail')) {
                console.log('📧 For Gmail:');
                console.log('1. Enable 2-Factor Authentication:');
                console.log('   https://myaccount.google.com/security\n');
                console.log('2. Generate App Password:');
                console.log('   https://myaccount.google.com/apppasswords\n');
                console.log('3. Update .env file:');
                console.log('   EMAIL_SERVER_PASSWORD="your-16-char-password"\n');
            } else if (emailConfig.host.includes('zoho')) {
                console.log('📧 For Zoho:');
                console.log('1. Log in to https://mail.zoho.com');
                console.log('2. Go to: Settings → Security → App Passwords');
                console.log('3. Generate a new app password for SMTP');
                console.log('4. Update .env file with the new password\n');
                console.log('💡 Alternative: Switch to Gmail (easier setup)');
                console.log('   See GMAIL_SETUP.md for instructions\n');
            }
            
            console.log('📄 See EMAIL_SETUP_GUIDE.md for detailed instructions');
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💡 Connection Issue');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            console.log('• Check your internet connection');
            console.log('• Verify the EMAIL_SERVER_HOST and PORT in .env');
            console.log('• Check if your firewall is blocking the connection\n');
        }
    }
}

console.log('═══════════════════════════════════════════');
console.log('   AI Chat - Email Configuration Test');
console.log('═══════════════════════════════════════════\n');

testEmail();
