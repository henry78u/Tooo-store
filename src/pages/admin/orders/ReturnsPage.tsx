import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Check, X, RotateCcw } from 'lucide-react';

export const ReturnsPage: React.FC = () => {
  const { returnRequests, updateReturnStatus } = useAdminStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returns & Exchanges"
        subtitle="Customer return inquiries, size swaps, garment inspection condition, and restocking."
        breadcrumbs={[{ label: 'Orders' }, { label: 'Returns' }]}
      />

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Order Ref</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Garment & Variant</th>
                <th className="py-3 px-3">Return Reason</th>
                <th className="py-3 px-3">Item Condition</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {returnRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No active return requests.
                  </td>
                </tr>
              ) : (
                returnRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-3 tabular-nums text-neutral-500">{r.date}</td>
                    <td className="py-3.5 px-3 font-bold text-neutral-900 tabular-nums">
                      {r.orderReference}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">{r.customerName}</td>
                    <td className="py-3.5 px-3 font-medium text-neutral-800">
                      {r.productName} ({r.variant})
                    </td>
                    <td className="py-3.5 px-3 text-neutral-600 max-w-xs">{r.reason}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-neutral-700 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium border border-neutral-200">
                        {r.condition}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={r.status} showDot />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {r.status === 'Pending Review' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateReturnStatus(r.id, 'Approved')}
                            className="px-2.5 py-1 bg-[#171717] text-white text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateReturnStatus(r.id, 'Rejected')}
                            className="px-2.5 py-1 border border-neutral-300 text-neutral-600 text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : r.status === 'Approved' ? (
                        <button
                          onClick={() => updateReturnStatus(r.id, 'Received & Restocked')}
                          className="px-2.5 py-1 bg-emerald-700 text-white text-[11px] font-semibold"
                        >
                          Confirm Restocked
                        </button>
                      ) : (
                        <span className="text-neutral-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
