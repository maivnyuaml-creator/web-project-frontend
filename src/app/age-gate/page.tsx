'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AgeGatePage() {
  const handleEnter = () => {
    localStorage.setItem('velora_age_consent', 'true');
    window.location.href = '/';
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="rounded-3xl bg-[#0f0f18] border border-zinc-800 p-8 sm:p-12 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Age Eligibility & Access Notice</h1>
            <p className="text-xs text-rose-400 font-mono uppercase tracking-wider mt-0.5">
              Strict 18+ Verification & Age Gate
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200 text-xs leading-relaxed flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <p>
            Velora Live strictly restricts access to individuals aged 18 and older (or the age of majority in your jurisdiction). If you are under the legal age, you must exit this website immediately.
          </p>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Requirements for Access:</h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>You must be at least 18 years old or the age of majority where you reside.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>You understand that this platform features adult live broadcasts, nudity, and sexually explicit interactive performances.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>You confirm that viewing adult material does not violate any local laws or community standards in your area.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>You agree not to permit minors access to your device, account, or any content obtained on this platform.</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="lg" onClick={handleEnter} className="flex-1">
            I am 18 or Older — Enter Velora Live
          </Button>
          <Button variant="secondary" size="lg" onClick={handleExit} className="flex-1">
            I am Under 18 — Leave Website
          </Button>
        </div>
      </div>
    </div>
  );
}
