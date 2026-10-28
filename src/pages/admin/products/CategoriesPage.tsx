import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Plus, Trash2, Edit, Check, Eye } from 'lucide-react';
import { AdminCategory } from '../../../types/admin';
import { ProductCategory } from '../../../types';

export const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState<ProductCategory>('Outerwear');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setTitle('');
    setCategoryName('Outerwear');
    setDescription('');
    setImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setCategoryName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        title,
        name: categoryName,
        description,
        image: image || editingCategory.image,
      });
    } else {
      addCategory({
        title,
        name: categoryName,
        description,
        itemCount: 4,
        image: image || categories[0]?.image || '',
        slug: categoryName.toLowerCase(),
        isPublished: true,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Manage product categories, visual photography cards, and taxonomy routing."
        breadcrumbs={[{ label: 'Products' }, { label: 'Categories' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-[#E9E7E3] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/9] bg-[#F6F3ED] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8D0C5] block">
                  {cat.name}
                </span>
                <h3 className="font-display font-semibold text-base">{cat.title}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-neutral-600 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-3 border-t border-[#E9E7E3] flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">{cat.itemCount} pieces</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 text-neutral-600 hover:text-neutral-900"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${cat.title}?`)) deleteCategory(cat.id);
                    }}
                    className="p-1 text-neutral-400 hover:text-rose-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              {editingCategory ? 'Edit Category' : 'Create Category'}
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
                <label className="font-semibold block mb-1">Taxonomy Key</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value as ProductCategory)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Sets">Sets</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                </select>
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
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
                  placeholder="Leave blank to preserve current"
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
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#171717] text-white font-semibold"
                >
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
