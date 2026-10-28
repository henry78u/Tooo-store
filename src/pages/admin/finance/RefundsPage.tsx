import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { CheckCircle2, Search, Filter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RefundRecord } from '../../../types/admin';

export default function RefundsPage() {
  const { refundRequests, approveRefund } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = refundRequests.filter((item: RefundRecord) => {
    const matchesSearch =
      item.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refundReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRefundAmount = refundRequests.reduce((acc: number, curr: RefundRecord) => acc + curr.amount, 0);
  const pendingRefunds = refundRequests.filter((r: RefundRecord) => r.status === 'Processing');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Requests"
        subtitle="Manage customer refund authorizations and exchange reconciliations with verified atelier auditing"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Finance', href: '/admin/finance/transactions' },
          { label: 'Refunds' },
        ]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Pending Review</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">{pendingRefunds.length}</p>
          <p className="text-xs text-[#77746F] mt-1">Requires garment return confirmation</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Total Value Processed</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">{formatNaira(totalRefundAmount)}</p>
          <p className="text-xs text-[#77746F] mt-1">All processed refund requests</p>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-5">
          <p className="text-xs uppercase tracking-wider text-[#77746F] font-mono">Policy Window</p>
          <p className="text-2xl font-bold text-[#171717] mt-2 font-mono">14 Days</p>
          <p className="text-xs text-[#77746F] mt-1">From delivery confirmation date</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white border border-[#E9E7E3]">
        <div className="p-4 border-b border-[#E9E7E3] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77746F]" />
            <input
              type="text"
              placeholder="Search refund ref, order ref or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#77746F]" />
            {['all', 'Processing', 'Approved', 'Completed', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  statusFilter === status
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#F6F3ED] text-[#77746F] hover:text-[#171717]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#F6F3ED]/40 text-xs text-[#77746F] font-mono uppercase">
                <th className="py-3 px-4">Refund Ref</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-[#77746F]">
                    No refund requests found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item: RefundRecord) => (
                  <tr key={item.id} className="hover:bg-[#F6F3ED]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#171717]">{item.refundReference}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/orders/${item.orderReference}`}
                        className="font-mono text-[#8A4735] hover:underline inline-flex items-center gap-1"
                      >
                        {item.orderReference}
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#171717]">{item.customerName}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#77746F] max-w-xs">{item.reason}</td>
                    <td className="py-3 px-4 text-xs font-mono text-[#77746F]">
                      {new Date(item.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#171717]">
                      {formatNaira(item.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status === 'Processing' ? (
                        <button
                          onClick={() => approveRefund(item.refundReference)}
                          className="px-2.5 py-1 text-xs font-mono uppercase bg-[#171717] text-white hover:bg-black transition-colors"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[#77746F]">{item.status}</span>
                      )}
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
}
