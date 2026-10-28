import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { Edit, Eye, Power, Check, ExternalLink } from 'lucide-react';
import { HomepageSectionConfig } from '../../../types/admin';

export const HomepageEditorPage: React.FC = () => {
  const { homepageSections, updateHomepageSection, toggleHomepageSection } = useAdminStore();
  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);

  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [image, setImage] = useState('');

  const handleEdit = (sec: HomepageSectionConfig) => {
    setEditingSection(sec);
    setHeadline(sec.headline || '');
    setSubheadline(sec.subheadline || '');
    setCtaText(sec.ctaText || '');
    setCtaLink(sec.ctaLink || '');
    setImage(sec.image || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    updateHomepageSection(editingSection.id, {
      headline,
      subheadline,
      ctaText,
      ctaLink,
      image,
    });
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage Section Architecture"
        subtitle="Manage the storytelling flow, editorial photography, and call-to-actions of the live customer storefront."
        breadcrumbs={[{ label: 'Storefront' }, { label: 'Homepage Editor' }]}
        actions={
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E9E7E3] hover:border-neutral-900 text-xs font-semibold text-neutral-800"
          >
            <span>Live Storefront Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        }
      />

      <div className="space-y-4">
        {homepageSections.map((sec, idx) => (
          <div
            key={sec.id}
            className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-neutral-400 font-bold">
                0{idx + 1}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-neutral-900">
                    {sec.name}
                  </h3>
                  <span className="text-neutral-400 text-xs">({sec.title})</span>
                  <StatusBadge status={sec.enabled ? 'Live' : 'Hidden'} showDot />
                </div>
                {sec.headline && (
                  <p className="text-xs font-semibold text-neutral-800">
                    "{sec.headline}"
                  </p>
                )}
                {sec.subheadline && (
                  <p className="text-[11px] text-neutral-500">{sec.subheadline}</p>
                )}
                {sec.ctaText && (
                  <p className="text-[11px] text-[#8A4735] font-medium">
                    CTA: {sec.ctaText} → {sec.ctaLink}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleHomepageSection(sec.id)}
                className={`p-2 border text-xs font-semibold ${
                  sec.enabled
                    ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                }`}
                title={sec.enabled ? 'Hide Section' : 'Show Section'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleEdit(sec)}
                className="px-3 py-1.5 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Edit Section
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingSection(null)} />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-lg w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Edit Section: {editingSection.name}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Primary Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Subheadline / Editorial Copy</label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">CTA Destination Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white font-semibold">
                  Update Homepage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
