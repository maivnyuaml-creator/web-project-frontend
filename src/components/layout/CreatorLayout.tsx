'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Video,
  Radio,
  Coins,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Users,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

import { RoleGuard } from '@/components/auth/RoleGuard';

const CREATOR_NAV = [
  { href: '/creator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/creator/stream', label: 'Broadcast & OBS', icon: Radio },
  { href: '/creator/tip-menu', label: 'Tip Menu & Goals', icon: Coins },
  { href: '/creator/profile', label: 'Profile Editor', icon: Settings },
  { href: '/creator/earnings', label: 'Earnings Analytics', icon: DollarSign },
  { href: '/creator/payouts', label: 'Payouts', icon: DollarSign },
  { href: '/creator/schedule', label: 'Schedule', icon: Calendar },
  { href: '/creator/media', label: 'Media Vault', icon: ImageIcon },
  { href: '/creator/fans', label: 'Fans & Blocks', icon: Users },
  { href: '/creator/verification', label: 'KYC Verification', icon: ShieldCheck },
];

export function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RoleGuard allowedRoles={['CREATOR', 'ADMIN']} redirectTo="/">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio Header Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-[#170e28] via-[#100f1c] to-[#1a0f26] border border-purple-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Velora Creator Studio</h1>
              <span className="text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                VERIFIED BROADCASTER
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Manage your live stream ingest, goals, tip menus, fan engagement, and automated payouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/rooms/room-101" target="_blank" className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/40 px-3.5 py-2 rounded-xl transition-all">
            View Live Room <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid with Sidebar on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 xl:col-span-2 rounded-2xl bg-[#0f0f18] border border-zinc-800 p-2 shadow-xl space-y-1">
          {CREATOR_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 xl:col-span-10 min-w-0">{children}</main>
      </div>
    </div>
    </RoleGuard>
  );
}

