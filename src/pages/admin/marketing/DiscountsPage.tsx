import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Plus, Tag, Trash2, Check, Power } from 'lucide-react';
import { DiscountCode } from '../../../types/admin';

export const DiscountsPage: React.FC = () => {
  const { discounts, addDiscount, toggleDiscount, deleteDiscount } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(40000);
  const [usageLimit, setUsageLimit] = useState<number>(200);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addDiscount({
      code: code.trim().toUpperCase(),
      type,
      value,
      minOrderValue,
      usageLimit,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });

    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Discounts & Privileges"
        subtitle="Manage seasonal voucher codes, percentage deductions, and minimum purchase rules."
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Discounts' }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Discount</span>
          </button>
        }
      />

      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Voucher Code</th>
                <th className="py-3 px-3">Discount Value</th>
                <th className="py-3 px-3">Min Order Value</th>
                <th className="py-3 px-3">Usage Ratio</th>
                <th className="py-3 px-3">Active Period</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 font-bold text-neutral-900 font-mono tracking-wider flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#8A4735]" />
                    <span>{d.code}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-800 tabular-nums">
                    {d.type === 'percentage' ? `${d.value}% Off` : `${formatNaira(d.value)} Flat`}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-700">
                    {formatNaira(d.minOrderValue)}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-600">
                    {d.usageCount} / {d.usageLimit || '∞'} used
                  </td>
                  <td className="py-3 px-3 text-neutral-500">
                    {d.startDate} {d.expiryDate ? `→ ${d.expiryDate}` : ''}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={d.isActive ? 'Active' : 'Inactive'} showDot />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleDiscount(d.id)}
                        className={`p-1.5 border ${
                          d.isActive ? 'border-neutral-300 text-neutral-700' : 'border-emerald-500 text-emerald-700'
                        }`}
                        title={d.isActive ? 'Disable Code' : 'Enable Code'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDiscount(d.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-700 border border-[#E9E7E3]"
                        title="Delete Code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-md w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Create Promotional Discount
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Code (Uppercase)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TOOO20"
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5] uppercase font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    Value {type === 'percentage' ? '(%)' : '(₦)'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5] font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Minimum Order Value (NGN ₦)</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white font-semibold">
                  Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
