import React from 'react';
import './Privacy.css';

/**
 * Privacy Policy Page
 *
 * POPIA-compliant privacy policy for CapeWeb.
 * Based on South African Protection of Personal Information Act (POPIA).
 */
export default function Privacy() {
  const lastUpdated = "January 2025";

  return (
    <div className="privacy-page">
      <div className="container">
        <article className="privacy-content">
          <header className="privacy-header">
            <h1>Privacy Policy</h1>
            <p className="privacy-meta">Last updated: {lastUpdated}</p>
          </header>

          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              CapeWeb ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p>
              This policy complies with the Protection of Personal Information Act (POPIA), 2013 (Act No. 4 of 2013) of South Africa.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, business address</li>
              <li><strong>Business Information:</strong> Company name, industry, project requirements</li>
              <li><strong>Communication Records:</strong> Emails, messages, and support tickets</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages</li>
            </ul>

            <h3>2.2 Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. See our Cookie Policy for more details.
            </p>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To communicate with you about projects, updates, and support</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To detect and prevent fraud or security issues</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Legal Basis for Processing (POPIA Compliance)</h2>
            <p>We process your personal information based on:</p>
            <ul>
              <li><strong>Consent:</strong> You have given explicit consent for specific purposes</li>
              <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our services</li>
              <li><strong>Legal Obligation:</strong> We must comply with South African law</li>
              <li><strong>Legitimate Interests:</strong> For business operations that don't override your rights</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Hosting providers, email services, analytics tools</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            </ul>
            <p>All third parties are contractually obligated to protect your data in compliance with POPIA.</p>
          </section>

          <section className="privacy-section">
            <h2>6. Your Rights Under POPIA</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your data</li>
              <li><strong>Right to Object:</strong> Object to processing of your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@capeweb.co.za">privacy@capeweb.co.za</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:
            </p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. Typically:
            </p>
            <ul>
              <li><strong>Active Clients:</strong> Duration of business relationship + 7 years</li>
              <li><strong>Inquiries:</strong> 2 years from last contact</li>
              <li><strong>Marketing Contacts:</strong> Until you unsubscribe or 3 years of inactivity</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside South Africa. We ensure appropriate safeguards are in place to protect your data in accordance with POPIA requirements.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="privacy-section">
            <h2>12. Contact Information</h2>
            <p><strong>Data Protection Officer / Information Officer:</strong></p>
            <address className="privacy-contact">
              CapeWeb<br />
              Cape Town, Western Cape, South Africa<br />
              Email: <a href="mailto:privacy@capeweb.co.za">privacy@capeweb.co.za</a><br />
              Phone: +27 XX XXX XXXX
            </address>
          </section>

          <section className="privacy-section">
            <h2>13. Complaints</h2>
            <p>
              If you have concerns about how we handle your personal information, you have the right to lodge a complaint with the South African Information Regulator:
            </p>
            <address className="privacy-contact">
              Information Regulator (South Africa)<br />
              JD House, 27 Stiemens Street<br />
              Braamfontein, Johannesburg, 2001<br />
              Email: <a href="mailto:inforeg@justice.gov.za">inforeg@justice.gov.za</a><br />
              Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">justice.gov.za/inforeg</a>
            </address>
          </section>

          <footer className="privacy-footer">
            <p>
              <strong>Acknowledgment:</strong> By using CapeWeb's services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
