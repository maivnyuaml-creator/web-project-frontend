'use client';

import React, { useState } from 'react';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Bell, Volume2, Mail, Smartphone } from 'lucide-react';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({
    emailOnlineAlerts: true,
    browserPushAlerts: true,
    soundAlerts: true,
    tipAnnouncements: true,
    emailMarketing: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      toast({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Your notification rules have been updated.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AccountLayout>
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="space-y-4 divide-y divide-zinc-800/60">
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Broadcaster Live Alerts</span>
                    <p className="text-zinc-400">Receive email alerts when creators on your favorite list start streaming.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.emailOnlineAlerts}
                    onChange={() => toggle('emailOnlineAlerts')}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Browser Push Notifications</span>
                    <p className="text-zinc-400">Receive desktop alerts when private show requests are accepted.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.browserPushAlerts}
                    onChange={() => toggle('browserPushAlerts')}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Room Sound Effects</span>
                    <p className="text-zinc-400">Play chime audio when you send or receive interactive tips in live rooms.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.soundAlerts}
                    onChange={() => toggle('soundAlerts')}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Special Token Promotions</span>
                    <p className="text-zinc-400">Occasional announcements about bonus token discount weekends.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.emailMarketing}
                    onChange={() => toggle('emailMarketing')}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
}
