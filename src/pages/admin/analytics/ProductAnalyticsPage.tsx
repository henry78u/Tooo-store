import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { MetricCard } from '../../../components/admin/ui/MetricCard';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { Package, Eye, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductAnalyticsPage: React.FC = () => {
  const { products } = useAdminStore();

  const productPerformance = products.map((p, idx) => ({
    ...p,
    views: 450 + idx * 80,
    conversion: `${(2.8 + (idx % 3) * 0.7).toFixed(1)}%`,
    revenueGenerated: p.price * (8 + (idx % 5)),
  })).sort((a, b) => b.revenueGenerated - a.revenueGenerated);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Product & Catalogue Analytics"
        subtitle="Individual garment performance, sell-through velocity, and category volume."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Products' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Top Category by Volume"
          value="Outerwear"
          subtext="₦1,150,000 generated"
          icon={<Package className="w-4 h-4" />}
        />
        <MetricCard
          label="Highest Sell-Through"
          value="Heavyweight Box Tee"
          subtext="82% inventory turned"
          change="+14%"
          changeType="positive"
        />
        <MetricCard
          label="Avg Gross Margin"
          value="64.2%"
          subtext="Across apparel lines"
          changeType="positive"
        />
      </div>

      {/* Performance Table */}
      <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
          Garment Velocity & Margin Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-2">Garment</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Unit Price</th>
                <th className="py-3 px-2">Views</th>
                <th className="py-3 px-2">Conversion</th>
                <th className="py-3 px-2">Revenue Generated</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {productPerformance.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-2 font-medium flex items-center gap-2.5">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-8 aspect-[3/4] object-cover bg-neutral-100"
                    />
                    <span className="text-neutral-900 truncate max-w-[180px]">{p.name}</span>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">{p.category}</td>
                  <td className="py-3 px-2 tabular-nums text-neutral-800">{formatNaira(p.price)}</td>
                  <td className="py-3 px-2 tabular-nums text-neutral-600">{p.views}</td>
                  <td className="py-3 px-2 tabular-nums font-semibold text-emerald-800">{p.conversion}</td>
                  <td className="py-3 px-2 tabular-nums font-bold text-neutral-900">
                    {formatNaira(p.revenueGenerated)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="text-[#8A4735] hover:underline font-semibold"
                    >
                      Manage
                    </Link>
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
