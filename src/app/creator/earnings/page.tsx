'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DollarSign, Coins, TrendingUp, Calendar, Lock, Sparkles } from 'lucide-react';

export default function CreatorEarningsPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');

  const days = [
    { day: 'Mon', tokens: 1240, usd: 124 },
    { day: 'Tue', tokens: 1850, usd: 185 },
    { day: 'Wed', tokens: 2400, usd: 240 },
    { day: 'Thu', tokens: 2100, usd: 210 },
    { day: 'Fri', tokens: 4950, usd: 495 },
    { day: 'Sat', tokens: 6800, usd: 680 },
    { day: 'Sun', tokens: 5200, usd: 520 },
  ];

  const maxTokens = Math.max(...days.map((d) => d.tokens));

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Earnings & Revenue Analytics
            </h2>
            <p className="text-xs text-zinc-400">
              Detailed breakdown of tokens received across all monetization channels.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141420] border border-zinc-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeframe === '7d' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeframe === '30d' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeframe === 'all' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">Total Net Revenue</span>
            <h3 className="text-2xl font-black text-white">$4,850.20</h3>
            <span className="text-[11px] text-amber-300 font-mono">🪙 48,502 tokens</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">Live Room Tips</span>
            <h3 className="text-2xl font-black text-white">$2,140.00</h3>
            <span className="text-[11px] text-zinc-400 font-mono">44% of total</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">1-on-1 Private Shows</span>
            <h3 className="text-2xl font-black text-white">$1,890.20</h3>
            <span className="text-[11px] text-zinc-400 font-mono">39% of total</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">Media Vault Sales</span>
            <h3 className="text-2xl font-black text-white">$820.00</h3>
            <span className="text-[11px] text-zinc-400 font-mono">17% of total</span>
          </div>
        </div>

        {/* Weekly Revenue Visual Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Token Volume (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
              {days.map((item) => {
                const heightPercent = Math.round((item.tokens / maxTokens) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.usd}
                    </span>
                    <div className="w-full bg-zinc-800/80 rounded-xl overflow-hidden h-48 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-fuchsia-500 group-hover:from-purple-500 group-hover:to-fuchsia-400 transition-all rounded-xl"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}
