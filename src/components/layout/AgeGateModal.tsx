'use client';

import React, { useSyncExternalStore } from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function getConsentSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('velora_age_consent') === 'true';
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function AgeGateModal() {
  const hasConsented = useSyncExternalStore(subscribe, getConsentSnapshot, getServerSnapshot);

  const handleAgree = () => {
    localStorage.setItem('velora_age_consent', 'true');
    window.dispatchEvent(new Event('storage'));
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (hasConsented) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d0d15] border border-purple-500/30 p-8 shadow-2xl text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-900/40">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>

        <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
          18+ Age Restricted Platform
        </span>

        <h2 className="text-2xl font-extrabold text-white mb-3">
          Welcome to Velora Live
        </h2>

        <p className="text-xs text-zinc-300 leading-relaxed mb-6">
          This platform contains sexually explicit content and live adult broadcasting. You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to enter.
        </p>

        <div className="bg-[#141422] rounded-2xl p-4 text-left text-xs text-zinc-400 space-y-2 mb-6 border border-zinc-800">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>I certify that I am at least 18 years of age or older.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>I consent to viewing adult themes and interactive broadcasts.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" onClick={handleExit} className="w-full sm:w-auto px-6">
            Leave Website
          </Button>
          <Button variant="primary" onClick={handleAgree} className="w-full sm:w-auto px-8">
            I am 18 or Older — Enter
          </Button>
        </div>
      </div>
    </div>
  );
}
