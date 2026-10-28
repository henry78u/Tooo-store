import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Plus, Megaphone, Eye, MousePointerClick, Calendar } from 'lucide-react';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const CampaignsPage: React.FC = () => {
  const { campaigns, addCampaign } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkedCollection, setLinkedCollection] = useState('Architectural Tailoring');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCampaign({
      title,
      description,
      image: campaigns[0]?.image || '',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      linkedCollection,
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Campaigns & Drops"
        subtitle="Schedule lookbook launches, track organic clickthroughs, and coordinate capsule debuts."
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Campaigns' }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch Campaign</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-white border border-[#E9E7E3] overflow-hidden flex flex-col justify-between">
            <div className="aspect-[16/9] bg-[#F6F3ED] overflow-hidden relative">
              <img
                src={camp.image}
                alt={camp.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={camp.status} showDot />
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A4735]">
                  Linked: {camp.linkedCollection}
                </span>
                <h3 className="font-display font-bold text-lg text-neutral-900 mt-1">
                  {camp.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {camp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E9E7E3] grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Eye className="w-4 h-4 text-neutral-400" />
                  <span>
                    <strong className="text-neutral-900 tabular-nums">{camp.impressions.toLocaleString()}</strong> views
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <MousePointerClick className="w-4 h-4 text-neutral-400" />
                  <span>
                    <strong className="text-neutral-900 tabular-nums">{camp.clicks.toLocaleString()}</strong> clicks
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-md w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Launch Campaign Drop
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Associated Collection</label>
                <input
                  type="text"
                  value={linkedCollection}
                  onChange={(e) => setLinkedCollection(e.target.value)}
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
                  Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
