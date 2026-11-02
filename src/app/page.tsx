'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Flame,
  Radio,
  Users,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle,
  Play,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('viewers');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Queries
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredRooms'],
    queryFn: () => roomsApi.getFeatured(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => roomsApi.getCategories(),
  });

  const { data: roomsData, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['rooms', selectedCategory, selectedLanguage, sortBy],
    queryFn: () =>
      roomsApi.getRooms({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        language: selectedLanguage === 'all' ? undefined : selectedLanguage,
        sort: sortBy,
      }),
  });

  const featuredRoom = featuredData?.data?.[0];
  const rooms = roomsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Showcase / Featured Live Broadcaster */}
      <section className="relative overflow-hidden pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isFeaturedLoading || !featuredRoom ? (
          <div className="w-full aspect-[21/9] min-h-[360px] rounded-3xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
        ) : (
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#120f24] via-[#100f1c] to-[#1a0e28] p-6 sm:p-10 shadow-2xl">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Hero Details */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="live">FEATURED BROADCASTER</Badge>
                  <span className="text-xs font-medium text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-0.5 rounded-full">
                    {typeof featuredRoom.category === 'object' && featuredRoom.category !== null
                      ? ((featuredRoom.category as any).name || (featuredRoom.category as any).slug || 'General')
                      : (featuredRoom.category || 'General')}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {featuredRoom.title}
                </h1>

                <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                  {featuredRoom.creator?.bio ||
                    'Join the interactive live session with interactive tipping, chat requests, and high-definition streaming.'}
                </p>

                {/* Creator Profile Strip */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500 shrink-0">
                    <img
                      src={featuredRoom.creator?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={featuredRoom.creator?.displayName || 'Creator'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-base">
                        {featuredRoom.creator?.displayName || 'Creator'}
                      </span>
                      {featuredRoom.creator?.verified && (
                        <CheckCircle className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">
                      @{featuredRoom.creator?.username || 'creator'} • {(featuredRoom.creator?.followersCount ?? 0).toLocaleString()} followers
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link href={`/rooms/${featuredRoom.id}`}>
                    <Button variant="primary" size="lg" className="shadow-lg shadow-purple-900/40">
                      <Play className="w-4 h-4 fill-current mr-1" /> Watch Live Now
                    </Button>
                  </Link>
                  <Link href={`/creators/${featuredRoom.creator?.username || 'creator'}`}>
                    <Button variant="secondary" size="lg">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Live Stream Preview Window */}
              <div className="lg:col-span-6 relative">
                <Link href={`/rooms/${featuredRoom.id}`} className="group block relative rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl">
                  <div className="aspect-video w-full relative">
                    <img
                      src={featuredRoom.thumbnailUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'}
                      alt={featuredRoom.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                    </div>
                    {/* Viewers badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                      <Users className="w-3.5 h-3.5 text-rose-400" />
                      <span>{((featuredRoom.viewerCount ?? (featuredRoom as any).currentViewerCount) || 0).toLocaleString()} Viewers</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Category Carousel / Quick Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Popular Categories</h2>
          </div>
          <Link href="/browse" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                : 'bg-[#12121b] text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
            }`}
          >
            🔥 All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                selectedCategory === cat.slug
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                  : 'bg-[#12121b] text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-zinc-400">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Live Broadcasts Feed with Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse-live" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Live Broadcasts Now
                <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full">
                  {rooms.length} Active
                </span>
              </h2>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#12121c] border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">🌍 All Languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#12121c] border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="viewers">🔥 Most Viewers</option>
              <option value="trending">⚡ Trending</option>
              <option value="newest">✨ Newly Live</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        {isRoomsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[#0e0e17] border border-zinc-800 p-8 space-y-3">
            <Radio className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-200">No live rooms found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your category or language filters to discover active creators.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, visibleCount).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < rooms.length && (
              <div className="text-center pt-8">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8"
                >
                  Load More Rooms ({rooms.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. Creator Promotion CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-fuchsia-500/30 bg-gradient-to-r from-purple-950/60 via-zinc-950 to-fuchsia-950/50 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase tracking-widest">
              Broadcast on Velora
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Turn Your Passion Into Sustainable Income
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Fast automated payouts via Paxum, SEPA, and Crypto. Keep up to 80% of token revenue with 1-on-1 private shows, interactive tip goals, and VIP media vaults.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/creator/apply">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Apply as Creator Today
              </Button>
            </Link>
            <Link href="/safety">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Creator Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
