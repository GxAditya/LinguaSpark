import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="mb-12">
            <div className="inline-flex p-3 rounded-lg tone-iris border border-accent mb-6">
              <Shield className="w-8 h-8 text-accent-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted">
              Last updated: January 14, 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="tone-iris border border-accent rounded-xl p-6 mb-8">
              <p className="text-primary mb-0">
                At LinguaSpark, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our language learning platform.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Name and email address</li>
                <li>Password (encrypted)</li>
                <li>Profile photo (optional)</li>
                <li>Language preferences and learning goals</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect information about your interactions with LinguaSpark:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Lessons completed and progress data</li>
                <li>Game scores and achievements</li>
                <li>AI conversation history</li>
                <li>Time spent on the platform</li>
                <li>Device information (browser type, operating system, device model)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Audio Data</h3>
              <p className="text-gray-700">
                When you use voice features, we collect and process audio recordings to provide pronunciation feedback and speech recognition. These recordings are processed by our AI systems and stored securely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Provide and improve our services:</strong> Personalize your learning experience, track progress, and recommend content</li>
                <li><strong>Process payments:</strong> Handle subscription billing and payment transactions</li>
                <li><strong>Communicate with you:</strong> Send account updates, promotional offers, and customer support responses</li>
                <li><strong>Analyze usage:</strong> Understand how users interact with our platform to improve features and user experience</li>
                <li><strong>Ensure security:</strong> Detect and prevent fraud, abuse, and security threats</li>
                <li><strong>Comply with legal obligations:</strong> Meet regulatory requirements and respond to legal requests</li>
                <li><strong>Train AI models:</strong> Improve our AI algorithms to provide better learning experiences (anonymized where possible)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Share Your Information</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 mb-4">
                Third-party companies that help us operate LinguaSpark:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Cloud hosting providers (AWS, Google Cloud)</li>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Email service providers (SendGrid)</li>
                <li>Analytics platforms (Google Analytics)</li>
                <li>AI and machine learning services (OpenAI, Google AI)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court order, or government request, or to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Comply with legal processes</li>
                <li>Enforce our Terms of Service</li>
                <li>Protect the rights, property, or safety of LinguaSpark, our users, or others</li>
                <li>Prevent or investigate fraud or security issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-gray-700">
                If LinguaSpark is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure payment processing (PCI DSS compliant)</li>
                <li>Employee training on data protection and privacy</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Access and Portability</h3>
              <p className="text-gray-700 mb-4">
                You have the right to request a copy of your personal data in a structured, machine-readable format.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Correction and Update</h3>
              <p className="text-gray-700 mb-4">
                You can update your account information at any time through your profile settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Deletion</h3>
              <p className="text-gray-700 mb-4">
                You can request deletion of your account and associated data. Note that some information may be retained for legal or legitimate business purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Opt-Out</h3>
              <p className="text-gray-700 mb-4">
                You can opt out of:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Marketing emails (via unsubscribe link)</li>
                <li>Cookies (through browser settings)</li>
                <li>Personalized recommendations (through app settings)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Do Not Track</h3>
              <p className="text-gray-700">
                We honor Do Not Track signals and similar mechanisms. When enabled, we will not track your browsing behavior for advertising purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Essential cookies:</strong> Required for the platform to function (e.g., authentication)</li>
                <li><strong>Performance cookies:</strong> Help us understand how users interact with our site</li>
                <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Advertising cookies:</strong> Deliver relevant ads (with your consent)</li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings. Disabling cookies may affect your ability to use certain features.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
              <p className="text-gray-700">
                For users between 13 and 18, we recommend parental guidance and consent before using our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark operates globally, and your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws.
              </p>
              <p className="text-gray-700">
                We ensure appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Standard contractual clauses approved by relevant authorities</li>
                <li>Adequacy decisions by regulatory bodies</li>
                <li>Privacy Shield frameworks (where applicable)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-gray-700">
                When you delete your account, we will delete or anonymize your personal information within 30 days, except for information we must retain for legal purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification</li>
                <li>Displaying a notice in the app</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of LinguaSpark after the effective date of the updated policy constitutes acceptance of the changes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@linguaspark.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Data Protection Officer:</strong> dpo@linguaspark.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> LinguaSpark Inc., 123 Learning Lane, San Francisco, CA 94105
                </p>
                <p className="text-gray-700 mb-0">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Regional Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">California Residents (CCPA)</h3>
              <p className="text-gray-700 mb-4">
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, delete personal information, and opt-out of the sale of personal information (which we do not engage in).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">European Residents (GDPR)</h3>
              <p className="text-gray-700 mb-4">
                European Union residents have rights under the General Data Protection Regulation (GDPR), including the right to access, rectification, erasure, restriction of processing, data portability, and objection to processing.
              </p>

              <p className="text-gray-700">
                To exercise any of these rights, please contact us using the information provided above.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
