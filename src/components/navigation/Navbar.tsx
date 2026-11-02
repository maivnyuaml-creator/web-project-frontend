'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Coins,
  Bell,
  User,
  Compass,
  Shield,
  LogOut,
  Settings,
  Heart,
  Video,
  Menu,
  X,
  CreditCard,
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, devSwitchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg tracking-wider">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                VELORA <span className="text-fuchsia-400 font-medium">LIVE</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-live" />
              </span>
              <span className="text-[10px] text-zinc-400 -mt-1 font-mono tracking-wider uppercase">18+ Premium</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/browse"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              Browse
            </Link>
            {(user?.role === 'CREATOR' || user?.role === 'ADMIN') && (
              <Link
                href="/creator/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-950/40 transition-colors"
              >
                <Video className="w-4 h-4 text-purple-400" />
                Creator Studio
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
              >
                <Shield className="w-4 h-4 text-rose-400" />
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search creators, categories, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 focus:border-purple-500 rounded-full py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </form>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Quick Development Role Switcher for seamless test preview */}
          {devSwitchRole && (
            <div className="hidden xl:flex items-center gap-1 bg-[#13131e] border border-zinc-800 rounded-lg p-1 text-[11px]">
              <span className="text-zinc-500 px-1 font-mono">Role:</span>
              <button
                onClick={() => devSwitchRole('VIEWER')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'VIEWER' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Viewer
              </button>
              <button
                onClick={() => devSwitchRole('CREATOR')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'CREATOR' ? 'bg-fuchsia-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Creator
              </button>
              <button
                onClick={() => devSwitchRole('ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'ADMIN' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          {isAuthenticated ? (
            <>
              {/* Token Balance Button */}
              <Link href="/account/wallet">
                <div className="flex items-center gap-2 bg-[#18140c] border border-amber-500/40 hover:border-amber-400 text-amber-300 px-3 py-1.5 rounded-full transition-all group">
                  <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-bold text-amber-200">{user?.tokenBalance ?? 0}</span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded font-semibold text-amber-300">
                    + GET
                  </span>
                </div>
              </Link>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f0f18] border border-zinc-800 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <h4 className="text-xs font-semibold text-zinc-100">Notifications</h4>
                      <Link href="/account/notifications" className="text-[11px] text-purple-400 hover:underline">
                        Settings
                      </Link>
                    </div>
                    <div className="py-3 space-y-2.5 text-xs">
                      <div className="p-2 rounded-xl bg-purple-950/20 border border-purple-500/20">
                        <p className="font-semibold text-purple-200">Aurora Velvet is live now!</p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">Late Night Chill & Cosplay Hangout started 10m ago</p>
                      </div>
                      <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <p className="font-semibold text-zinc-200">Wallet balance updated</p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">Your token package purchase was successful.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full bg-[#13131e] border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <span className="text-xs font-semibold text-zinc-200 max-w-[100px] truncate hidden sm:inline">
                    {user?.displayName || user?.username}
                  </span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-purple-900 border border-purple-500/40">
                    <img
                      src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f0f18] border border-zinc-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <div className="p-2.5 border-b border-zinc-800/80 mb-1">
                      <p className="text-xs font-bold text-zinc-100">{user?.displayName}</p>
                      <p className="text-[11px] text-zinc-400 truncate">@{user?.username}</p>
                      <span className="mt-1 inline-block text-[10px] font-mono uppercase bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      Account Overview
                    </Link>

                    <Link
                      href="/account/wallet"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      Wallet & Tokens
                    </Link>

                    <Link
                      href="/account/favorites"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      Favorites
                    </Link>

                    <Link
                      href="/account/security"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      Security & 2FA
                    </Link>

                    {(user?.role === 'CREATOR' || user?.role === 'ADMIN') && (
                      <Link
                        href="/creator/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-300 hover:text-white hover:bg-purple-950/40 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        Creator Studio
                      </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-rose-400" />
                        Admin Center
                      </Link>
                    )}

                    <div className="pt-1 border-t border-zinc-800/80">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/creator/apply" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-purple-300">
                  Become a Creator
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-[#0a0a10] border-b border-zinc-800 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100"
            />
          </form>
          <Link
            href="/browse"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-zinc-300 hover:text-white"
          >
            Browse Live Rooms
          </Link>
          {/* Strict RBAC Mobile Links */}
          {(!isAuthenticated || user?.role === 'VIEWER') && (
            <Link
              href="/creator/apply"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-purple-400 font-medium"
            >
              Become a Creator
            </Link>
          )}

          {(user?.role === 'CREATOR' || user?.role === 'ADMIN') && (
            <Link
              href="/creator/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-300 hover:text-white font-medium"
            >
              <Video className="w-4 h-4 text-purple-400" />
              Creator Studio
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-rose-300 hover:text-white font-medium"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              Admin Center
            </Link>
          )}

          {isAuthenticated ? (
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-zinc-300"
            >
              My Account
            </Link>
          ) : (
            <div className="pt-2 flex gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
