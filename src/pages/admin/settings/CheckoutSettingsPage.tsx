import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { CreditCard, Save, Check, Building2, ShieldCheck, Mail } from 'lucide-react';

export default function CheckoutSettingsPage() {
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [requirePhoneNumber, setRequirePhoneNumber] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Access Bank Nigeria PLC',
    accountNumber: '1098452391',
    accountName: 'TOOO STORE APPAREL NIGERIA LTD',
    instructions: 'Please use your Order Number (e.g. TOO-8841) as the transfer narration for swift verification.',
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checkout & Payment Rules"
        subtitle="Manage customer checkout flow, guest checkout permissions, and direct bank transfer instructions"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings/general' },
          { label: 'Checkout' },
        ]}
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Customer Account Rules */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E7E3]">
            <ShieldCheck className="w-4 h-4 text-[#8A4735]" />
            <h3 className="font-semibold text-sm text-[#171717]">Customer Access & Contact Rules</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowGuestCheckout}
                onChange={(e) => setAllowGuestCheckout(e.target.checked)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-[#171717]">Enable Guest Checkout</p>
                <p className="text-xs text-[#77746F]">
                  Allows customers to complete purchases without having to create an account beforehand.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePhoneNumber}
                onChange={(e) => setRequirePhoneNumber(e.target.checked)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-[#171717]">Require Recipient Phone Number</p>
                <p className="text-xs text-[#77746F]">
                  Required for domestic dispatch riders and courier waybill generation.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Nigerian Direct Bank Transfer Settings */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#8A4735]" />
              <h3 className="font-semibold text-sm text-[#171717]">Direct NIP Bank Transfer (Nigeria)</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bankTransferEnabled}
                onChange={(e) => setBankTransferEnabled(e.target.checked)}
              />
              <span className="text-xs font-mono uppercase text-[#77746F]">Accept Bank Transfers</span>
            </label>
          </div>

          {bankTransferEnabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Financial Institution</label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Account Number (NUBAN)</label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E9E7E3] text-sm font-mono focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Account Beneficiary Name</label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">
                    Customer Payment Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bankDetails.instructions}
                    onChange={(e) => setBankDetails({ ...bankDetails, instructions: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Notifications */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E7E3]">
            <Mail className="w-4 h-4 text-[#8A4735]" />
            <h3 className="font-semibold text-sm text-[#171717]">Order Receipts & Notifications</h3>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[#77746F]">
              All customers automatically receive a branded receipt email upon checkout confirmation with their waybill tracking link and atelier contact info.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {isSaved && (
            <span className="text-xs text-emerald-700 font-mono inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Checkout preferences updated
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171717] text-white text-xs font-medium uppercase tracking-wider hover:bg-black transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Rules
          </button>
        </div>
      </form>
    </div>
  );
}
