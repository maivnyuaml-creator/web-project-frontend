'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { FIXTURE_CREATOR_APPLICATIONS } from '@/lib/api/fixtures';
import { CreatorApplication } from '@/types';
import { FileCheck, CheckCircle2, XCircle, Search, User } from 'lucide-react';

export default function AdminCreatorsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<CreatorApplication[]>(FIXTURE_CREATOR_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedApp, setSelectedApp] = useState<CreatorApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: string, name: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'APPROVED' } : app))
    );
    toast({
      type: 'success',
      title: 'Application Approved',
      message: `${name} has been approved. RTMP streaming credentials generated.`,
    });
  };

  const handleRejectConfirm = () => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? { ...app, status: 'REJECTED', rejectionReason: rejectReason || 'Documentation incomplete' }
          : app
      )
    );
    toast({
      type: 'info',
      title: 'Application Rejected',
      message: `Application for ${selectedApp.legalFirstName} ${selectedApp.legalLastName} rejected.`,
    });
    setSelectedApp(null);
    setRejectReason('');
  };

  const filtered = filterStatus === 'ALL'
    ? applications
    : applications.filter((app) => app.status === filterStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-400" />
              Creator Applications & 2257 Intake
            </h2>
            <p className="text-xs text-zinc-400">
              Review government identity documents and age compliance affidavits before approving broadcast accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#141420] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Applications</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">Applicant</th>
                  <th className="p-4 font-semibold">Date of Birth</th>
                  <th className="p-4 font-semibold">Country</th>
                  <th className="p-4 font-semibold">ID Document</th>
                  <th className="p-4 font-semibold">Submitted</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">
                        {app.legalFirstName} {app.legalLastName}
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        @{app.username} • {app.userEmail}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{app.dateOfBirth}</td>
                    <td className="p-4">{app.country}</td>
                    <td className="p-4 font-mono">
                      <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                        {app.idDocumentType}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">{(app.submittedAt || '').split('T')[0] || 'N/A'}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          app.status === 'APPROVED'
                            ? 'success'
                            : app.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {app.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(app.id, app.legalFirstName)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setSelectedApp(app)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Reject Creator Application"
        description="Specify the compliance reason for rejecting this performer's application."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Rejection Reason
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="Document unreadable or blurry">Document unreadable or expired</option>
              <option value="Selfie does not match document">Selfie biometric liveness failed</option>
              <option value="Under legal age of majority">Under legal age requirement (&lt;18)</option>
              <option value="Prohibited jurisdiction">Restricted or embargoed jurisdiction</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setSelectedApp(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Dialog>
    </AdminLayout>
  );
}
