import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Edit, Check, Power, ExternalLink } from 'lucide-react';
import { PromoBanner } from '../../../types/admin';

export const BannersPage: React.FC = () => {
  const { promoBanners, updatePromoBanner } = useAdminStore();
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  const [text, setText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleEdit = (banner: PromoBanner) => {
    setEditingBanner(banner);
    setText(banner.text);
    setLinkText(banner.linkText);
    setLinkUrl(banner.linkUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    updatePromoBanner(editingBanner.id, {
      text,
      linkText,
      linkUrl,
    });
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Banners & Header Announcements"
        subtitle="Manage the rotating announcements rendered at the very top of the customer-facing storefront."
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Banners' }]}
      />

      <div className="space-y-4">
        {promoBanners.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A4735]">
                  Announcement #{b.priority}
                </span>
                <StatusBadge status={b.isActive ? 'Active' : 'Inactive'} showDot />
              </div>
              <p className="font-semibold text-sm text-neutral-900 leading-snug">{b.text}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                <span>Call to Action: <strong>{b.linkText}</strong></span>
                <span>·</span>
                <span>Destination: <code className="bg-[#FAF8F5] px-1">{b.linkUrl}</code></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updatePromoBanner(b.id, { isActive: !b.isActive })}
                className={`p-2 border text-xs font-semibold ${
                  b.isActive
                    ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                }`}
                title={b.isActive ? 'Pause' : 'Activate'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleEdit(b)}
                className="px-3 py-1.5 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Edit Content
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingBanner(null)} />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-md w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Edit Promotional Strip
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Headline Text</label>
                <textarea
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Link CTA Label</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Target URL</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white font-semibold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
