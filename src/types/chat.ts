import { ObjectId } from 'mongodb';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
    liked?: boolean;
    disliked?: boolean;
    isStreaming?: boolean;
    files?: Array<{ name: string; size: number; type: string }>;
}

export interface Chat {
    _id?: ObjectId;
    userId: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
