'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Radio, SlidersHorizontal, Sparkles, Compass } from 'lucide-react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('viewers');
  const [visibleCount, setVisibleCount] = useState(9);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => roomsApi.getCategories(),
  });

  const { data: roomsData, isLoading } = useQuery({
    queryKey: ['browseRooms', selectedCategory, selectedLanguage, sortBy, search],
    queryFn: () =>
      roomsApi.getRooms({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        language: selectedLanguage === 'all' ? undefined : selectedLanguage,
        sort: sortBy,
        search: search || undefined,
      }),
  });

  const rooms = roomsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Compass className="w-8 h-8 text-purple-400" />
          Browse Live Streams
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Discover hundreds of verified live broadcasters across all categories. Filter by language, popularity, or search for your favorite models.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by title, creator, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/60">
          <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Sort:
          </span>
          <button
            onClick={() => setSortBy('viewers')}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              sortBy === 'viewers'
                ? 'bg-purple-600 border-purple-500 text-white font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            🔥 Top Viewers
          </button>
          <button
            onClick={() => setSortBy('trending')}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              sortBy === 'trending'
                ? 'bg-purple-600 border-purple-500 text-white font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ Trending
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              sortBy === 'newest'
                ? 'bg-purple-600 border-purple-500 text-white font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            ✨ Newest First
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <p>
          Showing <span className="text-zinc-100 font-bold">{Math.min(visibleCount, rooms.length)}</span> of{' '}
          <span className="text-zinc-100 font-bold">{rooms.length}</span> live streams
        </p>
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
          <h3 className="text-lg font-bold text-zinc-200">No matching rooms found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try modifying your search criteria or resetting filters to view all active broadcasts.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedLanguage('all');
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, visibleCount).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {visibleCount < rooms.length && (
            <div className="text-center pt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-8"
              >
                Load More Rooms
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading discovery...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
