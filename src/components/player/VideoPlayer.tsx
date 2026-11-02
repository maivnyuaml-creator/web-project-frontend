'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertTriangle, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface VideoPlayerProps {
  streamUrl?: string;
  posterUrl?: string;
  isLive?: boolean;
  creatorName?: string;
  isPrivate?: boolean;
}

export function VideoPlayer({
  streamUrl,
  posterUrl,
  isLive = true,
  creatorName = 'Broadcaster',
  isPrivate = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLive || isPrivate) return;

    let hls: Hls | null = null;
    const testHlsSource = streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(testHlsSource);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay policy prevented playback, keep muted
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      let hasTriedFallback = false;
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!hasTriedFallback && streamUrl && (streamUrl.includes('localhost:8080') || streamUrl.includes(':8080'))) {
                hasTriedFallback = true;
                hls?.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                hls?.startLoad();
              } else {
                hls?.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              if (!hasTriedFallback && streamUrl && (streamUrl.includes('localhost:8080') || streamUrl.includes(':8080'))) {
                hasTriedFallback = true;
                hls?.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                hls?.startLoad();
              } else {
                setHasError(true);
                hls?.destroy();
              }
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = testHlsSource;
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, isLive, isPrivate]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (isPrivate) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-8 text-center overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Private Session in Progress</h3>
        <p className="text-sm text-zinc-400 max-w-md">
          {creatorName} is currently hosting a 1-on-1 private show. This room will resume public broadcasting once the session concludes.
        </p>
        <div className="mt-4">
          <Badge variant="purple">Authorized Viewers Only</Badge>
        </div>
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-8 text-center overflow-hidden">
        <Radio className="w-12 h-12 text-zinc-600 mb-3" />
        <h3 className="text-lg font-bold text-zinc-300 mb-1">Broadcaster is Offline</h3>
        <p className="text-sm text-zinc-500">Follow {creatorName} to receive a notification when the live stream begins.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative aspect-video w-full rounded-2xl bg-black border border-zinc-800/80 overflow-hidden shadow-2xl group select-none"
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Development Ingest Notice watermark */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <Badge variant="live">LIVE</Badge>
        <span className="text-[11px] font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          HLS Public Ingest 1080p60
        </span>
      </div>

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Fallback Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 text-center p-6">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
          <p className="text-zinc-200 font-medium">Stream connection interrupted</p>
          <p className="text-xs text-zinc-400 mt-1 mb-4">Attempting automated reconnection to ingest server...</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsBuffering(true);
            }}
            className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry Playback
          </button>
        </div>
      )}

      {/* Player Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/10"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <div className="flex items-center gap-2 group/volume">
            <button
              onClick={toggleMute}
              className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/10"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/10"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
