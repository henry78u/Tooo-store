import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Search, User, Mail, Phone, MapPin, Eye, X, Tag } from 'lucide-react';
import { CustomerProfile } from '../../../types/admin';

export const AllCustomersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, orders } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(id || null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerOrders = activeCustomer
    ? orders.filter((o) => o.address.email.toLowerCase() === activeCustomer.email.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Directory & Profiles"
        subtitle={`Total of ${customers.length} registered patrons and VIP atelier clients.`}
        breadcrumbs={[{ label: 'Customers' }, { label: 'All Clients' }]}
      />

      {/* Filter and Search */}
      <div className="bg-white border border-[#E9E7E3] p-4 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, city, or tag..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <span className="text-xs text-neutral-500 tabular-nums">
          {filtered.length} clients matching
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Orders Count</th>
                <th className="py-3 px-3">Lifetime Spend</th>
                <th className="py-3 px-3">Last Order</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Tags</th>
                <th className="py-3 px-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-neutral-900 block">{c.name}</span>
                    <span className="text-neutral-500 text-[11px]">{c.email}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-700">
                    {c.city}, {c.state}
                  </td>
                  <td className="py-3 px-3 tabular-nums font-medium text-neutral-800">
                    {c.totalOrders}
                  </td>
                  <td className="py-3 px-3 tabular-nums font-bold text-neutral-900">
                    {formatNaira(c.totalSpent)}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-500">{c.lastOrderDate}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} showDot />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 border border-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedCustomerId(c.id)}
                      className="inline-flex items-center gap-1 text-[#8A4735] hover:underline font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Slide-over Drawer / Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedCustomerId(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full z-10 shadow-2xl flex flex-col overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#E9E7E3]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A4735]">
                  Client Dossier
                </span>
                <h3 className="font-display font-bold text-xl text-neutral-900">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{activeCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E7E3]">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Spent</span>
                <div className="font-display font-bold text-base text-neutral-900 mt-0.5 tabular-nums">
                  {formatNaira(activeCustomer.totalSpent)}
                </div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E7E3]">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Orders Placed</span>
                <div className="font-display font-bold text-base text-neutral-900 mt-0.5 tabular-nums">
                  {activeCustomer.totalOrders}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-[#E9E7E3]">
                Contact & Delivery
              </h4>
              <p className="flex items-center gap-2 text-neutral-700">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{activeCustomer.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-neutral-700">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{activeCustomer.city}, {activeCustomer.state}</span>
              </p>
              {activeCustomer.notes && (
                <div className="p-3 bg-amber-50/50 border border-amber-200 text-neutral-700">
                  <strong>Atelier Notes:</strong> {activeCustomer.notes}
                </div>
              )}
            </div>

            {/* Past orders */}
            <div className="space-y-3 text-xs flex-1">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-[#E9E7E3]">
                Order History ({customerOrders.length})
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-neutral-400 italic">No recent storefront orders.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((o) => (
                    <div key={o.orderReference} className="p-2.5 border border-[#E9E7E3] bg-[#FAF8F5] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900 block">{o.orderReference}</span>
                        <span className="text-[11px] text-neutral-500">{o.date} · {o.items.length} items</span>
                      </div>
                      <span className="font-bold tabular-nums text-neutral-900">{formatNaira(o.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
