'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { User, UserRole, UserStatus } from '@/types';
import { Users, Search, Shield, Ban, CheckCircle2 } from 'lucide-react';

const MOCK_USERS: User[] = [
  {
    id: 'u-101',
    username: 'aurora_velvet',
    displayName: 'Aurora Velvet',
    email: 'aurora@veloralive.com',
    role: 'CREATOR',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: true,
    tokenBalance: 48502,
    createdAt: '2026-08-14',
    updatedAt: '2026-10-22',
  },
  {
    id: 'u-102',
    username: 'cyber_spectator',
    displayName: 'Alex Cyber',
    email: 'alex@example.com',
    role: 'VIEWER',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: false,
    tokenBalance: 1250,
    createdAt: '2026-09-02',
    updatedAt: '2026-10-22',
  },
  {
    id: 'u-103',
    username: 'troll_master99',
    displayName: 'Troll User',
    email: 'troll99@tempmail.com',
    role: 'VIEWER',
    status: 'SUSPENDED',
    emailVerified: false,
    twoFactorEnabled: false,
    tokenBalance: 0,
    createdAt: '2026-10-19',
    updatedAt: '2026-10-21',
  },
  {
    id: 'u-104',
    username: 'compliance_lead',
    displayName: 'Sarah Jenkins',
    email: 'sarah.compliance@veloralive.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: true,
    tokenBalance: 0,
    createdAt: '2026-06-01',
    updatedAt: '2026-10-22',
  },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleUpdateStatus = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    toast({
      type: 'success',
      title: 'User Status Updated',
      message: `Account status updated to ${newStatus}.`,
    });
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              User & Performer Directory
            </h2>
            <p className="text-xs text-zinc-400">
              Manage accounts, assign roles, enforce suspensions, and inspect verification badges.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 rounded-2xl bg-[#0f0f18] border border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-xl">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by username, email, display name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="VIEWER">Viewers</option>
              <option value="CREATOR">Creators</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#141422] border border-zinc-700/80 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141420] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Tokens</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <span className="font-bold text-white block">{u.displayName}</span>
                      <span className="text-zinc-500 text-[11px]">
                        @{u.username} • {u.email}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium">
                      <span className="text-[11px] bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.status === 'ACTIVE'
                            ? 'success'
                            : u.status === 'SUSPENDED'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-amber-300 font-mono">
                      🪙 {u.tokenBalance.toLocaleString()}
                    </td>
                    <td className="p-4 text-zinc-400 font-mono">{u.createdAt}</td>
                    <td className="p-4 text-right">
                      {u.status === 'ACTIVE' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleUpdateStatus(u.id, 'SUSPENDED')}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(u.id, 'ACTIVE')}
                        >
                          Reactivate
                        </Button>
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
