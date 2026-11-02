'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { FIXTURE_ROOMS } from '@/lib/api/fixtures';
import { Room } from '@/types';
import { Radio, Users, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminRoomsPage() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(FIXTURE_ROOMS);

  const handleTerminateRoom = (roomId: string, title: string) => {
    if (!confirm(`Are you sure you want to terminate live stream "${title}" immediately?`)) {
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    toast({
      type: 'success',
      title: 'Stream Force Terminated',
      message: `Room ${roomId} was disconnected from the RTMP ingest cluster.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse-live" />
              Live Room & Ingest Monitoring
            </h2>
            <p className="text-xs text-zinc-400">
              Live ingest grid. Real-time stream telemetry, viewer distribution, and instant moderation takedown.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-300">
            {rooms.length} Channels Broadcasting
          </span>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={room.thumbnailUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={room.status === 'LIVE' ? 'live' : 'neutral'}>
                      {room.status === 'LIVE' ? 'LIVE 1080p' : 'OFFLINE'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{(room.viewerCount ?? 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {room.creator?.displayName || 'Creator'}
                    </span>
                    <span className="text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                      {typeof room.category === 'object' && room.category !== null
                        ? ((room.category as any).name || (room.category as any).slug || 'General')
                        : (room.category || 'General')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2">{room.title}</p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                <Link href={`/rooms/${room.id}`} target="_blank">
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                    Preview <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleTerminateRoom(room.id, room.title)}
                >
                  Force Terminate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
