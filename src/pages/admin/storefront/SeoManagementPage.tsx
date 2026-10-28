import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Save, Search, Share2 } from 'lucide-react';

export const SeoManagementPage: React.FC = () => {
  const [siteTitle, setSiteTitle] = useState('TOOO STORE — Premium Contemporary Fashion');
  const [metaDesc, setMetaDesc] = useState('Premium contemporary fashion storefront. Modern streetwear, elevated essentials, and refined accessories crafted to be worn and seen.');
  const [keywords, setKeywords] = useState('Nigerian fashion, contemporary streetwear, luxury tailoring, wool overcoats, Lagos fashion brand');
  const [ogImage, setOgImage] = useState('/src/assets/images/hero_campaign_fashion_1793045649561.jpg');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Search Engine Optimization (SEO) & Social Graph"
        subtitle="Configure default search meta headers, OpenGraph share preview cards, and schema indexing."
        breadcrumbs={[{ label: 'Storefront' }, { label: 'SEO' }]}
      />

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          ✓ Meta tags updated for global indexation.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Global Metadata Settings
          </h3>

          <div>
            <label className="font-semibold block mb-1">Default Document Title (&lt;title&gt;)</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
              required
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Character count: {metaDesc.length} (Recommended: 120-160)
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">OpenGraph Social Share Image URL</label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
            />
          </div>
        </div>

        {/* Live Snippet Preview */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-3">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">
            Google Search Preview
          </h4>
          <div className="p-4 bg-[#FAF8F5] border border-[#E9E7E3] max-w-lg space-y-1">
            <span className="text-[11px] text-neutral-500 block">https://tooostore.example</span>
            <div className="text-blue-700 font-semibold text-sm hover:underline cursor-pointer">
              {siteTitle}
            </div>
            <p className="text-neutral-600 text-xs leading-snug">
              {metaDesc}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white font-semibold flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save SEO Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
