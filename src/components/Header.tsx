'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './Header.module.css';

interface HeaderProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
    onToggleSidebar?: () => void;
    showSidebarToggle?: boolean;
}

export default function Header({ onLoginClick, onSignupClick, onToggleSidebar, showSidebarToggle }: HeaderProps) {
    const { data: session, status } = useSession();
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                {showSidebarToggle && (
                    <button
                        className={styles.hamburger}
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>AI Chat</span>
            </div>

            <div className={styles.actions}>
                {status === 'loading' ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</span>
                ) : session ? (
                    <div className={styles.userSection}>
                        <div
                            className={styles.userAvatar}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {session.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || 'User'}
                                    width={32}
                                    height={32}
                                    style={{ borderRadius: '50%' }}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>

                        {showUserMenu && (
                            <div className={styles.userMenu}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{session.user?.name}</span>
                                    <span className={styles.userEmail}>{session.user?.email}</span>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />
                                <button
                                    className={styles.menuItem}
                                    onClick={handleLogout}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="btn btn-ghost" onClick={onLoginClick}>
                            Log in
                        </button>
                        <button className="btn btn-primary" onClick={onSignupClick}>
                            Sign up for free
                        </button>
                    </>
                )}

                <button
                    className={styles.helpBtn}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="12" cy="17" r="1" fill="currentColor" />
                    </svg>

                    {showTooltip && (
                        <div className={styles.tooltip}>
                            <p><strong>How to use AI Chat:</strong></p>
                            <ul>
                                <li>Type your message and press Enter or click Send</li>
                                <li>Use Search mode for web-based answers</li>
                                <li>Use Study mode for learning and explanations</li>
                                <li>Attach files for document analysis</li>
                            </ul>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
