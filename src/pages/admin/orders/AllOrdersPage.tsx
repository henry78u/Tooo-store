import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Search, Eye, Filter, CheckCircle2, Truck, Package, Clock } from 'lucide-react';
import { OrderStatus } from '../../../types';

export const AllOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderReference.toLowerCase().includes(search.toLowerCase()) ||
      o.address.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.address.email.toLowerCase().includes(search.toLowerCase()) ||
      o.address.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.deliveryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: OrderStatus[] = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Orders & Fulfillment"
        subtitle={`Total of ${orders.length} orders recorded. Manage tailoring progress, dispatches, and doorstep deliveries.`}
        breadcrumbs={[{ label: 'Orders' }, { label: 'All Orders' }]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E9E7E3] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ref, client name, email, or city..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E9E7E3] px-3 py-1.5 text-xs text-neutral-800"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Order Ref</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Garments Summary</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Fulfillment</th>
                <th className="py-3 px-3 text-right">Quick Transition</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderReference} className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-3 font-bold text-neutral-900 tabular-nums">
                      <Link
                        to={`/admin/orders/${order.orderReference}`}
                        className="hover:text-[#8A4735] hover:underline"
                      >
                        {order.orderReference}
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 text-neutral-500 tabular-nums">{order.date}</td>

                    <td className="py-3.5 px-3 font-medium">
                      <div className="text-neutral-900">{order.address.fullName}</div>
                      <div className="text-[11px] text-neutral-400">
                        {order.address.city}, {order.address.state}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-neutral-600">
                      {order.items.map((i) => `${i.quantity}x ${i.productName} (${i.size})`).join(', ')}
                    </td>

                    <td className="py-3.5 px-3 font-bold tabular-nums text-neutral-900">
                      {formatNaira(order.total)}
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={order.deliveryStatus} showDot />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {order.deliveryStatus === 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.orderReference, 'Processing', 'Garments being prepped in Lagos Atelier')}
                          className="px-2 py-1 bg-white border border-[#E9E7E3] hover:border-neutral-900 text-[10px] font-semibold text-neutral-800"
                        >
                          Start Processing
                        </button>
                      )}
                      {order.deliveryStatus === 'Processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.orderReference, 'Shipped', 'Handed over to courier with live tracking')}
                          className="px-2 py-1 bg-white border border-[#E9E7E3] hover:border-neutral-900 text-[10px] font-semibold text-neutral-800"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.deliveryStatus === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.orderReference, 'Delivered', 'Delivered and confirmed by recipient')}
                          className="px-2 py-1 bg-[#171717] text-white text-[10px] font-semibold"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.deliveryStatus === 'Delivered' && (
                        <span className="text-[11px] text-emerald-700 font-semibold">Completed</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/admin/orders/${order.orderReference}`}
                        className="inline-flex items-center gap-1 text-[#8A4735] hover:underline font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
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
