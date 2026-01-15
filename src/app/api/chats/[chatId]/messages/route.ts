import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const { chatId } = await params;
        const client = await clientPromise;
        const db = client.db('aichat');

        const result = await db.collection('chats').updateOne(
            { _id: new ObjectId(chatId), userId: session.user.email },
            {
                $push: { messages: message },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding message:', error);
        return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
    }
}
