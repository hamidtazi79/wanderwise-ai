// src/app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-300">Last updated: {year}</p>

          <p className="mt-6 text-sm text-slate-300">
            This Privacy Policy explains how{" "}
            <span className="font-semibold">Wanderwise AI</span> (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your
            information when you use our website{" "}
            <span className="text-sky-300">https://wanderwise.uk</span> and
            related services (collectively, the &quot;Service&quot;).
          </p>

          <p className="mt-4 text-xs text-slate-500">
            This is a general informational policy and may not cover all legal
            requirements for your specific country. For formal legal guidance,
            please consult a lawyer.
          </p>

          {/* 1. Information we collect */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-sm text-slate-300">
              We collect information to provide and improve Wanderwise AI. This
              may include:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>
                <span className="font-semibold">Account Information:</span> Your
                name, email address, and authentication details when you sign up
                or log in (for example with Google).
              </li>
              <li>
                <span className="font-semibold">Profile &amp; Usage Data:</span>{" "}
                Saved trips, itineraries, preferences (travel style, budget,
                etc.), and interactions with the AI planner and chat.
              </li>
              <li>
                <span className="font-semibold">Payment Information:</span> If
                you subscribe to a paid plan, billing and payment details are
                processed securely by our payment provider (Stripe). We do not
                store your full card details.
              </li>
              <li>
                <span className="font-semibold">Technical Data:</span> IP
                address, browser type, device information, and pages visited,
                which may be collected through cookies and analytics tools.
              </li>
            </ul>
          </section>

          {/* 2. How we use your information */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">
              2. How We Use Your Information
            </h2>
            <p className="text-sm text-slate-300">
              We use the information we collect in order to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>Provide and improve the AI itinerary builder and chat.</li>
              <li>Create and store your trip plans and preferences.</li>
              <li>Manage subscriptions, billing, and customer support.</li>
              <li>
                Understand how the Service is used so we can improve features
                and performance.
              </li>
              <li>Keep the Service secure and prevent fraud or abuse.</li>
            </ul>
          </section>

          {/* 3. Cookies & tracking */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">3. Cookies &amp; Tracking</h2>
            <p className="text-sm text-slate-300">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>Remember your login session.</li>
              <li>Measure usage and performance (analytics).</li>
              <li>
                Show or control ads for free-tier users (for example via Google
                AdSense).
              </li>
            </ul>
            <p className="text-sm text-slate-300">
              You can control certain cookies through your browser settings. Some
              features may not work properly if you disable cookies.
            </p>
          </section>

          {/* 4. Analytics & ads */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">
              4. Analytics &amp; Advertising
            </h2>
            <p className="text-sm text-slate-300">
              We may use third-party tools such as{" "}
              <span className="font-semibold">Google Analytics</span> to
              understand how visitors use Wanderwise AI, and{" "}
              <span className="font-semibold">Google AdSense</span> to display
              ads to free users.
            </p>
            <p className="text-sm text-slate-300">
              These providers may set their own cookies and collect information
              about your device and browsing activity across sites that use
              their services. You can learn more in Google&apos;s privacy
              documentation and adjust your ad settings via your Google account.
            </p>
          </section>

          {/* 5. Data sharing */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">5. How We Share Data</h2>
            <p className="text-sm text-slate-300">
              We do not sell your personal data. We may share information with:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>
                <span className="font-semibold">Service Providers:</span> such as
                hosting (Firebase), analytics (Google), and payment processing
                (Stripe).
              </li>
              <li>
                <span className="font-semibold">Legal &amp; Safety:</span> when
                required to comply with law, respond to legal requests, or
                protect our rights and users.
              </li>
            </ul>
          </section>

          {/* 6. Data retention */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">6. Data Retention</h2>
            <p className="text-sm text-slate-300">
              We keep your information for as long as it is reasonably necessary
              to provide the Service, comply with our legal obligations, resolve
              disputes, and enforce our agreements.
            </p>
          </section>

          {/* 7. Your rights */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">7. Your Rights</h2>
            <p className="text-sm text-slate-300">
              Depending on your location, you may have rights regarding your
              personal data, such as:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>Accessing or updating your account information.</li>
              <li>Requesting deletion of certain data.</li>
              <li>Objecting to or limiting certain types of processing.</li>
            </ul>
            <p className="text-sm text-slate-300">
              To exercise these rights, you can contact us at{" "}
              <a
                href="mailto:contact@wanderwise.uk"
                className="text-sky-300 underline hover:text-sky-400"
              >
                contact@wanderwise.uk
              </a>
              .
            </p>
          </section>

          {/* 8. Children */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">8. Children&apos;s Privacy</h2>
            <p className="text-sm text-slate-300">
              Wanderwise AI is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe a child has provided us with personal data, please
              contact us so we can delete it.
            </p>
          </section>

          {/* 9. Changes */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-sm text-slate-300">
              We may update this Privacy Policy from time to time. If we make
              material changes, we will update the &quot;Last updated&quot; date
              and may provide additional notice where appropriate.
            </p>
          </section>

          {/* 10. Contact */}
          <section className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p className="text-sm text-slate-300">
              If you have any questions about this policy or how we handle your
              data, please contact us at:
            </p>
            <p className="text-sm text-slate-300">
              Email:{" "}
              <a
                href="mailto:contact@wanderwise.uk"
                className="text-sky-300 underline hover:text-sky-400"
              >
                contact@wanderwise.uk
              </a>
            </p>
          </section>

          <div className="mt-10">
            <Link
              href="/"
              className="text-sm text-sky-300 underline hover:text-sky-400"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
