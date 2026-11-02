'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Settings, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function CreatorProfileEditorPage() {
  const { toast } = useToast();
  const [stageName, setStageName] = useState('Aurora Velvet');
  const [bio, setBio] = useState('Professional cosplay model, electronic music lover, and full-time broadcaster. Streaming Monday through Saturday evenings from my neon-drenched studio.');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80');
  const [privateShowRate, setPrivateShowRate] = useState('60');
  const [groupShowCost, setGroupShowCost] = useState('200');
  const [tags, setTags] = useState('Cosplay, Chill, Anime, Music, Interactive');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      toast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your public creator profile details and show rates are updated.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Creator Profile & Show Rates
          </h2>
          <p className="text-xs text-zinc-400">
            Customize how viewers perceive your brand and set your token pricing for private shows.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Stage / Performer Name"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  required
                />

                <Input
                  label="Tags (Comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Public Bio & Welcome Message
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Avatar Image URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />

                <Input
                  label="Profile Banner URL"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Show Pricing & Monetization Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="1-on-1 Private Show Rate (Tokens per minute)"
                  type="number"
                  min="10"
                  value={privateShowRate}
                  onChange={(e) => setPrivateShowRate(e.target.value)}
                  helperText="Default: 60 tokens/min (~$6.00/min)"
                />

                <Input
                  label="Group Show Entry Cost (Tokens per viewer)"
                  type="number"
                  min="50"
                  value={groupShowCost}
                  onChange={(e) => setGroupShowCost(e.target.value)}
                  helperText="Default: 200 tokens admission (~$20.00)"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-1.5" /> Save Profile & Rates
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </CreatorLayout>
  );
}
