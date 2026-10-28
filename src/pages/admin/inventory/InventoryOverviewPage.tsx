import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Search, Plus, Minus, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const InventoryOverviewPage: React.FC = () => {
  const { products, adjustProductStock, lowStockThreshold } = useAdminStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Flatten product variants for granular inventory management
  const allInventoryRows = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      category: p.category,
      variantId: v.variantId,
      size: v.size,
      colour: v.colour,
      sku: v.sku || `TOOO-${p.slug.toUpperCase().slice(0, 4)}-${v.size}`,
      stock: v.stock,
      image: p.images[0],
    }))
  );

  const filtered = allInventoryRows.filter((row) => {
    const matchesSearch =
      row.productName.toLowerCase().includes(search.toLowerCase()) ||
      row.sku.toLowerCase().includes(search.toLowerCase()) ||
      row.colour.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || row.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalStockUnits = allInventoryRows.reduce((sum, r) => sum + r.stock, 0);
  const lowStockCount = allInventoryRows.filter((r) => r.stock <= lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Matrix & Stock Reserves"
        subtitle={`Total of ${totalStockUnits} physical garments across ${allInventoryRows.length} distinct size-and-colourway variants.`}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Overview' }]}
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Total Garments on Rack</span>
          <div className="text-2xl font-display font-extrabold text-neutral-900 mt-1 tabular-nums">
            {totalStockUnits} units
          </div>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Active Variant Combinations</span>
          <div className="text-2xl font-display font-extrabold text-neutral-900 mt-1 tabular-nums">
            {allInventoryRows.length} SKUs
          </div>
        </div>
        <div className="bg-white border border-[#E9E7E3] p-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Low Stock Threshold</span>
          <div className="text-2xl font-display font-extrabold text-amber-700 mt-1 tabular-nums">
            {lowStockCount} alert items
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E9E7E3] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, garment name, or colour..."
            className="w-full bg-[#FAF8F5] border border-[#E9E7E3] pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-[#E9E7E3] px-3 py-1.5 text-xs text-neutral-800"
        >
          <option value="All">All Categories</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Sets">Sets</option>
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E9E7E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-3">Garment & Variant</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Colour</th>
                <th className="py-3 px-3">Available Reserve</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E3]">
              {filtered.map((item) => {
                const isLow = item.stock <= lowStockThreshold;
                const isOut = item.stock === 0;

                return (
                  <tr key={item.variantId} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-3 font-semibold text-neutral-900 flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-8 aspect-[3/4] object-cover bg-neutral-100 border border-[#E9E7E3]"
                      />
                      <span className="truncate max-w-[200px]">{item.productName}</span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{item.category}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">{item.sku}</td>
                    <td className="py-3 px-3 font-bold">{item.size}</td>
                    <td className="py-3 px-3 text-neutral-700">{item.colour}</td>
                    <td className="py-3 px-3 font-bold tabular-nums">
                      <span className={isOut ? 'text-rose-700' : isLow ? 'text-amber-700' : 'text-neutral-900'}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={isOut ? 'Out of Stock' : isLow ? 'Low Reserve' : 'Healthy'}
                        showDot
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center border border-[#E9E7E3] bg-white">
                        <button
                          onClick={() => adjustProductStock(item.productId, item.variantId, -1, 'Manual Adjustment')}
                          disabled={item.stock <= 0}
                          className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                          title="Decrease 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold tabular-nums">{item.stock}</span>
                        <button
                          onClick={() => adjustProductStock(item.productId, item.variantId, 1, 'Restock')}
                          className="p-1 text-neutral-500 hover:text-neutral-900"
                          title="Increase 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
