import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="mb-12">
            <div className="inline-flex p-3 rounded-lg bg-blue-50 border border-blue-100 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: January 14, 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <p className="text-gray-700 mb-0">
                Welcome to LinguaSpark! These Terms of Service govern your use of our platform. By accessing or using LinguaSpark, you agree to be bound by these terms.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By creating an account and using LinguaSpark, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Your continued use of LinguaSpark after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of LinguaSpark, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              <p className="text-gray-700">
                You must be at least 13 years old to create an account. Users under 18 should have parental consent.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Subscription and Payment</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark offers both free and paid subscription plans:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Free Plan:</strong> Limited access to features with usage restrictions</li>
                <li><strong>Pro Plan:</strong> Monthly or annual subscription with full access to features</li>
                <li><strong>Lifetime Plan:</strong> One-time payment for permanent access</li>
              </ul>
              <p className="text-gray-700 mb-4">
                By subscribing to a paid plan, you authorize us to charge your payment method on a recurring basis until you cancel. Subscription fees are non-refundable except as required by law or as specified in our refund policy.
              </p>
              <p className="text-gray-700">
                You can cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use LinguaSpark to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use automated tools or bots to access our services</li>
                <li>Resell or redistribute our content without permission</li>
                <li>Interfere with the proper functioning of the platform</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on LinguaSpark, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of LinguaSpark or its content suppliers and is protected by international copyright laws.
              </p>
              <p className="text-gray-700 mb-4">
                You are granted a limited, non-exclusive, non-transferable license to access and use LinguaSpark for personal, non-commercial purposes. You may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Reverse engineer or attempt to extract source code from our software</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Use our content for commercial purposes without a separate agreement</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI-Generated Content</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark uses artificial intelligence to provide personalized learning experiences, including AI-generated conversations, feedback, and content recommendations. While we strive for accuracy, AI-generated content may occasionally contain errors or inaccuracies.
              </p>
              <p className="text-gray-700">
                You acknowledge that AI-generated content should be used as a learning tool and not as a substitute for professional language instruction or translation services. We are not responsible for any consequences arising from reliance on AI-generated content.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy. By using LinguaSpark, you consent to our data practices as described in the Privacy Policy.
              </p>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data, but no method of transmission over the internet is 100% secure. You use our services at your own risk.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                LinguaSpark is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>The service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using the service will be accurate or reliable</li>
                <li>Any errors in the service will be corrected</li>
                <li>The service will meet your specific requirements or expectations</li>
              </ul>
              <p className="text-gray-700">
                Your use of LinguaSpark is at your sole risk. We are not responsible for any learning outcomes or lack thereof.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, LinguaSpark and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
              </p>
              <p className="text-gray-700">
                Our total liability to you for all claims arising from your use of LinguaSpark shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate your account and access to LinguaSpark at our sole discretion, without notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Violates these Terms of Service</li>
                <li>Is harmful to other users or our business</li>
                <li>Exposes us to legal liability</li>
              </ul>
              <p className="text-gray-700">
                Upon termination, your right to use LinguaSpark will immediately cease. We are not liable to you or any third party for termination of your account.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which LinguaSpark operates, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, unless otherwise required by law.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@linguaspark.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> LinguaSpark Inc., 123 Learning Lane, San Francisco, CA 94105
                </p>
                <p className="text-gray-700 mb-0">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
