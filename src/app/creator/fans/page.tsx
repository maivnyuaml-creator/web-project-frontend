'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Users, Crown, ShieldAlert, UserX, CheckCircle2 } from 'lucide-react';

interface FanMember {
  id: string;
  username: string;
  displayName: string;
  totalTippedTokens: number;
  isVip: boolean;
  memberSince: string;
}

interface BlockedUser {
  id: string;
  username: string;
  blockedAt: string;
  reason: string;
}

const INITIAL_FANS: FanMember[] = [
  { id: '1', username: 'WhaleKing99', displayName: 'WhaleKing', totalTippedTokens: 14250, isVip: true, memberSince: 'August 2026' },
  { id: '2', username: 'CyberValkyrie', displayName: 'Valkyrie', totalTippedTokens: 8900, isVip: true, memberSince: 'September 2026' },
  { id: '3', username: 'NeonKnight', displayName: 'Neon Knight', totalTippedTokens: 4120, isVip: false, memberSince: 'October 2026' },
  { id: '4', username: 'RetroStreamer', displayName: 'Retro Alex', totalTippedTokens: 2500, isVip: false, memberSince: 'October 2026' },
];

const INITIAL_BLOCKED: BlockedUser[] = [
  { id: 'b-1', username: 'troll_spammer', blockedAt: 'Oct 20, 2026', reason: 'Unsolicited promotional links' },
  { id: 'b-2', username: 'rude_chatter', blockedAt: 'Oct 18, 2026', reason: 'Repeated offensive remarks in chat' },
];

export default function CreatorFansPage() {
  const { toast } = useToast();
  const [fans, setFans] = useState<FanMember[]>(INITIAL_FANS);
  const [blocked, setBlocked] = useState<BlockedUser[]>(INITIAL_BLOCKED);

  const handleUnblock = (id: string, username: string) => {
    setBlocked(blocked.filter((u) => u.id !== id));
    toast({
      type: 'success',
      title: 'User Unblocked',
      message: `@${username} has been removed from your blocked list.`,
    });
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Fans, VIPs & Blocked Users
          </h2>
          <p className="text-xs text-zinc-400">
            View your top supporters, VIP badge holders, and manage blocked room viewers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Tippers & Fans */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-amber-400" /> Top Supporters & VIPs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fans.map((fan, idx) => (
                  <div
                    key={fan.id}
                    className="p-3.5 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-500 font-bold w-4">#{idx + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{fan.displayName}</span>
                          <span className="text-zinc-500 text-[11px]">@{fan.username}</span>
                          {fan.isVip && (
                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          Member since {fan.memberSince}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-amber-300 font-mono block">
                        🪙 {fan.totalTippedTokens.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500">Tipped</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Blocked Users */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Blocked Users ({blocked.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {blocked.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No blocked users.</p>
                ) : (
                  blocked.map((u) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">@{u.username}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          Reason: {u.reason}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">{u.blockedAt}</span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUnblock(u.id, u.username)}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
