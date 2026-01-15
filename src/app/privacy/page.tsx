import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Privacy Policy - AI Chat',
    description: 'Privacy Policy for AI Chat. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
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
                <h1>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last updated: January 14, 2026</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        At AI Chat, we take your privacy seriously. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you use our AI-powered chat service.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide, including:</p>
                    <ul>
                        <li>Name and email address when creating an account</li>
                        <li>Profile information you choose to provide</li>
                        <li>Payment information for premium services</li>
                    </ul>

                    <h3>Usage Data</h3>
                    <p>We automatically collect certain information when you use our service:</p>
                    <ul>
                        <li>Chat conversations and interactions with the AI</li>
                        <li>Files you upload for analysis</li>
                        <li>Device information and browser type</li>
                        <li>IP address and general location</li>
                        <li>Usage patterns and feature preferences</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide and maintain our AI chat service</li>
                        <li>Improve and personalize your experience</li>
                        <li>Train and enhance our AI models</li>
                        <li>Communicate with you about updates and features</li>
                        <li>Detect and prevent fraud or abuse</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as your account is active or as needed
                        to provide services. Chat history may be retained to improve our AI systems, but you
                        can request deletion of your data at any time.
                    </p>
                </section>

                <section>
                    <h2>5. Data Sharing</h2>
                    <p>We do not sell your personal information. We may share data with:</p>
                    <ul>
                        <li>Service providers who assist in our operations</li>
                        <li>Law enforcement when required by law</li>
                        <li>Business partners for integrated features (with your consent)</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your information, including:
                    </p>
                    <ul>
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security audits and assessments</li>
                        <li>Access controls and authentication</li>
                        <li>Secure data centers and infrastructure</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Your Rights</h2>
                    <p>Depending on your location, you may have the right to:</p>
                    <ul>
                        <li>Access the personal information we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to or restrict certain processing</li>
                        <li>Data portability</li>
                        <li>Withdraw consent</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Cookies and Tracking</h2>
                    <p>
                        We use cookies and similar tracking technologies to enhance your experience. You can
                        control cookie preferences through your browser settings.
                    </p>
                </section>

                <section>
                    <h2>9. Children&apos;s Privacy</h2>
                    <p>
                        AI Chat is not intended for children under 13. We do not knowingly collect personal
                        information from children under 13.
                    </p>
                </section>

                <section>
                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes
                        by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                    </p>
                </section>

                <section>
                    <h2>11. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy or our data practices, please contact
                        us at privacy@aichat.com.
                    </p>
                </section>
            </article>
        </main>
    );
}
