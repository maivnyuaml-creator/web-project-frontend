'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Heart, Play, UserX, CheckCircle, Radio } from 'lucide-react';

interface FavoriteCreator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  category: string;
  isLive: boolean;
  roomId?: string;
  followersCount: number;
}

const INITIAL_FAVORITES: FavoriteCreator[] = [
  {
    id: 'c-aurora',
    username: 'aurora_velvet',
    displayName: 'Aurora Velvet',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Cosplay & Fantasy',
    isLive: true,
    roomId: 'room-101',
    followersCount: 42800,
  },
  {
    id: 'c-elena',
    username: 'elena_fox',
    displayName: 'Elena Fox',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    category: 'Dance & Music',
    isLive: true,
    roomId: 'room-102',
    followersCount: 89300,
  },
  {
    id: 'c-valentina',
    username: 'valentina_lux',
    displayName: 'Valentina Lux',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    category: 'Glamour',
    isLive: false,
    followersCount: 65100,
  },
];

export default function FavoritesPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteCreator[]>(INITIAL_FAVORITES);

  const removeFavorite = (id: string, name: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast({
      type: 'info',
      title: 'Removed from Favorites',
      message: `${name} has been removed from your favorites list.`,
    });
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Favorite Broadcasters ({favorites.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Broadcasters you follow. Live creators appear with an interactive watch link.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[#0f0f18] border border-zinc-800 p-8 space-y-3">
            <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-zinc-200">No favorite creators yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Follow your favorite live streamers to get notifications when they broadcast.
            </p>
            <Link href="/browse">
              <Button variant="primary" size="sm">
                Browse Live Rooms
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((creator) => (
              <div
                key={creator.id}
                className="rounded-2xl bg-[#0f0f18] border border-zinc-800/80 p-5 space-y-4 hover:border-zinc-700 transition-colors shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-purple-500/50 shrink-0">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {creator.displayName}
                      </h4>
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20 shrink-0" />
                    </div>
                    <p className="text-xs text-zinc-400">@{creator.username}</p>
                  </div>

                  <Badge variant={creator.isLive ? 'live' : 'neutral'}>
                    {creator.isLive ? 'LIVE' : 'OFFLINE'}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{creator.category}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFavorite(creator.id, creator.displayName)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Unfollow"
                    >
                      <UserX className="w-4 h-4" />
                    </button>

                    {creator.isLive && creator.roomId ? (
                      <Link href={`/rooms/${creator.roomId}`}>
                        <Button variant="primary" size="sm">
                          <Play className="w-3 h-3 fill-current mr-1" /> Watch
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/creators/${creator.username}`}>
                        <Button variant="secondary" size="sm">
                          Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
