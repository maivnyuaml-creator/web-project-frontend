'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export function Footer() {
  const { user } = useAuth();
  const isCreatorOrAdmin = user?.role === 'CREATOR' || user?.role === 'ADMIN';

  return (
    <footer className="w-full bg-[#07070a] border-t border-zinc-800/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                VELORA <span className="text-fuchsia-400 font-light">LIVE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The premier next-generation adult live broadcasting platform. Dedicated to creator empowerment, state-of-the-art interactive streaming, and community safety.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Strict 18+ Compliance Enforced</span>
            </div>
          </div>

          {/* Discovery */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/browse" className="hover:text-purple-400 transition-colors">
                  Browse Live Streams
                </Link>
              </li>
              <li>
                <Link href="/categories/cosplay" className="hover:text-purple-400 transition-colors">
                  Cosplay & Fantasy
                </Link>
              </li>
              <li>
                <Link href="/categories/dance-music" className="hover:text-purple-400 transition-colors">
                  Dance & Music
                </Link>
              </li>
              <li>
                <Link href="/categories/asmr-chat" className="hover:text-purple-400 transition-colors">
                  ASMR & Pillow Talk
                </Link>
              </li>
              <li>
                <Link href="/categories/gaming" className="hover:text-purple-400 transition-colors">
                  Gaming & Challenge
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators & Viewers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              {isCreatorOrAdmin ? (
                <>
                  <li>
                    <Link href="/creator/dashboard" className="text-purple-300 hover:text-white transition-colors">
                      Creator Studio
                    </Link>
                  </li>
                  <li>
                    <Link href="/creator/verification" className="hover:text-purple-400 transition-colors">
                      Broadcaster Verification
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/creator/apply" className="hover:text-purple-400 transition-colors">
                    Become a Creator
                  </Link>
                </li>
              )}
              <li>
                <Link href="/account/wallet" className="hover:text-purple-400 transition-colors">
                  Buy Tokens & Packages
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-purple-400 transition-colors">
                  Safety & Compliance
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Report Violation / DMCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-3">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-purple-400 transition-colors">
                  18 U.S.C. 2257 Compliance & Safety
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-purple-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/age-gate" className="hover:text-purple-400 transition-colors">
                  Age Eligibility Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 2257 Compliance Statement Banner */}
        <div className="pt-6 pb-6 border-t border-zinc-800/60 text-[11px] text-zinc-500 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-zinc-300">18 U.S.C. § 2257 Record-Keeping Compliance:</strong> All visual depictions of actual or simulated sexually explicit conduct appearing on Velora Live were produced in strict compliance with federal recordkeeping regulations. All performers, broadcasters, and models were at least 18 years of age at the time of production and transmission. Access by minors under 18 is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© 2026 Velora Live Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Engineered for high-performance adult entertainment
          </p>
        </div>
      </div>
    </footer>
  );
}
