'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FIXTURE_AUDIT_LOGS } from '@/lib/api/fixtures';
import { AuditLog } from '@/types';
import { ClipboardList, Search, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(FIXTURE_AUDIT_LOGS);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-400" />
              Administrative Audit Trail
            </h2>
            <p className="text-xs text-zinc-400">
              Immutable log of compliance decisions, creator approvals, suspensions, and settings changes.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Staff Member</th>
                  <th className="p-4 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Target</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                      {log.createdAt.replace('T', ' ').replace('.000Z', '')}
                    </td>
                    <td className="p-4 font-bold text-white whitespace-nowrap">{log.adminName}</td>
                    <td className="p-4 font-mono font-medium text-purple-300">
                      <span className="bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-200">{log.target}</td>
                    <td className="p-4 text-zinc-400 max-w-xs">{log.details}</td>
                    <td className="p-4 font-mono text-zinc-500 text-[11px]">{log.ipAddress}</td>
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
