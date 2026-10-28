import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ExternalLink,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { MetricCard } from '../../../components/admin/ui/MetricCard';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { ChartCard } from '../../../components/admin/ui/ChartCard';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, orders, customers, returnRequests, lowStockThreshold } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 1850000; // includes past batch
  const totalOrdersCount = orders.length + 38;
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);
  const lowStockItems = products.filter((p) => p.stock <= lowStockThreshold);
  const pendingOrders = orders.filter((o) => o.deliveryStatus === 'Confirmed' || o.deliveryStatus === 'Processing');

  const chartData = [
    { label: 'Oct 01', value: 240000 },
    { label: 'Oct 05', value: 410000 },
    { label: 'Oct 10', value: 320000 },
    { label: 'Oct 15', value: 580000 },
    { label: 'Oct 20', value: 690000 },
    { label: 'Oct 24', value: 820000 },
    { label: 'Oct 27', value: 940000 },
  ];

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <PageHeader
        title="Business Overview"
        subtitle="Atelier real-time sales performance, active order status, and inventory tracking."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products/new"
              className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/admin/marketing/discounts"
              className="bg-white hover:bg-[#F6F3ED] border border-[#E9E7E3] text-neutral-800 text-xs font-semibold px-3.5 py-2 transition-colors"
            >
              Create Discount
            </Link>
            <Link
              to="/admin/storefront/homepage"
              className="bg-white hover:bg-[#F6F3ED] border border-[#E9E7E3] text-neutral-800 text-xs font-semibold px-3.5 py-2 transition-colors"
            >
              Edit Homepage
            </Link>
          </div>
        }
      />

      {/* Operational Alerts Banner if needed */}
      {(lowStockItems.length > 0 || pendingOrders.length > 0 || returnRequests.length > 0) && (
        <div className="bg-[#FAF8F5] border border-[#E9E7E3] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8A4735]/10 text-[#8A4735]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-neutral-900 block">
                Operational Attention Required
              </span>
              <p className="text-xs text-neutral-600">
                {pendingOrders.length} orders awaiting fulfillment dispatch · {lowStockItems.length} silhouettes at or below minimum reserve · {returnRequests.length} return review
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#8A4735] hover:underline"
            >
              Fulfill Orders →
            </Link>
          </div>
        </div>
      )}

      {/* Primary KPI Cards Grid with title, value, trend, and optional comparison data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Revenue Card */}
        <MetricCard
          title="Total Gross Revenue"
          value={formatNaira(totalRevenue)}
          trend={{
            value: '+18.4%',
            isPositive: true,
            label: 'vs last 30 days',
          }}
          comparisonData={{
            label: 'Prior Period',
            value: formatNaira(Math.round(totalRevenue * 0.845)),
            period: '30-day baseline',
          }}
          icon={<DollarSign className="w-4 h-4 text-[#8A4735]" />}
          linkTo="/admin/analytics/sales"
          linkText="Sales Report"
        />

        {/* 2. Orders Card */}
        <MetricCard
          title="Total Orders"
          value={totalOrdersCount}
          trend={{
            value: '+12.5%',
            isPositive: true,
            label: 'vs last month',
          }}
          comparisonData={{
            label: 'Prior Period',
            value: `${totalOrdersCount - 16} orders`,
            period: 'MoM',
          }}
          icon={<ShoppingBag className="w-4 h-4 text-[#8A4735]" />}
          linkTo="/admin/orders"
          linkText="All Orders"
        />

        {/* 3. Conversion Rate Card */}
        <MetricCard
          title="Store Conversion Rate"
          value="3.42%"
          trend={{
            value: '+0.85%',
            isPositive: true,
            label: 'vs prior 30d',
          }}
          comparisonData={{
            label: 'Industry Avg',
            value: '2.10%',
            period: 'Benchmark',
          }}
          icon={<TrendingUp className="w-4 h-4 text-[#8A4735]" />}
          linkTo="/admin/analytics/sales"
          linkText="Funnel Details"
        />

        {/* 4. Daily Active Users (DAU) Card */}
        <MetricCard
          title="Daily Active Users"
          value="1,248"
          trend={{
            value: '+22.4%',
            isPositive: true,
            label: 'vs yesterday',
          }}
          comparisonData={{
            label: 'Yesterday',
            value: '1,019 users',
            period: '7d avg: 1,140',
          }}
          icon={<Users className="w-4 h-4 text-[#8A4735]" />}
          linkTo="/admin/analytics/customers"
          linkText="Audience Intel"
        />
      </div>

      {/* Secondary Operational Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase font-mono">Average Order Value</span>
          <div className="text-xl font-display font-bold text-neutral-900 mt-1 tabular-nums">{formatNaira(avgOrderValue)}</div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">▲ +5.1% basket size</span>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase font-mono">In Stock Silhouettes</span>
          <div className="text-xl font-display font-bold text-neutral-900 mt-1 tabular-nums">{products.length} styles</div>
          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">Across all capsules</span>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase font-mono">Pending Fulfilment</span>
          <div className="text-xl font-display font-bold text-[#8A4735] mt-1 tabular-nums">{pendingOrders.length} orders</div>
          <span className="text-[10px] text-amber-700 font-mono mt-0.5 block">Awaiting dispatch</span>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase font-mono">Low Stock Alerts</span>
          <div className="text-xl font-display font-bold text-amber-700 mt-1 tabular-nums">{lowStockItems.length} variants</div>
          <span className="text-[10px] text-rose-700 font-mono mt-0.5 block">Below reorder point</span>
        </div>
      </div>

      {/* Sales Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <ChartCard
            title="Revenue Trajectory (NGN)"
            subtitle="Gross daily and weekly sales collected across Nigerian online and atelier orders."
            data={chartData}
            summaryValue={formatNaira(totalRevenue)}
            summaryTrend="+18.4% vs previous cycle"
          />
        </div>

        {/* Bestselling Products Column */}
        <div className="lg:col-span-4 bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
            <div>
              <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-wider block">
                Top Performers
              </span>
              <h3 className="font-display font-bold text-base text-neutral-900">
                Bestselling Garments
              </h3>
            </div>
            <Link to="/admin/analytics/products" className="text-xs text-[#8A4735] hover:underline font-medium">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#E9E7E3]">
            {bestSellers.map((prod) => (
              <div key={prod.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-12 aspect-[3/4] object-cover bg-neutral-100 border border-[#E9E7E3] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/products/${prod.id}/edit`}
                    className="font-medium text-xs text-neutral-900 hover:text-[#8A4735] truncate block"
                  >
                    {prod.name}
                  </Link>
                  <span className="text-[11px] text-neutral-500 block">
                    {prod.category} · {formatNaira(prod.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-900 tabular-nums block">
                    {prod.stock} left
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                    High Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
          <div>
            <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-wider block">
              Fulfilment Queue
            </span>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Recent Customer Orders
            </h3>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-neutral-800 hover:text-[#8A4735] flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-2">Order Ref</th>
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Total Amount</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2">Fulfillment</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3] text-neutral-800">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.orderReference} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-2 font-bold text-neutral-900 tabular-nums">
                    {order.orderReference}
                  </td>
                  <td className="py-3.5 px-2 font-medium">
                    <div>{order.address.fullName}</div>
                    <div className="text-[11px] text-neutral-400">{order.address.state}</div>
                  </td>
                  <td className="py-3.5 px-2 text-neutral-500 tabular-nums">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-2 tabular-nums">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} pieces
                  </td>
                  <td className="py-3.5 px-2 font-bold tabular-nums text-neutral-900">
                    {formatNaira(order.total)}
                  </td>
                  <td className="py-3.5 px-2">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-2">
                    <StatusBadge status={order.deliveryStatus} showDot />
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link
                      to={`/admin/orders/${order.orderReference}`}
                      className="inline-flex items-center gap-1 text-[#8A4735] hover:underline font-semibold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
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
