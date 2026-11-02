'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, TipEvent, UserRole } from '@/types';
import { socketService } from '@/lib/socket/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Send, Coins, Lock, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface ChatSidebarProps {
  roomId: string;
  creatorName: string;
  onOpenTipDialog: () => void;
  onOpenPrivateShowDialog: () => void;
  onOpenGroupShowDialog: () => void;
  onOpenReportDialog: () => void;
}

const QUICK_EMOJIS = ['🔥', '💖', '👑', '✨', '👏', '💋', '🎉', '💜'];

export function ChatSidebar({
  roomId,
  creatorName,
  onOpenTipDialog,
  onOpenPrivateShowDialog,
  onOpenGroupShowDialog,
  onOpenReportDialog,
}: ChatSidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      roomId,
      senderId: 'system',
      senderName: 'Velora Guardian',
      senderRole: 'ADMIN',
      content: `Welcome to ${creatorName}'s room! Please respect our community guidelines. Zero tolerance for harassment or unlawful content.`,
      timestamp: '23:40',
      isNotice: true,
      isSystem: true,
    },
    {
      id: 'm-1',
      roomId,
      senderId: 'u-1',
      senderName: 'NeonKnight',
      senderRole: 'VIEWER',
      content: 'Hey everyone! Awesome stream tonight 💜',
      timestamp: '23:42',
    },
    {
      id: 'm-2',
      roomId,
      senderId: 'u-2',
      senderName: 'CyberValkyrie',
      senderRole: 'VIEWER',
      senderBadge: 'VIP',
      content: 'Loving the background lighting setup! Sent 100 tokens to goal ✨',
      tipAmount: 100,
      timestamp: '23:44',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketService.joinRoom(roomId);

    const unsubMsg = socketService.onNewMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    const unsubTip = socketService.onTip((tip: TipEvent) => {
      const tipMsg: ChatMessage = {
        id: tip.id,
        roomId: tip.roomId,
        senderId: tip.senderId,
        senderName: tip.senderName,
        senderRole: 'VIEWER',
        content: tip.message || `Tipped ${tip.amount} tokens! 🪙`,
        tipAmount: tip.amount,
        timestamp: new Date(tip.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tipMsg]);
      toast({
        type: 'token',
        title: 'New Tip!',
        message: `${tip.senderName} tipped ${tip.amount} tokens!`,
      });
    });

    return () => {
      unsubMsg();
      unsubTip();
      socketService.leaveRoom(roomId);
    };
  }, [roomId, toast]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!isAuthenticated) {
      toast({
        type: 'error',
        title: 'Account Required',
        message: 'Please sign in to participate in live chat.',
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      roomId,
      senderId: user?.id || 'anon',
      senderName: user?.displayName || user?.username || 'Guest',
      senderRole: user?.role || 'VIEWER',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    socketService.sendMessage(roomId, inputMessage.trim());
    setInputMessage('');
  };

  const addEmoji = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c14] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-[#12121c]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <h4 className="text-sm font-semibold text-zinc-100">Live Stream Chat</h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenReportDialog}
            title="Report Stream"
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 rounded-lg transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Action Bar (Private Show, Group Show, Tip Menu) */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#0e0e18] border-b border-zinc-800/60">
        <button
          onClick={onOpenTipDialog}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium transition-all"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" /> Tip Menu
        </button>

        <button
          onClick={onOpenPrivateShowDialog}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-purple-400" /> Private
        </button>

        <button
          onClick={onOpenGroupShowDialog}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-fuchsia-950/30 hover:bg-fuchsia-900/40 text-fuchsia-300 border border-fuchsia-500/30 rounded-xl text-xs font-medium transition-all"
        >
          <Users className="w-3.5 h-3.5 text-fuchsia-400" /> Group Show
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-[11px] leading-relaxed flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-purple-300 block mb-0.5">{msg.senderName}</span>
                  {msg.content}
                </div>
              </div>
            );
          }

          if (msg.tipAmount) {
            return (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-500/40 text-amber-100 shadow-md shadow-amber-950/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-300">{msg.senderName}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold border border-amber-500/30">
                      🪙 {msg.tipAmount} TOKENS
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/60">{msg.timestamp}</span>
                </div>
                <p className="text-zinc-200 text-xs mt-0.5 font-medium">{msg.content}</p>
              </div>
            );
          }

          const getRoleBadge = (role: UserRole) => {
            if (role === 'ADMIN') return <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded border border-rose-500/40">STAFF</span>;
            if (role === 'CREATOR') return <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1 rounded border border-purple-500/40">HOST</span>;
            return null;
          };

          return (
            <div key={msg.id} className="leading-relaxed group hover:bg-white/[0.02] p-1 rounded-lg transition-colors">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                {getRoleBadge(msg.senderRole)}
                {msg.senderBadge && (
                  <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-300 px-1 rounded border border-fuchsia-500/30">
                    {msg.senderBadge}
                  </span>
                )}
                <span className="font-semibold text-zinc-300 hover:text-purple-400 cursor-pointer">
                  {msg.senderName}:
                </span>
                <span className="text-zinc-200 break-words flex-1">{msg.content}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis */}
      <div className="px-3 py-1 flex items-center gap-1 border-t border-zinc-800/40 bg-[#0b0b12] overflow-x-auto no-scrollbar">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addEmoji(emoji)}
            className="hover:scale-125 transition-transform p-1 text-sm select-none"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#10101a] border-t border-zinc-800/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isAuthenticated ? "Send a message..." : "Sign in to chat..."}
            className="w-full bg-[#181826] border border-zinc-700/60 rounded-xl py-2 pl-3 pr-10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="absolute right-2 p-1.5 text-zinc-400 hover:text-purple-400 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Balance Strip */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50 text-[11px]">
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Balance:</span>
            <span className="font-bold text-amber-400 flex items-center gap-0.5">
              🪙 {user?.tokenBalance ?? 0}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenTipDialog}
            className="text-amber-400 hover:text-amber-300 font-medium hover:underline text-[11px]"
          >
            + Get Tokens
          </button>
        </div>
      </form>
    </div>
  );
}
