import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import schmappsLogo from '../assets/schmappslogo.png';

const LAST_UPDATED = 'April 28, 2026';
const SUPPORT_EMAIL = 'polyrhythmm@gmail.com';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-brand-50 flex flex-col">
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={schmappsLogo} alt="Schmapps logo" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-gray-900">Investors Playground</span>
        </Link>
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <SEO
            title="Privacy Policy"
            description="Privacy Policy for Investors Playground by Schmapps."
            canonical="/privacy"
          />

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">1. Who we are</h2>
              <p>
                Investors Playground is a product by Schmapps. You can reach us at{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:text-brand-700">{SUPPORT_EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">2. What data we collect</h2>
              <p>We collect only the data necessary to provide the service:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account data:</strong> email address and password (stored securely via AWS Cognito).</li>
                <li><strong>Portfolio data:</strong> portfolios, holdings, and trading activity you create in the app.</li>
                <li><strong>Subscription data:</strong> purchase receipts and subscription status, managed by RevenueCat (iOS &amp; Android) and Stripe (web).</li>
                <li><strong>Usage data:</strong> anonymised crash reports and diagnostics.</li>
              </ul>
              <p className="mt-2">We do not sell your data to third parties.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">3. How we use your data</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide and operate the app (paper trading portfolios, holdings, P&amp;L tracking).</li>
                <li>To manage your subscription and process payments.</li>
                <li>To send transactional emails (account notices, password resets).</li>
                <li>To diagnose crashes and improve reliability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">4. Third-party services</h2>
              <p>We use the following third-party services, each governed by their own privacy policies:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>AWS Amplify / Cognito</strong> — authentication and data storage.</li>
                <li><strong>RevenueCat</strong> — in-app purchase management (iOS &amp; Android).</li>
                <li><strong>Stripe</strong> — payment processing (web subscriptions).</li>
                <li><strong>Yahoo Finance</strong> — stock price data fetched on your behalf.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">5. Data retention and deletion</h2>
              <p>
                Your data is retained while your account is active. You can delete your account at any time
                from the Account screen in the app or in account settings on the web.
                Deletion removes all portfolios, holdings, and account information permanently.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">6. Children's privacy</h2>
              <p>
                The app is not directed at children under 13. We do not knowingly collect personal
                information from children.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">7. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. We will post the revised policy on this page
                with an updated date. Continued use of the app after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">8. Contact</h2>
              <p>
                For any privacy questions or requests, email{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:text-brand-700">{SUPPORT_EMAIL}</a>.
              </p>
            </section>

          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
