'use client';

import React, { use, Suspense } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomCardSkeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Sparkles, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const formattedName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const { data: roomsData, isLoading } = useQuery({
    queryKey: ['categoryRooms', slug],
    queryFn: () => roomsApi.getRooms({ category: formattedName }),
  });

  const rooms = roomsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Header */}
      <div>
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Categories
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                Live Category
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">{formattedName}</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Explore live interactive streams in {formattedName}. Join rooms, tip creators, and request private shows.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono">
              <strong className="text-zinc-100">{rooms.length}</strong> Broadcasters Online
            </span>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#0e0e17] border border-zinc-800 p-8 space-y-3">
          <Radio className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-200">No Broadcasters in {formattedName} right now</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Check back soon or explore other exciting categories live right now!
          </p>
          <Link href="/browse">
            <Button variant="primary" size="sm">
              Explore Other Categories
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">Loading category...</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
