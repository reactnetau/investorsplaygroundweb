import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import schmappsLogo from '../assets/schmappslogo.png';

const LAST_UPDATED = 'April 28, 2026';
const SUPPORT_EMAIL = 'polyrhythmm@gmail.com';

export function TermsPage() {
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
            title="Terms of Use"
            description="Terms of Use for Investors Playground by Schmapps."
            canonical="/terms"
          />

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Terms of Use</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">1. Acceptance</h2>
              <p>
                By creating an account or using Investors Playground, you agree to these Terms of Use.
                If you do not agree, do not use the app. You can reach us at{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:text-brand-700">{SUPPORT_EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">2. Eligibility</h2>
              <p>
                You must be at least 13 years old to use the app. By using the app you represent that
                you meet this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">3. Your account</h2>
              <p>
                You are responsible for keeping your account credentials secure and for all activity
                that occurs under your account.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">4. Not financial advice</h2>
              <p>
                Investors Playground is a paper trading simulation for educational purposes only.
                Nothing in the app constitutes financial, investment, or trading advice. All trades
                use virtual money. Past simulated performance is not indicative of real-world results.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">5. Pro subscription — auto-renewing</h2>
              <p>The app offers a <strong>Pro</strong> auto-renewing subscription that unlocks:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Unlimited portfolios (free plan is limited to 1)</li>
                <li>Unlimited holdings per portfolio (free plan is limited to 5)</li>
              </ul>
              <p className="mt-3"><strong>Billing:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>The subscription price is shown at the time of purchase.</li>
                <li>Payment is charged to your App Store, Google Play, or card at confirmation of purchase.</li>
                <li>The subscription automatically renews at the end of each billing period unless cancelled at least 24 hours before the renewal date.</li>
                <li>Your account will be charged for renewal within 24 hours prior to the end of the current period.</li>
                <li>You can manage and cancel your subscription in your App Store, Google Play, or account settings.</li>
                <li>No refund is given for the unused portion of a billing period when you cancel.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">6. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use the app for any unlawful purpose or in violation of any regulations.</li>
                <li>Attempt to gain unauthorised access to any part of the service or its infrastructure.</li>
                <li>Reverse-engineer or scrape the app.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">7. Intellectual property</h2>
              <p>
                All content, design, and code in the app is owned by Schmapps. You retain ownership
                of the portfolio data you create. We do not claim any rights over your trading data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">8. Disclaimer of warranties</h2>
              <p>
                The app is provided "as is" without warranties of any kind. We do not guarantee
                that the app will be error-free, uninterrupted, or suitable for your specific purpose.
                Stock price data is provided for simulation purposes and may not reflect real-time
                market prices.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">9. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, Schmapps is not liable for any indirect,
                incidental, or consequential damages arising from your use of the app.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">10. Governing law</h2>
              <p>
                These terms are governed by the laws of Australia. Any disputes shall be resolved in
                the courts of Australia.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">11. Changes</h2>
              <p>
                We may update these terms from time to time. We will post the revised terms on this
                page with an updated date. Continued use of the app after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-1">12. Contact</h2>
              <p>
                For any questions about these terms, email{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:text-brand-700">{SUPPORT_EMAIL}</a>.
              </p>
            </section>

          </div>

          <div className="mt-10 flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
