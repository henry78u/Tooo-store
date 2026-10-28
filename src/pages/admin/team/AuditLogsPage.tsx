import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Search } from 'lucide-react';
import { AuditLogEntry } from '../../../types/admin';

export default function AuditLogsPage() {
  const { auditLogs } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('all');

  const actors = Array.from(new Set(auditLogs.map((l: AuditLogEntry) => l.actor)));

  const filtered = auditLogs.filter((log: AuditLogEntry) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActor = actorFilter === 'all' || log.actor === actorFilter;
    return matchesSearch && matchesActor;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & System Activity"
        subtitle="Immutable ledger of staff operations, price updates, order cancellations, and system access"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Team', href: '/admin/team/staff' },
          { label: 'Audit Logs' },
        ]}
      />

      <div className="bg-white border border-[#E9E7E3]">
        {/* Controls */}
        <div className="p-4 border-b border-[#E9E7E3] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77746F]" />
            <input
              type="text"
              placeholder="Search actions, modified resources, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#77746F]">Filter Staff:</span>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#E9E7E3] text-xs font-mono bg-white focus:outline-none"
            >
              <option value="all">All Personnel</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#F6F3ED]/40 text-xs text-[#77746F] font-mono uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((log: AuditLogEntry) => (
                <tr key={log.id} className="hover:bg-[#F6F3ED]/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#77746F] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#171717]">{log.actor}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#77746F]">{log.actorRole}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono px-2 py-0.5 bg-[#F6F3ED] border border-[#E9E7E3] text-[#8A4735] font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#171717]">{log.resource}</td>
                  <td className="py-3 px-4 text-xs text-[#77746F] max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
