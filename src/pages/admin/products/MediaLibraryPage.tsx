import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Upload, Trash2, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useAdminStore();
  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const filtered = mediaAssets.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    addMediaAsset({
      name: newName.trim() || 'Lookbook Asset',
      url: newUrl.trim(),
      size: '340 KB',
      dimensions: '1440x1080',
      format: 'JPG',
      usedIn: ['Custom Media Entry'],
    });
    setNewUrl('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atelier Media & Asset Library"
        subtitle="Campaign photography, lookbook cutouts, and editorial imagery catalog."
        breadcrumbs={[{ label: 'Products' }, { label: 'Media Library' }]}
      />

      {/* Upload & Search Bar */}
      <div className="bg-white border border-[#E9E7E3] p-5 space-y-4">
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Asset title (e.g. Overcoat Silhouette Autumn)"
            className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Asset image URL..."
            className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Asset</span>
          </button>
        </form>

        <div className="pt-2 border-t border-[#E9E7E3] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
            />
          </div>
          <span className="text-xs text-neutral-500 tabular-nums">
            {filtered.length} assets cataloged
          </span>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-[#E9E7E3] group flex flex-col justify-between overflow-hidden"
          >
            <div className="aspect-[4/3] bg-[#F6F3ED] overflow-hidden relative">
              <img
                src={asset.url}
                alt={asset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => deleteMediaAsset(asset.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-neutral-700 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 text-xs space-y-1 bg-white">
              <span className="font-semibold text-neutral-900 block truncate">{asset.name}</span>
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>
              <div className="text-[10px] text-neutral-500 truncate pt-1 border-t border-[#E9E7E3]">
                Used in: {asset.usedIn.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
