import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/?error=missing-token', request.url));
        }

        const client = await clientPromise;
        const db = client.db('aichat');

        // Find user with this token
        const user = await db.collection('users').findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
        }

        // Update user to verified
        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: { emailVerified: new Date() },
                $unset: { verificationToken: '', tokenExpiry: '' },
            }
        );

        return NextResponse.redirect(new URL('/?verified=true', request.url));
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(new URL('/?error=verification-failed', request.url));
    }
}
