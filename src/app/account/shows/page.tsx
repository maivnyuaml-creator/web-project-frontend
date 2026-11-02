'use client';

import React from 'react';
import Link from 'next/link';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Video, Lock, Users, Calendar, Coins, Play } from 'lucide-react';

interface ShowSession {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  type: 'PRIVATE' | 'GROUP';
  durationMinutes: number;
  tokensSpent: number;
  date: string;
  status: 'COMPLETED' | 'SCHEDULED';
  roomId?: string;
}

const SHOWS_DATA: ShowSession[] = [
  {
    id: 'sh-101',
    creatorName: 'Aurora Velvet',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    type: 'PRIVATE',
    durationMinutes: 15,
    tokensSpent: 900,
    date: 'Oct 21, 2026 • 23:45',
    status: 'COMPLETED',
    roomId: 'room-101',
  },
  {
    id: 'sh-102',
    creatorName: 'Elena Fox',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    type: 'GROUP',
    durationMinutes: 30,
    tokensSpent: 300,
    date: 'Oct 19, 2026 • 21:00',
    status: 'COMPLETED',
  },
  {
    id: 'sh-103',
    creatorName: 'Valentina Lux',
    creatorAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&auto=format&fit=crop&q=80',
    type: 'PRIVATE',
    durationMinutes: 10,
    tokensSpent: 750,
    date: 'Oct 15, 2026 • 22:15',
    status: 'COMPLETED',
  },
];

export default function ShowsPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              Show Sessions & Private History
            </h2>
            <p className="text-xs text-zinc-400">
              Review your 1-on-1 private video sessions and group show tickets.
            </p>
          </div>
          <Link href="/browse">
            <Button variant="primary" size="sm">
              Discover Live Shows
            </Button>
          </Link>
        </div>

        {/* Sessions List */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Broadcaster</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold">Tokens</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {SHOWS_DATA.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-purple-500/40 shrink-0">
                          <img src={s.creatorAvatar} alt={s.creatorName} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-white">{s.creatorName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {s.type === 'PRIVATE' ? (
                        <Badge variant="purple" className="gap-1">
                          <Lock className="w-3 h-3 text-purple-400" /> Private 1-on-1
                        </Badge>
                      ) : (
                        <Badge variant="fuchsia" className="gap-1">
                          <Users className="w-3 h-3 text-fuchsia-400" /> Group Show
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 font-mono">{s.durationMinutes} mins</td>
                    <td className="p-4 font-bold text-amber-300 font-mono">🪙 {s.tokensSpent}</td>
                    <td className="p-4 text-zinc-400">{s.date}</td>
                    <td className="p-4">
                      <Badge variant="success">Completed</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {s.roomId && (
                        <Link href={`/rooms/${s.roomId}`}>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                            Visit Room
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
