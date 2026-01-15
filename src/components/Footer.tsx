import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                By messaging AI Chat, an AI chatbot, you agree to our{' '}
                <Link href="/terms">Terms</Link> and have read our{' '}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>
        </footer>
    );
}
