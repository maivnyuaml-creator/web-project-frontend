'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { usersApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Mail, ShieldCheck, Heart, Coins, ArrowRight, Check } from 'lucide-react';

export default function AccountOverviewPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await usersApi.updateProfile({ displayName, bio });
      await refreshUser();
      toast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal account details have been saved.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update profile information.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AccountLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Details Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Username (Handle)"
                    value={user?.username || ''}
                    disabled
                    helperText="Unique platform handle cannot be altered."
                  />
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex"
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Primary email used for billing invoices and password recovery."
                />

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Bio / Status Line
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A brief note shown in tip rankings and comments..."
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Security Status */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400">Email Verification:</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400">2-Factor Authentication:</span>
                <span className="font-semibold text-zinc-300">
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400">Account Standing:</span>
                <span className="font-semibold text-emerald-400">Active (Good Standing)</span>
              </div>

              <div className="pt-2">
                <Link href="/account/security" className="text-purple-400 hover:underline flex items-center gap-1">
                  Manage security settings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Become a creator banner */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-950/40 to-fuchsia-950/30 border border-purple-500/30 p-5 space-y-3">
            <h4 className="text-sm font-bold text-white">Want to broadcast on Velora?</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Earn top revenue sharing with live tipping, private 1-on-1 shows, and paid media.
            </p>
            <Link href="/creator/apply" className="block">
              <Button variant="accent" size="sm" className="w-full">
                Apply for Creator Verification
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
