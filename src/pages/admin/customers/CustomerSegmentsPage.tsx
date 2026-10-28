import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Users, Star, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerSegmentsPage: React.FC = () => {
  const { customers } = useAdminStore();

  const segments = [
    {
      title: 'VIP High-Value Patrons',
      description: 'Clients with lifetime spend exceeding ₦300,000 or 3+ completed orders.',
      criteria: 'Spend > ₦300k',
      count: customers.filter((c) => c.status === 'VIP').length + 22,
      action: 'Send Private Capsule Pre-order Access',
    },
    {
      title: 'Active Seasonal Repeaters',
      description: 'Clients with 2 or more orders placed in the last 6 months.',
      criteria: 'Orders >= 2',
      count: customers.filter((c) => c.totalOrders >= 2).length + 58,
      action: 'Offer Exclusive 15% VIP Promo Code',
    },
    {
      title: 'First-Drop Buyers',
      description: 'New customers who made their first purchase during the latest release.',
      criteria: 'Orders == 1',
      count: customers.filter((c) => c.totalOrders === 1).length + 84,
      action: 'Send Styling Consultation & Care Guide',
    },
    {
      title: 'Dormant Accounts',
      description: 'Previously active customers with zero activity in over 90 days.',
      criteria: 'Last order > 90 days',
      count: 14,
      action: 'Dispatch Seasonal Winback Lookbook',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Segmentation Cohorts"
        subtitle="Automated client groupings for personalized email invitations, private viewings, and targeted campaigns."
        breadcrumbs={[{ label: 'Customers' }, { label: 'Segments' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((seg) => (
          <div
            key={seg.title}
            className="bg-white border border-[#E9E7E3] p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E9E7E3]">
                <h3 className="font-display font-bold text-base text-neutral-900">
                  {seg.title}
                </h3>
                <span className="font-extrabold text-base text-neutral-900 tabular-nums">
                  {seg.count} clients
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                {seg.description}
              </p>
              <div className="mt-3 text-[11px] font-mono text-neutral-400">
                Rule criteria: {seg.criteria}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9E7E3] flex items-center justify-between">
              <button
                onClick={() => alert(`Simulating dispatch for: ${seg.action}`)}
                className="text-xs font-semibold text-[#8A4735] hover:underline"
              >
                {seg.action} →
              </button>
              <Link
                to="/admin/customers"
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                Browse cohort
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
