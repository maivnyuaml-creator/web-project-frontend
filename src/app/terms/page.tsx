import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
          <Shield className="w-4 h-4" /> Legal Agreement
        </div>
        <h1 className="text-3xl font-black text-white">Terms of Service</h1>
        <p className="text-xs text-zinc-400">Effective Date: October 2026 • Platform: Velora Live</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none text-xs text-zinc-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Velora Live (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you are prohibited from using or accessing the Platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Strict 18+ Eligibility</h2>
          <p>
            You must be at least eighteen (18) years of age, or the age of majority in your jurisdiction, whichever is older, to access or use the Platform. Any access by minors is strictly prohibited. Providing false age or identity information constitutes fraud and immediate account termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Tokens, Payments & Virtual Goods</h2>
          <p>
            Velora Tokens (&quot;Tokens&quot;) are digital virtual tokens used solely within the platform to interact with broadcasters, tip, access private sessions, and purchase creator media. Tokens have no real-world monetary value, cannot be redeemed for legal currency by viewers, and are non-refundable once acquired, except where required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Broadcaster Standards & 2257 Recordkeeping</h2>
          <p>
            All performers on Velora Live must undergo comprehensive government identity verification and liveness checks prior to transmitting any live or recorded content. All records are maintained in strict accordance with 18 U.S.C. § 2257.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">5. Prohibited Conduct</h2>
          <p>
            Users and creators are strictly forbidden from broadcasting or uploading content depicting minors, non-consensual sexual acts, revenge material, physical violence, hate speech, or financial scams. Any infraction results in instant termination, referral to law enforcement agencies, and forfeiture of funds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">6. Reporting & Moderation</h2>
          <p>
            If you witness any conduct violating these terms, submit a formal report immediately via our 24/7 moderation portal at{' '}
            <Link href="/report" className="text-purple-400 hover:underline">
              veloralive.com/report
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
