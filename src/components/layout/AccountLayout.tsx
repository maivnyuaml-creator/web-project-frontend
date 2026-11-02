'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  User,
  Shield,
  Heart,
  Coins,
  History,
  Video,
  Bell
} from 'lucide-react';

const ACCOUNT_NAV = [
  { href: '/account', label: 'Overview', icon: User, exact: true },
  { href: '/account/wallet', label: 'Wallet & Tokens', icon: Coins },
  { href: '/account/favorites', label: 'Favorites', icon: Heart },
  { href: '/account/shows', label: 'Show Sessions', icon: Video },
  { href: '/account/transactions', label: 'Transactions', icon: History },
  { href: '/account/security', label: 'Security & 2FA', icon: Shield },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
];

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Top Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121020] via-[#0f0f18] to-[#1a1024] border border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-purple-500 bg-purple-950/60 shrink-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {user?.displayName || user?.username || 'My Account'}
              </h1>
              <span className="text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                {user?.role || 'VIEWER'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {user?.email || 'user@veloralive.com'} • Member since October 2026
            </p>
          </div>
        </div>

        {/* Token Balance Pill */}
        <div className="flex items-center gap-3 bg-[#161208] border border-amber-500/40 rounded-2xl p-3 px-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 block font-medium">Token Balance</span>
            <span className="text-xl font-black text-amber-300">
              🪙 {user?.tokenBalance ?? 0}
            </span>
          </div>
          <Link
            href="/account/wallet"
            className="ml-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 rounded-xl transition-colors"
          >
            + Buy
          </Link>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800 no-scrollbar">
        {ACCOUNT_NAV.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                  : 'bg-[#12121b] text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Child View */}
      <div>{children}</div>
    </div>
  );
}
