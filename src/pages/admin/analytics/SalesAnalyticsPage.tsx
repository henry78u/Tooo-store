import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { MetricCard } from '../../../components/admin/ui/MetricCard';
import { ChartCard } from '../../../components/admin/ui/ChartCard';
import { formatNaira } from '../../../store/useStore';
import { useAdminStore } from '../../../store/useAdminStore';
import { Download, Calendar, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

export const SalesAnalyticsPage: React.FC = () => {
  const { orders } = useAdminStore();

  const totalGross = 2840000;
  const discountsIssued = 245000;
  const refundsIssued = 39000;
  const netSales = totalGross - discountsIssued - refundsIssued;

  const revenueByRegion = [
    { region: 'Lagos Metropolitan', percentage: 68, amount: 1740000 },
    { region: 'Abuja & North Central', percentage: 18, amount: 460000 },
    { region: 'Rivers & South-South', percentage: 9, amount: 230000 },
    { region: 'South-West Interstate', percentage: 5, amount: 128000 },
  ];

  const salesTrend = [
    { label: 'Week 1', value: 520000 },
    { label: 'Week 2', value: 680000 },
    { label: 'Week 3', value: 740000 },
    { label: 'Week 4', value: 900000 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales & Revenue Analytics"
        subtitle="Gross revenue, Net revenue after promotional discounts, and geographical distribution."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Sales' }]}
        actions={
          <button
            onClick={() => alert('Exporting Sales Report CSV (Prototype Download)')}
            className="flex items-center gap-2 bg-white hover:bg-[#F6F3ED] border border-[#E9E7E3] px-3.5 py-2 text-xs font-semibold text-neutral-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sales CSV</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Net Sales"
          value={formatNaira(netSales)}
          change="+15.8%"
          changeType="positive"
          subtext="after deductions"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          label="Gross Revenue"
          value={formatNaira(totalGross)}
          change="+18.4%"
          changeType="positive"
          subtext="total orders"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Promotional Discounts"
          value={formatNaira(discountsIssued)}
          change="8.6%"
          changeType="neutral"
          subtext="of gross sales"
        />
        <MetricCard
          label="Refunds & Returns"
          value={formatNaira(refundsIssued)}
          change="1.4%"
          changeType="positive"
          subtext="healthy low rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <ChartCard
            title="Weekly Net Revenue Trajectory"
            subtitle="Trailing 4-week sales volume in Nigerian Naira."
            data={salesTrend}
            summaryValue={formatNaira(netSales)}
            summaryTrend="+15.8% month-over-month"
          />
        </div>

        {/* Regional Breakdown */}
        <div className="lg:col-span-4 bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
            Revenue by Nigerian Region
          </h3>
          <div className="space-y-4 pt-1">
            {revenueByRegion.map((r) => (
              <div key={r.region} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-neutral-800">
                  <span className="font-medium">{r.region}</span>
                  <span className="font-bold tabular-nums">{formatNaira(r.amount)}</span>
                </div>
                <div className="w-full bg-[#F6F3ED] h-2 rounded-none overflow-hidden">
                  <div
                    className="bg-[#171717] h-full"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-neutral-400 text-right">{r.percentage}% share</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
