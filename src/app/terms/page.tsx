import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Terms of Service - AI Chat',
    description: 'Terms of Service for using AI Chat, your intelligent conversation partner.',
};

export default function TermsPage() {
    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to AI Chat
                </Link>
            </nav>

            <article className={styles.content}>
                <h1>Terms of Service</h1>
                <p className={styles.lastUpdated}>Last updated: January 14, 2026</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using AI Chat, you accept and agree to be bound by the terms and
                        provisions of this agreement. If you do not agree to these terms, please do not use
                        our service.
                    </p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>
                        AI Chat provides an artificial intelligence-powered conversational interface that allows
                        users to ask questions, seek information, generate content, and engage in various
                        interactive tasks. The service includes features such as:
                    </p>
                    <ul>
                        <li>Text-based conversations with AI</li>
                        <li>Web search integration</li>
                        <li>Study and learning assistance</li>
                        <li>Image generation capabilities</li>
                        <li>Voice input functionality</li>
                        <li>File attachment and analysis</li>
                    </ul>
                </section>

                <section>
                    <h2>3. User Responsibilities</h2>
                    <p>
                        As a user of AI Chat, you agree to:
                    </p>
                    <ul>
                        <li>Provide accurate information when creating an account</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Use the service in compliance with all applicable laws</li>
                        <li>Not use the service for any unlawful or prohibited purpose</li>
                        <li>Not attempt to reverse engineer or compromise the service</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Content Guidelines</h2>
                    <p>
                        You may not use AI Chat to generate, request, or distribute content that is:
                    </p>
                    <ul>
                        <li>Illegal, harmful, or threatening</li>
                        <li>Harassing, defamatory, or invasive of privacy</li>
                        <li>Infringing on intellectual property rights</li>
                        <li>Sexually explicit or obscene</li>
                        <li>Fraudulent or deceptive</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Intellectual Property</h2>
                    <p>
                        The AI Chat service, including its original content, features, and functionality,
                        is owned by AI Chat and is protected by international copyright, trademark, patent,
                        trade secret, and other intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        AI Chat and its affiliates shall not be liable for any indirect, incidental, special,
                        consequential, or punitive damages resulting from your use of or inability to use the
                        service.
                    </p>
                </section>

                <section>
                    <h2>7. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. We will notify users of any
                        changes by posting the new terms on this page and updating the &quot;Last updated&quot; date.
                    </p>
                </section>

                <section>
                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at
                        support@aichat.com.
                    </p>
                </section>
            </article>
        </main>
    );
}
