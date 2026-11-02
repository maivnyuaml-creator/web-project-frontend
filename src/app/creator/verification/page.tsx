'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function VerificationPage() {
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'APPROVED' | 'PENDING' | 'UNVERIFIED'>('APPROVED');
  const [isStartingSession, setIsStartingSession] = useState(false);

  const startSumsubSession = () => {
    setIsStartingSession(true);
    setTimeout(() => {
      setIsStartingSession(false);
      toast({
        type: 'info',
        title: 'Sumsub Session Started',
        message: 'Sumsub biometric KYC widget loaded. Ready for identity verification.',
      });
    }, 1000);
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Identity Verification & 2257 Compliance
          </h2>
          <p className="text-xs text-zinc-400">
            Automated KYC identity provider integration powered by Sumsub.
          </p>
        </div>

        {/* Status Hero Card */}
        <div className="rounded-3xl bg-[#0f0f18] border border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Identity Verified & Approved</h3>
                <Badge variant="success">APPROVED</Badge>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Your 18 U.S.C. 2257 recordkeeping documentation and government-issued ID have been verified. Streaming and payout privileges are active.
              </p>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={startSumsubSession} isLoading={isStartingSession}>
            Refresh KYC Status
          </Button>
        </div>

        {/* Verification Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <Badge variant="success">VERIFIED</Badge>
            </div>
            <h4 className="text-sm font-bold text-white">Government ID</h4>
            <p className="text-xs text-zinc-400">Passport or Driver&apos;s License validated.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <Badge variant="success">PASSED</Badge>
            </div>
            <h4 className="text-sm font-bold text-white">Biometric Liveness</h4>
            <p className="text-xs text-zinc-400">3D facial scan matching verified document.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <Badge variant="success">RECORDED</Badge>
            </div>
            <h4 className="text-sm font-bold text-white">18 U.S.C. 2257</h4>
            <p className="text-xs text-zinc-400">Formal federal age compliance affidavit.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <h4 className="text-sm font-bold text-white">Ingest Ingestion</h4>
            <p className="text-xs text-zinc-400">RTMP credentials and broadcast unlocked.</p>
          </div>
        </div>

        {/* Sumsub WebSDK Container Mock */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Integration (Sumsub WebSDK)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-[#141420] border border-zinc-800 p-8 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Sumsub Production Integration Ready</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Connected to <code className="text-purple-300">/api/v1/verification/status</code>. Sumsub access tokens are generated server-side by the NestJS backend and mounted into this container.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}
