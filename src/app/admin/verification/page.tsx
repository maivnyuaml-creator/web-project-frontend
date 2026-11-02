'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, Search } from 'lucide-react';

export default function AdminVerificationPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Identity Verification & 2257 Compliance Audit
          </h2>
          <p className="text-xs text-zinc-400">
            Automated Sumsub KYC webhook feeds and federal recordkeeping records repository.
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">Sumsub KYC Ingestion</span>
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Operational
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Webhooks: 200 OK (0 dropped)</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">2257 Records Stored</span>
            <h3 className="text-lg font-bold text-white">1,280 Verified Performers</h3>
            <span className="text-[11px] text-zinc-500 font-mono">Encrypted at rest (AES-256)</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400">Automated Liveness Pass Rate</span>
            <h3 className="text-lg font-bold text-purple-300">96.4%</h3>
            <span className="text-[11px] text-zinc-500 font-mono">3.6% manual review queue</span>
          </div>
        </div>

        {/* Compliance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent 2257 Verification Audits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4 font-semibold">Broadcaster Handle</th>
                    <th className="p-4 font-semibold">Document Check</th>
                    <th className="p-4 font-semibold">Liveness Check</th>
                    <th className="p-4 font-semibold">2257 Affidavit</th>
                    <th className="p-4 font-semibold">Verified Timestamp</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {[
                    { handle: 'aurora_velvet', doc: 'Passport (Canada)', liveness: 'Passed 99.8%', aff: 'Signed & Recorded', time: '2026-10-18 10:14', status: 'COMPLIANT' },
                    { handle: 'elena_fox', doc: 'National ID (Spain)', liveness: 'Passed 98.4%', aff: 'Signed & Recorded', time: '2026-10-17 14:22', status: 'COMPLIANT' },
                    { handle: 'valentina_lux', doc: 'Passport (Italy)', liveness: 'Passed 99.1%', aff: 'Signed & Recorded', time: '2026-10-15 09:30', status: 'COMPLIANT' },
                    { handle: 'dmitri_blade', doc: 'Drivers License (Germany)', liveness: 'Passed 97.5%', aff: 'Signed & Recorded', time: '2026-10-21 20:00', status: 'COMPLIANT' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">@{row.handle}</td>
                      <td className="p-4 font-mono text-zinc-300">{row.doc}</td>
                      <td className="p-4 text-emerald-400 font-mono">{row.liveness}</td>
                      <td className="p-4 text-zinc-400">{row.aff}</td>
                      <td className="p-4 text-zinc-500 font-mono">{row.time}</td>
                      <td className="p-4">
                        <Badge variant="success">{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
