import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Plus, Trash2, Edit, Check } from 'lucide-react';
import { AdminCollection } from '../../../types/admin';

export const CollectionsPage: React.FC = () => {
  const { collections, addCollection, updateCollection, deleteCollection } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<AdminCollection | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setEditingCol(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: AdminCollection) => {
    setEditingCol(col);
    setTitle(col.title);
    setSubtitle(col.subtitle);
    setDescription(col.description);
    setImage(col.image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCol) {
      updateCollection(editingCol.id, {
        title,
        subtitle,
        description,
        image: image || editingCol.image,
      });
    } else {
      addCollection({
        title,
        subtitle,
        description,
        image: image || collections[0]?.image || '',
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        piecesCount: 5,
        isFeatured: true,
        status: 'Active',
        productIds: [],
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curated Seasonal Collections"
        subtitle="Capsules, lookbook edits, and thematic drops for seasonal storytelling."
        breadcrumbs={[{ label: 'Products' }, { label: 'Collections' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </button>
        }
      />

      <div className="space-y-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white border border-[#E9E7E3] grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 sm:p-6"
          >
            <div className="md:col-span-4 aspect-[16/10] bg-[#F6F3ED] overflow-hidden">
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A4735]">
                    {col.piecesCount} Pieces · {col.status}
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-neutral-900 mt-0.5">
                    {col.title}
                  </h3>
                  <p className="text-xs font-medium text-neutral-700 mt-1">{col.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 border border-[#E9E7E3]"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection ${col.title}?`)) deleteCollection(col.id);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-700 border border-[#E9E7E3]"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                {col.description}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-neutral-500">
                <span>Slug: <code className="bg-[#FAF8F5] px-1 py-0.5 border">/{col.slug}</code></span>
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
              {editingCol ? 'Edit Collection' : 'Create Collection'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                />
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white font-semibold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
