import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Please fill in all fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('aichat');

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user (unverified)
        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            emailVerified: null,
            verificationToken,
            tokenExpiry,
            createdAt: new Date(),
        });

        // Send verification email only if email configuration is available
        if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER) {
            try {
                const transporter = nodemailer.createTransport({
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
                });

                const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
                    to: email,
                    subject: 'Verify your AI Chat account',
                    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #7c3aed; text-align: center;">Welcome to AI Chat!</h1>
          <p style="font-size: 16px; color: #333;">Hi ${name},</p>
          <p style="font-size: 16px; color: #333;">Thank you for signing up! To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 14px; color: #7c3aed; word-break: break-all;">${verifyUrl}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">This link will expire in 24 hours.</p>
          <p style="font-size: 12px; color: #999; text-align: center;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
                });

                return NextResponse.json({
                    success: true,
                    message: 'Account created! Please check your email to verify.',
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                return NextResponse.json({
                    success: true,
                    message: 'Account created, but we couldn\'t send the verification email. Please contact support.',
                });
            }
        } else {
            // If email is not configured, auto-verify the user
            await db.collection('users').updateOne(
                { email },
                { $set: { emailVerified: new Date() }, $unset: { verificationToken: '', tokenExpiry: '' } }
            );
            
            return NextResponse.json({
                success: true,
                message: 'Account created successfully! You can now log in.',
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create account. Please try again.' },
            { status: 500 }
        );
    }
}
