import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter your email and password');
                }

                try {
                    const client = await clientPromise;
                    const db = client.db('aichat');
                    const user = await db.collection('users').findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    if (!user.emailVerified) {
                        throw new Error('Please verify your email before logging in');
                    }

                    if (!user.password) {
                        throw new Error('This account uses Google sign-in. Please use Google to log in.');
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    throw new Error('Authentication failed');
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
        error: '/',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = String(token.id);
            }
            return session;
        },
        async signIn({ user, account }) {
            // Allow Google sign-in without email verification
            if (account?.provider === 'google') {
                return true;
            }
            
            // For credentials provider, check email verification
            if (account?.provider === 'credentials') {
                try {
                    const client = await clientPromise;
                    const db = client.db('aichat');
                    const dbUser = await db.collection('users').findOne({ email: user.email });
                    
                    if (!dbUser?.emailVerified) {
                        return false;
                    }
                } catch (error) {
                    console.error('Sign in callback error:', error);
                    return false;
                }
            }
            
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
