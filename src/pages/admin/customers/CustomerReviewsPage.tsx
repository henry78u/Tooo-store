import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Star, Check, EyeOff, ShieldCheck } from 'lucide-react';

export const CustomerReviewsPage: React.FC = () => {
  const { customerReviews, updateReviewStatus } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = customerReviews.filter(
    (r) => filterStatus === 'All' || r.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Reviews & Testimonials"
        subtitle="Review client feedback, verify garment purchase credentials, and moderate storefront display."
        breadcrumbs={[{ label: 'Customers' }, { label: 'Reviews' }]}
      />

      <div className="bg-white border border-[#E9E7E3] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-neutral-700">Filter status:</span>
          {(['All', 'Approved', 'Pending', 'Hidden'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 font-semibold border transition-colors ${
                filterStatus === st
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-neutral-700 border-[#E9E7E3] hover:border-neutral-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-500 tabular-nums">
          {filtered.length} reviews cataloged
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E7E3] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-500' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-neutral-900 text-xs">{rev.title}</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  By <strong>{rev.customerName}</strong> for <em>{rev.productName}</em> · {rev.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {rev.verifiedPurchase && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                )}
                <StatusBadge status={rev.status} showDot />
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              {rev.status !== 'Approved' && (
                <button
                  onClick={() => updateReviewStatus(rev.id, 'Approved')}
                  className="px-3 py-1 bg-[#171717] text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Approve for Storefront</span>
                </button>
              )}
              {rev.status !== 'Hidden' && (
                <button
                  onClick={() => updateReviewStatus(rev.id, 'Hidden')}
                  className="px-3 py-1 border border-neutral-300 text-neutral-700 text-[11px] font-medium hover:bg-neutral-50 flex items-center gap-1"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Hide from Public</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
