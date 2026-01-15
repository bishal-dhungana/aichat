import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { Chat } from '@/types/chat';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('aichat');

        const chats = await db.collection<Chat>('chats')
            .find({ userId: session.user.email })
            .sort({ updatedAt: -1 })
            .project({ title: 1, updatedAt: 1, createdAt: 1 })
            .toArray();

        return NextResponse.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, title } = await request.json();
        const client = await clientPromise;
        const db = client.db('aichat');

        const firstMessage = message ? [{
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            createdAt: new Date()
        }] : [];

        const newChat: Chat = {
            userId: session.user.email,
            title: title || message?.slice(0, 30) || 'New Chat',
            messages: firstMessage as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('chats').insertOne(newChat);

        return NextResponse.json({ ...newChat, _id: result.insertedId });
    } catch (error) {
        console.error('Error creating chat:', error);
        return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
    }
}
