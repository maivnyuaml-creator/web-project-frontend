'use client';

import React, { use, useState, Suspense } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { creatorsApi, roomsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  CheckCircle,
  Heart,
  Calendar,
  Sparkles,
  Play,
  Lock,
  Globe,
  Coins,
  Share2,
  Clock,
  Radio
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CreatorProfileContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(42800);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['creatorProfile', username],
    queryFn: () => creatorsApi.getProfile(username),
  });

  const profile = profileData?.data;

  const toggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : prev - 1));
    toast({
      type: 'success',
      title: nextState ? 'Followed Creator' : 'Unfollowed',
      message: nextState
        ? `You will now receive notifications when @${username} goes live!`
        : `Unfollowed @${username}.`,
    });
  };

  const copyProfileLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      type: 'info',
      title: 'Link Copied',
      message: 'Creator profile link copied to clipboard.',
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading creator profile...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950">
        <img
          src={profile.bannerUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80'}
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8">
        {/* Profile Card Header */}
        <div className="rounded-3xl bg-[#0f0f18]/90 border border-zinc-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-purple-600 shadow-2xl bg-zinc-900 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.stageName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{profile.stageName}</h1>
                <CheckCircle className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                <Badge variant="live">LIVE BROADCASTER</Badge>
              </div>
              <p className="text-sm text-zinc-400">@{username} • {profile.country}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
                <span><strong>{followersCount.toLocaleString()}</strong> Followers</span>
                <span>•</span>
                <span><strong>{profile.subscribersCount.toLocaleString()}</strong> Subscribers</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-zinc-400" />
                  {profile.languages.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link href="/rooms/room-101" className="flex-1 sm:flex-none">
              <Button variant="primary" size="md" className="w-full">
                <Play className="w-4 h-4 fill-current mr-1" /> Enter Live Room
              </Button>
            </Link>
            <Button
              variant={isFollowing ? 'secondary' : 'accent'}
              size="md"
              onClick={toggleFollow}
              className="flex-1 sm:flex-none"
            >
              <Heart className={`w-4 h-4 mr-1 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button variant="ghost" size="icon" onClick={copyProfileLink} title="Share Profile">
              <Share2 className="w-4 h-4 text-zinc-300" />
            </Button>
          </div>
        </div>

        {/* Content Tabs & Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Bio, Tip Menu, Media */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bio Card */}
            <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">About {profile.stageName}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-900 border border-zinc-800 text-purple-300 px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tip Menu */}
            <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Interactive Tip Menu</h3>
                </div>
                <span className="text-xs text-zinc-400">Tokens are spent during live streams</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.tipMenu.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#141420] border border-zinc-800/80 hover:border-amber-500/40 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full shrink-0">
                      🪙 {item.tokens}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Permitted Media Vault Preview */}
            <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Exclusive Vault Media</h3>
                  <p className="text-xs text-zinc-400">Approved 18+ high-definition photo sets and video clips</p>
                </div>
                <Badge variant="purple">18+ Vault</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: '1', title: 'Cyberpunk Neon Set', tokens: 150, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
                  { id: '2', title: 'Cosplay Backstage Clip', tokens: 250, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
                  { id: '3', title: 'Studio Glamour Pack', tokens: 180, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80' },
                ].map((media) => (
                  <div key={media.id} className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
                    <img src={media.img} alt={media.title} className="w-full aspect-square object-cover blur-xs group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center">
                      <Lock className="w-6 h-6 text-purple-400 mb-1" />
                      <p className="text-xs font-semibold text-white">{media.title}</p>
                      <span className="text-[11px] font-bold text-amber-300 mt-1 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        🪙 {media.tokens} Tokens
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Schedule & Rates */}
          <div className="lg:col-span-4 space-y-6">
            {/* Show Rates Card */}
            <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Show Rates</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-purple-200">1-on-1 Private Show</p>
                    <p className="text-[11px] text-zinc-400">Exclusive private video lounge</p>
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    🪙 {profile.privateShowRate}/min
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-fuchsia-950/20 border border-fuchsia-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-fuchsia-200">Group Show Admission</p>
                    <p className="text-[11px] text-zinc-400">Entry ticket to group event</p>
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    🪙 {profile.groupShowCost} tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Broadcast Schedule</h3>
              </div>
              <p className="text-xs text-zinc-400">Regular streaming schedule (Eastern Time):</p>

              <div className="space-y-2.5">
                {profile.schedule.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{item.title}</p>
                      <span className="text-[11px] text-purple-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {item.startTime} - {item.endTime}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                      {DAYS[item.dayOfWeek]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading creator profile...</p>
        </div>
      }
    >
      <CreatorProfileContent params={params} />
    </Suspense>
  );
}
