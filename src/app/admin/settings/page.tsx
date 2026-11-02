'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Settings, Save, Sliders, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [tokenRate, setTokenRate] = useState('0.10');
  const [commission, setCommission] = useState('20');
  const [minPayout, setMinPayout] = useState('100');
  const [streamDelay, setStreamDelay] = useState('2');
  const [requireKyc, setRequireKyc] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Platform financial and streaming parameters updated.',
      });
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Platform & Token Configuration
          </h2>
          <p className="text-xs text-zinc-400">
            Configure global exchange rates, broadcaster commission tiers, and streaming compliance flags.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Financial & Commission Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Token USD Exchange Value"
                  type="number"
                  step="0.01"
                  value={tokenRate}
                  onChange={(e) => setTokenRate(e.target.value)}
                  helperText="Default: $0.10 USD per token (10 tokens = $1.00)"
                />

                <Input
                  label="Platform Commission Fee (%)"
                  type="number"
                  min="5"
                  max="50"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  helperText="Broadcasters keep remaining 80%"
                />
              </div>

              <Input
                label="Minimum Creator Payout Threshold (USD)"
                type="number"
                min="50"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                helperText="Minimum balance required before withdrawal is enabled"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Streaming Ingest & Compliance Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <Input
                label="Target Low-Latency HLS Buffer (Seconds)"
                type="number"
                min="1"
                max="10"
                value={streamDelay}
                onChange={(e) => setStreamDelay(e.target.value)}
                helperText="Lower latency increases chat interactivity"
              />

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Strict 2257 Pre-Broadcast KYC Gate</span>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Prohibit RTMP publishing until government ID and biometric liveness are approved.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireKyc}
                  onChange={(e) => setRequireKyc(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-1.5" /> Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
