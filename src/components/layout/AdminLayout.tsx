'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  FileCheck,
  ShieldAlert,
  Radio,
  CreditCard,
  Landmark,
  Settings,
  ClipboardList
} from 'lucide-react';

import { RoleGuard } from '@/components/auth/RoleGuard';

const ADMIN_NAV = [
  { href: '/admin', label: 'Platform Overview', icon: LayoutDashboard },
  { href: '/admin/creators', label: 'Creator Applications', icon: FileCheck },
  { href: '/admin/verification', label: 'ID & 2257 Review', icon: Shield },
  { href: '/admin/reports', label: 'Moderation Reports', icon: ShieldAlert },
  { href: '/admin/users', label: 'User Directory', icon: Users },
  { href: '/admin/rooms', label: 'Live Room Monitor', icon: Radio },
  { href: '/admin/payments', label: 'Payments & Chargebacks', icon: CreditCard },
  { href: '/admin/payouts', label: 'Creator Payouts', icon: Landmark },
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
  { href: '/admin/audit-logs', label: 'Audit Trail', icon: ClipboardList },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={['ADMIN']} redirectTo="/">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#200c14] via-[#100f1c] to-[#1a0e28] border border-rose-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Velora Admin & Compliance Center</h1>
              <span className="text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                STAFF ACCESS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Platform administration, creator 2257 verification, live stream moderation, and financial audits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl font-mono">
          <span>Signed in as:</span>
          <strong className="text-rose-300">{user?.displayName || 'Administrator'}</strong>
        </div>
      </div>

      {/* Main Grid with Admin Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 xl:col-span-2 rounded-2xl bg-[#0f0f18] border border-zinc-800 p-2 shadow-xl space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-900/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Admin Content Area */}
        <main className="lg:col-span-9 xl:col-span-10 min-w-0">{children}</main>
      </div>
    </div>
    </RoleGuard>
  );
}

