'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { FIXTURE_MODERATION_REPORTS } from '@/lib/api/fixtures';
import { ModerationReport } from '@/types';
import { ShieldAlert, AlertTriangle, CheckCircle2, UserX, Ban, Eye } from 'lucide-react';

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ModerationReport[]>(FIXTURE_MODERATION_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [actionNote, setActionNote] = useState('');

  const handleResolveAction = (actionType: 'DISMISS' | 'BAN' | 'TERMINATE') => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? { ...r, status: 'RESOLVED', moderatorNotes: actionNote || `Action: ${actionType}` }
          : r
      )
    );

    toast({
      type: 'success',
      title: 'Report Processed',
      message: `Report #${selectedReport.id} resolved with action ${actionType}.`,
    });
    setSelectedReport(null);
    setActionNote('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Moderation Reports & Emergency Queue
          </h2>
          <p className="text-xs text-zinc-400">
            Investigate reported broadcasts, chat abuse, copyright notices, and safety concerns.
          </p>
        </div>

        {/* Reports Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Reported Target</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Reported By</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <Badge
                        variant={
                          r.urgency === 'HIGH' || r.urgency === 'CRITICAL'
                            ? 'danger'
                            : r.urgency === 'MEDIUM'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {r.urgency}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{r.targetName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {r.targetType} • {r.targetId}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium text-purple-300">{r.reason}</td>
                    <td className="p-4 max-w-xs truncate text-zinc-300">{r.description}</td>
                    <td className="p-4 text-zinc-400">@{r.reporterUsername}</td>
                    <td className="p-4">
                      <Badge variant={r.status === 'RESOLVED' ? 'success' : 'warning'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {r.status !== 'RESOLVED' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedReport(r)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Review
                        </Button>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Review Report #${selectedReport?.id}`}
        description="Review evidence and take administrative enforcement action."
      >
        {selectedReport && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141420] border border-zinc-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Target:</span>
                <strong className="text-white">{selectedReport.targetName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Category:</span>
                <strong className="text-rose-400">{selectedReport.reason}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Urgency:</span>
                <strong className="text-amber-300">{selectedReport.urgency}</strong>
              </div>
            </div>

            <div>
              <span className="font-bold text-white block mb-1">Reporter Description:</span>
              <p className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Resolution Action Note
              </label>
              <textarea
                rows={2}
                placeholder="Log internal action taken (e.g. warned user, IP banned, false report)..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleResolveAction('DISMISS')}
              >
                Dismiss Report
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleResolveAction('TERMINATE')}
              >
                Terminate Stream
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleResolveAction('BAN')}
              >
                <Ban className="w-3.5 h-3.5 mr-1" /> Ban Target
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </AdminLayout>
  );
}
