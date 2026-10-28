import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Search, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const StockMovementsPage: React.FC = () => {
  const { stockMovements } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = stockMovements.filter((m) =>
    m.productName.toLowerCase().includes(search.toLowerCase()) ||
    m.actor.toLowerCase().includes(search.toLowerCase()) ||
    m.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements & Audit Log"
        subtitle="Immutable ledger of sales adjustments, manual corrections, deliveries, and restock batches."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Movements' }]}
      />

      <div className="bg-white border border-[#E9E7E3] p-4 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movements by product, reason, actor..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <span className="text-xs text-neutral-500 tabular-nums">
          {filtered.length} logged events
        </span>
      </div>

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Garment Item</th>
                <th className="py-3 px-3">Variant (Size / Colour)</th>
                <th className="py-3 px-3">Quantity Delta</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-right">Initiated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 tabular-nums text-neutral-500">{m.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-neutral-900">{m.productName}</td>
                  <td className="py-3 px-3 text-neutral-700">{m.size} · {m.colour}</td>
                  <td className="py-3 px-3 tabular-nums font-bold">
                    <span
                      className={`inline-flex items-center gap-0.5 ${
                        m.quantityChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {m.quantityChange > 0 ? '+' : ''}
                      {m.quantityChange} units
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={m.reason} />
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-neutral-800">{m.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
