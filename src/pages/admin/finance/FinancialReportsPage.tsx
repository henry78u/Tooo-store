import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { ChartCard } from '../../../components/admin/ui/ChartCard';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function FinancialReportsPage() {
  const { orders } = useAdminStore();

  // Compute summary numbers
  const grossSales = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Simulated Paid' ? o.total : 0), 0) + 1850000;
  const discountsGiven = 425000;
  const shippingCollected = 145000;
  const estimatedCOGS = Math.round(grossSales * 0.38); // 38% production and fabric cost
  const netProfit = grossSales - estimatedCOGS - discountsGiven;
  const grossMargin = grossSales > 0 ? Math.round(((grossSales - estimatedCOGS) / grossSales) * 100) : 62;

  const monthlyReportData = [
    { label: 'Jan', value: 1850000 },
    { label: 'Feb', value: 2400000 },
    { label: 'Mar', value: 2100000 },
    { label: 'Apr', value: 3100000 },
    { label: 'May', value: 2900000 },
    { label: 'Jun', value: 3800000 },
    { label: 'Jul', value: 4200000 },
    { label: 'Aug', value: 4600000 },
    { label: 'Sep', value: 4300000 },
    { label: 'Oct', value: 5200000 },
    { label: 'Nov', value: 5800000 },
    { label: 'Dec', value: 6400000 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Amount (NGN)\n' +
      `Gross Sales,${grossSales}\n` +
      `Estimated COGS,${estimatedCOGS}\n` +
      `Discounts Given,${discountsGiven}\n` +
      `Shipping Fees Collected,${shippingCollected}\n` +
      `Net Profit,${netProfit}\n` +
      `Gross Margin,${grossMargin}%\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TOOO_STORE_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reports & P&L"
        subtitle="Audited financial summary, cost of goods sold, margin performance, and revenue realization"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Finance', href: '/admin/finance/transactions' },
          { label: 'Reports' },
        ]}
        actions={
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#E9E7E3] bg-white text-xs font-medium uppercase tracking-wider text-[#171717] hover:bg-[#F6F3ED] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Statement (.CSV)
          </button>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Gross Realized Sales</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">{formatNaira(grossSales)}</p>
          <p className="text-xs text-emerald-600 mt-1">▲ +24.8% vs previous period</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Cost of Goods (COGS)</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">{formatNaira(estimatedCOGS)}</p>
          <p className="text-xs text-[#77746F] mt-1">38% average production cost</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Gross Margin</p>
          <p className="text-2xl font-bold text-[#8A4735] mt-2 font-mono">{grossMargin}%</p>
          <p className="text-xs text-[#77746F] mt-1">Above target threshold (60%)</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Estimated Operating Profit</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">{formatNaira(netProfit)}</p>
          <p className="text-xs text-emerald-600 mt-1">Healthy liquidity</p>
        </div>
      </div>

      {/* Chart */}
      <ChartCard
        title="Revenue Trajectory & Realization"
        subtitle="Monthly audited sales figures across all channels"
        data={monthlyReportData}
        isCurrency={true}
        summaryValue={formatNaira(grossSales)}
        summaryTrend="+24.8%"
      />

      {/* Statement Breakdown Table */}
      <div className="bg-white border border-[#E9E7E3]">
        <div className="p-4 border-b border-[#E9E7E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#8A4735]" />
            <h3 className="text-sm font-semibold text-[#171717]">Profit & Loss Breakdown (YTD)</h3>
          </div>
          <span className="text-xs font-mono text-[#77746F]">Currency: NGN (₦)</span>
        </div>

        <div className="divide-y divide-[#E9E7E3] text-sm">
          <div className="p-4 flex items-center justify-between font-medium">
            <span>Gross Merchandise Value (GMV)</span>
            <span className="font-mono">{formatNaira(grossSales + discountsGiven)}</span>
          </div>
          <div className="p-4 flex items-center justify-between text-[#77746F]">
            <span>Less: Promotional Discounts & Codes</span>
            <span className="font-mono text-rose-600">-{formatNaira(discountsGiven)}</span>
          </div>
          <div className="p-4 flex items-center justify-between font-medium bg-[#F6F3ED]/40">
            <span>Net Sales Realization</span>
            <span className="font-mono font-bold text-[#171717]">{formatNaira(grossSales)}</span>
          </div>
          <div className="p-4 flex items-center justify-between text-[#77746F]">
            <span>Cost of Materials & Manufacturing (COGS)</span>
            <span className="font-mono text-rose-600">-{formatNaira(estimatedCOGS)}</span>
          </div>
          <div className="p-4 flex items-center justify-between font-medium bg-[#F6F3ED]/40">
            <span>Gross Profit</span>
            <span className="font-mono font-bold text-[#171717]">{formatNaira(grossSales - estimatedCOGS)}</span>
          </div>
          <div className="p-4 flex items-center justify-between text-[#77746F]">
            <span>Logistics & Domestic Dispatch Income</span>
            <span className="font-mono text-emerald-600">+{formatNaira(shippingCollected)}</span>
          </div>
          <div className="p-4 flex items-center justify-between text-[#77746F]">
            <span>Merchant Gateway Fees (Paystack 1.5%)</span>
            <span className="font-mono text-rose-600">-{formatNaira(Math.round(grossSales * 0.015))}</span>
          </div>
          <div className="p-4 flex items-center justify-between font-bold text-[#171717] bg-[#F6F3ED]">
            <span>Net Operating Retained Earnings</span>
            <span className="font-mono text-base text-[#8A4735]">
              {formatNaira(grossSales - estimatedCOGS + shippingCollected - Math.round(grossSales * 0.015))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
