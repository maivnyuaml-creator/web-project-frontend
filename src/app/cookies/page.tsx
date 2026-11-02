import React from 'react';
import { Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
          <Cookie className="w-4 h-4" /> Transparency
        </div>
        <h1 className="text-3xl font-black text-white">Cookie Policy</h1>
        <p className="text-xs text-zinc-400">How Velora Live utilizes essential and analytical cookies.</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none text-xs text-zinc-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that enable websites to remember your session, preferences, and authentication state securely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Essential Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Session Authentication:</strong> Secure HTTP-only cookies that verify your active session without exposing tokens to client scripts.</li>
            <li><strong>Age Gate Verification:</strong> Remembers your 18+ age verification consent so you are not prompted repeatedly.</li>
            <li><strong>Stream Video Player:</strong> Stores your chosen player volume and audio preferences across live broadcasts.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Managing Cookie Preferences</h2>
          <p>
            You can modify your browser settings to decline or clear cookies at any time. Disabling essential cookies may impair your ability to log in or participate in live chat rooms.
          </p>
        </section>
      </div>
    </div>
  );
}
