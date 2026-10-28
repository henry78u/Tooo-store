import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Mail, ShoppingBag, Check } from 'lucide-react';

export const AbandonedCheckoutsPage: React.FC = () => {
  const { abandonedCheckouts, markAbandonedRecovered } = useAdminStore();

  const totalAbandonedValue = abandonedCheckouts.reduce((s, a) => s + a.totalValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Abandoned Checkout Sessions"
        subtitle="Uncompleted shopping carts and automated recovery dispatch sequences."
        breadcrumbs={[{ label: 'Orders' }, { label: 'Abandoned Checkouts' }]}
      />

      <div className="bg-white border border-[#E9E7E3] p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase">
            Recoverable Cart Potential
          </span>
          <div className="text-2xl font-display font-extrabold text-neutral-900 mt-0.5 tabular-nums">
            {formatNaira(totalAbandonedValue)}
          </div>
        </div>
        <span className="text-xs text-neutral-600 bg-[#FAF8F5] border border-[#E9E7E3] px-3 py-1.5 font-medium">
          {abandonedCheckouts.length} sessions logged
        </span>
      </div>

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Session Date</th>
                <th className="py-3 px-3">Prospect Client</th>
                <th className="py-3 px-3">Items in Bag</th>
                <th className="py-3 px-3">Cart Value</th>
                <th className="py-3 px-3">Recovery Status</th>
                <th className="py-3 px-3 text-right">Recovery Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {abandonedCheckouts.map((a) => (
                <tr key={a.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5 px-3 tabular-nums text-neutral-500">{a.date}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-neutral-900 block">{a.customerName || 'Guest Shopper'}</span>
                    <span className="text-neutral-500 text-[11px]">{a.customerEmail}</span>
                  </td>
                  <td className="py-3.5 px-3 text-neutral-700 max-w-sm">
                    <p className="truncate">{a.itemsSummary}</p>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      ({a.itemsCount} pieces)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold tabular-nums text-neutral-900">
                    {formatNaira(a.totalValue)}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={a.recoveryStatus} showDot />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {a.recoveryStatus === 'Unrecovered' ? (
                      <button
                        onClick={() => markAbandonedRecovered(a.id)}
                        className="px-3 py-1.5 bg-[#171717] hover:bg-neutral-800 text-white text-[11px] font-semibold flex items-center gap-1.5 ml-auto"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Send Recovery Offer</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Follow-up Dispatched</span>
                      </span>
                    )}
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
