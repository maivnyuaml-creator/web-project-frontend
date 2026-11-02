'use client';

import React, { use, useState, Suspense } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { roomsApi, tipsApi, showsApi, reportsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Heart,
  Bell,
  Coins,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Radio
} from 'lucide-react';

function RoomContent({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { user, isAuthenticated, updateTokenBalance } = useAuth();
  const { toast } = useToast();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isBellActive, setIsBellActive] = useState(true);

  // Modals state
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(50);
  const [customTipAmount, setCustomTipAmount] = useState<string>('');
  const [tipMessage, setTipMessage] = useState('');
  const [isSubmittingTip, setIsSubmittingTip] = useState(false);

  const [isPrivateShowOpen, setIsPrivateShowOpen] = useState(false);
  const [privateMinutes, setPrivateMinutes] = useState<number>(10);
  const [isSubmittingPrivate, setIsSubmittingPrivate] = useState(false);

  const [isGroupShowOpen, setIsGroupShowOpen] = useState(false);
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('HARASSMENT');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const { data: roomData, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomsApi.getRoomById(roomId),
    refetchInterval: 5000,
  });

  const room = roomData?.data;

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      type: 'success',
      title: !isFavorited ? 'Added to Favorites' : 'Removed from Favorites',
      message: !isFavorited
        ? `You will see ${room?.creator.displayName} in your favorites tab.`
        : 'Removed from favorites.',
    });
  };

  const handleSendTip = async () => {
    const amount = customTipAmount ? parseInt(customTipAmount, 10) : selectedTipAmount;
    if (!amount || amount <= 0) {
      toast({ type: 'error', title: 'Invalid Amount', message: 'Please select or enter a valid token amount.' });
      return;
    }

    if (!user || user.tokenBalance < amount) {
      toast({
        type: 'error',
        title: 'Insufficient Tokens',
        message: 'Your token balance is too low. Please purchase a token pack.',
      });
      return;
    }

    try {
      setIsSubmittingTip(true);
      await tipsApi.sendTip({
        roomId: room?.id || roomId,
        amount,
        message: tipMessage.trim() || undefined,
      });

      updateTokenBalance(user.tokenBalance - amount);
      toast({
        type: 'token',
        title: 'Tip Sent!',
        message: `Successfully tipped ${amount} tokens to ${room?.creator.displayName}!`,
      });
      setIsTipOpen(false);
      setTipMessage('');
      setCustomTipAmount('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send tip';
      toast({ type: 'error', title: 'Tip Error', message: msg });
    } finally {
      setIsSubmittingTip(false);
    }
  };

  const handleRequestPrivateShow = async () => {
    if (!room) return;
    const requiredTokens = room.privateShowRate * privateMinutes;

    if (!user || user.tokenBalance < requiredTokens) {
      toast({
        type: 'error',
        title: 'Insufficient Tokens',
        message: `You need ${requiredTokens} tokens for a ${privateMinutes}-minute private show.`,
      });
      return;
    }

    try {
      setIsSubmittingPrivate(true);
      const res = await showsApi.requestPrivateShow({
        creatorId: room.creatorId,
        roomId: room.id,
        durationMinutes: privateMinutes,
      });

      if (res.success) {
        toast({
          type: 'success',
          title: 'Private Show Requested',
          message: `Request sent to ${room.creator.displayName}. Awaiting broadcaster acceptance.`,
        });
        setIsPrivateShowOpen(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Private show request could not be sent';
      toast({ type: 'error', title: 'Request Failed', message: msg });
    } finally {
      setIsSubmittingPrivate(false);
    }
  };

  const handleJoinGroupShow = async () => {
    if (!room) return;
    if (!user || user.tokenBalance < room.groupShowCost) {
      toast({
        type: 'error',
        title: 'Insufficient Tokens',
        message: `Group show entry requires ${room.groupShowCost} tokens.`,
      });
      return;
    }

    try {
      setIsSubmittingGroup(true);
      const res = await showsApi.joinGroupShow(room.id);
      if (res.success) {
        updateTokenBalance(user.tokenBalance - room.groupShowCost);
        toast({
          type: 'success',
          title: 'Group Show Access Granted',
          message: 'You have been admitted to the upcoming group show session!',
        });
        setIsGroupShowOpen(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join group show';
      toast({ type: 'error', title: 'Join Failed', message: msg });
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) {
      toast({ type: 'error', title: 'Description Required', message: 'Please provide details for the report.' });
      return;
    }

    try {
      setIsSubmittingReport(true);
      await reportsApi.submitReport({
        targetType: 'ROOM',
        targetId: roomId,
        reason: reportReason,
        description: reportDescription.trim(),
      });
      toast({
        type: 'success',
        title: 'Report Submitted',
        message: 'Our 24/7 compliance team has received your report and is investigating.',
      });
      setIsReportOpen(false);
      setReportDescription('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit report';
      toast({ type: 'error', title: 'Report Error', message: msg });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (isLoading || !room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading live room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top back & Category Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link href="/browse" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="purple">
            {typeof room.category === 'object' && room.category !== null
              ? ((room.category as any).name || (room.category as any).slug || 'General')
              : (room.category || 'General')}
          </Badge>
          <span className="text-zinc-500">•</span>
          <span>Language: <strong className="text-zinc-200">{room.language || 'English'}</strong></span>
        </div>
      </div>

      {/* Creator Channel Preview Banner (if broadcaster is viewing their own room) */}
      {(user?.id === room.creatorId || user?.username === room.creator.username) && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-950/70 via-[#141224] to-[#161228] border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Badge variant={room.status === 'LIVE' || (room as any).isLive ? 'live' : 'neutral'}>
              {room.status === 'LIVE' || (room as any).isLive ? '● BROADCASTING LIVE' : '● CHANNEL OFFLINE'}
            </Badge>
            <span className="text-xs text-zinc-300">
              {room.status === 'LIVE' || (room as any).isLive
                ? 'Your stream is live to fans! Fans can chat and send tips.'
                : 'You are previewing your channel. Visit Creator Studio to go live.'}
            </span>
          </div>
          <Link href="/creator/stream">
            <Button variant="primary" size="sm">
              <Radio className="w-3.5 h-3.5 mr-1.5" /> Open Broadcast Studio
            </Button>
          </Link>
        </div>
      )}

      {/* Main Grid: Video Player + Stream Info (Left) and Chat Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Room Details */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* HLS Video Player */}
          <VideoPlayer
            streamUrl={room.hlsPlaybackUrl}
            posterUrl={room.thumbnailUrl}
            isLive={room.status === 'LIVE' || (room as any).isLive === true}
            creatorName={room.creator.displayName}
            isPrivate={room.isPrivateShow}
          />

          {/* Goal Progress Banner (if active) */}
          {room.tipGoal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#120f20] to-amber-950/30 border border-purple-500/30 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Room Goal: {room.tipGoal.title}
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  🪙 {room.tipGoal.currentAmount} / {room.tipGoal.targetAmount} Tokens
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((room.tipGoal.currentAmount / room.tipGoal.targetAmount) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Broadcaster Info Header */}
          <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Creator details */}
              <div className="flex items-center gap-4">
                <Link href={`/creators/${room.creator.username}`} className="relative group">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-purple-500 shrink-0">
                    <img
                      src={room.creator.avatarUrl}
                      alt={room.creator.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/creators/${room.creator.username}`}
                      className="text-lg font-bold text-white hover:text-purple-400 transition-colors"
                    >
                      {room.creator.displayName}
                    </Link>
                    {room.creator.verified && (
                      <CheckCircle className="w-4 h-4 text-purple-400 fill-purple-400/20 shrink-0" />
                    )}
                    <Badge variant={room.status === 'LIVE' ? 'live' : 'neutral'}>
                      {room.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    @{room.creator?.username || 'creator'} • {(room.creator?.followersCount ?? 0).toLocaleString()} followers
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button variant="token" size="md" onClick={() => setIsTipOpen(true)} className="flex-1 sm:flex-none">
                  <Coins className="w-4 h-4 mr-1 text-zinc-950" /> Tip Creator
                </Button>

                <Button
                  variant={isFavorited ? 'secondary' : 'outline'}
                  size="md"
                  onClick={toggleFavorite}
                  className="flex-1 sm:flex-none"
                >
                  <Heart className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsBellActive(!isBellActive)}
                  title="Toggle notifications"
                >
                  <Bell className={`w-4 h-4 ${isBellActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                </Button>
              </div>
            </div>

            {/* Stream Title & Description */}
            <div className="pt-2 border-t border-zinc-800/60 space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">{room.title}</h2>
              {room.description && (
                <p className="text-xs text-zinc-400 leading-relaxed">{room.description}</p>
              )}

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {(Array.isArray(room.tags) ? (room.tags as string[]) : []).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat Sidebar (Sticky) */}
        <div className="lg:col-span-4 xl:col-span-3 h-[720px] sticky top-20">
          <ChatSidebar
            roomId={room.id}
            creatorName={room.creator.displayName}
            onOpenTipDialog={() => setIsTipOpen(true)}
            onOpenPrivateShowDialog={() => setIsPrivateShowOpen(true)}
            onOpenGroupShowDialog={() => setIsGroupShowOpen(true)}
            onOpenReportDialog={() => setIsReportOpen(true)}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. Tip Menu & Custom Tip Dialog */}
      {/* ========================================== */}
      <Dialog
        isOpen={isTipOpen}
        onClose={() => setIsTipOpen(false)}
        title={`Send a Tip to ${room.creator.displayName}`}
        description="Choose a token amount or enter a custom amount with your message."
      >
        <div className="space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Select Token Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 250, 500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedTipAmount(amt);
                    setCustomTipAmount('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedTipAmount === amt && !customTipAmount
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-900/40'
                      : 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-amber-500/40'
                  }`}
                >
                  🪙 {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Or Custom Token Amount</label>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 750"
              value={customTipAmount}
              onChange={(e) => setCustomTipAmount(e.target.value)}
            />
          </div>

          {/* Tip Message */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Highlight Message in Chat (Optional)</label>
            <textarea
              rows={2}
              maxLength={150}
              placeholder="Write a message to appear with your tip..."
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Balance & Submit Strip */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Your Balance: <strong className="text-amber-400 font-bold">🪙 {user?.tokenBalance ?? 0}</strong>
            </span>
            <Link href="/account/wallet" className="text-amber-400 hover:underline font-medium">
              + Buy Tokens
            </Link>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsTipOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="token"
              isLoading={isSubmittingTip}
              onClick={handleSendTip}
            >
              Confirm & Send Tip
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* 2. Private Show Request Dialog */}
      {/* ========================================== */}
      <Dialog
        isOpen={isPrivateShowOpen}
        onClose={() => setIsPrivateShowOpen(false)}
        title="Request 1-on-1 Private Show"
        description="Exclusive private session where only you and the broadcaster interact."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-400">Broadcaster Private Rate:</span>
              <strong className="text-amber-300">🪙 {room.privateShowRate} tokens / min</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Selected Duration:</span>
              <strong className="text-white">{privateMinutes} minutes</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-purple-500/20">
              <span className="text-zinc-200 font-bold">Estimated Cost:</span>
              <strong className="text-amber-400 font-bold text-sm">
                🪙 {room.privateShowRate * privateMinutes} tokens
              </strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Choose Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setPrivateMinutes(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    privateMinutes === mins
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            *Tokens are only deducted upon the broadcaster accepting your private session invitation. You can extend the session while in the room.
          </p>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsPrivateShowOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isSubmittingPrivate}
              onClick={handleRequestPrivateShow}
            >
              Request Private Session
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* 3. Group Show Entry Dialog */}
      {/* ========================================== */}
      <Dialog
        isOpen={isGroupShowOpen}
        onClose={() => setIsGroupShowOpen(false)}
        title="Join Group Show Admission"
        description="Share a special VIP broadcast session with other participating viewers."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-fuchsia-950/20 border border-fuchsia-500/30 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-400">Admission Ticket Price:</span>
              <strong className="text-amber-300">🪙 {room.groupShowCost} tokens</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Minimum Viewers Required:</span>
              <strong className="text-white">{room.groupShowMinUsers} members</strong>
            </div>
          </div>

          <p className="text-xs text-zinc-300">
            Once the minimum viewer count is reached, the broadcaster will switch to the exclusive group show mode.
          </p>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsGroupShowOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              isLoading={isSubmittingGroup}
              onClick={handleJoinGroupShow}
            >
              Confirm Entry (🪙 {room.groupShowCost})
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* 4. Report Stream Dialog */}
      {/* ========================================== */}
      <Dialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Report Broadcaster or Stream Violation"
        description="All reports are strictly confidential and investigated immediately by 24/7 compliance."
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Reason for Report</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="UNDERAGE_CONCERN">Underage / Minor Concern (Critical)</option>
              <option value="NON_CONSENSUAL">Non-consensual content / Blackmail</option>
              <option value="HARASSMENT">Harassment, Hate Speech or Bullying</option>
              <option value="VIOLENCE">Self-harm or Violence</option>
              <option value="COPYRIGHT">Copyright / DMCA Violation</option>
              <option value="FRAUD">Scam, Impersonation or Fraud</option>
              <option value="OTHER">Other Community Policy Breach</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Description & Evidence</label>
            <textarea
              rows={3}
              required
              placeholder="Provide specific details, timestamps, or context..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={isSubmittingReport}>
              Submit Violation Report
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading live room...</p>
        </div>
      }
    >
      <RoomContent params={params} />
    </Suspense>
  );
}
