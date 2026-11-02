'use client';

import React from 'react';
import Link from 'next/link';
import { Room } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { Users, CheckCircle, Globe } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const isLive = room.status === 'LIVE' || (room as any).isLive;
  const viewerCount = room.viewerCount ?? (room as any).currentViewerCount ?? 0;
  const categoryName =
    typeof room.category === 'object' && room.category !== null
      ? (room.category as any).name || (room.category as any).slug || 'General'
      : room.category || 'General';
  const language = room.language || 'English';
  const creator = room.creator || {
    displayName: 'Creator',
    username: 'creator',
    avatarUrl: undefined,
    verified: false,
  };
  const tags = Array.isArray(room.tags) ? room.tags : [];
  const tipGoal = room.tipGoal && room.tipGoal.targetAmount > 0 ? room.tipGoal : null;
  const goalPercent = tipGoal
    ? Math.min(100, Math.max(0, Math.round((tipGoal.currentAmount / tipGoal.targetAmount) * 100)))
    : 0;

  return (
    <Link href={`/rooms/${room.id}`} className="group block focus:outline-none">
      <div className="relative rounded-2xl bg-[#0e0e17] border border-zinc-800/80 overflow-hidden card-hover shadow-xl">
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          <img
            src={room.thumbnailUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'}
            alt={room.title || 'Stream'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Top Indicators */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
            {isLive ? (
              <Badge variant="live">LIVE</Badge>
            ) : (
              <Badge variant="neutral">OFFLINE</Badge>
            )}

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-zinc-200">
              <Users className="w-3 h-3 text-purple-400" />
              <span>{formatNumber(viewerCount)}</span>
            </div>
          </div>

          {/* Category Pill on bottom thumbnail */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-200 border border-purple-500/30 backdrop-blur-md">
              {categoryName}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-zinc-400" />
              {language}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          {/* Creator Profile line */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-purple-500/40 shrink-0">
              <img
                src={creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={creator.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-400 transition-colors">
                  {creator.displayName}
                </span>
                {creator.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20 shrink-0" />
                )}
              </div>
              <p className="text-xs text-zinc-400">@{creator.username}</p>
            </div>
          </div>

          {/* Stream Title */}
          <h4 className="text-xs font-medium text-zinc-300 line-clamp-2 leading-relaxed">
            {room.title}
          </h4>

          {/* Goal Progress bar (if exists) */}
          {tipGoal && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                <span className="truncate max-w-[160px] text-zinc-300 font-medium">🎯 {tipGoal.title}</span>
                <span className="text-amber-400 font-bold">{goalPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1 overflow-hidden">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-md truncate">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
