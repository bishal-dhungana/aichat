'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSendMessage: (message: string, mode: string | null, files: File[]) => void;
    isLoggedIn: boolean;
    onLoginRequired: () => void;
    isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoggedIn, onLoginRequired, isLoading = false }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [activeMode, setActiveMode] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [showAttachModal, setShowAttachModal] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [loginPromptFeature, setLoginPromptFeature] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdvancedFeatureClick = (feature: string, action: () => void) => {
        if (!isLoggedIn) {
            setLoginPromptFeature(feature);
            setShowLoginPrompt(true);
        } else {
            action();
        }
    };

    const handleModeToggle = (mode: string) => {
        if (activeMode === mode) {
            setActiveMode(null);
        } else {
            setActiveMode(mode);
            // Show feedback for the selected mode
            if (mode === 'search') {
                // Search mode activated
            } else if (mode === 'study') {
                // Study mode activated
            }
        }
    };

    const handleVoiceClick = () => {
        if (isRecording) {
            setIsRecording(false);
        } else {
            setIsRecording(true);
            // Simulate voice recording - in production, integrate actual speech recognition
            setTimeout(() => {
                setIsRecording(false);
                alert('Voice input feature coming soon! For now, please type your message.');
            }, 1500);
        }
    };

    const handleAttachClick = () => {
        setShowAttachModal(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) {
            setFiles([...files, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (isLoading) return;
        if (message.trim() || files.length > 0) {
            onSendMessage(message, activeMode, files);
            setMessage('');
            setActiveMode(null);
            // Clear files after sending
            setTimeout(() => setFiles([]), 100);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const hasInput = message.trim().length > 0;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.inputWrapper}>
                    <textarea
                        className={styles.input}
                        placeholder="Ask anything"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    <div className={styles.actions}>
                        <div className={styles.leftActions}>
                            <button
                                className={`btn btn-action ${files.length > 0 ? 'active' : ''}`}
                                onClick={() => handleAdvancedFeatureClick('Attach', handleAttachClick)}
                                aria-label="Attach files"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00318 15.1625 2.00318C16.2259 2.00318 17.2444 2.42975 17.995 3.18C18.7453 3.93064 19.1718 4.94913 19.1718 6.0125C19.1718 7.07587 18.7453 8.09436 17.995 8.845L9.41 17.43C9.03472 17.8053 8.52551 18.0168 7.995 18.0168C7.46449 18.0168 6.95528 17.8053 6.58 17.43C6.20472 17.0547 5.99318 16.5455 5.99318 16.015C5.99318 15.4845 6.20472 14.9753 6.58 14.6L15.07 6.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Attach
                                {files.length > 0 && <span className={styles.badge}>{files.length}</span>}
                            </button>

                            <button
                                className={`btn btn-action ${activeMode === 'search' ? 'active' : ''}`}
                                onClick={() => handleAdvancedFeatureClick('Search', () => handleModeToggle('search'))}
                                aria-label="Search mode"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Search
                            </button>

                            <button
                                className={`btn btn-action ${activeMode === 'study' ? 'active' : ''}`}
                                onClick={() => handleAdvancedFeatureClick('Study', () => handleModeToggle('study'))}
                                aria-label="Study mode"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H5.5C4.67 21 4 20.33 4 19.5Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M8 11H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Study
                            </button>
                        </div>

                        {/* Show Send button when typing, Voice button otherwise */}
                        {hasInput ? (
                            <button
                                className={`btn btn-voice ${styles.sendButton}`}
                                onClick={handleSubmit}
                                aria-label="Send message"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Send
                            </button>
                        ) : (
                            <button
                                className={`btn btn-voice ${isRecording ? 'recording' : ''}`}
                                onClick={handleVoiceClick}
                                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 23H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Voice
                            </button>
                        )}
                    </div>
                </div>

                {files.length > 0 && (
                    <div className={styles.fileList}>
                        {files.map((file, index) => (
                            <div key={index} className={styles.fileItem}>
                                <span>{file.name}</span>
                                <button onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeMode && (
                    <div className={styles.modeIndicator}>
                        <span>
                            {activeMode === 'search' && '🔍 Search mode active - AI will search the web for answers'}
                            {activeMode === 'study' && '📚 Study mode active - AI will help you learn and understand'}
                        </span>
                        <button onClick={() => setActiveMode(null)} aria-label="Clear mode">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Attach Modal */}
            {showAttachModal && (
                <div className="modal-overlay" onClick={() => setShowAttachModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Attach Files</h3>
                            <button className="modal-close" onClick={() => setShowAttachModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div
                                className={`file-upload-area ${isDragOver ? 'dragover' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleFileDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Drop files here or click to browse
                                </p>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                    Supports images, PDFs, documents, and more
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {files.length > 0 && (
                                <div className="file-list">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <span>{file.name}</span>
                                            <button onClick={() => removeFile(index)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => setShowAttachModal(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Required Prompt */}
            {showLoginPrompt && (
                <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Login Required</h3>
                            <button className="modal-close" onClick={() => setShowLoginPrompt(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                                </svg>
                                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Sign in to unlock {loginPromptFeature}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    Create a free account to access advanced features like {loginPromptFeature}, file attachments, web search, and study mode.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    onLoginRequired();
                                }}
                            >
                                Sign up for free
                            </button>
                            <p className="modal-link">
                                Already have an account?{' '}
                                <a onClick={() => {
                                    setShowLoginPrompt(false);
                                    onLoginRequired();
                                }}>Log in</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
