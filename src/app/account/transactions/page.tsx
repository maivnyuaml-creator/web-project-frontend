'use client';

import React, { useState } from 'react';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Badge } from '@/components/ui/Badge';
import { Transaction, TransactionType } from '@/types';
import { History, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-901',
    userId: 'u-1',
    type: 'PURCHASE',
    amountTokens: 600,
    amountUsd: 54.99,
    status: 'COMPLETED',
    paymentMethod: 'Credit Card (ending 4242)',
    description: 'VIP Pack Purchase (+100 Bonus Tokens)',
    referenceId: 'ch_3N194KDJF8492048',
    createdAt: '2026-10-21 14:30',
  },
  {
    id: 'tx-902',
    userId: 'u-1',
    type: 'TIP_SENT',
    amountTokens: -100,
    status: 'COMPLETED',
    description: 'Live room tip to @aurora_velvet',
    referenceId: 'tip_48102847',
    createdAt: '2026-10-21 15:10',
  },
  {
    id: 'tx-903',
    userId: 'u-1',
    type: 'PRIVATE_SHOW',
    amountTokens: -900,
    status: 'COMPLETED',
    description: '15-min Private Video Session with @aurora_velvet',
    referenceId: 'show_92847192',
    createdAt: '2026-10-21 23:45',
  },
  {
    id: 'tx-904',
    userId: 'u-1',
    type: 'PURCHASE',
    amountTokens: 250,
    amountUsd: 24.99,
    status: 'COMPLETED',
    paymentMethod: 'Crypto (USDT)',
    description: 'Supporter Pack Purchase (+25 Bonus Tokens)',
    referenceId: 'crypto_tx_0x94829fae',
    createdAt: '2026-10-18 19:20',
  },
];

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = filterType === 'ALL'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter((t) => t.type === filterType);

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              Transaction & Token Ledger
            </h2>
            <p className="text-xs text-zinc-400">
              Complete history of token purchases, broadcaster tips, and show debits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#141420] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Transactions</option>
              <option value="PURCHASE">Token Purchases</option>
              <option value="TIP_SENT">Tips Sent</option>
              <option value="PRIVATE_SHOW">Private Shows</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Date & Reference</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Payment / Details</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((t) => {
                  const isPositive = t.amountTokens > 0;
                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <span className="font-medium text-white block">{t.createdAt}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{t.referenceId || t.id}</span>
                      </td>
                      <td className="p-4 font-medium text-zinc-200">{t.description}</td>
                      <td className="p-4 text-zinc-400">
                        {t.paymentMethod || 'In-App Token Debit'}
                        {t.amountUsd && (
                          <span className="block text-[11px] text-zinc-500 font-mono">
                            ${t.amountUsd.toFixed(2)} USD
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isPositive ? 'text-emerald-400' : 'text-zinc-200'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {t.amountTokens} tokens
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="success">Completed</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
