import React from 'react';
import { Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
          <Lock className="w-4 h-4" /> Privacy & Data Protection
        </div>
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-zinc-400">Effective Date: October 2026 • Platform: Velora Live</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none text-xs text-zinc-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect account registration data (email, chosen username), transaction and token purchase logs, and device/session security telemetry (IP address, browser type). For verified broadcasters, our certified KYC identity provider processes government-issued IDs, proof of address, and biometric selfie checks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. How We Protect Your Data</h2>
          <p>
            All network communication is secured using TLS 1.3 encryption. Passwords are cryptographically salted and hashed. We utilize secure HTTP-only cookies and do not store sensitive authentication tokens in accessible client-side browser storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Discretion & Billing Privacy</h2>
          <p>
            We prioritize your privacy. Payment processor billing descriptors appear under neutral corporate entity names without referencing adult entertainment keywords.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Your Rights Under GDPR / CCPA</h2>
          <p>
            You have the right to request access, correction, or deletion of your personal account data at any time through your Account Security settings or by contacting privacy@veloralive.com.
          </p>
        </section>
      </div>
    </div>
  );
}
