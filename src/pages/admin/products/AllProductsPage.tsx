import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  Star,
  Sparkles,
  CheckSquare,
  Square,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { ProductCategory, Product } from '../../../types';

export const AllProductsPage: React.FC = () => {
  const { products, deleteProduct, duplicateProduct, toggleProductStatus } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'inStock' | 'lowStock' | 'outOfStock'>('All');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'inStock') matchesStock = p.stock > 5;
      else if (stockFilter === 'lowStock') matchesStock = p.stock > 0 && p.stock <= 5;
      else if (stockFilter === 'outOfStock') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    setSelectedProductIds((prev) => prev.filter((i) => i !== id));
  };

  const categories: ProductCategory[] = ['Outerwear', 'Sets', 'Tops', 'Bottoms', 'Accessories'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Garments & Products"
        subtitle={`Managing ${products.length} catalog items across streetwear, tailoring, and atelier essentials.`}
        breadcrumbs={[{ label: 'Products' }, { label: 'Catalogue' }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products/new"
              className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E9E7E3] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, category, or slug..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#E9E7E3] px-3 py-2 text-neutral-800 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter Dropdown */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-white border border-[#E9E7E3] px-3 py-2 text-neutral-800 focus:outline-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="inStock">In Stock (&gt; 5)</option>
            <option value="lowStock">Low Stock (1-5)</option>
            <option value="outOfStock">Out of Stock (0)</option>
          </select>

          {/* Bulk actions */}
          {selectedProductIds.length > 0 && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E9E7E3]">
              <span className="text-[11px] font-bold text-[#8A4735]">
                {selectedProductIds.length} selected
              </span>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedProductIds.length} selected items?`)) {
                    selectedProductIds.forEach((id) => deleteProduct(id));
                    setSelectedProductIds([]);
                  }
                }}
                className="text-xs text-rose-700 hover:underline font-semibold"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3 w-8">
                  <button onClick={toggleSelectAll} className="p-0.5 text-neutral-500">
                    {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-neutral-900" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Garment</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Units</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3">Variants</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No garments found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${
                        isSelected ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleSelectProduct(p.id)}
                          className="p-0.5 text-neutral-500"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-neutral-900" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-300" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 aspect-[3/4] object-cover bg-neutral-100 border border-[#E9E7E3]"
                          />
                          <div>
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="font-semibold text-neutral-900 hover:text-[#8A4735] block truncate max-w-[220px]"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-neutral-700 font-medium">
                        {p.category}
                      </td>

                      <td className="py-3 px-3 tabular-nums font-bold text-neutral-900">
                        {formatNaira(p.price)}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold tabular-nums ${
                            p.stock <= 5 ? 'text-amber-700' : 'text-neutral-900'
                          }`}
                        >
                          {p.stock} units
                        </span>
                        {p.stock <= 5 && (
                          <span className="text-[10px] text-amber-700 block font-medium">
                            Low Reserve
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.isFeatured && (
                            <button
                              onClick={() => toggleProductStatus(p.id, 'isFeatured')}
                              className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-1.5 py-0.5 font-semibold"
                              title="Click to toggle featured"
                            >
                              Featured
                            </button>
                          )}
                          {p.isNew && (
                            <button
                              onClick={() => toggleProductStatus(p.id, 'isNew')}
                              className="text-[10px] bg-neutral-900 text-white px-1.5 py-0.5 font-semibold"
                              title="Click to toggle new"
                            >
                              New
                            </button>
                          )}
                          {p.isBestSeller && (
                            <button
                              onClick={() => toggleProductStatus(p.id, 'isBestSeller')}
                              className="text-[10px] text-[#8A4735] border border-[#8A4735]/40 px-1.5 py-0.5 font-semibold"
                              title="Click to toggle bestseller"
                            >
                              Bestseller
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[11px] text-neutral-500">
                        {p.variants.length} combinations
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => duplicateProduct(p.id)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog for Deletion */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white border border-[#E9E7E3] p-6 max-w-sm w-full z-10 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Confirm Product Deletion
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you wish to delete this garment from TOOO STORE? This action will remove it from the customer catalog immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-neutral-700 border border-neutral-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 text-xs text-white bg-rose-700 font-semibold"
              >
                Delete Garment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
