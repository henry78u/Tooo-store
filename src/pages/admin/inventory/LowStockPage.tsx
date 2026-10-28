import React from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { AlertTriangle, Plus, PackageCheck } from 'lucide-react';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

export const LowStockPage: React.FC = () => {
  const { products, adjustProductStock, lowStockThreshold } = useAdminStore();

  const lowStockRows = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= lowStockThreshold)
      .map((v) => ({
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Low Stock & Replenishment Alerts"
        subtitle={`Flagging ${lowStockRows.length} variant allocations with reserves at or below ${lowStockThreshold} units.`}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Low Stock' }]}
      />

      {lowStockRows.length === 0 ? (
        <div className="bg-white border border-[#E9E7E3] p-12 text-center text-neutral-500">
          <PackageCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-display font-semibold text-base text-neutral-900">
            All Inventory Healthy
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            No size or colourway variants currently fall beneath the {lowStockThreshold}-unit reserve threshold.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E9E7E3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E9E7E3] bg-[#FAF8F5] text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-3 px-3">Garment & Variant</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Size / Colour</th>
                  <th className="py-3 px-3">Remaining</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Restock Batch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E3]">
                {lowStockRows.map((item) => (
                  <tr key={item.variantId} className="hover:bg-amber-50/20">
                    <td className="py-3 px-3 font-semibold text-neutral-900 flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-8 aspect-[3/4] object-cover bg-neutral-100"
                      />
                      <span className="truncate max-w-[200px]">{item.productName}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">{item.sku}</td>
                    <td className="py-3 px-3 text-neutral-700">
                      {item.size} · {item.colour}
                    </td>
                    <td className="py-3 px-3 font-bold tabular-nums text-rose-700">
                      {item.stock} left
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.stock === 0 ? 'Out of Stock' : 'Low Stock'} showDot />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => adjustProductStock(item.productId, item.variantId, 10, 'Restock')}
                          className="px-2.5 py-1 bg-white border border-[#E9E7E3] hover:border-neutral-900 text-[11px] font-semibold"
                        >
                          +10 units
                        </button>
                        <button
                          onClick={() => adjustProductStock(item.productId, item.variantId, 25, 'Restock')}
                          className="px-2.5 py-1 bg-[#171717] text-white hover:bg-neutral-800 text-[11px] font-semibold"
                        >
                          +25 units
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
