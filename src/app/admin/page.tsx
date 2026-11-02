'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Radio,
  DollarSign,
  Coins,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats(),
  });

  const stats = statsData?.data || {
    activeLiveRooms: 48,
    totalViewersOnline: 12480,
    todayRevenueUsd: 18450.50,
    todayTokensCirculated: 184505,
    pendingCreatorApplications: 14,
    pendingReports: 6,
    totalUsers: 142080,
    activeCreators: 1280,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Active Live Streams</span>
              <Radio className="w-4 h-4 text-rose-500 animate-pulse-live" />
            </div>
            <h3 className="text-2xl font-black text-white">{stats.activeLiveRooms}</h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {stats.totalViewersOnline.toLocaleString()} Viewers Online
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Today&apos;s Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white">${stats.todayRevenueUsd.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-400 font-mono">
              🪙 {stats.todayTokensCirculated.toLocaleString()} tokens
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Pending Creator Apps</span>
              <FileCheck className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-2xl font-black text-white">{stats.pendingCreatorApplications}</h3>
            <Link href="/admin/creators" className="text-[11px] text-purple-400 hover:underline">
              Review queue →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Pending Moderation Reports</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-white">{stats.pendingReports}</h3>
            <Link href="/admin/reports" className="text-[11px] text-rose-400 hover:underline">
              Investigate reports →
            </Link>
          </div>
        </div>

        {/* Priority Queues Alert Box */}
        <div className="rounded-3xl bg-[#160c14] border border-rose-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Compliance Priority Queue</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              There are <strong className="text-white">{stats.pendingReports} moderation reports</strong> awaiting urgent action and <strong className="text-white">{stats.pendingCreatorApplications} creator KYC submissions</strong> pending 2257 identity verification.
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Link href="/admin/reports">
              <Button variant="danger" size="md">
                Open Reports Queue
              </Button>
            </Link>
            <Link href="/admin/creators">
              <Button variant="secondary" size="md">
                Review Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/rooms" className="group">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-purple-500/40 transition-colors shadow-lg space-y-2">
              <Radio className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Live Stream Monitor</h4>
              <p className="text-xs text-zinc-400">Inspect active broadcasts, monitor stream bitrate and terminate flagged sessions.</p>
            </div>
          </Link>

          <Link href="/admin/users" className="group">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-purple-500/40 transition-colors shadow-lg space-y-2">
              <Users className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">User & Account Directory</h4>
              <p className="text-xs text-zinc-400">Search members, suspend abusive accounts, or inspect purchase patterns.</p>
            </div>
          </Link>

          <Link href="/admin/payouts" className="group">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-purple-500/40 transition-colors shadow-lg space-y-2">
              <DollarSign className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Creator Payout Approvals</h4>
              <p className="text-xs text-zinc-400">Authorize Paxum, Crypto, and Wire transfers to verified platform performers.</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
