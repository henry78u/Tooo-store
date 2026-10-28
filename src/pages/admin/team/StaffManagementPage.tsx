import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Shield, UserPlus, Check, X } from 'lucide-react';
import { AdminUser, AdminRole } from '../../../types/admin';

export default function StaffManagementPage() {
  const { staffList, currentStaff, loginAsStaff, addStaffMember } = useAdminStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Store Manager' as AdminRole,
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    addStaffMember({
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'Active',
    });

    setIsInviteOpen(false);
    setNewStaff({ name: '', email: '', role: 'Store Manager' });
  };

  const rolePermissions: Record<AdminRole, string[]> = {
    'Owner': ['Full Root Access', 'Financial Audits', 'Staff Permissions', 'Payment Gateways', 'Storefront CMS', 'Inventory Control'],
    'Administrator': ['Catalog Editing', 'Inventory Control', 'Order Processing', 'Customer Support', 'Marketing Campaigns'],
    'Store Manager': ['Inventory Control', 'Order Fulfillment', 'Customer Care', 'Promotions'],
    'Fulfilment Staff': ['Order Picking & Packing', 'Waybill Printing', 'Delivery Dispatch', 'Return Inspections'],
    'Support Staff': ['Customer Inquiries', 'Concierge Chat', 'Exchange Requests'],
    'Analyst': ['Sales Analytics', 'Performance Audits', 'Export CSV Reports'],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Permissions"
        subtitle="Manage atelier personnel, role-based access control, and team authorization keys"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Team', href: '/admin/team/staff' },
          { label: 'Staff' },
        ]}
        actions={
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] text-white text-xs font-medium uppercase tracking-wider hover:bg-black transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite Staff Member
          </button>
        }
      />

      {/* Roster Table */}
      <div className="bg-white border border-[#E9E7E3]">
        <div className="p-4 border-b border-[#E9E7E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8A4735]" />
            <h3 className="text-sm font-semibold text-[#171717]">Authorized Atelier Staff ({staffList.length})</h3>
          </div>
          <span className="text-xs text-[#77746F]">Role-Based Access Control Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#F6F3ED]/40 text-xs text-[#77746F] font-mono uppercase">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Permissions Overview</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Switch Active Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {staffList.map((member: AdminUser) => {
                const isCurrent = currentStaff.id === member.id;
                return (
                  <tr key={member.id} className="hover:bg-[#F6F3ED]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#E9E7E3]"
                        />
                        <div>
                          <p className="font-medium text-[#171717] flex items-center gap-1.5">
                            {member.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-[#171717] text-white px-1.5 py-0.2 font-mono uppercase">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#77746F]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono font-medium text-[#8A4735] uppercase">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {rolePermissions[member.role]?.map((perm, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono bg-[#F6F3ED] text-[#77746F] px-1.5 py-0.5 border border-[#E9E7E3]"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#77746F]">
                      {member.lastActive}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                          member.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-xs font-mono text-[#77746F] inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Profile
                        </span>
                      ) : (
                        <button
                          onClick={() => loginAsStaff(member.role)}
                          className="text-xs px-2.5 py-1 border border-[#E9E7E3] hover:border-[#171717] font-mono uppercase text-[#171717] transition-colors"
                        >
                          Simulate User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E9E7E3] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E7E3] pb-3">
              <h3 className="font-semibold text-base text-[#171717]">Authorize New Staff Member</h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-[#77746F] hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tunde Adebayo"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@tooo-store.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Staff Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717] bg-white"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Fulfilment Staff">Fulfilment Staff</option>
                  <option value="Support Staff">Support Staff</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Owner">Co-Owner</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-[#E9E7E3] text-xs font-mono uppercase text-[#77746F] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171717] text-white text-xs font-medium uppercase tracking-wider hover:bg-black"
                >
                  Send Access Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
