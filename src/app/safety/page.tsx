import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
          <ShieldCheck className="w-4 h-4" /> Trust, Safety & Compliance
        </div>
        <h1 className="text-3xl font-black text-white">18 U.S.C. 2257 Compliance & Safety Policy</h1>
        <p className="text-xs text-zinc-400">Zero tolerance for exploitation, non-consensual material, or underage content.</p>
      </div>

      <div className="rounded-3xl bg-purple-950/20 border border-purple-500/30 p-6 space-y-3">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
          <FileText className="w-5 h-5 text-purple-400" />
          Federal Record-Keeping Statement (18 U.S.C. § 2257)
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          All models, actors, and broadcasters appearing in visual depictions of actual or simulated sexually explicit conduct on Velora Live were at least eighteen (18) years of age at the time of creation. Records required pursuant to 18 U.S.C. § 2257 and 28 C.F.R. Part 75 are maintained by our designated Custodian of Records.
        </p>
        <div className="pt-2 text-xs text-zinc-400 space-y-1 font-mono">
          <p><strong>Designated Records Custodian:</strong> Compliance Director, Velora Live Inc.</p>
          <p><strong>Address:</strong> Corporate Compliance Center, Records Division, Wilmington, DE, USA</p>
        </div>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none text-xs text-zinc-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">Broadcaster Identity Verification Protocols</h2>
          <p>
            No user is permitted to broadcast or monetize media without completing multi-tiered identity verification. We require valid government-issued photo identification (Passport, National ID, or Driver&apos;s License) paired with biometric liveness scanning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">Emergency Response & Immediate Takedowns</h2>
          <p>
            Our moderation agents operate 24 hours a day, 7 days a week. Any reports flagging suspected underage involvement, non-consensual content, or trafficking trigger instantaneous stream termination, IP blacklisting, and law enforcement escalation (NCMEC referral).
          </p>
        </section>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link href="/report">
            <Button variant="danger" size="md">
              Submit Immediate Safety Report
            </Button>
          </Link>
          <Link href="/creator/verification">
            <Button variant="secondary" size="md">
              Review Creator Verification Guidelines
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
