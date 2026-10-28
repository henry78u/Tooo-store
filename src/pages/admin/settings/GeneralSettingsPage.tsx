import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Store, Save, Check, Globe, MapPin } from 'lucide-react';
import { StoreSettings } from '../../../types/admin';

export default function GeneralSettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Settings"
        subtitle="Brand identity, physical atelier address, regional currencies, and public contacts"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings/general' },
          { label: 'General' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Brand Information */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E7E3]">
            <Store className="w-4 h-4 text-[#8A4735]" />
            <h3 className="font-semibold text-sm text-[#171717]">Brand Identity & Wordmark</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Primary Wordmark</label>
              <input
                type="text"
                value="TOOO."
                disabled
                className="w-full px-3 py-2 border border-[#E9E7E3] bg-[#F6F3ED] text-sm text-[#77746F] font-serif"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Atelier Physical Details */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E7E3]">
            <MapPin className="w-4 h-4 text-[#8A4735]" />
            <h3 className="font-semibold text-sm text-[#171717]">Atelier & Concierge Contacts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Support Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Concierge Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Atelier Address</label>
              <input
                type="text"
                value={formData.atelierAddress}
                onChange={(e) => setFormData({ ...formData, atelierAddress: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* Regional & Financial Preferences */}
        <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E7E3]">
            <Globe className="w-4 h-4 text-[#8A4735]" />
            <h3 className="font-semibold text-sm text-[#171717]">Currency & Localization</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Base Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-[#E9E7E3] text-sm bg-white"
              >
                <option value="NGN">NGN (₦) — Nigerian Naira</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                disabled
                className="w-full px-3 py-2 border border-[#E9E7E3] bg-[#F6F3ED] text-sm font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#77746F] block mb-1">Timezone</label>
              <input
                type="text"
                value={formData.timezone}
                disabled
                className="w-full px-3 py-2 border border-[#E9E7E3] bg-[#F6F3ED] text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {isSaved && (
            <span className="text-xs text-emerald-700 font-mono inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Store identity successfully saved
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171717] text-white text-xs font-medium uppercase tracking-wider hover:bg-black transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
