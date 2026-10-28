import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { useAdminStore } from '../../../store/useAdminStore';
import { Truck, Search, Filter, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderStatus } from '../../../types';

export default function DeliveriesPage() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [courierFilter, setCourierFilter] = useState<'all' | 'GIG Logistics' | 'DHL Express' | 'Lagos Express'>('all');

  // Derive delivery assignments from orders
  const deliveryList = orders.map((order, idx) => {
    const couriers = ['GIG Logistics', 'DHL Express', 'Lagos Express'] as const;
    const assignedCourier = couriers[idx % couriers.length];
    const trackingCode = `TOO-${assignedCourier.slice(0, 3).toUpperCase()}-${1000 + idx * 83}`;
    return {
      orderReference: order.orderReference,
      customerName: order.address.fullName,
      customerPhone: order.address.phone,
      cityState: `${order.address.city}, ${order.address.state}`,
      address: order.address.street,
      courier: assignedCourier,
      trackingNumber: trackingCode,
      status: order.deliveryStatus,
      date: order.date,
      itemsCount: order.items.reduce((s, i) => s + i.quantity, 0),
    };
  });

  const filtered = deliveryList.filter((item) => {
    const matchesSearch =
      item.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cityState.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourier = courierFilter === 'all' || item.courier === courierFilter;
    return matchesSearch && matchesCourier;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Dispatch"
        subtitle="Track domestic courier dispatches, waybills, and last-mile fulfillment across Nigeria"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Shipping', href: '/admin/shipping/deliveries' },
          { label: 'Deliveries' },
        ]}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">In Transit</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">
            {deliveryList.filter((d) => d.status === 'Shipped' || d.status === 'Processing').length}
          </p>
          <p className="text-xs text-[#77746F] mt-1">Active domestic shipments</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Delivered (30d)</p>
          <p className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            {deliveryList.filter((d) => d.status === 'Delivered').length}
          </p>
          <p className="text-xs text-[#77746F] mt-1">100% on-time fulfillment rate</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Avg Dispatch Lag</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">1.2 Days</p>
          <p className="text-xs text-[#77746F] mt-1">From order confirmation</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Primary Partner</p>
          <p className="text-2xl font-bold text-[#8A4735] mt-2 font-mono">GIG / DHL</p>
          <p className="text-xs text-[#77746F] mt-1">Waybill API connected</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#E9E7E3]">
        <div className="p-4 border-b border-[#E9E7E3] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77746F]" />
            <input
              type="text"
              placeholder="Search tracking #, order, customer, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#77746F]" />
            {(['all', 'GIG Logistics', 'DHL Express', 'Lagos Express'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCourierFilter(c)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  courierFilter === c ? 'bg-[#171717] text-white' : 'bg-[#F6F3ED] text-[#77746F] hover:text-[#171717]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#F6F3ED]/40 text-xs text-[#77746F] font-mono uppercase">
                <th className="py-3 px-4">Waybill / Tracking</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Courier</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((item) => (
                <tr key={item.orderReference} className="hover:bg-[#F6F3ED]/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-medium text-[#171717] block">{item.trackingNumber}</span>
                    <span className="text-xs text-[#77746F]">{item.itemsCount} garments</span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${item.orderReference}`}
                      className="font-mono text-[#8A4735] hover:underline"
                    >
                      {item.orderReference}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717]">
                      <Truck className="w-3.5 h-3.5 text-[#77746F]" />
                      {item.courier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#171717]">{item.cityState}</p>
                    <p className="text-xs text-[#77746F] truncate max-w-xs">{item.address}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[#171717] font-medium">{item.customerName}</p>
                    <p className="text-xs text-[#77746F] font-mono">{item.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status !== 'Delivered' ? (
                      <button
                        onClick={() => updateOrderStatus(item.orderReference, 'Delivered')}
                        className="text-xs px-2.5 py-1 border border-[#E9E7E3] hover:border-[#171717] font-mono uppercase text-[#171717] transition-colors"
                      >
                        Confirm Delivery
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-mono inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Confirmed
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
}
