import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Edit, Eye, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaticPageItem {
  id: string;
  title: string;
  slug: string;
  lastEdited: string;
  summary: string;
  content: string;
}

const STATIC_PAGES: StaticPageItem[] = [
  {
    id: 'page-about',
    title: 'The TOOO Story (About Us)',
    slug: '/about',
    lastEdited: '2026-10-26',
    summary: 'Brand philosophy, architectural proportions, and Lagos atelier origin.',
    content: 'TOOO STORE exists to eliminate the compromise between relaxed streetwear comfort and high architectural tailoring...',
  },
  {
    id: 'page-delivery',
    title: 'Shipping & Delivery Policies',
    slug: '/track-order',
    lastEdited: '2026-10-25',
    summary: '24-48h Lagos dispatch and nationwide express courier SLAs.',
    content: 'All garments are prepped, steamed, and boxed at our Lagos atelier. Orders over ₦100,000 qualify for complimentary delivery...',
  },
  {
    id: 'page-returns',
    title: 'Returns & Exchange Terms',
    slug: '/about#returns',
    lastEdited: '2026-10-22',
    summary: '14-day exchange protocol for unworn garments with original tags intact.',
    content: 'We welcome exchanges within 14 calendar days of confirmed delivery for size adjustments or store credit...',
  },
];

export const PagesContentPage: React.FC = () => {
  const [pages, setPages] = useState<StaticPageItem[]>(STATIC_PAGES);
  const [activePage, setActivePage] = useState<StaticPageItem | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saveMsg, setSaveMsg] = useState(false);

  const handleOpenEdit = (p: StaticPageItem) => {
    setActivePage(p);
    setEditContent(p.content);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage) return;
    setPages(
      pages.map((p) =>
        p.id === activePage.id ? { ...p, content: editContent, lastEdited: 'Just now' } : p
      )
    );
    setActivePage(null);
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Storefront Pages & Editorial Copy"
        subtitle="Manage brand story copy, shipping guidelines, and customer care policy text."
        breadcrumbs={[{ label: 'Storefront' }, { label: 'Pages' }]}
      />

      {saveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          ✓ Page content revisions saved to storefront cache.
        </div>
      )}

      <div className="space-y-4">
        {pages.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#E9E7E3] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-neutral-900">{p.title}</h3>
              <p className="text-xs text-neutral-600">{p.summary}</p>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                <span>Public route: {p.slug}</span>
                <span>·</span>
                <span>Last updated: {p.lastEdited}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={p.slug}
                target="_blank"
                className="p-2 border border-[#E9E7E3] text-neutral-700 hover:text-neutral-900 text-xs"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleOpenEdit(p)}
                className="px-3.5 py-1.5 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Edit Text
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {activePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setActivePage(null)} />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-xl w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Edit Content: {activePage.title}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Body Markdown / Text</label>
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-[#E9E7E3] bg-[#FAF8F5] font-mono leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePage(null)}
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
