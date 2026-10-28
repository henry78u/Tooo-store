import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Search, Mail, Download, UserCheck } from 'lucide-react';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const SubscribersPage: React.FC = () => {
  const { subscribers } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Subscribers & Newsletter List"
        subtitle={`Total of ${subscribers.length + 340} registered email recipients subscribed to seasonal lookbook drops.`}
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Subscribers' }]}
        actions={
          <button
            onClick={() => alert('Exporting subscriber email roster (CSV demonstration)')}
            className="flex items-center gap-2 bg-white hover:bg-[#F6F3ED] border border-[#E9E7E3] px-3.5 py-2 text-xs font-semibold text-neutral-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster CSV</span>
          </button>
        }
      />

      <div className="bg-white border border-[#E9E7E3] p-4 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriber email or capture source..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <span className="text-xs text-neutral-500 tabular-nums">
          {filtered.length} visible
        </span>
      </div>

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Subscriber Email</th>
                <th className="py-3 px-3">Subscribed Date</th>
                <th className="py-3 px-3">Origin Channel</th>
                <th className="py-3 px-3 text-right">Consent State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 font-semibold text-neutral-900 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{s.email}</span>
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-500">{s.subscribedAt}</td>
                  <td className="py-3 px-3 font-medium text-neutral-700">{s.source}</td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={s.status} showDot />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
