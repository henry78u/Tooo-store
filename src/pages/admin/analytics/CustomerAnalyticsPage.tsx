import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { MetricCard } from '../../../components/admin/ui/MetricCard';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { Users, UserPlus, Heart, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerAnalyticsPage: React.FC = () => {
  const { customers } = useAdminStore();

  const totalClients = customers.length + 182;
  const repeatClientRate = '34.8%';
  const avgLifetimeSpend = 142000;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customer Behavior & Cohorts"
        subtitle="Client acquisition, retention rates, and average lifetime value (LTV)."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Customers' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Clientele Base"
          value={totalClients}
          change="+18 this month"
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Repeat Purchase Rate"
          value={repeatClientRate}
          change="+4.2%"
          changeType="positive"
          subtext="healthy brand loyalty"
          icon={<Repeat className="w-4 h-4" />}
        />
        <MetricCard
          label="Average Lifetime Spend"
          value={formatNaira(avgLifetimeSpend)}
          change="+8.1%"
          changeType="positive"
          subtext="per active client"
          icon={<Heart className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cohort Segments */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
            Client Cohort Segments
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF8F5] border border-[#E9E7E3] flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">VIP High-Value Collectors</span>
                <span className="text-neutral-500">Over ₦300,000 spend · Tailoring & trench focus</span>
              </div>
              <span className="font-extrabold text-neutral-900 tabular-nums text-sm">24 clients</span>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E9E7E3] flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">Active Seasonal Repeaters</span>
                <span className="text-neutral-500">2-4 orders in last 90 days</span>
              </div>
              <span className="font-extrabold text-neutral-900 tabular-nums text-sm">62 clients</span>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E9E7E3] flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">First Drop Buyers</span>
                <span className="text-neutral-500">Acquired during latest Volume 01 drop</span>
              </div>
              <span className="font-extrabold text-neutral-900 tabular-nums text-sm">96 clients</span>
            </div>
          </div>
        </div>

        {/* Top Clients by Volume */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E9E7E3]">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Leading Private Patrons
            </h3>
            <Link to="/admin/customers" className="text-xs text-[#8A4735] hover:underline font-semibold">
              View Directory
            </Link>
          </div>
          <div className="divide-y divide-[#E9E7E3]">
            {customers.slice(0, 4).map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">{c.name}</span>
                  <span className="text-neutral-500 text-[11px]">{c.city}, {c.state}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums text-neutral-900 block">{formatNaira(c.totalSpent)}</span>
                  <span className="text-[10px] text-neutral-400">{c.totalOrders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
