'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Sidebar.module.css';

interface Chat {
    _id: string;
    title: string;
    updatedAt: string;
}

interface SidebarProps {
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    lastUpdated?: number;
}

export default function Sidebar({ activeChatId, onSelectChat, onNewChat, lastUpdated }: SidebarProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (session) {
            fetchChats();
        } else {
            setChats([]);
            setIsLoading(false);
        }
    }, [session, lastUpdated]);

    const fetchChats = async () => {
        try {
            const response = await fetch('/api/chats');
            if (response.ok) {
                const data = await response.json();
                setChats(data);
            }
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            const response = await fetch(`/api/chats/${chatId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setChats(prev => prev.filter(c => c._id !== chatId));
                if (activeChatId === chatId) {
                    onNewChat();
                }
            }
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <button
                    className={styles.newChatBtn}
                    onClick={onNewChat}
                    title="New Chat"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {!isCollapsed && <span>New chat</span>}
                </button>
                <button
                    className={styles.collapseBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className={styles.content}>
                <button
                    className={styles.newChatBtnLarge}
                    onClick={onNewChat}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {!isCollapsed && <span>New chat</span>}
                </button>

                <div className={styles.sectionTitle}>
                    {!isCollapsed && <span>YOUR CHATS</span>}
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : chats.length === 0 ? (
                    <div className={styles.emptyState}>
                        {!isCollapsed && "No chats yet"}
                    </div>
                ) : (
                    <div className={styles.chatList}>
                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                className={`${styles.chatItem} ${activeChatId === chat._id ? styles.active : ''}`}
                                onClick={() => onSelectChat(chat._id)}
                            >
                                <svg className={styles.chatIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {!isCollapsed && (
                                    <>
                                        <span className={styles.chatTitle}>{chat.title}</span>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={(e) => handleDeleteChat(e, chat._id)}
                                            title="Delete chat"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {session && (
                <div className={styles.userSection}>
                    <div className={styles.userProfile}>
                        {session.user?.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                className={styles.userAvatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {session.user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        {!isCollapsed && (
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{session.user?.name}</div>
                                <div className={styles.userPlan}>Free Plan</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
