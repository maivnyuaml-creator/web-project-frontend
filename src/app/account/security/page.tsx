'use client';

import React, { useState } from 'react';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { usersApi } from '@/lib/api';
import { Shield, Lock, Smartphone, Laptop, Trash2, CheckCircle2 } from 'lucide-react';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: 'sess-1',
    device: 'Windows 11 PC',
    browser: 'Chrome 130.0',
    ip: '192.168.1.45 (Current Session)',
    lastActive: 'Active Now',
    isCurrent: true,
  },
  {
    id: 'sess-2',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    ip: '172.56.21.90',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
];

export default function SecurityPage() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ type: 'error', title: 'Password Too Short', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ type: 'error', title: 'Mismatch', message: 'New passwords do not match.' });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await usersApi.updateSecurity({ currentPassword, newPassword });
      toast({ type: 'success', title: 'Password Changed', message: 'Your login credentials have been updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast({ type: 'error', title: 'Update Failed', message: 'Current password incorrect or server error.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    toast({
      type: 'success',
      title: nextState ? '2FA Enabled' : '2FA Disabled',
      message: nextState
        ? 'Authenticator app 2FA has been activated.'
        : 'Two-factor protection disabled.',
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast({
      type: 'info',
      title: 'Session Revoked',
      message: 'The selected device has been logged out.',
    });
  };

  return (
    <AccountLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Password Update */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <Input
                  label="New Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" isLoading={isUpdatingPassword}>
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Device Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-400">
                These devices are currently authenticated to your account.
              </p>

              <div className="space-y-2.5">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        {s.device.includes('iPhone') ? (
                          <Smartphone className="w-5 h-5" />
                        ) : (
                          <Laptop className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{s.device}</span>
                          {s.isCurrent && (
                            <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-400 block text-[11px] mt-0.5">
                          {s.browser} • {s.ip}
                        </span>
                      </div>
                    </div>

                    {!s.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2FA & Protection */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-zinc-300 leading-relaxed">
                Add an extra layer of protection to your account by requiring an authenticator code (Google Authenticator, Authy, or 1Password) during sign-in.
              </p>

              <div className="p-4 rounded-xl bg-[#141420] border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Authenticator 2FA</span>
                  <span className="text-zinc-400 text-[11px]">
                    Status: {twoFactorEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <Button
                  variant={twoFactorEnabled ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleToggle2FA}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccountLayout>
  );
}
