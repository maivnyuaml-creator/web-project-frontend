'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { DollarSign, Landmark, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';

interface PayoutRecord {
  id: string;
  amountUsd: number;
  tokens: number;
  method: string;
  status: 'COMPLETED' | 'PENDING';
  date: string;
  txHash?: string;
}

const MOCK_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-501',
    amountUsd: 1850.0,
    tokens: 18500,
    method: 'Paxum (pax_aurora@...)',
    status: 'COMPLETED',
    date: 'Oct 14, 2026',
    txHash: 'PX-9824018',
  },
  {
    id: 'pay-502',
    amountUsd: 2200.0,
    tokens: 22000,
    method: 'Crypto USDT (TRC20)',
    status: 'COMPLETED',
    date: 'Oct 07, 2026',
    txHash: '0x9482f...a719',
  },
];

export default function CreatorPayoutsPage() {
  const { toast } = useToast();
  const [payoutMethod, setPayoutMethod] = useState<'PAXUM' | 'CRYPTO' | 'SEPA'>('PAXUM');
  const [destinationAccount, setDestinationAccount] = useState('creator_paxum@example.com');
  const [payoutAmountTokens, setPayoutAmountTokens] = useState('10000');
  const [isRequesting, setIsRequesting] = useState(false);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);

  const availableTokens = 48502; // Available balance

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const tokens = parseInt(payoutAmountTokens, 10);
    if (!tokens || tokens < 1000) {
      toast({ type: 'error', title: 'Minimum Threshold', message: 'Minimum payout is 1,000 tokens ($100 USD).' });
      return;
    }
    if (tokens > availableTokens) {
      toast({ type: 'error', title: 'Exceeds Balance', message: 'Requested amount exceeds available balance.' });
      return;
    }

    setIsRequesting(true);
    setTimeout(() => {
      const newPayout: PayoutRecord = {
        id: `pay-${Math.floor(Math.random() * 900) + 100}`,
        amountUsd: tokens / 10,
        tokens,
        method: `${payoutMethod} (${destinationAccount})`,
        status: 'PENDING',
        date: 'Today (Pending Approval)',
      };
      setPayouts([newPayout, ...payouts]);
      setIsRequesting(false);
      toast({
        type: 'success',
        title: 'Payout Request Submitted',
        message: 'Your payout has been queued for standard processing.',
      });
    }, 800);
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-purple-400" />
            Creator Payouts & Disbursal
          </h2>
          <p className="text-xs text-zinc-400">
            Request earnings withdrawals via Paxum, SEPA, Bank Wire, or Crypto (USDT).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Request Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request New Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex justify-between items-center">
                    <span className="text-zinc-400">Available to Withdraw:</span>
                    <strong className="text-amber-300 font-bold text-sm">
                      🪙 {availableTokens.toLocaleString()} ($4,850.20)
                    </strong>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Withdrawal Method
                    </label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as 'PAXUM' | 'CRYPTO' | 'SEPA')}
                      className="w-full bg-[#141422] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="PAXUM">Paxum Wallet</option>
                      <option value="CRYPTO">Crypto USDT (TRC-20 / ERC-20)</option>
                      <option value="SEPA">SEPA European Bank Transfer</option>
                    </select>
                  </div>

                  <Input
                    label={payoutMethod === 'PAXUM' ? 'Paxum Account Email' : payoutMethod === 'CRYPTO' ? 'USDT Wallet Address' : 'IBAN / SWIFT Code'}
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                    required
                  />

                  <Input
                    label="Tokens to Disburse"
                    type="number"
                    min="1000"
                    max={availableTokens}
                    value={payoutAmountTokens}
                    onChange={(e) => setPayoutAmountTokens(e.target.value)}
                    helperText={`Est. Value: $${(parseInt(payoutAmountTokens || '0', 10) / 10).toFixed(2)} USD`}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    isLoading={isRequesting}
                  >
                    Submit Withdrawal Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payout History Table */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Method</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {payouts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="p-4">{p.date}</td>
                          <td className="p-4 font-bold text-white font-mono">
                            ${p.amountUsd.toFixed(2)}
                            <span className="text-[11px] text-zinc-500 block font-normal">
                              🪙 {p.tokens} tokens
                            </span>
                          </td>
                          <td className="p-4 text-zinc-400">{p.method}</td>
                          <td className="p-4">
                            <Badge variant={p.status === 'COMPLETED' ? 'success' : 'warning'}>
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
