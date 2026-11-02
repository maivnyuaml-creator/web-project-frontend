'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Landmark, CheckCircle2, XCircle } from 'lucide-react';

interface AdminPayoutRequest {
  id: string;
  creatorName: string;
  creatorUsername: string;
  amountUsd: number;
  tokens: number;
  method: string;
  destination: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_REQUESTS: AdminPayoutRequest[] = [
  { id: 'pr-101', creatorName: 'Aurora Velvet', creatorUsername: 'aurora_velvet', amountUsd: 1850.0, tokens: 18500, method: 'PAXUM', destination: 'aurora.paxum@domain.com', requestedAt: '2026-10-22 09:30', status: 'PENDING' },
  { id: 'pr-102', creatorName: 'Elena Fox', creatorUsername: 'elena_fox', amountUsd: 3200.0, tokens: 32000, method: 'CRYPTO (USDT)', destination: '0x847294829fae8291', requestedAt: '2026-10-22 11:15', status: 'PENDING' },
  { id: 'pr-103', creatorName: 'Dmitri Blade', creatorUsername: 'dmitri_blade', amountUsd: 950.0, tokens: 9500, method: 'SEPA WIRE', destination: 'DE89 3704 0044 0532 0130 00', requestedAt: '2026-10-21 16:00', status: 'APPROVED' },
];

export default function AdminPayoutsReviewPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminPayoutRequest[]>(INITIAL_REQUESTS);

  const handleApprove = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    toast({
      type: 'success',
      title: 'Payout Approved',
      message: `Disbursement authorized for ${name}. Ingesting wire instructions.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    toast({
      type: 'info',
      title: 'Payout Rejected',
      message: `Payout request for ${name} rejected. Tokens refunded to creator balance.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-purple-400" />
            Performer Payout Approvals
          </h2>
          <p className="text-xs text-zinc-400">
            Review weekly earnings withdrawal requests submitted by verified broadcasters.
          </p>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Broadcaster</th>
                  <th className="p-4 font-semibold">Amount USD</th>
                  <th className="p-4 font-semibold">Tokens</th>
                  <th className="p-4 font-semibold">Method & Destination</th>
                  <th className="p-4 font-semibold">Requested At</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <span className="font-bold text-white block">{r.creatorName}</span>
                      <span className="text-zinc-500 text-[11px]">@{r.creatorUsername}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white text-sm">
                      ${r.amountUsd.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-amber-300">🪙 {r.tokens}</td>
                    <td className="p-4">
                      <span className="font-medium text-purple-300 block">{r.method}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{r.destination}</span>
                    </td>
                    <td className="p-4 text-zinc-400 font-mono">{r.requestedAt}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          r.status === 'APPROVED'
                            ? 'success'
                            : r.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {r.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(r.id, r.creatorName)}
                          >
                            Authorize
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(r.id, r.creatorName)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
