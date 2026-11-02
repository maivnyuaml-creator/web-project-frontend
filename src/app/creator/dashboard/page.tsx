'use client';

import React from 'react';
import Link from 'next/link';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Coins,
  DollarSign,
  Radio,
  Users,
  Heart,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Play
} from 'lucide-react';

export default function CreatorDashboardPage() {
  return (
    <CreatorLayout>
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Month Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white">$4,850.20</h3>
              <span className="text-[11px] text-emerald-400 font-medium">🪙 48,502 Tokens</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Broadcasting Status</span>
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                Live Ingest
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <span className="text-[11px] text-zinc-400 font-medium">1,420 Active Viewers</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Total Followers</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white">42,800</h3>
              <span className="text-[11px] text-emerald-400 font-medium">+840 this week</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Next Payout Eligible</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-amber-300">$3,240.00</h3>
              <span className="text-[11px] text-zinc-400 font-medium">Auto-disbursed weekly</span>
            </div>
          </div>
        </div>

        {/* Live Stream Quick Setup Card */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#100f1c] to-fuchsia-950/30 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <Badge variant="live">LIVE BROADCAST READY</Badge>
            <h3 className="text-xl font-bold text-white">
              Connect OBS or Broadcast Directly in Browser
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your RTMP credentials are authenticated. Stream in 1080p 60fps with automatic HLS distribution, low-latency WebSockets chat, and dynamic tip overlays.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link href="/creator/stream">
              <Button variant="primary" size="md">
                Stream & OBS Settings <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/creator/tip-menu">
              <Button variant="secondary" size="md">
                Edit Tip Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Tips & Fan Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Tippers in Room</CardTitle>
                <Link href="/creator/earnings" className="text-xs text-purple-400 hover:underline">
                  Full Analytics
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: '1', user: 'CyberValkyrie', tokens: 100, msg: 'Loving the background lighting setup! 💜', time: '5m ago' },
                    { id: '2', user: 'NeonKnight', tokens: 250, msg: 'Dance to Favorite Song requested', time: '18m ago' },
                    { id: '3', user: 'WhaleKing99', tokens: 1000, msg: 'Awesome cosplay stream as always ✨', time: '42m ago' },
                  ].map((tip) => (
                    <div
                      key={tip.id}
                      className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">@{tip.user}</span>
                          <span className="text-[10px] text-zinc-500">{tip.time}</span>
                        </div>
                        <p className="text-zinc-300 text-[11px] mt-0.5">{tip.msg}</p>
                      </div>
                      <span className="font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full shrink-0">
                        🪙 {tip.tokens}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Stream Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-300">🎯 New Cyberpunk Cosplay Outfit</span>
                  <span className="text-amber-300 font-bold">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full" />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>🪙 3,740 received</span>
                  <span>Goal: 🪙 5,000</span>
                </div>
                <div className="pt-2">
                  <Link href="/creator/tip-menu">
                    <Button variant="secondary" size="sm" className="w-full">
                      Configure Goals
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
