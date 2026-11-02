'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { CreditCard, DollarSign, ShieldAlert, ArrowDownUp } from 'lucide-react';

interface PaymentMonitoringRecord {
  id: string;
  user: string;
  amountUsd: number;
  tokens: number;
  method: string;
  status: 'COMPLETED' | 'REFUNDED' | 'DISPUTED';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

const INITIAL_PAYMENTS: PaymentMonitoringRecord[] = [
  { id: 'pay-tx-01', user: 'cyber_spectator', amountUsd: 129.99, tokens: 1850, method: 'Stripe (Visa 4242)', status: 'COMPLETED', riskScore: 'LOW', timestamp: '2026-10-22 13:40' },
  { id: 'pay-tx-02', user: 'whale_donator', amountUsd: 329.99, tokens: 5200, method: 'Crypto (USDT-TRC20)', status: 'COMPLETED', riskScore: 'LOW', timestamp: '2026-10-22 12:15' },
  { id: 'pay-tx-03', user: 'suspect_buyer', amountUsd: 54.99, tokens: 700, method: 'MasterCard (ending 9912)', status: 'DISPUTED', riskScore: 'HIGH', timestamp: '2026-10-21 18:20' },
  { id: 'pay-tx-04', user: 'normal_fan', amountUsd: 24.99, tokens: 275, method: 'Stripe (Apple Pay)', status: 'COMPLETED', riskScore: 'LOW', timestamp: '2026-10-21 16:05' },
];

export default function AdminPaymentsPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentMonitoringRecord[]>(INITIAL_PAYMENTS);

  const handleRefund = (id: string, user: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'REFUNDED' } : p))
    );
    toast({
      type: 'info',
      title: 'Payment Refunded',
      message: `Transaction ${id} for @${user} marked as refunded. Associated tokens revoked.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Payment Processing, Chargebacks & Refunds
          </h2>
          <p className="text-xs text-zinc-400">
            Monitor real-time token package purchases, fraud risk telemetry, and handle chargeback disputes.
          </p>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Transaction ID</th>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Amount USD</th>
                  <th className="p-4 font-semibold">Tokens</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Risk Score</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-medium text-white">{p.id}</td>
                    <td className="p-4">@{p.user}</td>
                    <td className="p-4 font-mono font-bold text-white">${p.amountUsd.toFixed(2)}</td>
                    <td className="p-4 font-mono text-amber-300">🪙 {p.tokens}</td>
                    <td className="p-4 text-zinc-400">{p.method}</td>
                    <td className="p-4 font-mono">
                      <Badge
                        variant={
                          p.riskScore === 'HIGH'
                            ? 'danger'
                            : p.riskScore === 'MEDIUM'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {p.riskScore} RISK
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === 'COMPLETED'
                            ? 'success'
                            : p.status === 'DISPUTED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'COMPLETED' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefund(p.id, p.user)}
                          className="text-rose-400 hover:text-white"
                        >
                          Refund
                        </Button>
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
