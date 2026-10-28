import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Search, Download, CreditCard } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) =>
    t.reference.toLowerCase().includes(search.toLowerCase()) ||
    t.orderReference.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalSuccessful = transactions
    .filter((t) => t.status === 'Successful')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions & Gateways"
        subtitle="Gateway audit ledger across simulated Paystack card authorizations and NIP direct bank transfers."
        breadcrumbs={[{ label: 'Finance' }, { label: 'Transactions' }]}
        actions={
          <button
            onClick={() => alert('Exporting Transactions CSV')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E9E7E3] text-xs font-semibold text-neutral-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Summary */}
      <div className="bg-white border border-[#E9E7E3] p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase">Settled Inflow</span>
          <div className="text-2xl font-display font-extrabold text-neutral-900 mt-0.5 tabular-nums">
            {formatNaira(totalSuccessful)}
          </div>
        </div>
        <span className="text-xs text-neutral-600 bg-[#FAF8F5] border border-[#E9E7E3] px-3 py-1.5 font-medium">
          {transactions.length} transactions processed
        </span>
      </div>

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Transaction Ref</th>
                <th className="py-3 px-3">Order Ref</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Payment Channel</th>
                <th className="py-3 px-3">Settlement Amount</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-neutral-900">
                    {t.reference}
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-800 tabular-nums">
                    {t.orderReference}
                  </td>
                  <td className="py-3 px-3 text-neutral-800 font-medium">{t.customerName}</td>
                  <td className="py-3 px-3 text-neutral-600">{t.paymentMethod}</td>
                  <td className="py-3 px-3 font-bold tabular-nums text-neutral-900">
                    {formatNaira(t.amount)}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-500">{t.date}</td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={t.status} showDot />
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
