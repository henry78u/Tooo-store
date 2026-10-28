import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Save, ExternalLink } from 'lucide-react';

export const NavigationFooterPage: React.FC = () => {
  const { settings, updateSettings } = useAdminStore();

  const [instagram, setInstagram] = useState(settings.instagramUrl);
  const [tiktok, setTiktok] = useState(settings.tiktokUrl);
  const [supportEmail, setSupportEmail] = useState(settings.contactEmail);
  const [atelierAddress, setAtelierAddress] = useState(settings.atelierAddress);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      instagramUrl: instagram,
      tiktokUrl: tiktok,
      contactEmail: supportEmail,
      atelierAddress,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Navigation & Global Footer Channels"
        subtitle="Manage public link directories, social media profiles, and atelier contact addresses."
        breadcrumbs={[{ label: 'Storefront' }, { label: 'Navigation' }]}
      />

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Main Nav Tree */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Top Navigation Header Links
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Shop', path: '/shop' },
              { label: 'New Arrivals', path: '/shop?sort=newest' },
              { label: 'Collections', path: '/collections' },
              { label: 'The Story', path: '/about' },
            ].map((link, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E9E7E3]">
                <span className="font-semibold text-neutral-900">{link.label}</span>
                <span className="font-mono text-neutral-500">{link.path}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-400">
            Note: Top navigation adheres to the strict 1-row, 3-zone brand contract.
          </p>
        </div>

        {/* Footer Channels & Addresses */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Footer Social & Atelier Presence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">TikTok Profile URL</label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Official Client Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Physical Atelier Address</label>
            <textarea
              rows={2}
              value={atelierAddress}
              onChange={(e) => setAtelierAddress(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E9E7E3]">
            {savedSuccess ? (
              <span className="text-emerald-700 font-semibold text-xs">
                ✓ Navigation settings updated successfully.
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white font-semibold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Footer Configurations</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
